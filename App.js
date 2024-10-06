const fs = require("fs");
const axios = require("axios");
require('dotenv').config(); // For managing environment variables

// Function to read the text file
function readTextFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject("Error reading the file: " + err);
            } else {
                resolve(data); // The extracted text
            }
        });
    });
}

// Function to respond based on user queries
function respondToQuery(query) {
    const responses = {
        "what is your name?": "Zayan AI",
        "who invented you?": "Zayan Mohammed",
        "what is your purpose?": "To assist and provide information.",
        "who is your creator?": "Zayan Mohammed",
        "what can you do?": "I can answer questions and assist with various tasks.",
    };

    // Normalize the query to lowercase for comparison
    const normalizedQuery = query.toLowerCase();

    return responses[normalizedQuery] || "I'm sorry, I don't have an answer for that.";
}

// Function to use AI21 Labs API
async function processWithAI21(text) {
    const apiKey = process.env.AI21_API_KEY; // Store your API key in an environment variable
    const endpoint = "https://api.ai21.com/studio/v1/j1-large/complete";

    try {
        const response = await axios.post(endpoint, {
            prompt: text,
            maxTokens: 50, // Adjust as needed
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });
        
        console.log("AI21 Response:", response.data);
    } catch (error) {
        console.error("Error calling AI21 API:", error);
    }
}

// Main function to read the document and send to AI21
async function main() {
    const filePath = "knowledge.txt"; // Use the name of your text file
    const extractedText = await readTextFile(filePath);

    if (extractedText) {
        // Split the text into queries, assuming each line is a question
        const queries = extractedText.split('\n').filter(q => q.trim());

        for (const query of queries) {
            const response = respondToQuery(query.trim());
            console.log(`User: ${query}`);
            console.log(`AI: ${response}`);
        }
    }
}

// Run the main function
main();
