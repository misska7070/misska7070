// Global state management
let itemCount = 12;
const maxFreeItems = 50;
let isPremium = false;

// Outfit templates for AI suggestions
const outfitTemplates = [
    {
        name: "Professional Meeting",
        items: ["👔", "👔", "👞", "👜"],
        reason: "Perfect for your 2pm work meeting - smart and confident",
        missing: [],
        shopLinks: []
    },
    {
        name: "Casual Comfort",
        items: ["👕", "👖", "👟", "🎒"],
        reason: "Comfortable for the partly cloudy weather",
        missing: [],
        shopLinks: []
    },
    {
        name: "Smart Casual",
        items: ["👔", "🩳", "👟", "🎒"],
        reason: "Versatile look that works for multiple occasions",
        missing: ["🧢"],
        shopLinks: [
            { name: "Baseball Cap", url: "#" }
        ]
    }
];

// Weather data (in real app, this would come from API)
const weatherData = {
    temperature: 18,
    condition: "Partly cloudy",
    emoji: "🌤️",
    date: "Mon, July 14"
};

// Calendar data (in real app, this would come from calendar API)
const calendarData = {
    events: [
        { time: "2pm", title: "Work meeting" }
    ]
};

// Initialize app
function initializeApp() {
    updateItemCount();
    setupEventListeners();
    loadWeatherData();
    loadCalendarData();
}

// Update item count display
function updateItemCount() {
    const itemCountElement = document.getElementById('itemCount');
    if (itemCountElement) {
        itemCountElement.textContent = `${itemCount}/${maxFreeItems} items`;
    }
    
    // Show upgrade prompt if at limit
    if (itemCount >= maxFreeItems && !isPremium) {
        const upgradePrompt = document.getElementById('upgradePrompt');
        if (upgradePrompt) {
            upgradePrompt.style.display = 'block';
        }
    }
}

// Add new clothing item
function addClothingItem() {
    // Check if user has reached free limit
    if (itemCount >= maxFreeItems && !isPremium) {
        showUpgrade();
        return;
    }
    
    // Simulate adding an item
    itemCount++;
    updateItemCount();
    
    // Add visual feedback
    const addButton = document.querySelector('.add-item');
    if (addButton) {
        addButton.style.background = '#e8f5e8';
        addButton.style.color = '#28a745';
        addButton.innerHTML = '✓';
        
        setTimeout(() => {
            addButton.style.background = '';
            addButton.style.color = '#666';
            addButton.innerHTML = '+';
        }, 1500);
    }
    
    // In real app, this would trigger camera/photo upload
    console.log('Add clothing item triggered');
}

