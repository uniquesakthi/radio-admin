# 🚀 Deploy Radio Admin Panel to Vercel

## ✅ Pre-Deployment Checklist

Your project is ready to deploy! Here's what's configured:

- ✅ Firebase config uses environment variables (`.env`)
- ✅ `.gitignore` protects sensitive files
- ✅ Vite build system configured
- ✅ `package.json` with build scripts
- ✅ `vercel.json` configuration file
- ✅ Edit and Delete functions working
- ✅ Stream validation (30s timeout)

---

## 📦 Method 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

```powershell
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/radio-admin.git

# Push to GitHub
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to **https://vercel.com**
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel auto-detects **Vite** framework

### Step 3: Add Environment Variables

In Vercel dashboard → **Environment Variables**, add these 7 variables:


**Important:** Set scope to **Production** and **Preview**

### Step 4: Deploy

Click **"Deploy"** → Vercel builds and deploys automatically!

Your app will be live at: `https://your-project-name.vercel.app`

---

## 📦 Method 2: Deploy via Vercel CLI (Alternative)

### Step 1: Install Vercel CLI

```powershell
npm i -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

### Step 3: Deploy

```powershell
# Navigate to project folder
cd C:\Users\ADMIN\Desktop\radio_admin

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **radio-admin** (or your choice)
- Directory? **./** (current directory)
- Override settings? **N**

### Step 4: Add Environment Variables

```powershell


### Step 5: Deploy to Production

```powershell
vercel --prod
```

---

## 📦 Method 3: Manual ZIP Upload (If No Git/CLI)

### Step 1: Create ZIP File

**Option A: Using PowerShell**
```powershell
# Navigate to parent directory
cd C:\Users\ADMIN\Desktop

# Create ZIP (excluding node_modules and .env)
Compress-Archive -Path "radio_admin\*" -DestinationPath "radio_admin_deploy.zip" -Force
```

**Option B: Using Windows Explorer**
1. Go to `C:\Users\ADMIN\Desktop\`
2. Right-click `radio_admin` folder
3. Select **"Send to" → "Compressed (zipped) folder"**
4. Rename to `radio_admin_deploy.zip`

### Step 2: Upload to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Browse"** or drag and drop your ZIP file
3. Vercel will extract and detect the project

### Step 3: Configure Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables

Same as Method 1, Step 3 above.

### Step 5: Deploy

Click **"Deploy"** and wait for the build to complete!

---

## 🔒 Important Security Notes

### ✅ What's Safe to Deploy:

- `.env` file is **NOT** included in deployment (protected by `.gitignore`)
- Firebase credentials are stored as **Vercel environment variables**
- Only the compiled `dist/` folder is deployed

### ❌ Never Do This:

- Don't commit `.env` to Git
- Don't share your `.env` file publicly
- Don't hardcode Firebase keys in the code

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Login works with Firebase auth
- [ ] Channels load from Firestore
- [ ] Add/Edit/Delete functions work
- [ ] Stream validation runs (check console)
- [ ] No console errors

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Environment variables not set correctly

**Fix:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify all 7 `VITE_*` variables are set
3. Redeploy: Settings → Deployments → Click "..." → Redeploy

### Error: "Failed to load channels"

**Cause:** Firestore security rules or wrong project ID

**Fix:**
1. Check Firebase console → Firestore → Rules
2. Verify `VITE_FIREBASE_PROJECT_ID` matches your Firebase project

### Build Fails

**Cause:** Missing dependencies or wrong Node version

**Fix:**
1. Vercel dashboard → Settings → General → Node.js Version
2. Set to **18.x** or **20.x**
3. Redeploy

---

## 🎉 Success!

Your Radio Admin Panel is now live on Vercel!

**Next Steps:**
1. Share the Vercel URL with your team
2. (Optional) Add a custom domain in Vercel settings
3. (Optional) Enable Vercel Analytics for usage insights

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Vite Docs: https://vitejs.dev/guide/

---

**Deployment Ready!** 🚀
