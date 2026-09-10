# Beginner Workout App

This Beginner Workout App supports beginners in the gym by allowing the user to insert data, such as weight, height, age, gender, fitness goals and number of days to train, and stores this in a Supabase database. Then it creates a workout plan suited to the user's fitness goals and number of days to train. And users can log their meals and track their daily calories and macros. This app also finds out the user's top sets for each exercise.

### Tech Stack
- React Native
- JavaScript
- Python

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
- User capabilities - users can sign up using their email and password, insert their data and log their meals and track their daily calories and macros
- Python - calculates each user's daily calorie and macro targets, creates a workout plan suited to their fitness goals and number of days to train
- Supabase - stores user inputs and top sets for each exercise. Supabase works smoothly with Expo projects and it works well with authentication
- React Native - works well for both Android and iOS phones
- JavaScript - for functions, such as finding the user's top sets for each exercise, validating user inputs
