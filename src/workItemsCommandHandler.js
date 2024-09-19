const testCard = require("./adaptiveCards/workItemsTest.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");
const workItemsFactory = require("./workItemsFactory")

class WorkItemsCommandHandler {
  triggerPatterns = "myWorkItems";

  async handleCommandReceived(context, message) {
    // verify the command arguments which are received from the client if needed.
    console.log(`App received message: ${message.text}`);

    let cardJson = workItemsFactory.buildCard(0);
    //console.log('Sending: ', JSON.stringify(cardJson));
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
    WorkItemsCommandHandler,
};
