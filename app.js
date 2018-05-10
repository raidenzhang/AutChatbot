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


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {

    // Create your bot with a function to receive messages from the user
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
        // Echo back attachment
        
        var attachment = msg.attachments[0];
        session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        });
    } else {

        if (session.message.text == "Hi") {
            session.send("Greeting!");
        } else {
            // Echo back users text
            session.send("You said: %s", session.message.text);
        }
    }
});