const bugData = require("./bugData.json");
const workItemsCard = require("./adaptiveCards/workItemsOutline.json");
const actionData = require("./adaptiveCards/workItemsActions.json");
const { StatusCodes } = require('botbuilder');
const pageSize = 3;

const invokeResponse = (card) => {
    const cardRes = {
        statusCode: StatusCodes.OK,
        type: 'application/vnd.microsoft.card.adaptive',
        value: card
    };
    const res = {
        status: StatusCodes.OK,
        body: cardRes
    };
    return res;
};

const buildCard = (page) => {
    let cardJson = JSON.parse(JSON.stringify(workItemsCard));
    let cardData = dataSegment(page);
    let cardDataArray = dataToCardArray(cardData);
    cardJson.body.push(...cardDataArray);
    cardJson.body.push(actionSegment(page));
    return cardJson;
}

const dataSegment = (page) => {
    dataLength = bugData.length;
    startIndex = page * pageSize;
    if (startIndex < 0 || startIndex >= dataLength) startIndex = 0;
    let result = [];
    result.push(bugData[startIndex]);
    if (startIndex + 1 < dataLength) result.push(bugData[startIndex + 1]);
    if (startIndex + 2 < dataLength) result.push(bugData[startIndex + 2]);
    return result;
};

const dataToCardArray = (data) => {
    let result = [];
    for (var i = 0; i < data.length; i++) {
        let obj = {};
        obj.type = "Container";
        obj.separator = true;
        obj.items = [];
        obj.items.push({
            type: "RichTextBlock",
            inlines: [
                {
                    type: "TextRun",
                    text: "" + data[i].tracking_number,
                    color: "accent",
                    underline: true
                }
            ]
        });
        obj.items.push({
            type: "TextBlock",
            text: data[i].title,
            wrap: false
        });
        obj.items.push({
            type: "TextBlock",
            text: "Priority: " + data[i].priority + " Severity: " + data[i].severity,
            size: "small"
        })
        result.push(obj);
    }
    return result;
};

const actionSegment = (page) => {
    dataLength = bugData.length;
    totalPages = Math.floor(dataLength / pageSize);
    if (dataLength % pageSize != 0) totalPages = totalPages + 1;
    let result = JSON.parse(JSON.stringify(actionData));
    
    result.columns[0].items[0].actions[0].data.targetPage = page - 1;
    if (page <= 0) result.columns[0].items[0].actions[0].isEnabled = false;
    
    result.columns[1].items[0].text = "Page " + page + " of " + totalPages;

    result.columns[2].items[0].actions[0].data.targetPage = page + 1;
    if (page >= totalPages) result.columns[2].items[0].actions[0].isEnabled = false;

    return result;
}

module.exports = {
    invokeResponse,
    buildCard
};
