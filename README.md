# ☕ CoffeeCounter

A fun, gamified web application to track your daily coffee consumption, spending, and unlock achievements along the way!

![CoffeeCounter Screenshot](https://img.shields.io/badge/Made%20with-☕%20Coffee-brown)

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

### Option 1: Open directly
Simply open `index.html` in your web browser - no server required!

### Option 2: Use a local server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **LocalStorage** - Client-side data persistence

## Project Structure

```
coffee-counter/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── app.js          # Application logic and state management
├── .gitignore      # Git ignore file
└── README.md       # This file
```

## Browser Support

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Privacy

All your data is stored locally in your browser using LocalStorage. No data is sent to any server - your coffee habits stay private! 🔒

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
