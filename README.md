# ☕ CoffeeCounter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/LordTT/coffee-counter)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/LordTT/coffee-counter/releases)

A professional-grade web application for tracking daily coffee consumption, monitoring spending habits, and celebrating milestones through an achievement-based gamification system.

## 📋 Overview

CoffeeCounter is a feature-rich, client-side web application designed for coffee enthusiasts who want to track their consumption patterns, manage their coffee-related expenses, and stay motivated through gamified achievements. The application provides comprehensive analytics, customizable settings, and optional cloud synchronization through Firebase integration.

## Features

### ☕ Coffee Tracking
- Track 6 different coffee types: Espresso, Americano, Latte, Cappuccino, Mocha, and Cold Brew
- Intuitive increment/decrement interface for quick logging
- Real-time daily summary displaying total coffees consumed and cumulative spending

### 🏆 Gamification System
The application features a comprehensive achievement system with 16 unique milestones:

| Achievement | Description | Requirement |
|-------------|-------------|-------------|
| First Sip | Log your first coffee | 1 coffee |
| Getting Started | Drink 10 coffees | 10 coffees |
| Regular | Drink 50 coffees | 50 coffees |
| Coffee Enthusiast | Drink 100 coffees | 100 coffees |
| Coffee Addict | Drink 500 coffees | 500 coffees |
| Coffee Legend | Drink 1000 coffees | 1000 coffees |
| Espresso Master | Drink 25 espressos | 25 espressos |
| Latte Lover | Drink 25 lattes | 25 lattes |
| Mocha Madness | Drink 25 mochas | 25 mochas |
| Cold Brew Champion | Drink 25 cold brews | 25 cold brews |
| Variety Seeker | Try all coffee types | 6 types |
| Big Spender | Spend $50 on coffee | $50 spent |
| Coffee Investor | Spend $100 on coffee | $100 spent |
| Coffee Mogul | Spend $500 on coffee | $500 spent |
| Caffeine Rush | Drink 5 coffees in one day | 5/day |
| Unstoppable | Drink 10 coffees in one day | 10/day |

### 📊 Analytics Dashboard
- **Lifetime statistics**: Total coffees consumed and total spending
- **Time-based tracking**: Weekly and monthly consumption monitoring
- **Consumption breakdown**: Visual representation of coffee type distribution
- **Average metrics**: Daily consumption and spending averages
- **Favorite identification**: Automatic detection of most consumed coffee type
- **Historical data**: Access to the last 30 days of consumption records

### ⚙️ Customization & Management
- **Price customization**: Adjust coffee prices to reflect local market rates
- **Data management tools**: Options to reset daily counts, clear all data, or export data in JSON format
- **Local persistence**: All data stored in browser localStorage for offline access

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (required only for Firebase cloud sync)

### Installation

#### Option 1: Local Mode (No Account Required)
Simply open `index.html` in your web browser. All data will be stored locally in your browser's localStorage.

#### Option 2: Cloud Sync (Google Account Required)
To enable Google Sign-In and cloud synchronization, configure Firebase:

**Firebase Setup:**

1. **Create a Firebase Project**
   - Navigate to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the setup wizard
   - Assign a descriptive name to your project (e.g., "coffee-counter")

2. **Enable Google Authentication**
   - In your Firebase project, go to **Authentication** → **Sign-in method**
   - Select **Google** and enable it as a sign-in provider
   - Configure the support email and save the settings

3. **Set Up Firestore Database**
   - Navigate to **Firestore Database** → **Create database**
   - Select **test mode** for initial setup (implement security rules before production)
   - Choose a geographic location closest to your user base

4. **Obtain Firebase Configuration**
   - Go to **Project Settings** (gear icon) → **General**
   - Under "Your apps", click the web icon (`</>`)
   - Register your application with a descriptive nickname
   - Copy the provided `firebaseConfig` object

5. **Configure the Application**
   - Open `firebase-config.js` in the project directory
   - Replace the placeholder values with your Firebase configuration:
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

6. **Configure Authorized Domains** (for production deployment)
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Add your production domain (e.g., `yourdomain.com`)

### Running the Application

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your web browser.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | CSS Grid, Flexbox, CSS Variables |
| Authentication | Firebase Authentication (Google OAuth) |
| Database | Cloud Firestore (real-time sync) |
| Storage | LocalStorage (client-side persistence) |

## Project Structure

```
coffee-counter/
├── index.html          # Main HTML structure and page layout
├── styles.css          # Styling, responsive design, and animations
├── app.js              # Application logic, state management, and Firebase integration
├── firebase-config.js  # Firebase configuration (user-provided)
├── test/               # Test suite directory
│   ├── coffee.test.js  # Unit tests
│   └── setup.js        # Test configuration
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## Authentication

- **Google OAuth**: One-click authentication using Google accounts
- **Guest Mode**: Full functionality without authentication (local storage only)
- **Data Migration**: Automatic migration of local data to cloud on first sign-in

## Cloud Synchronization

- **Real-time Sync**: Automatic data synchronization with Firebase Firestore
- **Cross-Device Access**: Access your data from any device with internet connectivity
- **Offline Support**: Full functionality with local backup when offline
- **Debounced Sync**: Automatic synchronization with 1-second debounce to optimize performance

## Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |

## Data Privacy & Security

- **Local Mode**: All data remains in your browser's localStorage
- **Cloud Mode**: Data stored in your personal Firebase Firestore document
- **No Data Sharing**: User data is never shared with third parties
- **Data Portability**: Export functionality available in JSON format
- **Data Deletion**: Users can delete their data at any time

## Testing

The project includes a comprehensive test suite:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Feature Requests:**
- Add more coffee types
- Implement weekly/monthly challenges
- Add coffee shop location tracking
- Implement dark mode
- Add export to CSV/PDF functionality

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Firebase for providing the backend infrastructure
- Coffee lovers everywhere for the inspiration

---

*Version 1.0.0 - Last updated February 2025*
