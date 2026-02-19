// Mock localStorage
global.localStorage = {
    store: {},
    getItem: function(key) {
        return this.store[key] || null;
    },
    setItem: function(key, value) {
        this.store[key] = value.toString();
    },
    removeItem: function(key) {
        delete this.store[key];
    },
    clear: function() {
        this.store = {};
    }
};

// Mock document with all required methods
global.document = {
    body: { appendChild: jest.fn() },
    createElement: function(tag) {
        const element = {
            id: '',
            className: '',
            classList: {
                add: function(cls) { this.classes = (this.classes || '') + ' ' + cls; },
                remove: function(cls) { this.classes = (this.classes || '').replace(' ' + cls, ''); },
                contains: function(cls) { return (this.classes || '').includes(cls); }
            },
            textContent: '',
            value: '',
            style: {},
            onclick: null,
            appendChild: function(child) { this.children = this.children || []; this.children.push(child); },
            addEventListener: function(event, handler) { this.handlers = this.handlers || {}; this.handlers[event] = handler; },
            getAttribute: function(attr) { return this[attr] || null; },
            setAttribute: function(attr, value) { this[attr] = value; }
        };
        return element;
    },
    getElementById: function(id) {
        return this.elements ? this.elements[id] : null;
    },
    elements: {},
    addElement: function(element) {
        if (element.id) {
            this.elements[element.id] = element;
        }
    },
    addEventListener: function(event, handler) {
        this.handlers = this.handlers || {};
        this.handlers[event] = handler;
    }
};

// Mock window
global.window = {
    localStorage: global.localStorage,
    document: global.document
};

// Mock all required globals
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Mock Firebase
global.firebase = {
    apps: { length: 0 },
    auth: () => ({ currentUser: null, signInWithPopup: jest.fn(), signOut: jest.fn() }),
    firestore: () => ({ collection: jest.fn(), doc: jest.fn() })
};
global.auth = global.firebase.auth();
global.db = global.firebase.firestore();
global.googleProvider = {};

// Mock updateUI to avoid DOM dependencies
global.updateUI = jest.fn();
global.updateUIFunc = jest.fn();

// Prevent DOMContentLoaded from triggering init
const originalAddEventListener = global.document.addEventListener;
global.document.addEventListener = function(event, handler) {
    if (event !== 'DOMContentLoaded') {
        originalAddEventListener.call(this, event, handler);
    }
};
