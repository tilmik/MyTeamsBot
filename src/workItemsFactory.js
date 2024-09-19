const workItemsCard = require("./adaptiveCards/workItemsOutline.json");
const actionData = require("./adaptiveCards/workItemsActions.json");
const { StatusCodes } = require('botbuilder');
const dataService = require('./dataService');
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
    let cardData = dataService.getData(page, pageSize);
    let cardDataArray = dataToCardArray(cardData);
    cardJson.body.push(...cardDataArray);
    cardJson.body.push(actionSegment(page));
    return cardJson;
}

const dataToCardArray = (data) => {
    let result = [];
    for (var i = 0; i < data.length; i++) {
        let obj = {};
        obj.type = "Container";
        obj.style = "emphasis";
        obj.items = [];
        obj.items.push({
            type: "ColumnSet",
            columns: [
                {
                    type: "Column",
                    width: "auto",
                    verticalContentAlignment: "center",
                    items: [
                        {
                            type: "Image",
                            url: "https://i.imgur.com/X4Xhz8s.png",
                            height: "16px",
                        }
                    ]
                },
                {
                    type: "Column",
                    width: "stretch",
                    items: [
                        {
                            type: "RichTextBlock",
                            inlines: [
                                {
                                    type: "TextRun",
                                    text: "" + data[i].tracking_number,
                                    color: "accent",
                                    underline: true
                                }
                            ]
                        }
                    ]
                }
            ],
        });
        obj.items.push({
            type: "TextBlock",
            text: data[i].title,
            spacing: "none",
            wrap: false
        });
        obj.items.push({
            type: "TextBlock",
            text: "Priority: " + data[i].priority + " &nbsp;&nbsp;  Severity: " + data[i].severity,
            size: "small",
            spacing: "none"
        })
        result.push(obj);
    }
    return result;
};

const actionSegment = (page) => {
    //dataLength = bugData.length;
    //totalPages = Math.floor(dataLength / pageSize);
    //if (dataLength % pageSize != 0) totalPages = totalPages + 1;
    let totalPages = dataService.getTotalPages(pageSize);
    let result = JSON.parse(JSON.stringify(actionData));
    
    result.columns[0].items[0].actions[0].data.targetPage = page - 1;
    if (page <= 0) result.columns[0].items[0].actions[0].isEnabled = false;
    
    result.columns[1].items[0].text = "Page " + (page+1) + " of " + totalPages;

    result.columns[2].items[0].actions[0].data.targetPage = page + 1;
    if (page >= totalPages - 1) result.columns[2].items[0].actions[0].isEnabled = false;

    return result;
}

module.exports = {
    invokeResponse,
    buildCard
};
