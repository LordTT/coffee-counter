// CoffeeCounter Application

// Default coffee prices
const DEFAULT_PRICES = {
    espresso: 2.50,
    americano: 3.00,
    latte: 4.50,
    cappuccino: 4.00,
    mocha: 5.00,
    coldBrew: 4.00
};

// Coffee display names
const COFFEE_NAMES = {
    espresso: 'Espresso',
    americano: 'Americano',
    latte: 'Latte',
    cappuccino: 'Cappuccino',
    mocha: 'Mocha',
    coldBrew: 'Cold Brew'
};

// Achievements definition
const ACHIEVEMENTS = [
    { id: 'first_coffee', name: 'First Sip', icon: '🎉', desc: 'Log your first coffee', requirement: { type: 'total', count: 1 } },
    { id: 'coffee_10', name: 'Getting Started', icon: '☕', desc: 'Drink 10 coffees', requirement: { type: 'total', count: 10 } },
    { id: 'coffee_50', name: 'Regular', icon: '🌟', desc: 'Drink 50 coffees', requirement: { type: 'total', count: 50 } },
    { id: 'coffee_100', name: 'Coffee Enthusiast', icon: '💫', desc: 'Drink 100 coffees', requirement: { type: 'total', count: 100 } },
    { id: 'coffee_500', name: 'Coffee Addict', icon: '🏆', desc: 'Drink 500 coffees', requirement: { type: 'total', count: 500 } },
    { id: 'coffee_1000', name: 'Coffee Legend', icon: '👑', desc: 'Drink 1000 coffees', requirement: { type: 'total', count: 1000 } },
    { id: 'espresso_master', name: 'Espresso Master', icon: '⚡', desc: 'Drink 25 espressos', requirement: { type: 'coffee', coffee: 'espresso', count: 25 } },
    { id: 'latte_lover', name: 'Latte Lover', icon: '🥛', desc: 'Drink 25 lattes', requirement: { type: 'coffee', coffee: 'latte', count: 25 } },
    { id: 'mocha_madness', name: 'Mocha Madness', icon: '🍫', desc: 'Drink 25 mochas', requirement: { type: 'coffee', coffee: 'mocha', count: 25 } },
    { id: 'cold_brew_champ', name: 'Cold Brew Champion', icon: '🧊', desc: 'Drink 25 cold brews', requirement: { type: 'coffee', coffee: 'coldBrew', count: 25 } },
    { id: 'variety', name: 'Variety Seeker', icon: '🌈', desc: 'Try all coffee types', requirement: { type: 'variety', count: 6 } },
    { id: 'big_spender_50', name: 'Big Spender', icon: '💰', desc: 'Spend $50 on coffee', requirement: { type: 'money', amount: 50 } },
    { id: 'big_spender_100', name: 'Coffee Investor', icon: '💎', desc: 'Spend $100 on coffee', requirement: { type: 'money', amount: 100 } },
    { id: 'big_spender_500', name: 'Coffee Mogul', icon: '🤑', desc: 'Spend $500 on coffee', requirement: { type: 'money', amount: 500 } },
    { id: 'daily_5', name: 'Caffeine Rush', icon: '⚡', desc: 'Drink 5 coffees in one day', requirement: { type: 'daily', count: 5 } },
    { id: 'daily_10', name: 'Unstoppable', icon: '🚀', desc: 'Drink 10 coffees in one day', requirement: { type: 'daily', count: 10 } },
];

// State
let state = {
    prices: { ...DEFAULT_PRICES },
    history: [], // Array of { date: 'YYYY-MM-DD', coffees: { type: count }, totalSpent: number }
    achievements: [], // Array of unlocked achievement IDs
};

// Get today's date string
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// Get or create today's entry
function getTodayEntry() {
    const today = getTodayString();
    let entry = state.history.find(h => h.date === today);
    if (!entry) {
        entry = { date: today, coffees: {}, totalSpent: 0 };
        state.history.push(entry);
    }
    return entry;
}

// Calculate totals
function calculateTotals() {
    let totalCoffees = 0;
    let totalSpent = 0;
    const coffeeBreakdown = {};

    state.history.forEach(day => {
        Object.entries(day.coffees).forEach(([type, count]) => {
            totalCoffees += count;
            coffeeBreakdown[type] = (coffeeBreakdown[type] || 0) + count;
        });
        totalSpent += day.totalSpent;
    });

    return { totalCoffees, totalSpent, coffeeBreakdown };
}

