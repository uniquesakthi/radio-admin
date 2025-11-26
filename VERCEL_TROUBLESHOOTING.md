# 🔧 VERCEL LOGIN TROUBLESHOOTING CHECKLIST

## ❌ Can't Login? Check These:

### 1️⃣ **Environment Variables Missing**

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

**Verify ALL 7 variables are set:**

```
✓ VITE_FIREBASE_API_KEY
✓ VITE_FIREBASE_AUTH_DOMAIN
✓ VITE_FIREBASE_PROJECT_ID
✓ VITE_FIREBASE_STORAGE_BUCKET
✓ VITE_FIREBASE_MESSAGING_SENDER_ID
✓ VITE_FIREBASE_APP_ID
✓ VITE_FIREBASE_MEASUREMENT_ID
```

**If ANY are missing, add them:**

| Variable | Value |
|----------|-------|
| VITE_FIREBASE_API_KEY | AIzaSyAyIh6dmQbKl-czFJjlA63pw7cRMvHnMtc |
| VITE_FIREBASE_AUTH_DOMAIN | radios-50ea5.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID | radios-50ea5 |
| VITE_FIREBASE_STORAGE_BUCKET | radios-50ea5.appspot.com |
| VITE_FIREBASE_MESSAGING_SENDER_ID | 276232644106 |
| VITE_FIREBASE_APP_ID | 1:276232644106:web:d62b299a5e954dab4261f3 |
| VITE_FIREBASE_MEASUREMENT_ID | G-7C1HT7QNF7 |

**After adding, REDEPLOY:**
Settings → Deployments → Latest → "..." → **Redeploy**

---

### 2️⃣ **Firebase Domain Not Authorized**

Go to Firebase Console → Authentication → Settings → **Authorized domains**

**Add your Vercel domain:**
```
your-project-name.vercel.app
```

Click **"Add domain"** → Save

---

### 3️⃣ **Check Browser Console for Errors**

1. Open your Vercel site
2. Press **F12** (open DevTools)
3. Click **Console** tab
4. Try to login
5. Look for errors:

**Common Errors:**

| Error | Fix |
|-------|-----|
| `Firebase: Error (auth/invalid-api-key)` | Environment variables not set → See Issue #1 |
| `Firebase: Error (auth/unauthorized-domain)` | Domain not authorized → See Issue #2 |
| `import.meta.env is undefined` | Build failed, Vite not configured → Redeploy |
| `auth/operation-not-allowed` | Email/Password auth not enabled in Firebase |

---

### 4️⃣ **Firebase Email/Password Auth Enabled?**

Go to Firebase Console → Authentication → **Sign-in method**

**Verify:**
- ✓ Email/Password is **Enabled**
- ✓ Status shows **"Enabled"** (not disabled)

If disabled, click **Email/Password** → Enable → Save

---

### 5️⃣ **Correct Login Credentials?**

**Test with:**
```
Email: admin@tamilradio.com
Password: Sakthivel@1992
```

**If user doesn't exist:**
1. Go to Firebase Console → Authentication → **Users**
2. Click **"Add user"**
3. Email: `admin@tamilradio.com`
4. Password: `Sakthivel@1992`
5. Click **"Add user"**

---

### 6️⃣ **Build Logs Show Errors?**

Go to Vercel Dashboard → Your Project → **Deployments** → Click latest deployment

**Check Build Logs for:**
- ❌ `npm install` failed
- ❌ `npm run build` failed
- ❌ Missing dependencies

**If build failed:**
1. Check `package.json` has correct Vite version
2. Redeploy with: Settings → Deployments → "..." → **Redeploy**

---

## 🔧 QUICK FIX STEPS:

### Step 1: Add Environment Variables
Vercel Dashboard → Settings → Environment Variables → Add all 7 variables above

### Step 2: Authorize Domain
Firebase Console → Authentication → Settings → Authorized domains → Add `your-app.vercel.app`

### Step 3: Redeploy
Vercel Dashboard → Deployments → Latest → "..." → **Redeploy**

### Step 4: Test Login
Open site → F12 → Console → Try login → Check for errors

---

## 📞 Still Not Working?

**Send me:**
1. Your Vercel URL
2. Screenshot of browser console errors (F12 → Console)
3. Screenshot of Vercel environment variables page

I'll help debug!

---

**Most Common Fix:** Add environment variables + Redeploy = ✅ Working!
