const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment-timezone');

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
    const now = moment().tz("Asia/Kolkata");
    const hours = now.hours();
    return (hours >= 7 && hours < 22);
}

// Function to get the next scheduled time
function getNextScheduledTime() {
    const nextCall = moment().tz("Asia/Kolkata").add(14, 'minutes');
    return nextCall.format('YYYY-MM-DD HH:mm:ss');
}

// Start checking the websites at intervals
function startChecking(urls, port) {
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

    console.log(`Server is running on port ${port}`);
}

// URLs of the websites to check
const websiteUrls = [
    'https://www.vegetablesking.in/logo149.png',
    'https://regenai.onrender.com'
];

// Port number
const port = 3000;

// Start checking the websites
startChecking(websiteUrls, port);
