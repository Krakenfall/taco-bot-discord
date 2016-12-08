var fs = require("fs");
var Discord = require("discord.js");
var bot = new Discord.Client();
var config = require("appconfig.json");
var token = config.discord-bot.token;
const MongoClient = require('mongodb').MongoClient
var mongoConnectionLink = config.mongodb.connectionLink;
var db;

var parseMessage = function(message) {
	var pattern = /\!([a-zA-Z0-9]+)/g;
	var matches = message.match(pattern);

	if (matches) {
		for (var i = 0; i < matches.length; i++) {
			matches[i] = matches[i].replace(/\!/g, '');
		}
	}
	else {
		return [];
	}
	return matches;
};

bot.on("message", msg => {
	var calledCommands = parseMessage(msg.content);
	if (calledCommands.length > 0){ for(var i = 0; i < calledCommands.length; i++){ console.log(`Received command ${calledCommands[i]}`);}}
	db.collection("commands").find().toArray(function(error, commands) {
		if (error) {
			console.log(`Error retrieving commands: ${error}`);
		} else {
			console.log(`Retrieving command values`);
			for(var i = 0; i < calledCommands.length; i++) {
				var found;
				try {
					found = commands.find(o => o.command === calledCommands[i]).value;
				} catch(e) {
					console.log(`Command ${calledCommands[i]} does not exist`);
				}
				console.log(`Found value for ${calledCommands[i]}: ${found}`);
				if (found) {
					msg.channel.sendMessage(found);
				}
			}
		}
	});
	
});

MongoClient.connect(mongoConnectionLink, (err, database) => {
	if (err) return console.log(err);
	db = database;
	console.log("Opened db connection");

	bot.on('ready', () => {
	  console.log('I am ready!');
	});
});

bot.login(token);