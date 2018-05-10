var restify = require('restify');
var builder = require('botbuilder');


//set up restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});


// Listen for messages from users
server.post('/api/messages', connector.listen());


// Receive messages from the user (default with non-understanding condition)
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
    //session.send("You said: %s", session.message.text);
});


//Sends greeting message when the bot is added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        // Say hello
        var txt =  "Hello";
        var reply = new builder.Message()
            .address(message.address)
            .text(txt);
        bot.send(reply);
    } /*if (message.membersRemoved) {
        // See if bot was removed
        var botId = message.address.bot.id;
        for (var i = 0; i < message.membersRemoved.length; i++) {
            if (message.membersRemoved[i].id === botId) {
                // Say goodbye
                var reply = new builder.Message()
                    .address(message.address)
                    .text("Goodbye");
                bot.send(reply);
                break;
            }
        }
    }*/
});