require('dotenv').config() // Load .env file
const Discord = require('discord.js')
const client = new Discord.Client()
const https = require('https')

var channels = []

var previous

function callApi() {
    https.get('https://api.warframestat.us/pc/arbitration', (resp) => {
        let data = ''
        
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk
        })
        
        // The whole response has been received.
        resp.on('end', () => {
            dataObj = JSON.parse(data)
            console.log(dataObj)
            console.log(dataObj.type)
            if (dataObj.type != previous) {
                channels.forEach(function(channel) {
                    channel.send(JSON.stringify(dataObj, null, 4))
                })
                previous = dataObj.type
            }
        })
    
    }).on("error", (err) => {
        console.log("Error: " + err.message)
    })
}

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)
    client.guilds.forEach(function(guild) {
        channels.push(guild.systemChannel)
    })

    callApi()
    setInterval(callApi, Math.max(1, process.env.UPDATE_FREQUENCY || 1) * 60 * 1000) // in ms
})

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
