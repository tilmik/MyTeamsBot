const workItemsCard = require("./adaptiveCards/workItemsOutline.json");
const actionData = require("./adaptiveCards/workItemsActions.json");
const filterData = require("./adaptiveCards/workItemsFilter.json");
const { StatusCodes } = require('botbuilder');
const dataService = require('./dataService');
const pageSize = 3;

let filterByType = "all";

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
    cardJson.body.push(filterSegment());
    let cardData = dataService.getData(page, pageSize);
    let cardDataArray = dataToCardArray(cardData);
    cardJson.body.push(...cardDataArray);
    cardJson.body.push(actionSegment(page));
    return cardJson;
}

const applyFilter = (itemType) => {
    filterByType = itemType;
    dataService.applyFilter(itemType, 0, 0);
}

const dataToCardArray = (data) => {
    let result = [];
    for (var i = 0; i < data.length; i++) {
        let obj = {};
        obj.type = "Container";
        obj.style = "emphasis";
        obj.spacing = "small";
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
                            url: dataService.getIconUrl(data[i].type),
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
        if (data[i].type == "bug") {
            obj.items.push({
                type: "TextBlock",
                text: "Priority: " + data[i].priority + " &nbsp;&nbsp;  Severity: " + data[i].severity,
                size: "small",
                spacing: "none"
            });
        } else if (data[i].type == "feature") {
            obj.items.push({
                type: "TextBlock",
                text: "Target date: " + data[i].target_date,
                size: "small",
                spacing: "none"
            });
        }

        result.push(obj);
    }
    return result;
};

const filterSegment = () => {
    let result = JSON.parse(JSON.stringify(filterData));
    let accentIndex = filterByType == "all"? 1
        : filterByType == "bug" ? 2
        : filterByType == "feature" ? 3
        : 0;
    for (var i = 1; i < 4; i++) {
        if (i == accentIndex) result.rows[0].cells[i].style = "accent";
        else result.rows[0].cells[i].style = "default";
    }
    return result;
};

const actionSegment = (page) => {
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
    applyFilter,
    buildCard
};
