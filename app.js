// CoffeeCounter Application with Firebase Authentication & Cloud Storage

// Default coffees (used for new users)
const DEFAULT_COFFEES = [
    { id: 'espresso', name: 'Espresso', icon: '☕', price: 2.50 },
    { id: 'americano', name: 'Americano', icon: '🫖', price: 3.00 },
    { id: 'latte', name: 'Latte', icon: '🥛', price: 4.50 },
    { id: 'cappuccino', name: 'Cappuccino', icon: '🍵', price: 4.00 },
    { id: 'mocha', name: 'Mocha', icon: '🍫', price: 5.00 },
    { id: 'coldBrew', name: 'Cold Brew', icon: '🧊', price: 4.00 }
];

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
    coffees: [...DEFAULT_COFFEES],
    history: [],
    achievements: [],
};

// Current user
let currentUser = null;
let syncTimeout = null;
let editingCoffeeId = null;

// ==================== FIREBASE AUTHENTICATION ====================

function initAuth() {
    // Check if Firebase is configured
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.warn('Firebase not configured. Running in local-only mode.');
        return;
    }

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            showSignedInUI(user);
            showLoading(true);
            await loadCloudData();
            showLoading(false);
        } else {
            currentUser = null;
            showSignedOutUI();
            loadLocalState();
        }
        updateUI();
        renderAchievements();
    });

    // Sign in button
    document.getElementById('sign-in-btn').addEventListener('click', signIn);
    
    // Sign out button
    document.getElementById('sign-out-btn').addEventListener('click', signOut);
}

async function signIn() {
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (error) {
        console.error('Sign in error:', error);
        showSyncStatus('error', 'Sign in failed');
    }
}

async function signOut() {
    try {
        await auth.signOut();
        loadLocalState();
        updateUI();
        renderAchievements();
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

function showSignedInUI(user) {
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('user-signed-in').style.display = 'flex';
    document.getElementById('user-photo').src = user.photoURL || 'https://via.placeholder.com/35';
    document.getElementById('user-name').textContent = user.displayName || user.email;
}

function showSignedOutUI() {
    document.getElementById('user-signed-out').style.display = 'flex';
    document.getElementById('user-signed-in').style.display = 'none';
}

// ==================== CLOUD DATA SYNC ====================

async function loadCloudData() {
    if (!currentUser) {
        loadLocalState();
        return;
    }

    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        
        if (doc.exists) {
            const cloudData = doc.data();
            state = {
                coffees: cloudData.coffees || [...DEFAULT_COFFEES],
                history: cloudData.history || [],
                achievements: cloudData.achievements || [],
            };
            // Also save to local storage as backup
            saveLocalState();
            showSyncStatus('success', 'Data synced');
        } else {
            // No cloud data, check for local data to migrate
            const localData = localStorage.getItem('coffeeCounter');
            if (localData) {
                const parsed = JSON.parse(localData);
                state = {
                    coffees: parsed.coffees || [...DEFAULT_COFFEES],
                    history: parsed.history || [],
                    achievements: parsed.achievements || [],
                };
                // Save local data to cloud
                await saveCloudData();
                showSyncStatus('success', 'Local data migrated to cloud');
            } else {
                // Fresh start
                state = {
                    coffees: [...DEFAULT_COFFEES],
                    history: [],
                    achievements: [],
                };
                await saveCloudData();
            }
        }
    } catch (error) {
        console.error('Error loading cloud data:', error);
        showSyncStatus('error', 'Failed to load data');
        loadLocalState();
    }
}

async function saveCloudData() {
    if (!currentUser) {
        saveLocalState();
        return;
    }

    try {
        showSyncStatus('syncing', 'Syncing...');
        
        await db.collection('users').doc(currentUser.uid).set({
            coffees: state.coffees,
            history: state.history,
            achievements: state.achievements,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            email: currentUser.email,
            displayName: currentUser.displayName
        });
        
        // Also save locally as backup
        saveLocalState();
        showSyncStatus('success', 'Saved to cloud');
    } catch (error) {
        console.error('Error saving to cloud:', error);
        showSyncStatus('error', 'Sync failed');
        saveLocalState();
    }
}

function debouncedSaveCloud() {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
    }
    syncTimeout = setTimeout(() => {
        saveCloudData();
    }, 1000);
}

