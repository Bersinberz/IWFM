<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=IWFM%20System&fontSize=60&animation=fadeIn&fontAlignY=35" width="100%"/>

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=007BFF&center=true&vCenter=true&width=800&lines=Integrated+Water+Fleet+Management+(IWFM);Real-time+Tanker+Tracking;ML-based+Water+Demand+Forecasting;Smart+Alerts+%26+Dashboard+Analytics" alt="Typing SVG" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
</div>

<br />

## 📌 Overview

**IWFM (Integrated Water Fleet Management)** is a robust, AI-powered full-stack platform designed to optimize the distribution and monitoring of water resources. It leverages **real-time tanker tracking**, **intelligent route monitoring**, and **Machine Learning algorithms** to forecast daily water demands across different zones. 

The system provides dispatchers and administrators with an interactive dashboard to monitor operations, analyze upcoming demand levels up to 7 days ahead, and receive automated critical alerts—ensuring a seamless, efficient water supply chain.

---

## ✨ Key Features

- 🚛 **Real-Time Tanker Tracking:** Live geolocation tracking and path monitoring of water tankers using interactive Leaflet heatmaps and spatial representations.
- 🔮 **Water Demand Forecasting:** AI-driven 7-day water demand prediction using Scikit-Learn's Random Forest Regressor based on historical area delivery statistics.
- 🚨 **Automated Alerting System:** Instant web notifications and prioritized email alerts via Nodemailer for system delays, high-severity operational faults, and tanker maintenance.
- 📊 **Interactive Analytics Dashboard:** Track delivery statuses, visualize actual vs. predicted demands, and assess algorithm accuracy using Recharts and Python-generated analytical models.
- 🔐 **Secure Role-Based Access:** Encrypted user authentication streams with JWT and bcrypt mechanisms, strictly enforcing route-level access.

---

## 🏗️ Architecture & Project Structure

The platform is divided into three interconnected ecosystems:

```text
IWFM/
├── client/           # Frontend (React + Vite + TypeScript)
├── server/           # Backend API (Node.js + Express + TypeScript)
│   ├── controllers/  # Route logic (Alerts, Tankers, Users)
│   ├── models/       # MongoDB Schemas
│   ├── routes/       # API endpoints definitions
│   ├── predict.py    # Python script targeting inference logic
│   └── train.py      # Python script containing Random Forest training pipelines
└── graphs/           # ML Output visuals & residual analytics
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed before proceeding:
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Python** (v3.8 or higher)
- **MongoDB** (Running locally on port `27017` or a cloud Atlas URI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd IWFM
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/iwfm
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```
Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Run the frontend client:
```bash
npm run dev
```

### 4. Machine Learning & Predictive Modeling Setup
Navigate to the `server` directory to structure Python pipelines (recommended to use a virtual environment).
```bash
pip install pandas scikit-learn pymongo matplotlib seaborn joblib
```
To train the demand model based on current database states and generate visual plots:
```bash
python train.py
```
This action will yield a serialized `tanker_demand_model.pkl` along with `.png` files saved to the local `graphs` directory reflecting predictions and residual distributions.


<div align="center">
  <i>Structured and meticulously crafted for exceptional operational reliability.</i>
</div>