// Get week's coffees
function getWeekCoffees() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let count = 0;

    state.history.forEach(day => {
        const dayDate = new Date(day.date);
        if (dayDate >= weekAgo) {
            Object.values(day.coffees).forEach(c => count += c);
        }
    });

    return count;
}

// Get month's coffees
function getMonthCoffees() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let count = 0;

    state.history.forEach(day => {
        const dayDate = new Date(day.date);
        if (dayDate >= monthStart) {
            Object.values(day.coffees).forEach(c => count += c);
        }
    });

    return count;
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('coffeeCounter', JSON.stringify(state));
}

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('coffeeCounter');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = {
            prices: { ...DEFAULT_PRICES, ...parsed.prices },
            history: parsed.history || [],
            achievements: parsed.achievements || [],
        };
    }
}

// Update coffee count
function updateCoffeeCount(type, delta) {
    const entry = getTodayEntry();
    entry.coffees[type] = (entry.coffees[type] || 0) + delta;
    
    if (entry.coffees[type] < 0) {
        entry.coffees[type] = 0;
    }

    // Recalculate today's total spent
    entry.totalSpent = 0;
    Object.entries(entry.coffees).forEach(([t, count]) => {
        entry.totalSpent += count * state.prices[t];
    });

    saveState();
    updateUI();
    checkAchievements();
}