function showSyncStatus(type, message) {
    const statusEl = document.getElementById('sync-status');
    const iconEl = statusEl.querySelector('.sync-icon');
    const textEl = statusEl.querySelector('.sync-text');
    
    statusEl.className = 'sync-status show';
    
    switch (type) {
        case 'syncing':
            statusEl.classList.add('syncing');
            iconEl.textContent = '🔄';
            break;
        case 'success':
            iconEl.textContent = '☁️';
            break;
        case 'error':
            statusEl.classList.add('error');
            iconEl.textContent = '⚠️';
            break;
        case 'offline':
            statusEl.classList.add('offline');
            iconEl.textContent = '📴';
            break;
    }
    
    textEl.textContent = message;
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// ==================== LOCAL STORAGE ====================

function saveLocalState() {
    localStorage.setItem('coffeeCounter', JSON.stringify(state));
}

function loadLocalState() {
    const saved = localStorage.getItem('coffeeCounter');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = {
            coffees: parsed.coffees || [...DEFAULT_COFFEES],
            history: parsed.history || [],
            achievements: parsed.achievements || [],
        };
    } else {
        state = {
            coffees: [...DEFAULT_COFFEES],
            history: [],
            achievements: [],
        };
    }
}

// ==================== SAVE STATE (UNIFIED) ====================

function saveState() {
    if (currentUser) {
        debouncedSaveCloud();
    } else {
        saveLocalState();
    }
}

// ==================== CORE FUNCTIONS ====================

function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function getTodayEntry() {
    const today = getTodayString();
    let entry = state.history.find(h => h.date === today);
    if (!entry) {
        entry = { date: today, coffees: {}, totalSpent: 0 };
        state.history.push(entry);
    }
    return entry;
}

function calculateTotals() {
    let totalCoffees = 0;
    let totalSpent = 0;
    const coffeeBreakdown = {};

    state.history.forEach(day => {
        Object.entries(day.coffees || {}).forEach(([type, count]) => {
            totalCoffees += count;
            coffeeBreakdown[type] = (coffeeBreakdown[type] || 0) + count;
        });
        totalSpent += day.totalSpent || 0;
    });

    return { totalCoffees, totalSpent, coffeeBreakdown };
}

function getCoffeeById(id) {
    return state.coffees.find(c => c.id === id);
}

function getCoffeeName(id) {
    const coffee = getCoffeeById(id);
    return coffee ? coffee.name : id;
}

function getCoffeePrice(id) {
    const coffee = getCoffeeById(id);
    return coffee ? coffee.price : 0;
}

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

function updateCoffeeCount(type, delta) {
    const entry = getTodayEntry();
    entry.coffees[type] = (entry.coffees[type] || 0) + delta;
    
    if (entry.coffees[type] < 0) {
        entry.coffees[type] = 0;
    }

    // Recalculate total spent
    entry.totalSpent = 0;
    Object.entries(entry.coffees).forEach(([t, count]) => {
        entry.totalSpent += count * getCoffeePrice(t);
    });

    saveState();
    updateUI();
    checkAchievements();
}

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

function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievement-notification');
    document.getElementById('achievement-title').textContent = achievement.name;
    document.getElementById('achievement-desc').textContent = achievement.desc;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ==================== UI RENDERING ====================

function updateUI() {
    const todayEntry = getTodayEntry();
    const { totalCoffees, totalSpent, coffeeBreakdown } = calculateTotals();

    const todayTotal = Object.values(todayEntry.coffees || {}).reduce((a, b) => a + b, 0);
    document.getElementById('today-total').textContent = todayTotal;
    document.getElementById('today-money').textContent = `$${(todayEntry.totalSpent || 0).toFixed(2)}`;

    // Render coffee cards
    renderCoffeeCards(todayEntry);

    document.getElementById('total-coffees').textContent = totalCoffees;
    document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('week-coffees').textContent = getWeekCoffees();
    document.getElementById('month-coffees').textContent = getMonthCoffees();

    const daysWithCoffee = state.history.filter(h => Object.values(h.coffees || {}).some(c => c > 0)).length || 1;
    const avgCoffees = (totalCoffees / daysWithCoffee).toFixed(1);
    const avgMoney = (totalSpent / daysWithCoffee).toFixed(2);
    document.getElementById('daily-avg-count').textContent = avgCoffees;
    document.getElementById('daily-avg-money').textContent = `$${avgMoney}`;

    const favorite = Object.entries(coffeeBreakdown).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('favorite-coffee').textContent = favorite 
        ? `${getCoffeeName(favorite[0])} (${favorite[1]} cups)` 
        : 'No data yet';

    renderBreakdownChart(coffeeBreakdown, totalCoffees);
    renderHistory();
    renderCustomCoffeesList();
}

