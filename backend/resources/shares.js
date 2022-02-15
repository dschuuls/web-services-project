var axios = require('axios');
var jsonfile = require('jsonfile');
var multisort = require('multisort')
const uuidv1 = require('uuid/v1');

//API: https://iextrading.com/developer/

/**
 * TODO:
 * Aufteilen in Quote, News => Über q=?
 * Was soll angezeigt werden? 
 * Mit Filter, z.B. symbol=DAX
 * Mit Suche, z.B. q=Facebook
 * Options
 * Conditional Get
 */

module.exports = {
    getExampleStockSymbols: async function(queryParams) {
        return await GetPreparedExampleStockSymbolData(queryParams);
    },
    
    addExampleStockSymbol: async function(symbol,company,notes) {
        return await addExampleStockSymbol(symbol,company,notes);
    },

    deleteExampleStockSymbol: async function(uuid) {
        return await deleteExampleStockSymbol(uuid);
    },

    updateStockInformationInList: async function (uuid, company, notes) {
        return await updateStockInformationInList(uuid, company, notes);
    },

    patchStockInformationInList: async function (uuid, company, notes) {
        return await patchStockInformationInList(uuid, company, notes);
    },

    getStockInformationFromList: async function(uuid,queryParams) {
        return await getStockInformationFromList(uuid,queryParams);
    },

    getDetailedStockData: async function(uuid, queryParams) {
        return await getDetailedStockData(uuid, queryParams);
    }
 };

// ----- Example Stock Symbol Functions -----

async function GetPreparedExampleStockSymbolData(queryParams) {
    const readResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
        .then(readData => {
            return readData;
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(4008);
        })
    let dataResult = readResult;


    if(queryParams.hasOwnProperty("fields"))
    {
        dataResult = applySelectionToExampleStocks(dataResult, queryParams.fields.toUpperCase());
    }

    if(queryParams.hasOwnProperty("uuid") ||
    queryParams.hasOwnProperty("symbol") || 
    queryParams.hasOwnProperty("company") ||
    queryParams.hasOwnProperty("notes"))
    {
        filter = [];
        uuid = queryParams.uuid ? queryParams.uuid.toUpperCase() : undefined;
        symbol = queryParams.symbol ? queryParams.symbol.toUpperCase() : undefined;
        company = queryParams.company ? queryParams.company.toUpperCase() : undefined;
        notes = queryParams.notes ? queryParams.notes.toUpperCase() : undefined;
        
        filter.push(uuid, symbol, company, notes)
        dataResult = applyFilterToExampleStocks(dataResult, filter);
    }

    if(queryParams.hasOwnProperty("sort")) 
    {
        dataResult = sortExampleStocks(dataResult, queryParams.sort.toUpperCase());
    }

    if(queryParams.hasOwnProperty("q"))
    {
        dataResult = searchInExampleStocks(dataResult, queryParams.q.toUpperCase());
    }

    if(queryParams.hasOwnProperty("offset"))
    {
        dataResult = offsetExampleStocks(dataResult, queryParams.offset);
    }

    if(queryParams.hasOwnProperty("limit"))
    {
        dataResult = limitExampleStocks(dataResult, queryParams.limit);
    }
    
    return dataResult;
}

async function addExampleStockSymbol(symbol,company,notes) {
    if(symbol === undefined)
    {
        return Promise.reject(4014);
    }

    symbol = symbol.toUpperCase();

    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
        .then(readData => {
            return readData;
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(4005);
        })
    if(checkIfSymbolInList(symbol,fileResult)) {
        return Promise.reject(4003);
    }

    let symbolData = await fetchData(symbol).catch(error => {
        if(error.response.status == 404){
            return Promise.reject(4002);
        }
    });

    if(!company) {
        var company = await symbolData.quote.companyName;
    }

    let uuid = uuidv1();

    fileResult.push({"uuid":uuid, "symbol":symbol,"company":company,"notes":notes});

    writeToFile(fileResult);
    
    return [uuid, company];
}

async function deleteExampleStockSymbol(uuid) {
    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
        .then(readData => {
            return readData;
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(4007);
        })

    if(!checkIfUuidInList(uuid,fileResult)) {
        return Promise.reject(4004);
    }

    var result = getInformationInListByUuid(uuid, fileResult);

    let symbol = result[0]["symbol"];

    let companyName = result[0]["company"];

    fileResult = deleteSymbolFromlist(uuid,fileResult);

    writeToFile(fileResult);

    return [symbol, companyName];
}

