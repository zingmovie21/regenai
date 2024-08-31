const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment-timezone'); // Import moment-timezone for handling time zones

// Function to check if the website is loaded
async function checkWebsite(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            console.log(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] ${url} is fully loaded.`);
        } else {
            console.log(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] ${url} loaded with status: ${response.status}`);
        }
    } catch (error) {
        console.error(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] Error loading ${url}: ${error.message}`);
    }
}

// Function to determine if the current time is within the specified range
function isWithinTimeRange() {
    const now = moment().tz("Asia/Kolkata"); // Get current time in IST
    const hours = now.hours(); // Get hours in IST
    return (hours >= 7 && hours < 22); // Check if the time is between 7 AM and 10 PM IST
}

// Function to get the next scheduled time
function getNextScheduledTime() {
    const nextCall = moment().tz("Asia/Kolkata").add(14, 'minutes'); // Add 14 minutes in IST
    return nextCall.format('YYYY-MM-DD HH:mm:ss'); // Format the next call time
}

// Start checking the websites at intervals
function startChecking(urls) {
    // Check immediately on start
    urls.forEach(url => checkWebsite(url));

    // Log the next scheduled time
    console.log(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);

    // Set up a cron job to check every 14 minutes
    cron.schedule('*/14 * * * *', () => {
        if (isWithinTimeRange()) {
            urls.forEach(url => checkWebsite(url));
            console.log(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] Next function call will be in 14 minutes: ${getNextScheduledTime()}`);
        } else {
            console.log(`[${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}] Outside of checking hours (7 AM to 10 PM IST).`);
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