function renderCoffeeCards(todayEntry) {
    const container = document.getElementById('coffee-types');
    const hint = document.getElementById('add-coffee-hint');
    container.innerHTML = '';

    if (state.coffees.length === 0) {
        hint.classList.add('show');
        return;
    }

    hint.classList.remove('show');

    state.coffees.forEach(coffee => {
        const count = (todayEntry.coffees && todayEntry.coffees[coffee.id]) || 0;
        const card = document.createElement('div');
        card.className = 'coffee-card';
        card.dataset.type = coffee.id;
        card.innerHTML = `
            <div class="coffee-icon">${coffee.icon}</div>
            <h3>${coffee.name}</h3>
            <p class="price">$${coffee.price.toFixed(2)}</p>
            <div class="counter-controls">
                <button class="btn-decrement">-</button>
                <span class="count">${count}</span>
                <button class="btn-increment">+</button>
            </div>
        `;

        // Add event listeners
        card.querySelector('.btn-increment').addEventListener('click', () => {
            updateCoffeeCount(coffee.id, 1);
        });
        card.querySelector('.btn-decrement').addEventListener('click', () => {
            updateCoffeeCount(coffee.id, -1);
        });

        container.appendChild(card);
    });
}

function renderBreakdownChart(breakdown, total) {
    const container = document.getElementById('breakdown-chart');
    container.innerHTML = '';

    if (total === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No data yet</p>';
        return;
    }

    // Show breakdown for all coffees that have been consumed
    const allCoffeeIds = new Set([
        ...state.coffees.map(c => c.id),
        ...Object.keys(breakdown)
    ]);

    allCoffeeIds.forEach(id => {
        const count = breakdown[id] || 0;
        if (count === 0) return; // Skip coffees with no consumption
        
        const percentage = total > 0 ? (count / total * 100) : 0;
        const name = getCoffeeName(id);

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

function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = '';

    const sortedHistory = [...state.history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

    if (sortedHistory.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No history yet</p>';
        return;
    }

    sortedHistory.forEach(day => {
        const totalCoffees = Object.values(day.coffees || {}).reduce((a, b) => a + b, 0);
        if (totalCoffees === 0) return;

        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        item.innerHTML = `
            <span class="history-date">${dateStr}</span>
            <span class="history-count">${totalCoffees} coffees</span>
            <span class="history-money">$${(day.totalSpent || 0).toFixed(2)}</span>
        `;
        container.appendChild(item);
    });
}

function renderCustomCoffeesList() {
    const container = document.getElementById('custom-coffees-list');
    container.innerHTML = '';

    if (state.coffees.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">No coffees yet. Add your first one!</p>';
        return;
    }

    state.coffees.forEach(coffee => {
        const item = document.createElement('div');
        item.className = 'custom-coffee-item';
        item.innerHTML = `
            <div class="coffee-icon">${coffee.icon}</div>
            <div class="coffee-info">
                <div class="coffee-name">${coffee.name}</div>
                <div class="coffee-price">$${coffee.price.toFixed(2)}</div>
            </div>
            <div class="coffee-actions">
                <button class="btn-icon edit" title="Edit">✏️</button>
                <button class="btn-icon delete" title="Delete">🗑️</button>
            </div>
        `;

        item.querySelector('.edit').addEventListener('click', () => openEditCoffeeModal(coffee.id));
        item.querySelector('.delete').addEventListener('click', () => deleteCoffee(coffee.id));

        container.appendChild(item);
    });
}

// ==================== COFFEE MANAGEMENT ====================

function generateCoffeeId() {
    return 'coffee_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function openAddCoffeeModal() {
    editingCoffeeId = null;
    document.getElementById('modal-title').textContent = 'Add New Coffee';
    document.getElementById('selected-emoji').textContent = '☕';
    document.getElementById('coffee-name').value = '';
    document.getElementById('coffee-price').value = '';
    document.getElementById('emoji-picker').classList.remove('show');
    document.getElementById('coffee-modal').classList.add('show');
}

function openEditCoffeeModal(coffeeId) {
    const coffee = getCoffeeById(coffeeId);
    if (!coffee) return;

    editingCoffeeId = coffeeId;
    document.getElementById('modal-title').textContent = 'Edit Coffee';
    document.getElementById('selected-emoji').textContent = coffee.icon;
    document.getElementById('coffee-name').value = coffee.name;
    document.getElementById('coffee-price').value = coffee.price.toFixed(2);
    document.getElementById('emoji-picker').classList.remove('show');
    document.getElementById('coffee-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('coffee-modal').classList.remove('show');
    editingCoffeeId = null;
}

function saveCoffee() {
    const icon = document.getElementById('selected-emoji').textContent;
    const name = document.getElementById('coffee-name').value.trim();
    const price = parseFloat(document.getElementById('coffee-price').value) || 0;

    if (!name) {
        alert('Please enter a coffee name');
        return;
    }

    if (price < 0) {
        alert('Price cannot be negative');
        return;
    }

    if (editingCoffeeId) {
        // Update existing coffee
        const coffee = getCoffeeById(editingCoffeeId);
        if (coffee) {
            coffee.icon = icon;
            coffee.name = name;
            coffee.price = price;
        }
    } else {
        // Add new coffee
        state.coffees.push({
            id: generateCoffeeId(),
            icon: icon,
            name: name,
            price: price
        });
    }

    saveState();
    updateUI();
    closeModal();
}

function deleteCoffee(coffeeId) {
    const coffee = getCoffeeById(coffeeId);
    if (!coffee) return;

    if (!confirm(`Are you sure you want to delete "${coffee.name}"?`)) {
        return;
    }

    state.coffees = state.coffees.filter(c => c.id !== coffeeId);
    saveState();
    updateUI();
}

function initCoffeeModal() {
    // Add coffee button
    document.getElementById('add-coffee-btn').addEventListener('click', openAddCoffeeModal);

    // Modal close buttons
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveCoffee);

    // Close modal on overlay click
    document.getElementById('coffee-modal').addEventListener('click', (e) => {
        if (e.target.id === 'coffee-modal') {
            closeModal();
        }
    });

    // Emoji picker
    document.getElementById('emoji-trigger').addEventListener('click', () => {
        document.getElementById('emoji-picker').classList.toggle('show');
    });

    document.querySelectorAll('.emoji-option').forEach(emoji => {
        emoji.addEventListener('click', () => {
            document.getElementById('selected-emoji').textContent = emoji.textContent;
            document.getElementById('emoji-picker').classList.remove('show');
        });
    });
}

function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    container.innerHTML = '';

    const { totalCoffees, totalSpent, coffeeBreakdown } = calculateTotals();
    const todayEntry = getTodayEntry();
    const todayTotal = Object.values(todayEntry.coffees || {}).reduce((a, b) => a + b, 0);
    const varietyCount = Object.keys(coffeeBreakdown).filter(k => coffeeBreakdown[k] > 0).length;

    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = state.achievements.includes(achievement.id);
        const req = achievement.requirement;

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

        const progress = Math.min((current / target) * 100, 100);

        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="icon">${achievement.icon}</div>
            <h4>${achievement.name}</h4>
            <p>${achievement.desc}</p>
            <div class="progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <small>${Math.round(current)}/${target}</small>
        `;
        container.appendChild(card);
    });
}

// ==================== INITIALIZATION ====================

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

    document.getElementById('reset-all').addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
            state = {
                coffees: [...DEFAULT_COFFEES],
                history: [],
                achievements: [],
            };
            saveState();
            updateUI();
            renderAchievements();
        }
    });

    document.getElementById('export-data').addEventListener('click', () => {
        const exportData = {
            ...state,
            exportedAt: new Date().toISOString(),
            user: currentUser ? { email: currentUser.email, displayName: currentUser.displayName } : null
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coffee-counter-export-${getTodayString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function init() {
    // Load local state first (will be overwritten if user is signed in)
    loadLocalState();
    
    // Initialize UI components
    initTabs();
    initSettingsButtons();
    initCoffeeModal();
    updateUI();
    renderAchievements();
    
    // Initialize Firebase Auth (will trigger data load if user is signed in)
    initAuth();
}

document.addEventListener('DOMContentLoaded', init);
