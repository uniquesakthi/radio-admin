# 🚀 Quick Setup Guide

## Step-by-Step Firebase Setup (5 minutes)

### 1️⃣ Create Firebase Project
1. Visit: https://console.firebase.google.com/
2. Click "Add project"
3. Name it (e.g., "radio-admin")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2️⃣ Enable Authentication
1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable"
5. Click "Save"

### 3️⃣ Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose nearest location
5. Click "Enable"

### 4️⃣ Set Security Rules
1. Go to "Rules" tab in Firestore
2. Replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /channels/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click "Publish"

### 5️⃣ Get Configuration
1. Click gear icon (⚙️) → "Project settings"
2. Scroll to "Your apps"
3. Click web icon (`</>`)
4. Register app (name: "Radio Admin")
5. Copy the config object

### 6️⃣ Update app.js
1. Open `app.js`
2. Replace lines 3-9 with your config:
```javascript
const firebaseConfig = {
    apiKey: "paste-your-api-key",
    authDomain: "paste-your-auth-domain",
    projectId: "paste-your-project-id",
    storageBucket: "paste-your-storage-bucket",
    messagingSenderId: "paste-your-sender-id",
    appId: "paste-your-app-id"
};
```
3. Save file

### 7️⃣ Create Admin User
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Email: `admin@example.com`
4. Password: `admin123` (change this!)
5. Click "Add user"

### 8️⃣ Run the App
Open PowerShell in this folder and run:
```powershell
python -m http.server 8000
```
Or just double-click `index.html`

### 9️⃣ Login
- Email: `admin@example.com`
- Password: `admin123`

## 🎉 You're Done!

Now you can:
- ✅ Add radio channels
- ✅ Edit channels
- ✅ Delete channels
- ✅ Organize by categories
- ✅ See channel counts

---

**Need help?** Check the full README.md for detailed documentation.
