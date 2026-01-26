# ☕ CoffeeCounter

A fun, gamified web application to track your daily coffee consumption, spending, and unlock achievements along the way!

![CoffeeCounter Screenshot](https://img.shields.io/badge/Made%20with-☕%20Coffee-brown)
![AI Generated](https://img.shields.io/badge/Built%20by-Agentic%20AI-purple)

## 🤖 About This Project

**This project was entirely created by an Agentic AI as a test/demonstration of AI-assisted software development.** 

From the initial concept to the final implementation - including the HTML structure, CSS styling, JavaScript logic, gamification system, and this README - everything was generated through a conversation with an AI agent. This showcases how agentic AI can understand requirements, make design decisions, and produce a fully functional web application with minimal human intervention.

---

## Features

### 🎯 Coffee Tracking
- Track 6 different coffee types: Espresso, Americano, Latte, Cappuccino, Mocha, and Cold Brew
- Simple increment/decrement buttons for quick logging
- Real-time daily summary showing total coffees and money spent

### 🏆 Achievements & Gamification
Unlock 16 unique achievements as you track your coffee journey:

| Achievement | Description | Requirement |
|-------------|-------------|-------------|
| 🎉 First Sip | Log your first coffee | 1 coffee |
| ☕ Getting Started | Drink 10 coffees | 10 coffees |
| 🌟 Regular | Drink 50 coffees | 50 coffees |
| 💫 Coffee Enthusiast | Drink 100 coffees | 100 coffees |
| 🏆 Coffee Addict | Drink 500 coffees | 500 coffees |
| 👑 Coffee Legend | Drink 1000 coffees | 1000 coffees |
| ⚡ Espresso Master | Drink 25 espressos | 25 espressos |
| 🥛 Latte Lover | Drink 25 lattes | 25 lattes |
| 🍫 Mocha Madness | Drink 25 mochas | 25 mochas |
| 🧊 Cold Brew Champion | Drink 25 cold brews | 25 cold brews |
| 🌈 Variety Seeker | Try all coffee types | 6 types |
| 💰 Big Spender | Spend $50 on coffee | $50 spent |
| 💎 Coffee Investor | Spend $100 on coffee | $100 spent |
| 🤑 Coffee Mogul | Spend $500 on coffee | $500 spent |
| ⚡ Caffeine Rush | Drink 5 coffees in one day | 5/day |
| 🚀 Unstoppable | Drink 10 coffees in one day | 10/day |

### 📊 Statistics Dashboard
- **All-time stats**: Total coffees consumed and money spent
- **Time-based stats**: This week and this month tracking
- **Coffee breakdown**: Visual chart showing consumption by type
- **Daily averages**: Coffees per day and spending per day
- **Favorite coffee**: Your most consumed coffee type
- **History**: View your last 30 days of coffee consumption

### ⚙️ Customization
- **Custom prices**: Set prices to match your local coffee shop
- **Data management**: Reset today's count, reset all data, or export your data as JSON
- **Persistent storage**: All data saved locally in your browser

## Getting Started

### Option 1: Local Only (No Account)
Simply open `index.html` in your web browser - data will be saved locally in your browser.

### Option 2: With Google Account (Cloud Sync)
To enable Google Sign-In and cloud data sync, you need to set up Firebase:

#### Firebase Setup Instructions

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the steps
   - Give your project a name (e.g., "coffee-counter")

2. **Enable Google Authentication**
   - In your Firebase project, go to **Authentication** → **Sign-in method**
   - Click on **Google** and enable it
   - Add your email as the support email
   - Click **Save**

3. **Create Firestore Database**
   - Go to **Firestore Database** → **Create database**
   - Start in **test mode** (you can add security rules later)
   - Choose a location close to you

4. **Get Your Firebase Config**
   - Go to **Project Settings** (gear icon) → **General**
   - Scroll down to "Your apps" and click the web icon (`</>`)
   - Register your app with a nickname
   - Copy the `firebaseConfig` object

5. **Configure the App**
   - Open `firebase-config.js` in the project
   - Replace the placeholder values with your Firebase config:
   ```javascript
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
   };
   ```

6. **Add Authorized Domain** (for deployment)
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Add your deployment domain (e.g., `yourdomain.com`)

### Running the App

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **Firebase Authentication** - Google Sign-In
- **Cloud Firestore** - Real-time cloud database
- **LocalStorage** - Offline backup & guest mode

## Project Structure

```
coffee-counter/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js              # Application logic and state management
├── firebase-config.js  # Firebase configuration (user must configure)
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Features

### 🔐 Authentication
- **Google Sign-In** - One-click login with your Google account
- **Guest Mode** - Use the app without signing in (local storage only)
- **Data Migration** - Local data automatically syncs to cloud on first sign-in

### ☁️ Cloud Sync
- **Real-time Sync** - Data saved to Firebase Firestore
- **Cross-device** - Access your data from any device
- **Offline Support** - Works offline with local backup
- **Auto-sync** - Changes sync automatically with debouncing

## Browser Support

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Privacy

- **Guest Mode**: All data stored locally in your browser
- **Signed In**: Data stored in your personal Firebase Firestore document
- Your data is never shared with third parties
- You can export or delete your data at any time

## Contributing

Feel free to fork this project and submit pull requests. Some ideas for improvements:
- Add more coffee types
- Create weekly/monthly challenges
- Add coffee shop location tracking
- Implement data sync across devices
- Add dark mode

## License

MIT License - feel free to use this project however you like!

---

Made with ☕ and ❤️
