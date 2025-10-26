import pymongo
import pandas as pd
import joblib
from datetime import datetime, timedelta
import os
import matplotlib.pyplot as plt
import json

# -----------------------------
# 1️⃣ Load trained model
# -----------------------------
model = joblib.load("tanker_demand_model.pkl")

# -----------------------------
# 2️⃣ Connect to MongoDB
# -----------------------------
MONGO_URI = "mongodb://localhost:27017/iwfm"
client = pymongo.MongoClient(MONGO_URI)
db = client["iwfm"]
tankers = db["tankers"]

# -----------------------------
# 3️⃣ Fetch delivery data
# -----------------------------
records = []
for t in tankers.find({}, {"deliveries": 1}):
    for d in t.get("deliveries", []):
        records.append({
            "area": d["destination"],
            "date": pd.to_datetime(d["date"], errors='coerce'),
            "quantity": d["quantity"]
        })

df = pd.DataFrame(records)
df = df.dropna(subset=['date'])

if df.empty:
    raise ValueError("No valid delivery data found.")

# -----------------------------
# 4️⃣ Aggregate and pivot
# -----------------------------
df_agg = df.groupby(["date", "area"]).sum().reset_index()
pivot = df_agg.pivot(index="date", columns="area", values="quantity").fillna(0)

# -----------------------------
# 5️⃣ Create lag features (7 days)
# -----------------------------
lag_days = min(7, len(pivot))
for area in pivot.columns:
    for i in range(1, lag_days + 1):
        pivot[f"{area}_lag{i}"] = pivot[area].shift(i)
pivot.fillna(0, inplace=True)

lag_cols = [col for col in pivot.columns if "_lag" in col]
areas = [col for col in pivot.columns if "_lag" not in col]

# -----------------------------
# 6️⃣ Predict next 7 days
# -----------------------------
future_preds = []
last_row = pivot.iloc[-1:].copy()

for day in range(7):
    X_next = last_row[lag_cols]
    y_pred = model.predict(X_next)
    future_preds.append(y_pred.flatten())

    # Update lag columns for next prediction
    for area_idx, area in enumerate(areas):
        last_row[f"{area}_lag1"] = y_pred[0, area_idx]
    for col in lag_cols:
        n = int(col.split("_lag")[1])
        if n > 1:
            last_row[col] = last_row[col.replace(f"_lag{n}", f"_lag{n-1}")]

# -----------------------------
# 7️⃣ Format predictions
# -----------------------------
future_df = pd.DataFrame(future_preds, columns=areas)
future_dates = [datetime.now().date() + timedelta(days=i+1) for i in range(7)]
future_df.index = future_dates

# Set predicted time (example: 10:00 AM)
prediction_time = "10:00"

# -----------------------------
# 8️⃣ Assign demand levels
# -----------------------------
def assign_demand_level(qty):
    if qty > 500:
        return "High"
    elif qty > 250:
        return "Medium"
    else:
        return "Low"

future_levels = future_df.applymap(assign_demand_level)

# -----------------------------
# 9️⃣ Save plots
# -----------------------------
output_dir = "./prediction_plots"
os.makedirs(output_dir, exist_ok=True)

for area in areas:
    plt.figure(figsize=(8,4))
    plt.plot(future_df.index, future_df[area], marker='o', linestyle='-', color='blue')
    plt.title(f"Predicted Water Demand for {area} (Next 7 Days)")
    plt.xlabel("Date")
    plt.ylabel("Water Demand (KL)")
    plt.xticks(rotation=45)
    for x, y in zip(future_df.index, future_df[area]):
        plt.text(x, y+5, future_levels.at[x, area], ha='center', fontsize=9, color='red')
    plt.tight_layout()
    plt.savefig(f"{output_dir}/{area}_7day_prediction.png")
    plt.close()

# -----------------------------
# 🔟 Save JSON for frontend (with time)
# -----------------------------
prediction_json = []
for i, date in enumerate(future_df.index):
    day_data = {"date": str(date), "areas": []}
    for area in areas:
        day_data["areas"].append({
            "area": area,
            "predicted": float(future_df.at[date, area]),
            "demandLevel": future_levels.at[date, area],
            "time": prediction_time
        })
    prediction_json.append(day_data)

with open("next7days_predictions.json", "w") as f:
    json.dump(prediction_json, f, indent=2)

print("Predicted water demand for next 7 days (KL):")
print(future_df)
print("\nDemand levels:")
print(future_levels)
print(f"\nPlots saved in folder: {output_dir}")
print("\nJSON saved as next7days_predictions.json")