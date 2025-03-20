# BrainMeal - Your Smart Nutrition Assistant 🥗

BrainMeal is a comprehensive mobile application built with React Native (Expo) that helps users maintain a healthy lifestyle through personalized meal planning, nutrition tracking, and AI-powered recommendations.

## Features 🌟

- **Smart Meal Planning**: AI-powered meal suggestions based on your preferences and goals
- **Nutrition Tracking**: Track your daily calories, macros, and water intake
- **Activity Monitoring**: Log your workouts and daily activities
- **Personalized Goals**: Set and track your nutrition and fitness goals
- **Multi-language Support**: Available in English and Ukrainian
- **Dark/Light Mode**: Comfortable usage at any time of day
- **Offline Access**: Access your data even without internet connection
- **Push Notifications**: Timely reminders for meals, water, and activities

## Tech Stack 💻

- React Native (Expo)
- Firebase (Authentication & Firestore)
- Google Gemini AI
- TypeScript
- Expo Router
- AsyncStorage
- React Native Safe Area Context

## Getting Started 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/SCMARS/brainmealNative.git
   ```

2. Install dependencies:
   ```bash
   cd brainmealNative
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
