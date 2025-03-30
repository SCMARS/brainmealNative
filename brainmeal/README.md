# BrainMeal Native App

A React Native mobile application for meal planning and nutrition tracking, built with Expo and Firebase.

## Features

- 🔐 Authentication (Email/Password)
- 👤 User Profile Management
- 🍽️ Meal Planning
- 📊 Nutrition Tracking
- 🎯 Goal Setting
- 📱 Cross-platform (iOS & Android)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd brainmeal
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a new web app in your Firebase project
   - Copy the Firebase configuration
   - Create a file `app/config/firebase.ts` with your Firebase configuration:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     // Your Firebase configuration here
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

4. Start the development server:
```bash
npx expo start
```

5. Run on your device or simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
brainmeal/
├── app/
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main app tabs
│   ├── (onboarding)/     # Onboarding screens
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service functions
│   ├── _layout.tsx       # Root layout
│   ├── index.tsx         # Entry point
│   ├── login.tsx         # Login screen
│   ├── register.tsx      # Registration screen
│   └── profile.tsx       # User profile screen
├── assets/              # Static assets
└── package.json         # Dependencies and scripts
```

## Navigation Flow

1. **Authentication Flow**:
   - Users start at the login screen
   - They can either log in or navigate to registration
   - After successful authentication, they're redirected to the main tabs

2. **Main App Flow**:
   - After login, users are taken to the tabs navigation
   - The tabs include: Home, Profile, and other main features

## Development

- Use `npm run start` to start the development server
- Use `npm run android` to run on Android
- Use `npm run ios` to run on iOS
- Use `npm run web` to run in web browser

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

1. **Metro Bundler Issues**:
   ```bash
   npx expo start -c
   ```

2. **Dependency Issues**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Firebase Issues**:
   - Ensure Firebase configuration is correct
   - Check if Firebase services are enabled
   - Verify network connectivity

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
