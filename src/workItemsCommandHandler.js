const testCard = require("./adaptiveCards/workItemsTest.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");
const workItemsFactory = require("./workItemsFactory")

class WorkItemsCommandHandler {
  triggerPatterns = "myWorkItems";

  async handleCommandReceived(context, message) {
    // verify the command arguments which are received from the client if needed.
    console.log(`App received message: ${message.text}`);

    // do something to process your command and return message activity as the response

    let cardJson = workItemsFactory.buildCard(0);
    //console.log('Sending: ', JSON.stringify(cardJson));

    //let cardData = {};
    //const cardJson = AdaptiveCards.declare(testCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
    WorkItemsCommandHandler,
};
