async function fetchVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unknown IP';
    }
}

function showWelcomePopup(ip, responseTime) {
    const message = `Hey ${ip}, Sagore Sarker's backend just handled your request in ${responseTime} ms! Ready to dive into distributed systems?`;
    document.getElementById('welcome-message').textContent = message;
    document.getElementById('welcome-popup').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('welcome-popup').classList.add('hidden');
    }, 5000);
}

const simulatedResponseTime = Math.floor(Math.random() * 200) + 50; // Simulated response time between 50 and 250 ms

fetchVisitorIP().then(ip => showWelcomePopup(ip, simulatedResponseTime));
