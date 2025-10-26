import os
import pymongo
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime, timedelta
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# -----------------------------
# 0️⃣ Create folder to save graphs
# -----------------------------
graph_dir = "graphs"
os.makedirs(graph_dir, exist_ok=True)

# -----------------------------
# 1️⃣ Connect to MongoDB
# -----------------------------
MONGO_URI = "mongodb://localhost:27017/iwfm"  # change if needed
client = pymongo.MongoClient(MONGO_URI)
db = client["iwfm"]
tankers = db["tankers"]

# -----------------------------
# 2️⃣ Fetch all deliveries
# -----------------------------
all_tankers = list(tankers.find({}, {"deliveries": 1}))

records = []
for t in all_tankers:
    for d in t.get("deliveries", []):
        records.append({
            "area": d["destination"],
            "date": pd.to_datetime(d["date"], errors='coerce'),
            "quantity": d["quantity"]
        })

df = pd.DataFrame(records)
df = df.dropna(subset=['date'])

if df.empty:
    raise ValueError("No valid delivery data found in the tankers collection.")

# -----------------------------
# 3️⃣ Aggregate total deliveries per area per day
# -----------------------------
df_agg = df.groupby(["date", "area"]).sum().reset_index()

# -----------------------------
# 4️⃣ Pivot to create area columns
# -----------------------------
pivot = df_agg.pivot(index="date", columns="area", values="quantity").fillna(0)

# -----------------------------
# 5️⃣ Create lag features (past 7 days safely)
# -----------------------------
lag_days = min(7, len(pivot))
for area in pivot.columns:
    for i in range(1, lag_days + 1):
        pivot[f"{area}_lag{i}"] = pivot[area].shift(i)

pivot.fillna(0, inplace=True)

# -----------------------------
# 6️⃣ Prepare features (X) and targets (y)
# -----------------------------
X = pivot[[col for col in pivot.columns if "lag" in col]]
y = pivot[[col for col in pivot.columns if "_lag" not in col]]

if X.shape[0] == 0:
    raise ValueError("Not enough data to train. Add more deliveries or reduce lag days.")

# -----------------------------
# 7️⃣ Train Random Forest
# -----------------------------
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# -----------------------------
# 8️⃣ Evaluate on training data
# -----------------------------
y_pred = model.predict(X)
mae = mean_absolute_error(y, y_pred)
mse = mean_squared_error(y, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y, y_pred)

print(f"Model Evaluation on training data:")
print(f"MAE: {mae:.2f}")
print(f"MSE: {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R² Score: {r2:.2f}")

# -----------------------------
# 9️⃣ Plot Actual vs Predicted for each area and save
# -----------------------------
plt.figure(figsize=(12, 6))
for area in y.columns:
    plt.plot(y[area].values, label=f"Actual - {area}")
    plt.plot(y_pred[:, y.columns.get_loc(area)], "--", label=f"Predicted - {area}")

plt.title("Actual vs Predicted Water Demand per Area")
plt.xlabel("Days")
plt.ylabel("Water Demand (KL)")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(graph_dir, "actual_vs_predicted.png"))
plt.close()

# -----------------------------
# 🔟 Plot Residuals and save
# -----------------------------
residuals = y.values - y_pred
plt.figure(figsize=(10, 5))
sns.histplot(residuals.flatten(), bins=20, kde=True)
plt.title("Residuals Distribution")
plt.xlabel("Prediction Error (KL)")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(os.path.join(graph_dir, "residuals_distribution.png"))
plt.close()

# -----------------------------
# Helper function to assign demand level
# -----------------------------
def assign_demand_level(qty):
    if qty > 500:
        return "High"
    elif qty > 250:
        return "Medium"
    else:
        return "Low"

# -----------------------------
# 11️⃣ Predict tomorrow with time
# -----------------------------
last_row = pivot.iloc[-1:].copy()
X_tomorrow = last_row[[col for col in pivot.columns if "lag" in col]]
pred_tomorrow = model.predict(X_tomorrow)

pred_df = pd.DataFrame(pred_tomorrow, columns=y.columns)
pred_time = (datetime.now() + timedelta(days=1)).replace(hour=10, minute=0, second=0)
pred_df.index = [datetime.now().date() + timedelta(days=1)]

predicted_areas_tomorrow = pred_df.T.reset_index()
predicted_areas_tomorrow.columns = ["area", "predictedWater"]
predicted_areas_tomorrow["demandLevel"] = predicted_areas_tomorrow["predictedWater"].apply(assign_demand_level)
predicted_areas_tomorrow["predictedTime"] = pred_time.strftime("%H:%M")

print("\nPredicted water demand for tomorrow (KL) for all areas with time:")
print(predicted_areas_tomorrow)

# -----------------------------
# 12️⃣ Predict next 7 days with time
# -----------------------------
n_days = 7
future_predictions = []

last_features = pivot.iloc[-1:].copy()

for day in range(n_days):
    X_future = last_features[[col for col in pivot.columns if "lag" in col]]
    y_pred_day = model.predict(X_future)[0]

    pred_dict = dict(zip(y.columns, y_pred_day))
    prediction_date = datetime.now().date() + timedelta(days=day + 1)
    pred_dict["date"] = prediction_date
    pred_dict["predictedTime"] = (datetime.combine(prediction_date, datetime.min.time()) + timedelta(hours=10)).strftime("%H:%M")
    
    future_predictions.append(pred_dict)

    # Update last_features for next iteration: shift lags and append today prediction
    for area in y.columns:
        for i in range(lag_days, 1, -1):
            last_features[f"{area}_lag{i}"] = last_features[f"{area}_lag{i-1}"]
        last_features[f"{area}_lag1"] = pred_dict[area]

future_df = pd.DataFrame(future_predictions)
future_df = future_df[["date"] + list(y.columns) + ["predictedTime"]]

# Assign demand levels
demand_levels_df = future_df.copy()
for area in y.columns:
    demand_levels_df[f"{area}_level"] = future_df[area].apply(assign_demand_level)

print("\nPredicted water demand for next 7 days (KL) for all areas with time:")
print(demand_levels_df)

# -----------------------------
# 13️⃣ Plot 7-day forecast per area and save
# -----------------------------
plt.figure(figsize=(12, 6))
for area in y.columns:
    plt.plot(future_df["date"], future_df[area], marker='o', label=area)

plt.title("Predicted Water Demand for Next 7 Days per Area")
plt.xlabel("Date")
plt.ylabel("Predicted Water (KL)")
plt.xticks(rotation=45)
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(graph_dir, "predicted_next_7_days.png"))
plt.close()

# -----------------------------
# 14️⃣ Save model for future use
# -----------------------------
joblib.dump(model, "tanker_demand_model.pkl")
print("\nModel saved as tanker_demand_model.pkl")
print(f"Graphs saved in folder: {graph_dir}")
