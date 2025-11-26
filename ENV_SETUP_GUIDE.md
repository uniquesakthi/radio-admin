# 🔐 Firebase Configuration with Environment Variables

## ✅ Implementation Status

Your `app.js` is now **properly configured** to use environment variables instead of hard-coded Firebase credentials.

### What Changed:

**Before (❌ Insecure):**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAyIh6dmQbKl-czFJjlA63pw7cRMvHnMtc",  // Hard-coded!
    authDomain: "radios-50ea5.firebaseapp.com",
    // ...
};
```

**After (✅ Secure):**
```javascript
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // From .env file!
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    // ...
};
```

---

## 📁 Files Created/Updated

| File | Purpose | Status |
|------|---------|--------|
| `.env` | Stores Firebase credentials (NOT committed to Git) | ✅ Created |
| `.gitignore` | Prevents `.env` from being committed | ✅ Created |
| `app.js` | Updated to use `import.meta.env` | ✅ Updated |
| `package.json` | NPM configuration with Vite scripts | ✅ Created |
| `vite.config.js` | Vite bundler configuration | ✅ Created |

---

## 🚀 How to Run Locally

### 1️⃣ Development Server (with hot reload)

```powershell
npm run dev
```

- Opens **http://localhost:5173**
- Vite reads `.env` and injects values into `app.js`
- Changes auto-reload

### 2️⃣ Production Build

```powershell
npm run build
```

- Creates `dist/` folder with optimized static files
- All `import.meta.env` references are replaced with actual values
- Ready to deploy to Vercel/Netlify/any static host

### 3️⃣ Preview Production Build Locally

```powershell
npm run preview
```

- Serves the `dist/` folder locally
- Test the production build before deploying

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub

```powershell
git init
git add .
git commit -m "Add Vite + environment variables"
git remote add origin https://github.com/YOUR_USERNAME/radio-admin.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to **https://vercel.com** → **New Project**
2. Import your GitHub repository
3. Vercel auto-detects **Vite** framework

### Step 3: Add Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

| Variable Name | Value (from your `.env`) |
|--------------|--------------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyAyIh6dmQbKl-czFJjlA63pw7cRMvHnMtc` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `radios-50ea5.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `radios-50ea5` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `radios-50ea5.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `276232644106` |
| `VITE_FIREBASE_APP_ID` | `1:276232644106:web:d62b299a5e954dab4261f3` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-7C1HT7QNF7` |

**Important:** Set scope to **Production** and **Preview**

### Step 4: Deploy

Click **Deploy** → Vercel builds and deploys automatically!

---

## 🔒 Security Best Practices

✅ **What's Protected:**
- `.env` file is in `.gitignore` → never committed to Git
- Firebase credentials only exist in:
  - Your local `.env` file
  - Vercel's encrypted environment variables
  - The compiled JavaScript (which is safe for Firebase client SDK)

✅ **What's Safe to Expose:**
- Firebase client SDK keys are **designed to be public**
- Security is enforced by Firebase Security Rules, not by hiding keys
- Still, using `.env` keeps your repo clean and makes key rotation easy

❌ **Never Do This:**
- Don't commit `.env` to Git
- Don't share `.env` file publicly
- Don't use server-side Firebase Admin SDK keys in client code

---

## 🐛 Troubleshooting

### Error: `import.meta is not defined`

**Cause:** Running `app.js` without Vite (e.g., with `npx serve` or opening `index.html` directly)

**Fix:** Always use `npm run dev` or build first with `npm run build`

### Error: `Firebase: Error (auth/invalid-api-key)`

**Cause:** Environment variables not loaded

**Fix:** 
1. Check `.env` file exists in project root
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Verify variable names start with `VITE_`

### Vite Not Found

**Cause:** Dependencies not installed

**Fix:**
```powershell
npm install
```

---

## 📦 Project Structure

```
radio_admin/
├── .env                    # ← Firebase credentials (NEVER commit!)
├── .gitignore              # ← Protects .env
├── package.json            # ← NPM config with Vite
├── vite.config.js          # ← Vite bundler config
├── index.html              # ← Entry point
├── app.js                  # ← Uses import.meta.env ✅
├── styles.css              # ← Styles
└── dist/                   # ← Production build (created by npm run build)
```

---

## ✅ Verification Checklist

- [x] `.env` file created with `VITE_` prefixed variables
- [x] `.gitignore` includes `.env`
- [x] `app.js` uses `import.meta.env.VITE_*`
- [x] `package.json` has Vite scripts
- [x] `vite.config.js` created
- [x] `npm install` completed
- [x] Ready to run `npm run dev`

---

## 🎯 Next Steps

1. **Test locally:**
   ```powershell
   npm run dev
   ```
   Open http://localhost:5173 and verify Firebase login works

2. **Build for production:**
   ```powershell
   npm run build
   ```

3. **Deploy to Vercel:**
   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy!

---

**Your Firebase configuration is now secure and ready for deployment!** 🎉
