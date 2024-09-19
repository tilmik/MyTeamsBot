const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { StatusCodes, TeamsActivityHandler, CardFactory, MessageFactory } = require("botbuilder");
const workItemsFactory = require("./workItemsFactory")

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
    this.onMessage(async (context, next) => {
        console.log('Running on Message Activity.');
        await next();
    });
}

  async onInvokeActivity(context){
    console.log('Activity: ', context.activity.name);

    if (context.activity.name === 'adaptiveCard/action') {
        const action = context.activity.value.action;
        console.log('Verb: ', action.verb);
        if (action.verb == "pageChange") {
          const targetPage = action.data.targetPage;
          let cardJson = workItemsFactory.buildCard(targetPage);
          return workItemsFactory.invokeResponse(cardJson);
        }

        //return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
        //const responseCard = await adaptiveCards.selectResponseCard(context, user, allMembers);
        //return adaptiveCards.invokeResponse(responseCard);
    }
  }
}

module.exports.TeamsBot = TeamsBot;
