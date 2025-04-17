# Clerk Authentication Setup for Expo App

This Expo app has been configured to use Clerk for authentication. This guide will help you set up and configure Clerk correctly.

## Features

- Sign in and sign up with email (with verification code)
- Sign in and sign up with Google
- Sign in and sign up with Apple
- Protected routes requiring authentication
- Automatic redirects for unauthenticated users

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com) and create an account.
2. Create a new application in the Clerk Dashboard.
3. In your Clerk application settings, enable the following authentication methods:
   - Email/Password
   - Google
   - Apple

### 2. Configure Environment Variables

The app is configured to read the Clerk publishable key from a `.env` file in the root directory.

1. Create a `.env` file in the root of your project with the following variables:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_from_clerk_dashboard
   ```

2. Replace `your_publishable_key_from_clerk_dashboard` with your actual publishable key from the Clerk Dashboard.

3. **Important**: After creating or modifying the `.env` file, restart your development server completely:
   ```
   # Press Ctrl+C to stop the current server
   npx expo start --clear
   ```

### 3. Configure URL Scheme

The app uses `meet-cardspace` as its URL scheme for OAuth callbacks. This is already configured in the `app.json` file:

```json
{
  "expo": {
    "scheme": "meet-cardspace",
    // other settings...
  }
}
```

### 4. Important Note About OAuth (Google & Apple Sign-in)

In this implementation:

- **Email Authentication**: Fully functional in both development and production environments.
- **OAuth Authentication (Google & Apple)**: 
  - In the development environment (Expo Go), OAuth is intentionally disabled with a user message to use email sign-in instead.
  - For production builds, additional setup is required (see below).

### 5. Setting Up OAuth for Production

For production apps, to enable OAuth:

1. In your Clerk dashboard, go to **User & Authentication** > **Social Connections**
2. Enable and configure Google and Apple providers
3. Add the following redirect URLs for both providers:
   - `meet-cardspace://oauth-callback`
   - `meet-cardspace://`

4. Modify the OAuth code in `SignInScreen.tsx` and `SignUpScreen.tsx`:
   
   ```javascript
   // Replace the alert with this code:
   await signIn.authenticateWithRedirect({
     strategy: 'oauth_google', // or 'oauth_apple'
     redirectUrl: `${ENV.APP_SCHEME}://oauth-callback`,
     redirectUrlComplete: `${ENV.APP_SCHEME}://`,
   });
   ```

## Using Authentication in Your App

### Protected Routes

Wrap any component with the `RequireAuth` component to make it require authentication:

```jsx
import { RequireAuth } from '@/app/utils/authUtils';

export default function ProtectedScreen() {
  return (
    <RequireAuth>
      <YourComponent />
    </RequireAuth>
  );
}
```

### Accessing User Data

Use the Clerk hooks to access user data and authentication functions:

```jsx
import { useAuth, useUser } from '@clerk/clerk-expo';

function ProfileScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  
  // Now you can use user data or auth functions
  return (
    <View>
      <Text>Hello, {user?.firstName}!</Text>
      <Button onPress={() => signOut()} title="Sign Out" />
    </View>
  );
}
```

## Authentication Flow

1. When users open the app, they'll see the sign-in screen if not authenticated
2. Users can sign in with email, Google, or Apple
3. For email sign-in, they'll need to enter a verification code
4. Once authenticated, they'll have access to protected routes
5. If they try to access a protected route without authentication, they'll be redirected to sign in

## Troubleshooting

### Common Errors and Fixes

1. **"last_name is not a valid parameter"**: This error has been fixed by making last name optional in the sign-up process.

2. **"Couldn't find your account"**: When signing in with an email that doesn't exist, the app now prompts the user to sign up instead.

3. **OAuth errors in development**: OAuth is disabled in the development environment. Use email authentication instead.

4. **Verification code issues**: If the verification code is not working, try resending it using the "Resend" button.

### Environment Variables Not Loading

If your environment variables aren't loading:
1. Make sure your `.env` file is in the root directory
2. Double-check that the variable name is exactly `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Restart your development server with `npx expo start --clear`
4. Check console logs for any errors related to environment variables

### General Clerk Issues

- Check the Clerk Dashboard logs for any error messages
- Ensure your account has an active plan that supports the features you're using
- For development, ensure you have proper network access for OAuth callbacks 