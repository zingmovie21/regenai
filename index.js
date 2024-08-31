const axios = require('axios');
const cron = require('node-cron');

// Function to check if the website is loaded
async function checkWebsite(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            console.log(`[${new Date().toLocaleString()}] ${url} is fully loaded.`);
        } else {
            console.log(`[${new Date().toLocaleString()}] ${url} loaded with status: ${response.status}`);
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error loading ${url}: ${error.message}`);
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
    return nextCall.toLocaleString();
}

// Start checking the websites at intervals
function startChecking(urls) {
    // Check immediately on start
    urls.forEach(url => checkWebsite(url));

    // Log the next scheduled time
    console.log(`[${new Date().toLocaleString()}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);

    // Set up a cron job to check every 14 minutes
    cron.schedule('*/14 * * * *', () => {
        if (isWithinTimeRange()) {
            urls.forEach(url => checkWebsite(url));
            console.log(`[${new Date().toLocaleString()}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);
        } else {
            console.log(`[${new Date().toLocaleString()}] Outside of checking hours (7 AM to 10 PM IST).`);
        }
    });
}

// URLs of the websites to check
const websiteUrls = [
    'https://www.vegetablesking.in/logo149.png',
    'https://regenai.onrender.com'
];

// Start checking the websites
startChecking(websiteUrls);
