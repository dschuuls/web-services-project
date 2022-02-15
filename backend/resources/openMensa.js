var dataFetcher = require('./openMensa/openMensaFetcher');
var resolver = require('./openMensa/functionResolver');
var fileService = require('./openMensa/openMensaFileService');

module.exports = {
    deleteCanteen: async function(canteenUUID) {
        return await deleteCanteen(canteenUUID);
    },
    updateCanteen: async function(req, canteenUUID) {
        return await updateCanteen(req, canteenUUID);
    },
    addCanteen: async function(req) {
        return await addCanteen(req);
    },
    getPreparedCanteensData: async function(req) {
        return await getPreparedCanteensData(req);
    },
    getPreparedOneCanteenData: async function(req, canteenUUID) {
        return await getPreparedOneCanteenData(req, canteenUUID);
    },
    getPreparedDaysData: async function(req, canteenUUID) {
        return await getPreparedDaysData(req, canteenUUID);
    },
    getPreparedOneDayData: async function(req, canteenUUID, dayId) {
        return await getPreparedOneDayData(req, canteenUUID, dayId);
    },
    getPreparedMealsData: async function(req, canteenUUID, dayId) {
        return await getPreparedMealsData(req, canteenUUID, dayId);
    },
    getPreparedOneMealData: async function(req, canteenUUID, dayId, mealId) {
        return await getPreparedOneMealData(req, canteenUUID, dayId, mealId);
    },
};

async function deleteCanteen(canteenUUID) {
    return await fileService.deleteCanteen(canteenUUID);
};

async function updateCanteen(req, canteenUUID) {
    const id = req.body.id;
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;
    const coordinates = req.body.coordinates;

    if (id === undefined ||
        name === undefined ||
        city === undefined ||
        address === undefined ||
        coordinates === undefined) {
            throw "1011";
        }

    return await fileService.updateCanteen(canteenUUID, id, name, city, address, coordinates);
};

async function addCanteen(req) {
    const id = req.body.id;
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;
    const coordinates = req.body.coordinates;

    if (id === undefined ||
        name === undefined ||
        city === undefined ||
        address === undefined ||
        coordinates === undefined) {
            throw "1011";
        }

    return await fileService.addCanteen(id, name, city, address, coordinates);
};

async function getPreparedCanteensData(req) {
    // let data = await dataFetcher.fetchAllOpenMensaCanteens();
    let data = await fileService.findCanteens();
    data = await resolver.getResolvedData(req, data);
    return data;
};

async function getPreparedOneCanteenData(req, canteenUUID) {
    // let data = await dataFetcher.fetchOneOpenMensaCanteen(canteenId);
    let data = await fileService.findCanteen(canteenUUID);
    data = await resolver.getResolvedData(req, data);
    return data;
};

async function getPreparedDaysData(req, canteenUUID) {
    let canteen = await fileService.findCanteen(canteenUUID);
    let canteenId = canteen.id;
    let data = await dataFetcher.fetchAllOpenMensaDaysOfCanteen(canteenId);
    data = await resolver.getResolvedData(req, data);
    return data;
};

async function getPreparedOneDayData(req, canteenUUID, dayId) {
    let canteen = await fileService.findCanteen(canteenUUID);
    let canteenId = canteen.id;
    let data = await dataFetcher.fetchOneOpenMensaDayOfCanteen(canteenId, dayId);
    data = await resolver.getResolvedData(req, data);
    return data;
};

async function getPreparedMealsData(req, canteenUUID, dayId) {
    let canteen = await fileService.findCanteen(canteenUUID);
    let canteenId = canteen.id;
    let data = await dataFetcher.fetchAllOpenMensaMealsOfCanteenAndDay(canteenId, dayId);
    data = await resolver.getResolvedData(req, data);
    return data;
};

async function getPreparedOneMealData(req, canteenUUID, dayId, mealId) {
    let canteen = await fileService.findCanteen(canteenUUID);
    let canteenId = canteen.id;
    let data = await dataFetcher.fetchOneOpenMensaMealOfCanteenAndDay(canteenId, dayId, mealId);
    data = await resolver.getResolvedData(req, data);
    return data;
};

/*
function getDate() {
    var datetimeString = new Date().toISOString();
    var arr = datetimeString.split("T");
    return arr[0];
};

function getApiKey() {
    const key = "8ba6c0bb76c0af7469aa698d8e597fff";
    return key;
}
*/