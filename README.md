# Beginner Workout App

A React Native mobile application designed to support beginners in the gym by creating personalised workout plans, calculating calorie and macronutrient targets, allowing users to log their meals, calculating top sets for each exercise on their workout plan and helping users to progressively overload on their exercises, supporting beginners in the gym to make the progress they want.

### Tech Stack
- Frontend - React Native (framework) and JavaScript (validation)
- Backend - Python (calorie and macronutrient calculation, workout plan generation)
- Database - Supabase (user data storage)

Follow these steps to download Expo Go on your phone and run the application:

### 1. Download Expo Go on your phone

### 2. Clone the repository in your terminal
```
git clone https://github.com/BilalParkar12/BeginnerWorkoutApp.git
```

### 3. Navigate to the BeginnerWorkoutApp folder
```
cd BeginnerWorkoutApp
```

### 4. Install expo
```
npm install expo
```

### 5. Run the application
```
npx expo start --go
```

### 6. Use the app on Expo go
1. Go onto Expo Go on your phone
2. Press "Scan QR"
3. Scan the QR code shown on the terminal screen
4. Press "Expo Go" at the bottom of the screen

You can now see the screen displayed on your phone.

### Features
- User authentication - users can sign up and log in securely using email and password
- Progressive overload - analyses the previous top set and number of reps, then increases the weight depending on the rep ranges
- Nutrition tracker - allows users to log meals and view their daily total calories and macronutrients
- Workout generation - creates personalised workout plans to match the user's fitness goals and number of days to train
