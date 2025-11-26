# 🚀 DEPLOY TO VERCEL (NOT TIINY.HOST!)

## ❌ Why Tiiny.host Doesn't Work:

Tiiny.host is for **simple static HTML sites only**. Your app needs:
- ✅ Build process (Vite)
- ✅ Environment variables
- ✅ Node.js runtime

**You MUST use Vercel, Netlify, or similar!**

---

## ✅ CORRECT DEPLOYMENT - VERCEL

### METHOD 1: Vercel Website (Recommended - 5 Minutes)

#### Step 1: Go to Vercel
```
https://vercel.com
```

Click **"Sign Up"** or **"Login"** (use GitHub, GitLab, or Email)

#### Step 2: Create New Project
Click **"Add New..." → "Project"**

#### Step 3: Upload ZIP
- Click **"Browse"** or drag `radio_admin_vercel.zip`
- **OR** import from GitHub if you pushed there

#### Step 4: Configure Project
Vercel auto-detects **Vite**. Verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Step 5: Add Environment Variables ⚠️ CRITICAL!

Click **"Environment Variables"** → Add these 7:

```
VITE_FIREBASE_API_KEY
AIzaSyAyIh6dmQbKl-czFJjlA63pw7cRMvHnMtc

VITE_FIREBASE_AUTH_DOMAIN
radios-50ea5.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
radios-50ea5

VITE_FIREBASE_STORAGE_BUCKET
radios-50ea5.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID
276232644106

VITE_FIREBASE_APP_ID
1:276232644106:web:d62b299a5e954dab4261f3

VITE_FIREBASE_MEASUREMENT_ID
G-7C1HT7QNF7
```

**Set Environment:** Production + Preview

#### Step 6: Deploy!
Click **"Deploy"** → Wait 1-2 minutes

#### Step 7: Authorize Domain in Firebase
1. Copy your Vercel URL (e.g., `your-app.vercel.app`)
2. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
3. Click **"Add domain"** → Paste your Vercel URL → Save

#### Step 8: Test!
Open your Vercel URL → Login with:
```
Email: admin@tamilradio.com
Password: Sakthivel@1992
```

✅ Should work!

---

### METHOD 2: Vercel CLI (For Advanced Users)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd C:\Users\ADMIN\Desktop\radio_admin
vercel

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY
# (repeat for all 7 variables)

# Deploy to production
vercel --prod
```

---

### METHOD 3: GitHub → Vercel (Best for Updates)

```powershell
# Push to GitHub
git init
git add .
git commit -m "Deploy to Vercel"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Then:
1. Go to Vercel → **"Import Project"**
2. Select your GitHub repo
3. Add environment variables
4. Deploy!

**Benefit:** Every `git push` auto-deploys!

---

## 🔥 IMPORTANT: Delete Tiiny.host Deployment

Tiiny.host will NEVER work for this app. Delete it and use Vercel.

---

## 📋 Deployment Checklist:

- [ ] Sign up/login to Vercel.com
- [ ] Upload ZIP or import from GitHub
- [ ] Add ALL 7 environment variables
- [ ] Set environment scope to Production + Preview
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test login

---

## 🎯 Your Vercel URL Will Look Like:

```
https://radio-admin-abc123.vercel.app
```

NOT like:
```
https://radio-admin-vercel.tiiny.site  ← WRONG! This is Tiiny.host!
```

---

## 📞 Need Help?

After deploying to Vercel:
1. Share your Vercel URL (ends with `.vercel.app`)
2. If login fails, share screenshot of browser console (F12)

---

**Deploy to Vercel NOW!** 🚀
