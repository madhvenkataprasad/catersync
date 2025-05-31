document.addEventListener('DOMContentLoaded', function() {
    const cateringServices = [
        {
            name: "Delicious Bites",
            lat: 40.7128,
            lon: -74.0060,
            cuisine: "Italian",
            menuItems: ["MargheritaPizza", "PastaCarbonara", "Tiramisu"]
        },
        {
            name: "Italian Feast",
            lat: 40.7128,
            lon: -74.0060,
            cuisine: "Italian",
            menuItems: ["Lasagna", "Bruschetta", "Gelato"]
        },
        {
            name: "Pizza Palace",
            lat: 40.7128,
            lon: -74.0060,
            cuisine: "Italian",
            menuItems: ["PepperoniPizza", "Focaccia", "Cannoli"]
        },
        {
            name: "Gourmet Catering",
            lat: 40.7306,
            lon: -73.9352,
            cuisine: "French",
            menuItems: ["CroqueMonsieur", "BeefBourguignon", "CrèmeBrûlée"]
        },
        {
            name: "Tasty Treats",
            lat: 40.6782,
            lon: -73.9442,
            cuisine: "Indian",
            menuItems: ["ButterChicken", "NaanBread", "MangoLassi", "SambarDosa"]
        },
        {
            name: "South Spice",
            lat: 40.6782,
            lon: -73.9442,
            cuisine: "Indian",
            menuItems: ["MasalaDosa", "IdliSambar", "Biryani"]
        },
        {
            name: "Savory Events",
            lat: 40.7549,
            lon: -73.9840,
            cuisine: "Mexican",
            menuItems: ["TacosAlPastor", "Guacamole", "Churros"]
        },
        {
            name: "Dragon Feast",
            lat: 40.7178,
            lon: -73.9990,
            cuisine: "Chinese",
            menuItems: ["KungPaoChicken", "FriedRice", "SpringRolls"]
        },
        {
            name: "Burger Bonanza",
            lat: 40.7000,
            lon: -73.9500,
            cuisine: "American",
            menuItems: ["Cheeseburger", "FrenchFries", "Milkshake"]
        },
        {
            name: "Ocean Delights",
            lat: 40.7050,
            lon: -74.0080,
            cuisine: "Japanese",
            menuItems: ["SushiRoll", "Ramen", "Mochi"]
        },
        {
            name: "Spice Haven",
            lat: 40.7200,
            lon: -73.9900,
            cuisine: "Thai",
            menuItems: ["PadThai", "GreenCurry", "MangoStickyRice"]
        }
    ];

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function normalizeItem(item) {
        return item.replace(/\s+/g, '').toLowerCase();
    }

    const form = document.getElementById('locationForm');
    const resultText = document.getElementById('resultText');
    const serviceList = document.getElementById('serviceList');

    if (!form || !resultText || !serviceList) {
        console.error('Required DOM elements not found:', { form, resultText, serviceList });
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const userLat = parseFloat(document.getElementById('latitude').value);
        const userLon = parseFloat(document.getElementById('longitude').value);
        const selectedCuisine = document.getElementById('cuisine').value;
        const menuItemsInput = document.getElementById('menuItemsInput').value;
        const requestedItems = menuItemsInput.split(',').map(item => item.trim()).filter(item => item);

        if (isNaN(userLat) || isNaN(userLon)) {
            resultText.textContent = 'Please enter valid latitude and longitude values.';
            serviceList.innerHTML = '';
            return;
        }

        if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
            resultText.textContent = 'Latitude must be -90 to 90, longitude -180 to 180.';
            serviceList.innerHTML = '';
            return;
        }

        let validServices = [];
        let maxMatches = 0;
        let minDistance = Infinity;

        cateringServices.forEach(service => {
            if (isNaN(service.lat) || isNaN(service.lon)) {
                console.warn(`Invalid coordinates for ${service.name}:`, service.lat, service.lon);
                return;
            }

            if (selectedCuisine && service.cuisine !== selectedCuisine) {
                return;
            }

            const distance = haversineDistance(userLat, userLon, service.lat, service.lon);
            if (distance > 30) {
                return;
            }

            const matches = requestedItems.length > 0 
                ? requestedItems.filter(item => {
                    const normalizedInput = normalizeItem(item);
                    return service.menuItems.some(menuItem => normalizeItem(menuItem) === normalizedInput);
                }).length 
                : service.menuItems.length;

            validServices.push({ service, matches, distance });
            maxMatches = Math.max(maxMatches, matches);
            minDistance = Math.min(minDistance, distance);
        });

        const matchingServices = validServices.filter(
            ({ matches, distance }) => matches === maxMatches && Math.abs(distance - minDistance) < 0.01
        );

        if (matchingServices.length > 0 && (requestedItems.length === 0 || maxMatches > 0)) {
            resultText.textContent = `Found ${matchingServices.length} catering service(s) matching your criteria:`;
            serviceList.innerHTML = matchingServices.map(({ service, distance }) => `
                <li class="service-details">
                    <strong>${service.name}</strong> - ${distance.toFixed(2)} km away<br>
                    <strong>Cuisine:</strong> ${service.cuisine}<br>
                    <strong>Menu Items:</strong>
                    <ul>${service.menuItems.map(item => `<li>${item}</li>`).join('')}</ul>
                </li>
            `).join('');
        } else {
            resultText.textContent = 'No catering services found within 30 km that match your criteria.';
            serviceList.innerHTML = '';
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                setTimeout(() => {
                    window.location.href = 'contact.html';
                }, 1000);
            } else {
                window.location.href = 'contact.html';
            }
        }
    });
});