// Check and unlock achievements
function checkAchievements() {
    const { totalCoffees, totalSpent, coffeeBreakdown } = calculateTotals();
    const todayEntry = getTodayEntry();
    const todayTotal = Object.values(todayEntry.coffees).reduce((a, b) => a + b, 0);
    const varietyCount = Object.keys(coffeeBreakdown).filter(k => coffeeBreakdown[k] > 0).length;

    ACHIEVEMENTS.forEach(achievement => {
        if (state.achievements.includes(achievement.id)) return;

        let unlocked = false;
        const req = achievement.requirement;

        switch (req.type) {
            case 'total':
                unlocked = totalCoffees >= req.count;
                break;
            case 'coffee':
                unlocked = (coffeeBreakdown[req.coffee] || 0) >= req.count;
                break;
            case 'money':
                unlocked = totalSpent >= req.amount;
                break;
            case 'daily':
                unlocked = todayTotal >= req.count;
                break;
            case 'variety':
                unlocked = varietyCount >= req.count;
                break;
        }

        if (unlocked) {
            state.achievements.push(achievement.id);
            saveState();
            showAchievementNotification(achievement);
        }
    });

    renderAchievements();
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievement-notification');
    document.getElementById('achievement-title').textContent = achievement.name;
    document.getElementById('achievement-desc').textContent = achievement.desc;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Update UI
function updateUI() {
    const todayEntry = getTodayEntry();
    const { totalCoffees, totalSpent, coffeeBreakdown } = calculateTotals();

    // Update today's summary
    const todayTotal = Object.values(todayEntry.coffees).reduce((a, b) => a + b, 0);
    document.getElementById('today-total').textContent = todayTotal;
    document.getElementById('today-money').textContent = `$${todayEntry.totalSpent.toFixed(2)}`;

    // Update coffee cards
    document.querySelectorAll('.coffee-card').forEach(card => {
        const type = card.dataset.type;
        const count = todayEntry.coffees[type] || 0;
        card.querySelector('.count').textContent = count;
        card.querySelector('.price').textContent = `$${state.prices[type].toFixed(2)}`;
    });

    // Update statistics
    document.getElementById('total-coffees').textContent = totalCoffees;
    document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('week-coffees').textContent = getWeekCoffees();
    document.getElementById('month-coffees').textContent = getMonthCoffees();

    // Daily average
    const daysWithCoffee = state.history.filter(h => Object.values(h.coffees).some(c => c > 0)).length || 1;
    const avgCoffees = (totalCoffees / daysWithCoffee).toFixed(1);
    const avgMoney = (totalSpent / daysWithCoffee).toFixed(2);
    document.getElementById('daily-avg-count').textContent = avgCoffees;
    document.getElementById('daily-avg-money').textContent = `$${avgMoney}`;

    // Favorite coffee
    const favorite = Object.entries(coffeeBreakdown).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('favorite-coffee').textContent = favorite 
        ? `${COFFEE_NAMES[favorite[0]]} (${favorite[1]} cups)` 
        : 'No data yet';

    // Breakdown chart
    renderBreakdownChart(coffeeBreakdown, totalCoffees);

    // History
    renderHistory();
}

// Render breakdown chart
function renderBreakdownChart(breakdown, total) {
    const container = document.getElementById('breakdown-chart');
    container.innerHTML = '';

    if (total === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No data yet</p>';
        return;
    }

    Object.entries(COFFEE_NAMES).forEach(([type, name]) => {
        const count = breakdown[type] || 0;
        const percentage = total > 0 ? (count / total * 100) : 0;

        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <span class="name">${name}</span>
            <div class="bar-container">
                <div class="bar" style="width: ${percentage}%"></div>
            </div>
            <span class="value">${count}</span>
        `;
        container.appendChild(item);
    });
}

// Render history
function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = '';

    const sortedHistory = [...state.history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

    if (sortedHistory.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No history yet</p>';
        return;
    }

    sortedHistory.forEach(day => {
        const totalCoffees = Object.values(day.coffees).reduce((a, b) => a + b, 0);
        if (totalCoffees === 0) return;

        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        item.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-count">${totalCoffees} coffees</span>
            <span class="history-money">$${day.totalSpent.toFixed(2)}</span>
        `;
        container.appendChild(item);
    });
}

// Render achievements
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    container.innerHTML = '';

    const { totalCoffees, totalSpent, coffeeBreakdown } = calculateTotals();
    const todayEntry = getTodayEntry();
    const todayTotal = Object.values(todayEntry.coffees).reduce((a, b) => a + b, 0);
    const varietyCount = Object.keys(coffeeBreakdown).filter(k => coffeeBreakdown[k] > 0).length;

    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = state.achievements.includes(achievement.id);
        const req = achievement.requirement;

        let progress = 0;
        let current = 0;
        let target = req.count || req.amount;

        switch (req.type) {
            case 'total':
                current = totalCoffees;
                break;
            case 'coffee':
                current = coffeeBreakdown[req.coffee] || 0;
                break;
            case 'money':
                current = totalSpent;
                break;
            case 'daily':
                current = todayTotal;
                break;
            case 'variety':
                current = varietyCount;
                break;
        }

        progress = Math.min((current / target) * 100, 100);

        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="icon">${achievement.icon}</div>
            <h4>${achievement.name}</h4>
            <p>${achievement.desc}</p>
            <div class="progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <small>${current}/${target}</small>
        `;
        container.appendChild(card);
    });
}

// Render price settings
function renderPriceSettings() {
    const container = document.getElementById('price-settings');
    container.innerHTML = '';

    Object.entries(COFFEE_NAMES).forEach(([type, name]) => {
        const group = document.createElement('div');
        group.className = 'price-input-group';
        group.innerHTML = `
            <label>${name}</label>
            <input type="number" step="0.01" min="0" value="${state.prices[type].toFixed(2)}" data-type="${type}">
        `;
        container.appendChild(group);
    });

    // Add event listeners
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            const type = e.target.dataset.type;
            const value = parseFloat(e.target.value) || 0;
            state.prices[type] = value;
            
            // Recalculate all history totals
            state.history.forEach(day => {
                day.totalSpent = 0;
                Object.entries(day.coffees).forEach(([t, count]) => {
                    day.totalSpent += count * state.prices[t];
                });
            });
            
            saveState();
            updateUI();
        });
    });
}

// Initialize tabs
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

// Initialize counter buttons
function initCounterButtons() {
    document.querySelectorAll('.coffee-card').forEach(card => {
        const type = card.dataset.type;
        
        card.querySelector('.btn-increment').addEventListener('click', () => {
            updateCoffeeCount(type, 1);
        });
        
        card.querySelector('.btn-decrement').addEventListener('click', () => {
            updateCoffeeCount(type, -1);
        });
    });
}

// Initialize settings buttons
function initSettingsButtons() {
    document.getElementById('reset-today').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset today\'s count?')) {
            const today = getTodayString();
            const index = state.history.findIndex(h => h.date === today);
            if (index !== -1) {
                state.history.splice(index, 1);
            }
            saveState();
            updateUI();
        }
    });

    document.getElementById('reset-all').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
            state = {
                prices: { ...DEFAULT_PRICES },
                history: [],
                achievements: [],
            };
            saveState();
            updateUI();
            renderAchievements();
            renderPriceSettings();
        }
    });

    document.getElementById('export-data').addEventListener('click', () => {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coffee-counter-export-${getTodayString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Initialize app
function init() {
    loadState();
    initTabs();
    initCounterButtons();
    initSettingsButtons();
    renderPriceSettings();
    updateUI();
    renderAchievements();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
