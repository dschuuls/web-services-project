var axios = require('axios');

module.exports = {
    fetchAllOpenMensaCanteens: async function() {
        return await fetchAllOpenMensaCanteens();
    },
    fetchOneOpenMensaCanteen: async function(canteenId) {
        return await fetchOneOpenMensaCanteen(canteenId);
    },
    fetchAllOpenMensaDaysOfCanteen: async function(canteenId) {
        return await fetchAllOpenMensaDaysOfCanteen(canteenId);
    },
    fetchOneOpenMensaDayOfCanteen: async function(canteenId, dayId) {
        return await fetchOneOpenMensaDayOfCanteen(canteenId, dayId);
    },
    fetchAllOpenMensaMealsOfCanteenAndDay: async function(canteenId, dayId) {
        return await fetchAllOpenMensaMealsOfCanteenAndDay(canteenId, dayId);
    },
    fetchOneOpenMensaMealOfCanteenAndDay: async function(canteenId, dayId, mealId) {
        return await fetchOneOpenMensaMealOfCanteenAndDay(canteenId, dayId, mealId);
    },
 };

var openMensaBaseApiPath = "https://openmensa.org/api/v2";
var openMensaCanteens = "/canteens/";
var openMensaDays = "/days/";
var openMensaMeals = "/meals/";

/*
async function fetchAllOpenMensaCanteens() {

    return await axios.get(getAllOpenMensaCanteensPath())
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};

async function fetchOneOpenMensaCanteen(canteenId) {
    return await axios.get(getOneOpenMensaCanteenPath(canteenId))
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};
*/

async function fetchAllOpenMensaDaysOfCanteen(canteenId) {
    return await axios.get(getAllOpenMensaDaysOfCanteenPath(canteenId))
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};

async function fetchOneOpenMensaDayOfCanteen(canteenId, dayId) {
    return await axios.get(getOneOpenMensaDayOfCanteenPath(canteenId, dayId))
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};

async function fetchAllOpenMensaMealsOfCanteenAndDay(canteenId, dayId) {
    return await axios.get(getAllOpenMensaMealsOfCanteenAndDayPath(canteenId, dayId))
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};

async function fetchOneOpenMensaMealOfCanteenAndDay(canteenId, dayId, mealId) {
    return await axios.get(getOneOpenMensaMealOfCanteenAndDayPath(canteenId, dayId, mealId))
    .then(json => {
        return json.data;
    })
    .catch(error => {
        if (error.code === "ENOTFOUND") {
            throw "1002";
        }
        throw "1003";
    });
};

function getAllOpenMensaCanteensPath() {
    return openMensaBaseApiPath + openMensaCanteens;
}

function getOneOpenMensaCanteenPath(canteenId) {
    return openMensaBaseApiPath + openMensaCanteens + canteenId
}

function getAllOpenMensaDaysOfCanteenPath(canteenId) {
    return openMensaBaseApiPath + openMensaCanteens + canteenId + openMensaDays; 
}

function getOneOpenMensaDayOfCanteenPath(canteenId, dayId) {
    return openMensaBaseApiPath + openMensaCanteens + canteenId + openMensaDays + dayId; 
}

function getAllOpenMensaMealsOfCanteenAndDayPath(canteenId, dayId) {
    return openMensaBaseApiPath + openMensaCanteens + canteenId + openMensaDays + dayId + openMensaMeals; 
}

function getOneOpenMensaMealOfCanteenAndDayPath(canteenId, dayId, mealId) {
    return openMensaBaseApiPath + openMensaCanteens + canteenId + openMensaDays + dayId + openMensaMeals + mealId; 
}