const axios = require('axios');
const cron = require('node-cron');
const http = require('http');

// Function to check if the website is loaded
async function checkWebsite(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            console.log(`[${getCurrentIST()}] Website is fully loaded.`);
            return `Website is fully loaded.`;
        } else {
            console.log(`[${getCurrentIST()}] Website loaded with status: ${response.status}`);
            return `Website loaded with status: ${response.status}`;
        }
    } catch (error) {
        console.error(`[${getCurrentIST()}] Error loading website: ${error.message}`);
        return `Error loading website: ${error.message}`;
    }
}

// Function to determine if the current time is within the specified range
function isWithinTimeRange() {
    const now = new Date();
    const hours = now.getUTCHours() + 5.5; // Convert UTC to IST
    return (hours >= 7 && hours < 22); // Check if the time is between 7 AM and 10 PM IST
}

// Function to get the next scheduled time
function getNextScheduledTime() {
    const now = new Date();
    const nextCall = new Date(now.getTime() + 14 * 60 * 1000); // Add 14 minutes
    return nextCall.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Function to get the current time in IST
function getCurrentIST() {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Start checking the website at intervals
function startChecking(url) {
    // Check immediately on start
    checkWebsite(url).then(status => {
        console.log(`[${getCurrentIST()}] ${status}`);
    });

    // Log the next scheduled time
    console.log(`[${getCurrentIST()}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);

    // Set up a cron job to check every 14 minutes
    cron.schedule('*/14 * * * *', () => {
        if (isWithinTimeRange()) {
            checkWebsite(url).then(status => {
                console.log(`[${getCurrentIST()}] ${status}`);
                console.log(`[${getCurrentIST()}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);
            });
        } else {
            console.log(`[${getCurrentIST()}] Outside of checking hours (7 AM to 10 PM IST).`);
        }
    });
}

// URL of the website to check
const websiteUrl = 'https://www.vegetablesking.in/logo149.png';

// Create an HTTP server
const port = 3000; // Specify your desired port
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/check') {
        const status = await checkWebsite(websiteUrl);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(status);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Start checking the website
startChecking(websiteUrl);
