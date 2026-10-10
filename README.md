# 📱 Livestock Data System - Android App

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Mobile%20PWA-059669?style=for-the-badge&logo=android&logoColor=white" alt="Platform Android"/>
  <img src="https://img.shields.io/badge/Language-Kotlin%20%7C%20JavaScript-6366f1?style=for-the-badge&logo=kotlin&logoColor=white" alt="Kotlin & JS"/>
  <img src="https://img.shields.io/badge/UI-Jetpack%20Compose%20%7C%20Material%203-10b981?style=for-the-badge" alt="Material 3"/>
  <img src="https://img.shields.io/badge/Database-Room%20SQLite%20(100%25%20Offline)-f59e0b?style=for-the-badge&logo=sqlite&logoColor=white" alt="Offline SQLite"/>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-0284c7?style=for-the-badge" alt="Production Ready"/>
</p>

An **offline-first Android application** built for livestock management, dairy production monitoring, animal ear tag registration, feed ration optimization, and veterinary health logs.

Designed for field officers, dairy farmers, and veterinarians who require a clean, responsive, dynamic interface with **zero dependence on external internet servers**.

---

## 🌟 Key Features

### 1. 💾 100% Offline Local Phone Storage
- **Local SQLite / Room Database**: Reads and writes occur instantly on the mobile device.
- **Zero Server Dependency**: Operates in rural and low-connectivity environments.
- **Auto-Seeded Initial Data**: Includes sample livestock records for immediate testing out of the box.
- **Backup & Restore**: Export full database backups as JSON to clipboard/file and restore them on any device.

### 2. 🏷️ Animal Registration & Profile Management
- Unique Ear Tag Number identification (`TAG-1001`, `TAG-1002`, etc.)
- Multi-species support: **Cow, Buffalo, Goat, Sheep**
- Track breed, age, body weight (kg), and body condition score
- Owner details: Farmer Name, Village, Contact Number, Aadhaar Number
- Offline Animal Photo capture & upload with live image preview

### 3. 🥛 Daily & Monthly Milk Production Logs
- Daily milk yield tracking (Liters/Day)
- Quality parameters: **Fat %** and **SNF %**
- Real-time revenue estimation & daily feed expense tracking
- Net profitability calculation per animal and herd

### 4. 🌾 Feeding & Ration Calculator
- Customized ration formulations: **Concentrates, Green Fodder, Dry Fodder, Mineral Mixtures, Supplements**
- Live Daily and Monthly Feed Cost estimations (₹/kg & total cost)
- Daily ration weight balancing for optimal lactation yield

### 5. 🩺 Health, Breeding & Vaccinations
- Health condition tracking: *Healthy, Sick, Under Treatment, Vaccinated*
- Gestation & Pregnancy month counter (1–10 months)
- Vaccination history (FMD, HS, BQ, Anthrax)
- Deworming schedule records

### 6. 🎨 Dynamic & Clean Android UI (Material 3)
- **Android Bottom Navigation Bar**: 5 primary tabs (*Home, Animals, New Entry, Feeding, Storage/Settings*)
- **Android Status Bar & App Bar**: Live clock, battery/wifi indicators, storage status pill, and Dark/Light mode toggle
- **Floating Action Button (FAB)** for rapid registration
- Smooth card-lift animations, touch ripples, and responsive layout

---

## 🏗️ Architecture Overview

```
Livestock-Data-System-App/
├── app/                                    # Native Android Project
│   ├── src/main/
│   │   ├── AndroidManifest.xml             # Permissions & app configuration
│   │   ├── java/com/livestock/app/
│   │   │   ├── LivestockApplication.kt     # App initialization & DB setup
│   │   │   ├── MainActivity.kt             # Jetpack Compose Navigation Host
│   │   │   ├── data/
│   │   │   │   ├── model/                  # Animal, MonthlyRecord, FeedingItem entities
│   │   │   │   ├── local/                  # AppDatabase, AnimalDao, RecordDao (Room DB)
│   │   │   │   └── repository/             # LivestockRepository (Local DB + Backup)
│   │   │   └── ui/
│   │   │       ├── components/             # AppBottomNav, MetricCards, ActionCards
│   │   │       ├── screens/                # Dashboard, AnimalList, AddAnimal, RecordEntry, Feeding, History, Settings
│   │   │       ├── theme/                  # Material 3 Color, Theme, Typography
│   │   │       └── viewmodel/              # LivestockViewModel (StateFlow & Coroutines)
│   │   └── res/                            # Android resources & strings
│   └── build.gradle.kts                    # App dependencies (Compose, Room, Coroutines)
├── frontend/                               # Mobile Android Web Shell / PWA
│   ├── src/
│   │   ├── components/                     # Dashboard, AnimalForm, SearchAnimal, FeedingManagement, HistoryViewer, Settings
│   │   ├── utils/                          # localDb.js (Offline LocalStorage DB), api.js adapter
│   │   ├── App.jsx                         # Mobile router
│   │   └── index.css                       # Android Mobile Material 3 CSS
│   └── package.json
├── build.gradle.kts                        # Root Gradle build file
├── settings.gradle.kts                     # Gradle module configuration
├── gradle.properties                       # Android build properties
└── .gitignore
```

---

## 🚀 Getting Started

### Option A: Run Mobile Web Shell / Dev Preview

1. Open a terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` on your mobile browser or desktop.

---

### Option B: Build & Run Native Android App in Android Studio

1. Open **Android Studio**.
2. Select **Open an Existing Project** and choose the repository root directory.
3. Allow Gradle to sync dependencies.
4. Connect an Android device (USB Debugging enabled) or start an Android Emulator.
5. Click **Run** (`Shift + F10`).

#### Building Standalone APK:
```bash
# Debug APK
./gradlew assembleDebug

# Output APK path:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 📤 Push & Deploy to GitHub Repository

To push this codebase to [https://github.com/theshlok18/-Livestock-Data-System-App](https://github.com/theshlok18/-Livestock-Data-System-App):

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "feat: complete offline Android app with local storage, Jetpack Compose, and Material 3 UI"

# 4. Set main branch
git branch -M main

# 5. Add remote origin
git remote add origin https://github.com/theshlok18/-Livestock-Data-System-App.git

# 6. Push to GitHub
git push -u origin main --force
```

---

## 📄 License
This project is licensed under the MIT License.
