# Fallback Social Login Libraries

## Google
- [react-google-login](https://www.npmjs.com/package/react-google-login)

## Facebook
- [react-facebook-login](https://www.npmjs.com/package/react-facebook-login)

## Install

```
npm install react-google-login react-facebook-login
```

---

# How the Social Login Process Works (Full Stack)

## 1. Frontend

### Google Login
- User clicks the Google login button.
- Google SDK or fallback library opens a popup for the user to authenticate.
- On success, the frontend receives an `idToken` from Google.
- The frontend sends this `idToken` to the backend via a POST request to `/auth/google`.

### Facebook Login
- User clicks the Facebook login button.
- Facebook SDK or fallback library opens a popup for the user to authenticate.
- On success, the frontend receives an `accessToken` from Facebook.
- The frontend sends this `accessToken` to the backend via a POST request to `/auth/facebook`.

## 2. Backend

### Google
- Receives the `idToken` from the frontend.
- Verifies the token with Google (`https://oauth2.googleapis.com/tokeninfo?id_token=...`).
- If valid, finds or creates a user in the database.
- Returns a JWT token and user info to the frontend.

### Facebook
- Receives the `accessToken` from the frontend.
- Verifies the token with Facebook (`https://graph.facebook.com/me?...&access_token=...`).
- If valid, finds or creates a user in the database.
- Returns a JWT token and user info to the frontend.

## 3. Frontend (after backend response)
- Stores the JWT token (e.g., in cookies or localStorage).
- Redirects the user to the dashboard or intended page.

---

# Notes
- You must set up Google and Facebook apps and configure the correct origins/redirect URIs.

## Google OAuth Setup

**Authorized JavaScript origins:**
- `http://localhost:3000`
- `https://your-production-domain.com`

**Authorized redirect URIs:**
- (Not needed for One Tap or popup, but if you use OAuth redirect:)
	- `http://localhost:3000/auth/callback/google`
    	- `https://your-production-domain.com/auth/callback/google`

        ## Facebook App Setup

        **App Domains:**
        - `localhost`
        - `your-production-domain.com`

        **Valid OAuth Redirect URIs:**
        - `http://localhost:3000/`
        - `https://your-production-domain.com/`

        Replace `your-production-domain.com` with your actual deployed domain.
        - The backend must have the correct client IDs and secrets in environment variables.
        - The fallback libraries are only needed if the native SDKs fail or are not available.