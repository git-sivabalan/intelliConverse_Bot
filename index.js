// AIzaSyCYfnaibSltZx2mOWTI9wvVnityn9P1Iz8
const {Telegraf} = require('telegraf')
const dotenv = require('dotenv').config()
const { GoogleGenerativeAI } = require ("@google/generative-ai");
const express = require('express')
const app = express()
const genAI = new GoogleGenerativeAI(process.env.genAI_Token);
const bot = new Telegraf(process.env.TelegramBot_Token)
console.log(`Chat with bot : https://t.me/intelliConverse_bot`)
bot.on('message', async (ctx) => {
    try {
        await ctx.reply('Wait a minute...')
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Give me a solution in below 500 words... My querry is... ${ctx.message.text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const chunks = splitText(text, 4000); // Adjust the chunk size as needed

        for (const chunk of chunks) {
            try {
                await ctx.reply(chunk);
            } catch (err) {
                console.error("Error sending chunk:", err);
            }
        }
    } catch (error) {
        console.error("Error generating content:", error);
        await ctx.reply("Sorry, I couldn't generate a response for your query.");
    }
});


function splitText(text, maxLength) {
    const chunks = [];
    let currentChunk = '';

    // Split text into chunks that are smaller than maxLength
    for (const word of text.split(' ')) {
        if ((currentChunk + ' ' + word).length <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + word;
        } else {
            chunks.push(currentChunk);
            currentChunk = word;
        }
    }

    // Push the remaining chunk
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

bot.launch()
app.listen(5000,()=>{
    console.log('Server running on port 5000')
})
