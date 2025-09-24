const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : window.location.origin;

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the section
    if (sectionName === 'person') {
        loadAllStaff();
    } else if (sectionName === 'menu') {
        loadAllMenu();
    }
}

// Person/Staff Management
document.getElementById('person-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const personData = {
        name: document.getElementById('person-name').value,
        age: parseInt(document.getElementById('person-age').value) || undefined,
        work: document.getElementById('person-work').value,
        mobile: document.getElementById('person-mobile').value,
        email: document.getElementById('person-email').value,
        salary: parseInt(document.getElementById('person-salary').value),
        address: {
            street: document.getElementById('person-street').value,
            city: document.getElementById('person-city').value,
            state: document.getElementById('person-state').value,
            country: document.getElementById('person-country').value
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}/person`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Staff member added successfully!', 'success');
            clearPersonForm();
            loadAllStaff();
        } else {
            showMessage(result.error || 'Error adding staff member', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
});

async function loadAllStaff() {
    try {
        const response = await fetch(`${API_BASE}/person`);
        const staff = await response.json();
        displayStaff(staff);
    } catch (error) {
        showMessage('Error loading staff: ' + error.message, 'error');
    }
}

async function filterStaff() {
    const workType = document.getElementById('work-filter').value;
    
    try {
        let url = `${API_BASE}/person`;
        if (workType) {
            url += `/${workType}`;
        }
        
        const response = await fetch(url);
        const staff = await response.json();
        displayStaff(staff);
    } catch (error) {
        showMessage('Error filtering staff: ' + error.message, 'error');
    }
}

function displayStaff(staff) {
    const container = document.getElementById('person-list');
    
    if (!staff || staff.length === 0) {
        container.innerHTML = '<div class="loading">No staff members found</div>';
        return;
    }
    
    container.innerHTML = staff.map(person => `
        <div class="data-item">
            <div class="item-header">
                <div class="item-title">${person.name}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editPerson('${person._id}')">Edit</button>
                    <button class="btn-danger" onclick="deletePerson('${person._id}')">Delete</button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="detail-label">Position:</span>
                    <span class="work-badge work-${person.work}">${person.work}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Age:</span>
                    <span>${person.age || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Mobile:</span>
                    <span>${person.mobile}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span>${person.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Salary:</span>
                    <span>$${person.salary.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Address:</span>
                    <span>${formatAddress(person.address)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function editPerson(id) {
    try {
        const response = await fetch(`${API_BASE}/person`);
        const staff = await response.json();
        const person = staff.find(p => p._id === id);
        
        if (!person) {
            showMessage('Person not found', 'error');
            return;
        }
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <form id="edit-person-form">
                <div class="form-row">
                    <input type="text" id="edit-person-name" value="${person.name}" placeholder="Full Name" required>
                    <input type="number" id="edit-person-age" value="${person.age || ''}" placeholder="Age">
                </div>
                <div class="form-row">
                    <select id="edit-person-work" required>
                        <option value="chef" ${person.work === 'chef' ? 'selected' : ''}>Chef</option>
                        <option value="waiter" ${person.work === 'waiter' ? 'selected' : ''}>Waiter</option>
                        <option value="manager" ${person.work === 'manager' ? 'selected' : ''}>Manager</option>
                    </select>
                    <input type="tel" id="edit-person-mobile" value="${person.mobile}" placeholder="123-456-7890" required>
                </div>
                <div class="form-row">
                    <input type="email" id="edit-person-email" value="${person.email}" placeholder="Email" required>
                    <input type="number" id="edit-person-salary" value="${person.salary}" placeholder="Salary" required>
                </div>
                <div class="address-section">
                    <h4>Address</h4>
                    <div class="form-row">
                        <input type="text" id="edit-person-street" value="${person.address?.street || ''}" placeholder="Street">
                        <input type="text" id="edit-person-city" value="${person.address?.city || ''}" placeholder="City">
                    </div>
                    <div class="form-row">
                        <input type="text" id="edit-person-state" value="${person.address?.state || ''}" placeholder="State">
                        <input type="text" id="edit-person-country" value="${person.address?.country || ''}" placeholder="Country">
                    </div>
                </div>
                <button type="submit" class="btn-primary">Update Staff Member</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </form>
        `;
        
        document.getElementById('modal-title').textContent = 'Edit Staff Member';
        document.getElementById('edit-modal').style.display = 'block';
        
        document.getElementById('edit-person-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updatePerson(id);
        });
        
    } catch (error) {
        showMessage('Error loading person data: ' + error.message, 'error');
    }
}

async function updatePerson(id) {
    const personData = {
        name: document.getElementById('edit-person-name').value,
        age: parseInt(document.getElementById('edit-person-age').value) || undefined,
        work: document.getElementById('edit-person-work').value,
        mobile: document.getElementById('edit-person-mobile').value,
        email: document.getElementById('edit-person-email').value,
        salary: parseInt(document.getElementById('edit-person-salary').value),
        address: {
            street: document.getElementById('edit-person-street').value,
            city: document.getElementById('edit-person-city').value,
            state: document.getElementById('edit-person-state').value,
            country: document.getElementById('edit-person-country').value
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}/person/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Staff member updated successfully!', 'success');
            closeModal();
            loadAllStaff();
        } else {
            showMessage(result.error || 'Error updating staff member', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}

async function deletePerson(id) {
    if (!confirm('Are you sure you want to delete this staff member?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/person/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Staff member deleted successfully!', 'success');
            loadAllStaff();
        } else {
            showMessage(result.error || 'Error deleting staff member', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}

function clearPersonForm() {
    document.getElementById('person-form').reset();
}

// Menu Management
document.getElementById('menu-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ingredients = document.getElementById('menu-ingredients').value
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
    
    const menuData = {
        name: document.getElementById('menu-name').value,
        price: parseFloat(document.getElementById('menu-price').value),
        category: document.getElementById('menu-category').value,
        taste: document.getElementById('menu-taste').value,
        is_drink: document.getElementById('menu-drink').checked,
        ingredients: ingredients,
        num_sales: parseInt(document.getElementById('menu-sales').value) || 0
    };
    
    try {
        const response = await fetch(`${API_BASE}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Menu item added successfully!', 'success');
            clearMenuForm();
            loadAllMenu();
        } else {
            showMessage(result.error || 'Error adding menu item', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
});

async function loadAllMenu() {
    try {
        const response = await fetch(`${API_BASE}/menu`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menu = await response.json();
        console.log('Menu loaded:', menu);
        displayMenu(menu);
    } catch (error) {
        console.error('Menu loading error:', error);
        showMessage('Error loading menu: ' + error.message, 'error');
    }
}

function displayMenu(menu) {
    const container = document.getElementById('menu-list');
    
    if (!menu || menu.length === 0) {
        container.innerHTML = '<div class="loading">No menu items found</div>';
        return;
    }
    
    container.innerHTML = menu.map(item => {
        // Handle missing category field for backward compatibility
        const category = item.category || 'main-course';
        return `
        <div class="data-item">
            <div class="item-header">
                <div class="item-title">${item.name}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editMenu('${item._id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteMenu('${item._id}')">Delete</button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="detail-label">Price:</span>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="category-badge category-${category}">${getCategoryIcon(category)} ${category.replace('-', ' ')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Taste:</span>
                    <span class="taste-badge taste-${item.taste}">${item.taste}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span>${item.is_drink ? '🥤 Drink' : '🍽️ Food'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sales:</span>
                    <span>${item.num_sales}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ingredients:</span>
                    <span>${item.ingredients.join(', ') || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

async function editMenu(id) {
    try {
        const response = await fetch(`${API_BASE}/menu`);
        const menu = await response.json();
        const item = menu.find(m => m._id === id);
        
        if (!item) {
            showMessage('Menu item not found', 'error');
            return;
        }
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <form id="edit-menu-form">
                <div class="form-row">
                    <input type="text" id="edit-menu-name" value="${item.name}" placeholder="Dish Name" required>
                    <input type="number" id="edit-menu-price" value="${item.price}" placeholder="Price" step="0.01" required>
                </div>
                <div class="form-row">
                    <select id="edit-menu-category" required>
                        <option value="appetizer" ${item.category === 'appetizer' ? 'selected' : ''}>🥗 Appetizer</option>
                        <option value="bred" ${item.category === 'bred' ? 'selected' : ''}>🍞 Bread</option>
                        <option value="main-course" ${item.category === 'main-course' ? 'selected' : ''}>🍽️ Main Course</option>
                        <option value="dessert" ${item.category === 'dessert' ? 'selected' : ''}>🍰 Dessert</option>
                        <option value="beverage" ${item.category === 'beverage' ? 'selected' : ''}>🥤 Beverage</option>
                        <option value="salad" ${item.category === 'salad' ? 'selected' : ''}>🥙 Salad</option>
                        <option value="soup" ${item.category === 'soup' ? 'selected' : ''}>🍲 Soup</option>
                    </select>
                    <select id="edit-menu-taste" required>
                        <option value="sweet" ${item.taste === 'sweet' ? 'selected' : ''}>Sweet</option>
                        <option value="spicy" ${item.taste === 'spicy' ? 'selected' : ''}>Spicy</option>
                        <option value="sour" ${item.taste === 'sour' ? 'selected' : ''}>Sour</option>
                        <option value="normal" ${item.taste === 'normal' ? 'selected' : ''}>Normal</option>
                    </select>
                </div>
                <div class="form-row">
                    <label class="checkbox-label">
                        <input type="checkbox" id="edit-menu-drink" ${item.is_drink ? 'checked' : ''}> Is Drink?
                    </label>
                </div>
                <div class="form-row">
                    <input type="text" id="edit-menu-ingredients" value="${item.ingredients.join(', ')}" placeholder="Ingredients (comma separated)">
                    <input type="number" id="edit-menu-sales" value="${item.num_sales}" placeholder="Number of Sales">
                </div>
                <button type="submit" class="btn-primary">Update Menu Item</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </form>
        `;
        
        document.getElementById('modal-title').textContent = 'Edit Menu Item';
        document.getElementById('edit-modal').style.display = 'block';
        
        document.getElementById('edit-menu-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateMenu(id);
        });
        
    } catch (error) {
        showMessage('Error loading menu data: ' + error.message, 'error');
    }
}

async function updateMenu(id) {
    const ingredients = document.getElementById('edit-menu-ingredients').value
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
    
    const menuData = {
        name: document.getElementById('edit-menu-name').value,
        price: parseFloat(document.getElementById('edit-menu-price').value),
        category: document.getElementById('edit-menu-category').value,
        taste: document.getElementById('edit-menu-taste').value,
        is_drink: document.getElementById('edit-menu-drink').checked,
        ingredients: ingredients,
        num_sales: parseInt(document.getElementById('edit-menu-sales').value) || 0
    };
    
    try {
        const response = await fetch(`${API_BASE}/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Menu item updated successfully!', 'success');
            closeModal();
            loadAllMenu();
        } else {
            showMessage(result.error || 'Error updating menu item', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}

async function deleteMenu(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/menu/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Menu item deleted successfully!', 'success');
            loadAllMenu();
        } else {
            showMessage(result.error || 'Error deleting menu item', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}

function clearMenuForm() {
    document.getElementById('menu-form').reset();
}

// Utility Functions
function formatAddress(address) {
    if (!address) return 'N/A';
    
    const parts = [
        address.street,
        address.city,
        address.state,
        address.country
    ].filter(part => part && part.trim());
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success, .error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insert at the top of the active section
    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Utility function for category icons
function getCategoryIcon(category) {
    const icons = {
        'appetizer': '🥗',
        'bred': '🍞',
        'main-course': '🍽️',
        'dessert': '🍰',
        'beverage': '🥤',
        'salad': '🥙',
        'soup': '🍲'
    };
    return icons[category] || '🍽️';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadAllStaff();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('edit-modal');
        if (event.target === modal) {
            closeModal();
        }
    }
});