async function updateStockInformationInList(uuid, company, notes) {

    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
    .then(readData => {
        return readData;
    })
    .catch(error => {
        console.error(error);
        return Promise.reject(4013);
    })

    if(!checkIfUuidInList(uuid,fileResult)) {
        return Promise.reject(4012);
    }
    if((company === undefined) || (notes === undefined))
    {
        return Promise.reject(4015);
    }

    let share = await getStockInformationFromList(uuid, fileResult);
    shareSymbol = share[0].symbol;

    fileResult = deleteSymbolFromlist(uuid, fileResult);
    fileResult.push({"uuid": uuid, "symbol":shareSymbol, "company":company, "notes":notes});

    writeToFile(fileResult);
    
    return shareSymbol;
}

async function patchStockInformationInList(uuid, company, notes) {
    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
    .then(readData => {
        return readData;
    })
    .catch(error => {
        console.error(error);
        return Promise.reject(4013);
    })

    if(!checkIfUuidInList(uuid,fileResult)) {
        return Promise.reject(4012);
    }
    let result = await getInformationInListByUuid(uuid, fileResult);
    shareSymbol = result[0].symbol;
    newCompany = company;
    newNotes = notes;
    if(!newCompany)
    {
        newCompany = result[0]["company"];
    }
    if(!newNotes)
    {
        newNotes = result[0]["notes"];
    }

    fileResult = deleteSymbolFromlist(uuid, fileResult);
    fileResult.push({"uuid": uuid, "symbol":shareSymbol, "company":newCompany, "notes":newNotes});

    writeToFile(fileResult);
    
    return [shareSymbol, company, notes];
}

async function getStockInformationFromList(uuid,queryParams) {
    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
    .then(readData => {
        return readData;
    })
    .catch(error => {
        console.error(error);
        return Promise.reject(4010);
    })

    if(!checkIfUuidInList(uuid,fileResult)) {
        return Promise.reject(4011);
    }
    let dataResult = getInformationInListByUuid(uuid, fileResult);

    if(queryParams.hasOwnProperty("fields"))
    {
        dataResult = applySelectionToExampleStocks(dataResult, queryParams.fields.toUpperCase());
    }

    return dataResult;
}


// ----- Detailed Stock Symbol Functions -----

async function getDetailedStockData(uuid, queryParams) {
    
    const fields = queryParams.hasOwnProperty("fields") ? queryParams.fields : undefined;
    const newscount = queryParams.hasOwnProperty("newscount") ? queryParams.newscount : undefined;
    const timespan = queryParams.hasOwnProperty("timespan") ? queryParams.timespan : undefined;

    let fileResult = await jsonfile.readFile("./resources/exampleStockSymbols.json")
    .then(readData => {
        return readData;
    })
    .catch(error => {
        console.error(error);
        return Promise.reject(4016);
    })
    let dataResult = getInformationInListByUuid(uuid, fileResult);
    if(dataResult.length == 0) {
        return Promise.reject(4017);
    }
    let data = await fetchData(dataResult[0].symbol, fields, newscount, timespan)
    .then(fetchedData => {
        return fetchedData;
    })
    .catch(error => {
        console.error(error);
        if(error.response.status == 404) {
            return Promise.reject(4001);
        }
        return Promise.reject(4009);
    })

    if(queryParams.hasOwnProperty("q"))
    {
        for(dataFields in data){
            data[dataFields] = searchInExampleStocks(data[dataFields], queryParams.q.toUpperCase());
        }
    }

    if(queryParams.hasOwnProperty("offset")){
        chartData = offsetExampleStocks(data.chart, queryParams.offset);
        data.chart = chartData;
    }
    if(queryParams.hasOwnProperty("limit")){
         
        chartData = limitExampleStocks(data.chart, queryParams.limit);
        data.chart = chartData; 
    }
    if(queryParams.hasOwnProperty("sort")) {
        
        chartData = sortExampleStocks(data.chart, queryParams.sort.toUpperCase());
        data.chart = chartData;
    }
    return data;
};

