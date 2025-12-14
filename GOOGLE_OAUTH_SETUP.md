# Google OAuth Setup for AOFA Template

**This template now uses Google Sign-In as the default authentication method.**

All new apps using this template require Google OAuth configuration in Supabase.

---

## 🔑 Setup Steps (10 minutes)

### Step 1: Create Google OAuth Credentials (5 minutes)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create or Select Project:**
   - If you have an existing project, select it
   - Or click **"Create Project"**:
     - Name: `AOFA Apps` (or your preferred name)
     - Click **Create**

3. **Configure OAuth Consent Screen** (First time only):
   - Click **OAuth consent screen** in left sidebar
   - User Type: **External**
   - Click **Create**
   - Fill in required fields:
     - **App name**: `AOFA Apps` (or your app name)
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Click **Save and Continue**
   - Skip "Scopes" (click **Save and Continue**)
   - Skip "Test users" (click **Save and Continue**)
   - Click **Back to Dashboard**

4. **Create OAuth Client ID:**
   - Go back to **Credentials** in left sidebar
   - Click **+ CREATE CREDENTIALS** at top
   - Select **OAuth client ID**
   - Application type: **Web application**
   - Name: Your app name (e.g., `QuickTest App`)
   - **Authorized redirect URIs** - Click **+ ADD URI**
   - Paste: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_PROJECT_REF` with your actual Supabase project ref
     - Example: `https://icmbwpswppscqlskkrce.supabase.co/auth/v1/callback`
   - Click **Create**

5. **Copy Credentials:**
   - A dialog will appear with your credentials
   - **Client ID**: Copy this (starts with something like `1234567890-abc...`)
   - **Client Secret**: Copy this
   - Click **OK**

---

### Step 2: Configure Supabase (2 minutes)

1. **Go to Supabase Auth Providers:**
   - Visit: https://supabase.com/dashboard/project/YOUR_PROJECT_REF/auth/providers
   - Replace `YOUR_PROJECT_REF` with your project ref

2. **Enable Google Provider:**
   - Scroll to **Google** in the providers list
   - Toggle it **ON** (enabled)

3. **Enter Credentials:**
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
   - Click **Save**

4. **Done!** Google authentication is now active.

---

## 📝 For Each New App

When creating a new app with this template, you have two options:

### Option A: Reuse Existing Google OAuth App (Easier)

If you already have a Google OAuth app set up:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your existing OAuth Client ID
3. Under **Authorized redirect URIs**, click **+ ADD URI**
4. Add: `https://NEW_PROJECT_REF.supabase.co/auth/v1/callback`
5. Click **Save**
6. Use the same Client ID and Client Secret in new Supabase project

### Option B: Create Separate OAuth App Per Project

For better isolation, create a new OAuth Client ID for each app:

1. Follow Step 1 above with a new name
2. Use the new credentials in each Supabase project

**Recommended:** Option A (reuse) unless you need strict separation.

---

## 🔧 How to Find Your Supabase Project Ref

Your project ref is in your Supabase URL:

- **Supabase URL**: `https://icmbwpswppscqlskkrce.supabase.co`
- **Project Ref**: `icmbwpswppscqlskkrce` (the subdomain)

You can find it:
- In your Supabase dashboard URL
- In Project Settings → API → Project URL

---

## ✅ Verifying It Works

After setup:

1. Deploy your app (or visit deployed URL)
2. You should see **"Continue with Google"** button
3. Click it
4. Sign in with your Google account
5. You'll be redirected back to your app, signed in
6. User info is stored in Supabase `auth.users` table

---

## 🛠️ Troubleshooting

### "Redirect URI Mismatch" Error

**Problem:** Google shows "redirect_uri_mismatch" error

**Solution:**
1. Check the redirect URI in Google Console exactly matches:
   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
2. Make sure there's no trailing slash
3. Make sure you're using the correct project ref
4. Wait a few minutes after saving in Google Console

### "Invalid Client" Error

**Problem:** Google shows "invalid_client" error

**Solution:**
1. Verify Client ID and Client Secret are correct in Supabase
2. Make sure Google provider is enabled (toggle is ON)
3. Re-save the credentials in Supabase

### Users Can't Sign In

**Problem:** Sign in button doesn't work or shows error

**Solution:**
1. Check browser console for errors
2. Verify environment variables are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure you deployed after updating code
4. Check Supabase logs for auth errors

---

## 📚 Additional OAuth Providers

To add more providers (GitHub, Facebook, etc.):

1. Enable them in Supabase: Project Settings → Auth → Providers
2. Follow Supabase docs for each provider's setup
3. Update `auth-panel.jsx` to add more sign-in buttons

Example for adding GitHub:

```jsx
const handleGitHubSignIn = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
};
```

---

## 🔐 Security Notes

- **Never commit** Client ID or Client Secret to git
- Store them in Supabase only (they're secure there)
- Google OAuth tokens are managed by Supabase
- Users' Google passwords are never exposed to your app
- Supabase handles token refresh automatically

---

**Created**: December 14, 2025  
**Template Version**: 2.0 (Google OAuth)

