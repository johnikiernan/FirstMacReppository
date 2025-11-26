// Mock Data Service
const mockService = {
    // Simulate API delay
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    getHotels: async (destination, duration) => {
        await mockService.delay(1500); // 1.5s delay

        // Generate random hotels
        const hotelNames = [
            "Grand Plaza Hotel", "Ocean View Resort", "City Center Inn",
            "The Royal Hideaway", "Sunset Boulevard Hotel", "Mountain Peak Lodge"
        ];

        const results = [];
        for (let i = 0; i < 3; i++) {
            const name = hotelNames[Math.floor(Math.random() * hotelNames.length)];
            const rating = (3.5 + Math.random() * 1.5).toFixed(1);
            const pricePerNight = Math.floor(100 + Math.random() * 400);
            const totalPrice = pricePerNight * duration;

            results.push({
                id: i,
                name: `${name} ${destination}`,
                rating,
                pricePerNight,
                totalPrice
            });
        }
        return results;
    },

    getFlights: async (destination, date) => {
        await mockService.delay(1500);

        const airlines = ["SkyHigh Air", "Oceanic Airlines", "Global Wings", "SwiftJet"];
        const results = [];

        for (let i = 0; i < 3; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const price = Math.floor(200 + Math.random() * 600);
            const departHour = Math.floor(6 + Math.random() * 14);
            const departTime = `${departHour}:00`;
            const arriveTime = `${departHour + 3}:30`; // Mock 3.5h flight

            results.push({
                id: i,
                airline,
                departTime,
                arriveTime,
                price
            });
        }
        return results;
    }
};

// DOM Elements
const form = document.getElementById('travel-form');
const searchBtn = document.querySelector('.search-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultsContainer = document.getElementById('results-container');
const hotelsList = document.getElementById('hotels-list');
const flightsList = document.getElementById('flights-list');

// Event Listener
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get Values
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const duration = parseInt(document.getElementById('duration').value);

    // UI Loading State
    setLoading(true);
    clearResults();

    try {
        // Fetch Data (Parallel)
        const [hotels, flights] = await Promise.all([
            mockService.getHotels(destination, duration),
            mockService.getFlights(destination, startDate)
        ]);

        // Render
        renderHotels(hotels);
        renderFlights(flights);

        // Show Results
        resultsContainer.classList.remove('hidden');

        // Smooth scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
});

// Helpers
function setLoading(isLoading) {
    if (isLoading) {
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        searchBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        searchBtn.disabled = false;
    }
}

function clearResults() {
    hotelsList.innerHTML = '';
    flightsList.innerHTML = '';
    resultsContainer.classList.add('hidden');
}

function renderHotels(hotels) {
    hotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${hotel.name}</span>
                <span class="card-rating">★ ${hotel.rating}</span>
            </div>
            <div class="card-details">
                <p>Luxury accommodation in the heart of the city.</p>
                <p>Free Wi-Fi • Pool • Spa</p>
            </div>
            <div class="card-price">
                <div>
                    <div class="price-tag">$${hotel.totalPrice}</div>
                    <div class="price-sub">Total for stay</div>
                </div>
                <div style="text-align: right">
                    <div style="font-weight: 600">$${hotel.pricePerNight}</div>
                    <div class="price-sub">/ night</div>
                </div>
            </div>
        `;
        hotelsList.appendChild(card);
    });
}

function renderFlights(flights) {
    flights.forEach(flight => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${flight.airline}</span>
            </div>
            <div class="card-details">
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                    <div>
                        <strong>${flight.departTime}</strong><br>
                        <span class="price-sub">Departure</span>
                    </div>
                    <div style="color: var(--accent-3)">✈</div>
                    <div style="text-align: right">
                        <strong>${flight.arriveTime}</strong><br>
                        <span class="price-sub">Arrival</span>
                    </div>
                </div>
                <p class="price-sub">Non-stop • Economy</p>
            </div>
            <div class="card-price">
                <div class="price-tag">$${flight.price}</div>
                <div class="price-sub">Round trip</div>
            </div>
        `;
        flightsList.appendChild(card);
    });
}

// Set default date to today
document.getElementById('startDate').valueAsDate = new Date();