// ===== Helper functions =====

function getInformationInListByUuid(uuid, list){
    return list.filter(function(list) {
        return list.uuid == uuid; 
    });
}

function getInformationInListBySymbol(symbol, list){
    return list.filter(function(list) {
        return list.symbol == symbol; 
    });
}

function checkIfSymbolInList(symbol, list){
    let result = getInformationInListBySymbol(symbol, list);
    return result.length != 0;
}

function checkIfUuidInList(uuid, list){
    let result = getInformationInListByUuid(uuid, list);
    return result.length != 0;
}

function deleteSymbolFromlist(uuid,list){
    let newList = []
    newList = (list.filter(function(list) { 
        return list.uuid != uuid; 
    }));
    return newList;
}

async function writeToFile(fileData) {
    jsonfile.writeFile("./resources/exampleStockSymbols.json", fileData)
        .then(writtenData => {
            return writtenData;
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(4006);
        })
}

async function fetchData(symbol, fields, newscount, timespan) {
    let json = await axios.get(getShareUrl(symbol, fields, newscount, timespan))
    return json.data;
}

function getShareUrl(stockSymbol, fields, newscount, timespan ) {
    fields = (fields) ? fields : "quote,news,chart";
    newscount = (newscount) ? newscount : 1;
    timespan = (timespan) ? timespan : "m";

    return "https://api.iextrading.com/1.0/stock/"+stockSymbol+"/batch?types="+fields+"&range=1"+timespan+"&last="+newscount;
}

function applySelectionToExampleStocks(data, fields) {
    fields = fields.toLowerCase();
    const fieldsList = fields.split(",");
    let fieldedData = [];
    for (let listEntry in data) {
        let item = {};
        for(let field in fieldsList) {
            fieldName = fieldsList[field];
            fieldData = data[listEntry][fieldName];
            if(fieldData === undefined) {
                 fieldData = {};
            }
            item[fieldName] = fieldData;
        }
        fieldedData.push(item);
    }
    return fieldedData;
}

function applyFilterToExampleStocks(data, filter) {
    let uuid = filter[0]
    let symbol = filter[1];
    let company = filter[2];
    let notes = filter[3];
    let filteredData = [];
    for(let entry in data)
    {
    let dataNotes = data[entry]["notes"] ? data[entry]["notes"].toUpperCase() : undefined;
       if(
        (data[entry]["symbol"] === symbol || (symbol === undefined)) &&
        (data[entry]["company"].toUpperCase() === company || (company === undefined)) &&
        (dataNotes === notes || (notes === undefined)) && 
        (data[entry]["uuid"].toUpperCase() === uuid || uuid === undefined)) {
            filteredData.push(data[entry]);
        }
    }
    return filteredData;
}

function sortExampleStocks(data, sortOperations){
    sortOperations = sortOperations.toLowerCase();
    sortOperations = sortOperations.replace("-","~");
    sortOperations = sortOperations.replace("+","");
    sortOperations = sortOperations.replace(" ","");
    sortOperationsList = sortOperations.split(",");

    let sortedData = [];
    sortResults = multisort(data, sortOperationsList);
    sortedData = sortResults;

    return sortedData;
}

function searchInExampleStocks(data, query) {
    if (!Array.isArray(data)) {
        return data;
    }

    const searchValues = query.split(";");

    let newData = [];

    for (let dataObject of data) {
        let found = false;
        for (searchValue of searchValues) {
            for (key in dataObject) {
                if (dataObject[key].toString().toUpperCase().search(searchValue) != -1) {
                    found = true;
                    newData.push(dataObject);
                    break;
                }
            } 
            if (found) {
                break;
            }
        }
    }
    return newData;
}

function limitExampleStocks(dataResult, limit) {
    dataResult = dataResult;
    if (dataResult.length < limit) {
        limit = dataResult.length;
    }
    let newData = [];

    for(var i = 0; i < limit; i++){
        newData.push(dataResult[i]);
    }

    return newData;
}

function offsetExampleStocks(dataResult, offset) {
    let newData = [];
    if (dataResult.length < offset) {
        return newData;
    }

    for(var i = offset; i < dataResult.length; i++){
        newData.push(dataResult[i]);
    }
    return newData;
}