// Test suite for coffee functionality
// This tests the add coffee functionality

// Load the app module
const app = require('../app.js');

describe('Coffee Counter - Add New Coffee', () => {
    let originalState;
    
    beforeEach(() => {
        // Reset state by modifying existing object (not replacing reference)
        app.state.coffees = [...app.DEFAULT_COFFEES];
        app.state.history = [];
        app.state.achievements = [];
        
        // Reset editingCoffeeId
        app.editingCoffeeId = null;
        
        // Reset localStorage
        global.localStorage.clear();
        
        // Reset mocks
        global.alert.mockClear();
        global.confirm.mockClear();
        global.updateUI.mockClear();
    });
    
    describe('generateCoffeeId', () => {
        it('should generate a unique ID for each coffee', () => {
            const id1 = app.generateCoffeeId();
            const id2 = app.generateCoffeeId();
            
            expect(id1).toBeDefined();
            expect(id2).toBeDefined();
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^coffee_\d+_[a-z0-9]+$/);
            expect(id2).toMatch(/^coffee_\d+_[a-z0-9]+$/);
        });
    });
    
    describe('openAddCoffeeModal', () => {
        it('should open the modal and reset form fields', () => {
            // Create mock DOM elements
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '' },
                'coffee-name': { value: '' },
                'coffee-price': { value: '' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            app.openAddCoffeeModal();
            
            expect(app.editingCoffeeId).toBeNull();
        });
    });
    
    describe('saveCoffee - Add New Coffee', () => {
        it('should add a new coffee to the state', () => {
            // Create mock DOM elements
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'Caramel Macchiato' },
                'coffee-price': { value: '5.50' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Save
            app.saveCoffee();
            
            // Check that coffee was added
            const newCoffee = app.state.coffees.find(c => c.name === 'Caramel Macchiato');
            expect(newCoffee).toBeDefined();
            expect(newCoffee.id).toBeDefined();
            expect(newCoffee.name).toBe('Caramel Macchiato');
            expect(newCoffee.icon).toBe('☕');
            expect(newCoffee.price).toBe(5.50);
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length + 1);
        });
        
        it('should validate that coffee name is required', () => {
            // Create mock DOM elements with empty name
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: '' },
                'coffee-price': { value: '3.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Save
            app.saveCoffee();
            
            // Check that alert was called
            expect(global.alert).toHaveBeenCalledWith('Please enter a coffee name');
            
            // Check that coffee was NOT added
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length);
        });
        
        it('should validate that price cannot be negative', () => {
            // Create mock DOM elements with negative price
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'Free Coffee' },
                'coffee-price': { value: '-5.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Save
            app.saveCoffee();
            
            // Check that alert was called
            expect(global.alert).toHaveBeenCalledWith('Price cannot be negative');
            
            // Check that coffee was NOT added
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length);
        });
        
        it('should handle price of 0', () => {
            // Create mock DOM elements with zero price
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'Free Sample' },
                'coffee-price': { value: '0' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Save
            app.saveCoffee();
            
            // Check that coffee was added with price 0
            const newCoffee = app.state.coffees.find(c => c.name === 'Free Sample');
            expect(newCoffee).toBeDefined();
            expect(newCoffee.price).toBe(0);
        });
        
        it('should use the selected emoji', () => {
            // Create mock DOM elements with specific emoji
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '🍵' },
                'coffee-name': { value: 'Matcha Latte' },
                'coffee-price': { value: '4.50' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Save
            app.saveCoffee();
            
            // Check that coffee was added with correct emoji
            const newCoffee = app.state.coffees.find(c => c.name === 'Matcha Latte');
            expect(newCoffee.icon).toBe('🍵');
        });
        
        it('should generate unique IDs for multiple coffees', () => {
            // Add first coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'Coffee A' },
                'coffee-price': { value: '3.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Add second coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '🫖' },
                'coffee-name': { value: 'Coffee B' },
                'coffee-price': { value: '4.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Check that both coffees have unique IDs
            const coffeeA = app.state.coffees.find(c => c.name === 'Coffee A');
            const coffeeB = app.state.coffees.find(c => c.name === 'Coffee B');
            
            expect(coffeeA.id).not.toBe(coffeeB.id);
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length + 2);
        });
    });
    
    describe('saveCoffee - Edit Existing Coffee', () => {
        it('should update an existing coffee', () => {
            // First, add a coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'Test Coffee' },
                'coffee-price': { value: '3.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Get the coffee ID
            const testCoffee = app.state.coffees.find(c => c.name === 'Test Coffee');
            const coffeeId = testCoffee.id;
            
            // Open edit modal
            app.openEditCoffeeModal(coffeeId);
            
            // Update values
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '🌟' },
                'coffee-name': { value: 'Updated Coffee' },
                'coffee-price': { value: '5.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Check that coffee was updated (not added)
            const updatedCoffee = app.state.coffees.find(c => c.name === 'Updated Coffee');
            expect(updatedCoffee).toBeDefined();
            expect(updatedCoffee.id).toBe(coffeeId);
            expect(updatedCoffee.price).toBe(5.00);
            expect(updatedCoffee.icon).toBe('🌟');
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length + 1);
        });
    });
    
    describe('closeModal', () => {
        it('should close the modal and reset editing state', () => {
            // Create mock DOM elements
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '' },
                'coffee-name': { value: '' },
                'coffee-price': { value: '' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            
            // Open modal
            app.openAddCoffeeModal();
            expect(app.editingCoffeeId).toBeNull();
            
            // Close modal
            app.closeModal();
            
            expect(app.editingCoffeeId).toBeNull();
        });
    });
    
    describe('deleteCoffee', () => {
        it('should delete a coffee from the state', () => {
            // Add a coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'ToDelete' },
                'coffee-price': { value: '3.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            const coffeeId = app.state.coffees.find(c => c.name === 'ToDelete').id;
            
            // Mock confirm to return true
            global.confirm.mockReturnValue(true);
            
            // Delete
            app.deleteCoffee(coffeeId);
            
            // Check that coffee was deleted
            expect(app.state.coffees.find(c => c.id === coffeeId)).toBeUndefined();
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length);
        });
        
        it('should not delete if user cancels', () => {
            // Add a coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '☕' },
                'coffee-name': { value: 'ToKeep' },
                'coffee-price': { value: '3.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            const coffeeId = app.state.coffees.find(c => c.name === 'ToKeep').id;
            
            // Mock confirm to return false
            global.confirm.mockReturnValue(false);
            
            // Try to delete
            app.deleteCoffee(coffeeId);
            
            // Check that coffee still exists
            expect(app.state.coffees.find(c => c.id === coffeeId)).toBeDefined();
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length + 1);
        });
    });
    
    describe('integration - Complete workflow', () => {
        it('should handle adding multiple custom coffees', () => {
            // Add first coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '🍦' },
                'coffee-name': { value: 'Affogato' },
                'coffee-price': { value: '6.00' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Add second coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '⚡' },
                'coffee-name': { value: 'Ristretto' },
                'coffee-price': { value: '3.50' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Add third coffee
            global.document.elements = {
                'modal-title': { textContent: '' },
                'selected-emoji': { textContent: '🥛' },
                'coffee-name': { value: 'Flat White' },
                'coffee-price': { value: '4.25' },
                'emoji-picker': { classList: { add: () => {}, remove: () => {} } },
                'coffee-modal': { classList: { add: () => {}, remove: () => {} } }
            };
            app.saveCoffee();
            
            // Verify all coffees were added
            expect(app.state.coffees.length).toBe(app.DEFAULT_COFFEES.length + 3);
            
            // Verify specific coffees
            const affogato = app.state.coffees.find(c => c.name === 'Affogato');
            const ristretto = app.state.coffees.find(c => c.name === 'Ristretto');
            const flatWhite = app.state.coffees.find(c => c.name === 'Flat White');
            
            expect(affogato).toBeDefined();
            expect(affogato.price).toBe(6.00);
            expect(affogato.icon).toBe('🍦');
            
            expect(ristretto).toBeDefined();
            expect(ristretto.price).toBe(3.50);
            expect(ristretto.icon).toBe('⚡');
            
            expect(flatWhite).toBeDefined();
            expect(flatWhite.price).toBe(4.25);
            expect(flatWhite.icon).toBe('🥛');
        });
    });
});
