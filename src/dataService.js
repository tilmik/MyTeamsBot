const allData = require("./allData.json");
let totalPages = -1;
let filteredData = allData;

const applyFilter = (itemType, priority, severity) => {
    filteredData = bugData.filter((item) => {
        if (itemType != "all" && item.type != itemType) return false;
        if (priority >= 0 && item.priority != priority) return false;
        if (severity >= 0 && item.severity != severity) return false;
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

module.exports = {
    applyFilter,
    getTotalPages,
    getData
};
