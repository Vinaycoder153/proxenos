# Vercel Deployment Guide

## 🚀 Quick Deploy

### Required Environment Variables

Add these to your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key (optional)
```

---

## 📋 Step-by-Step Instructions

### 1. **Get Supabase Credentials**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. **Add to Vercel**

#### Option A: Via Vercel Dashboard
1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: **Production, Preview, Development**
4. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Option B: Via Vercel CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GEMINI_API_KEY
```

### 3. **Redeploy**

After adding environment variables:

```bash
# Via CLI
vercel --prod

# Or via Dashboard
# Go to Deployments → Click "..." → Redeploy
```

---

## 🔧 Optional: Gemini AI

For AI features (optional):

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to Vercel:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

**Note:** App works without this, but AI features will use fallback responses.

---

## ✅ Verify Deployment

After deployment:

1. Visit your Vercel URL
2. You should see the login page
3. Sign in with your Supabase credentials
4. Dashboard should load successfully

---

## 🐛 Troubleshooting

### Build fails with "Supabase client error"
- ✅ **Fixed:** App now shows friendly error if env vars missing
- **Solution:** Add environment variables and redeploy

### "Configuration Required" message
- **Cause:** Environment variables not set
- **Solution:** Follow steps above to add them

### AI features not working
- **Cause:** `GEMINI_API_KEY` not set
- **Solution:** Add the API key (optional)
- **Note:** App uses fallback responses if key missing

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anon/public key |
| `GEMINI_API_KEY` | ⚠️ Optional | Google Gemini API key for AI features |

---

## 🔒 Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose (client-side)
- ✅ `GEMINI_API_KEY` is server-only (not exposed)
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel's environment variable encryption

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Setup Guide](https://supabase.com/docs/guides/getting-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated:** 2026-01-03  
**Status:** Production Ready ✅