// Generate AI outfit suggestions
function generateOutfits() {
    const button = document.querySelector('.main-button');
    const outfitSection = document.getElementById('outfitSuggestions');
    const outfitList = document.getElementById('outfitList');
    
    if (!button || !outfitSection || !outfitList) return;
    
    // Show loading state
    button.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Finding perfect outfits...</div>';
    button.disabled = true;
    
    // Simulate AI processing time
    setTimeout(() => {
        // Generate outfit suggestions based on weather, calendar, and available items
        const suggestions = generateSmartOutfits();
        
        // Render outfit suggestions
        outfitList.innerHTML = suggestions.map(outfit => `
            <div class="outfit-card">
                <div class="outfit-title">${outfit.name}</div>
                <div class="outfit-items">
                    ${outfit.items.map(item => `<div class="outfit-item">${item}</div>`).join('')}
                </div>
                <div class="outfit-reason">${outfit.reason}</div>
                ${outfit.missing.length > 0 ? `
                    <div style="margin-bottom: 10px;">
                        <small>Missing: ${outfit.missing.join(', ')}</small>
                    </div>
                    <div class="shop-links">
                        ${outfit.shopLinks.map(link => `
                            <a href="${link.url}" class="shop-link" onclick="trackAffiliateClick('${link.name}')">Shop ${link.name}</a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // Show outfit suggestions
        outfitSection.classList.add('active');
        
        // Reset button
        button.innerHTML = '✨ What should I wear today?';
        button.disabled = false;
        
        // Scroll to outfits
        outfitSection.scrollIntoView({ behavior: 'smooth' });
        
        // Track analytics
        console.log('Outfit suggestions generated:', suggestions.length);
    }, 2000);
}

// Smart outfit generation based on context
function generateSmartOutfits() {
    const weather = weatherData;
    const calendar = calendarData;
    const userClothes = getUserClothingItems();
    
    // Rule-based outfit engine (in real app, this would be more sophisticated AI)
    let suggestions = [...outfitTemplates];
    
    // Modify suggestions based on weather
    if (weather.temperature < 15) {
        suggestions = suggestions.map(outfit => ({
            ...outfit,
            items: [...outfit.items, "🧥"], // Add jacket for cold weather
            reason: outfit.reason + " (jacket added for cooler weather)"
        }));
    }
    
    // Modify suggestions based on calendar
    const hasMeeting = calendar.events.some(event => event.title.includes('meeting'));
    if (hasMeeting) {
        suggestions = suggestions.filter(outfit => 
            outfit.name.includes('Professional') || outfit.name.includes('Smart')
        );
    }
    
    return suggestions;
}

// Get user's clothing items (simulated)
function getUserClothingItems() {
    const clothingItems = document.querySelectorAll('.clothing-item:not(.add-item)');
    return Array.from(clothingItems).map(item => ({
        type: item.dataset.type,
        color: item.dataset.color,
        formality: item.dataset.formality,
        emoji: item.textContent.trim()
    }));
}

// Show upgrade modal/prompt
function showUpgrade() {
    // In real app, this would show a proper modal
    const upgradeMessage = `
Upgrade to Closet Sage Pro!

✨ Benefits:
• Unlimited clothing items
• Advanced AI styling algorithms
• Weather integration
• Calendar sync
• Style trends analysis
• Priority support

Only £4.99/month - Cancel anytime
    `;
    
    if (confirm(upgradeMessage + '\n\nWould you like to upgrade now?')) {
        // In real app, this would redirect to payment flow
        console.log('User wants to upgrade to Pro');
        simulateUpgrade();
    }
}

// Simulate upgrade process
function simulateUpgrade() {
    isPremium = true;
    const upgradePrompt = document.getElementById('upgradePrompt');
    if (upgradePrompt) {
        upgradePrompt.style.display = 'none';
    }
    
    // Update premium badge
    const premiumBadge = document.querySelector('.premium-badge');
    if (premiumBadge) {
        premiumBadge.textContent = 'PRO';
        premiumBadge.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        premiumBadge.style.color = 'white';
    }
    
    // Update item count display
    const itemCountElement = document.getElementById('itemCount');
    if (itemCountElement) {
        itemCountElement.textContent = `${itemCount}/∞ items`;
    }
    
    alert('Welcome to Closet Sage Pro! 🎉\n\nYou now have unlimited clothing items and premium features.');
}

// Track affiliate link clicks (for revenue analytics)
function trackAffiliateClick(itemName) {
    console.log('Affiliate click tracked:', itemName);
    // In real app, this would send analytics to backend
    
    // Show user feedback
    alert(`Opening ${itemName} shopping page...\n\n(This would redirect to affiliate partner with tracking)`);
}

// Load weather data
function loadWeatherData() {
    // In real app, this would fetch from weather API
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
        // Weather data already loaded in HTML, but could be dynamic
        console.log('Weather data loaded:', weatherData);
    }
}

// Load calendar data
function loadCalendarData() {
    // In real app, this would fetch from calendar API
    console.log('Calendar data loaded:', calendarData);
}

// Setup event listeners
function setupEventListeners() {
    // Clothing item selection
    document.querySelectorAll('.clothing-item:not(.add-item)').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
            console.log('Clothing item selected:', this.dataset.type);
        });
    });
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation (in real app, this would change views)
            const navText = this.querySelector('small').textContent;
            console.log('Navigation clicked:', navText);
            
            // Simulate different views
            handleNavigation(navText);
        });
    });
    
    // Add item button (already handled in HTML onclick)
    // Generate outfits button (already handled in HTML onclick)
}

// Handle navigation between different app sections
function handleNavigation(section) {
    switch(section) {
        case 'Wardrobe':
            // Show wardrobe view (default)
            console.log('Showing wardrobe view');
            break;
        case 'Add Item':
            // Trigger add item flow
            addClothingItem();
            break;
        case 'Outfits':
            // Show outfits view
            generateOutfits();
            break;
        case 'Settings':
            // Show settings view
            showSettings();
            break;
    }
}

// Show settings (placeholder)
function showSettings() {
    const settingsMenu = `
Settings:
• Account: Free Plan (${itemCount}/${maxFreeItems} items)
• Notifications: On
• Privacy: Review permissions
• Help & Support
• About Closet Sage
• Sign Out
    `;
    
    alert(settingsMenu);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for testing (in real app)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateOutfits,
        addClothingItem,
        showUpgrade,
        updateItemCount,
        generateSmartOutfits
    };
}