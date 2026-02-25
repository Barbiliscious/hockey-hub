

## Fix Google Sign-In: Full Implementation Plan

### The Problem

Your app currently calls `supabase.auth.signInWithOAuth()` directly on line 80 of `AuthContext.tsx`. This requires you to manually configure a Google OAuth Client ID, Secret, consent screen, authorized domains, and redirect URIs in Google Cloud Console. A misconfiguration in that chain is causing the 403 error from Google.

### The Solution

Switch to **Lovable Cloud's managed Google Sign-In**, which handles all Google credentials and configuration automatically. No Google Cloud Console setup needed.

---

### Step-by-Step Implementation

#### Step 1: Run the Configure Social Login tool

This is an internal tool I will run that:
- Generates a new `src/integrations/lovable/` module (currently does not exist)
- Installs the `@lovable.dev/cloud-auth-js` package
- You will see an approval prompt -- just click approve

No code changes from you. I handle this.

---

#### Step 2: Update `AuthContext.tsx`

Replace the `signInWithGoogle` function (lines 77-88) to use the managed solution instead of the direct call.

**Before (current code):**
```typescript
import { supabase } from "@/integrations/supabase/client";

const signInWithGoogle = async () => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  });
  return { error: error as Error | null };
};
```

**After (fixed code):**
```typescript
import { lovable } from "@/integrations/lovable/index";

const signInWithGoogle = async () => {
  const { error } = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
  return { error: error as Error | null };
};
```

The key changes:
- New import: `lovable` from the auto-generated module
- Replace `supabase.auth.signInWithOAuth(...)` with `lovable.auth.signInWithOAuth("google", ...)`
- The `redirect_uri` is set to `window.location.origin` (the app root), not `/dashboard` -- the router and auth state listener will handle navigation after sign-in

Everything else in `AuthContext.tsx` stays exactly the same -- email sign-in, sign-up, sign-out, session management are all unaffected.

---

#### Step 3: No changes needed to Login.tsx

The Login page already calls `signInWithGoogle()` from the auth context (line 64). Since we are only changing the internal implementation of that function in the context, the Login page works as-is.

---

### Technical Details

| Item | Detail |
|---|---|
| Files modified | `src/contexts/AuthContext.tsx` (1 file) |
| Files auto-generated | `src/integrations/lovable/index.ts` (by the tool) |
| Package installed | `@lovable.dev/cloud-auth-js` (by the tool) |
| Lines changed | ~6 lines (add 1 import, replace lines 77-88) |
| Risk | Very low -- only the Google OAuth call changes |

### How to Test After Implementation

1. Open an incognito/private browser window
2. Navigate to `/login`
3. Click "Continue with Google"
4. Select your Google account on the Google sign-in screen
5. Confirm you are redirected back to the app and land on `/dashboard`
6. Verify the user session is active (profile page loads, etc.)

