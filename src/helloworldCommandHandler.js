const helloWorldCard = require("./adaptiveCards/helloworldCommand.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");

class HelloWorldCommandHandler {
  triggerPatterns = "helloWorld";

  async handleCommandReceived(context, message) {
    // verify the command arguments which are received from the client if needed.
    console.log(`App received message: ${message.text}`);

    // do something to process your command and return message activity as the response

    // render your adaptive card for reply message
    const cardData = {
      title: "Hello from work item bot!",
      body: "Congratulations! Your work item bot is running. Use available commands to interact with the bot.",
    };

    const cardJson = AdaptiveCards.declare(helloWorldCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
  HelloWorldCommandHandler,
};
