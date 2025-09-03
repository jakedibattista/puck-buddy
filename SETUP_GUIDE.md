# Authentication Setup Guide

## Firebase Configuration

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication in the Firebase console
   - Enable Google Sign-In provider in Authentication > Sign-in method

2. **Get Firebase Configuration**
   - In Project Settings > General, find your web app configuration
   - Copy the config object and replace the placeholder values in `firebase.config.js`

3. **Download Configuration Files**
   - **iOS**: Download `GoogleService-Info.plist` and place it in the root directory
   - **Android**: Download `google-services.json` and place it in the root directory

## Google Sign-In Configuration

1. **iOS Configuration**
   - Add the `REVERSED_CLIENT_ID` from `GoogleService-Info.plist` to your app.json:
   ```json
   {
     "expo": {
       "ios": {
         "googleServicesFile": "./GoogleService-Info.plist"
       }
     }
   }
   ```

2. **Android Configuration**
   - Add the Google Services file to your app.json:
   ```json
   {
     "expo": {
       "android": {
         "googleServicesFile": "./google-services.json"
       }
     }
   }
   ```

## Environment Variables (Optional)

Create a `.env` file for sensitive configuration:
```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
```

## Next Steps

After completing the setup:
1. Update `firebase.config.js` with your actual Firebase configuration
2. Test the authentication flow
3. Configure additional providers as needed

## Required Files to Add

- `GoogleService-Info.plist` (iOS)
- `google-services.json` (Android)
- Update `firebase.config.js` with real configuration values