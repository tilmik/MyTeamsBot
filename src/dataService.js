const allData = require("./allData.json");
const iconUrls = {
    bug: "https://i.imgur.com/X4Xhz8s.png",
    feature: "https://i.imgur.com/f13Oej7.png",
    task: "https://i.imgur.com/rhCc0o8.png",
    userstory: "https://i.imgur.com/enMwd2b.png"
};
let totalPages = -1;
let filteredData = allData;

const applyFilter = (itemType, priority, severity) => {
    filteredData = allData.filter((item) => {
        if (itemType != "all" && item.type != itemType) return false;
        if (priority > 0 && 'priority' in item && item.priority != priority) return false;
        if (severity > 0 && 'severity' in item && item.severity != severity) return false;
        return true;
    });
    totalPages = -1;
};

const getTotalPages = (pageSize) => {
    if (totalPages >= 0) return totalPages;
    dataLength = filteredData.length;
    totalPages = Math.floor(dataLength / pageSize);
    if (dataLength % pageSize != 0) totalPages = totalPages + 1;
    return totalPages;
};

const getData = (page, pageSize) => {
    dataLength = filteredData.length;
    startIndex = page * pageSize;
    if (startIndex < 0 || startIndex >= dataLength) startIndex = 0;
    endIndex = startIndex + pageSize;
    if (endIndex > dataLength) endIndex = dataLength;
    return filteredData.slice(startIndex, endIndex);
};

const getIconUrl = (itemType) => {
    return iconUrls[itemType];
};

module.exports = {
    applyFilter,
    getTotalPages,
    getData,
    getIconUrl
};
