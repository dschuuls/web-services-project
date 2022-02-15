var multisort = require('multisort');

module.exports = {
    getFilterData: async function(propNames, req, data) {
        return await filterData(propNames, req, data);
    },
    getSortData: async function(sortValues, data) {
        return await sortData(sortValues, data);
    },
    getSelectData: async function(fields, data) {
        return await selectData(fields, data);
    },
    getQData: async function(qValues, data) {
        return await qData(qValues, data);
    },
    getOffsetData: async function(offset, data) {
        return await offsetData(offset, data);
    },
    getLimitData: async function(limit, data) {
        return await limitData(limit, data);
    }
 };

// /profiles?name=Max&status=gold
async function filterData(propNames, req, data) {
    
    if (!Array.isArray(data)) {
        return data;
    }

    let newData = [];

    for (let dataObject of data) {
        let counter = 0;
        for (propName of propNames) {
            if (dataObject.hasOwnProperty(propName)) {
                let propValues = req.query[propName].split(";");
                                
                for (propValue of propValues) {
                    if (dataObject[propName].toString().toLowerCase() === propValue.toLowerCase()) {
                        counter++;
                    }
                }

                if (counter === propNames.length) {
                    newData.push(dataObject);
                }
            }
        }
    }
    return newData;
}

// /profiles?sort=-lastOnline,+name
async function sortData(sortOperations, data) {
    if (!Array.isArray(data)) {
        return data;
    }

    sortOperations = sortOperations.toLowerCase();
    sortOperations = sortOperations.replace("+","");
    sortOperations = sortOperations.replace("-","~");
    sortOperationsList = sortOperations.split(",");
    sortResults = multisort(data, sortOperationsList);

    return sortResults;
}

// /profiles?fields=id,name,status
async function selectData(fieldList, data) {
    
    const fieldArray = fieldList.split(",");

    if (Array.isArray(data)) {
        let newData = [];

        for (let dataObject of data) {
            let newObject = {};
            for (field of fieldArray) {
                let val = dataObject[field];
                if (val) {
                    newObject[field] = val;
                }
            }
            if (newObject !== {}) {
                newData.push(newObject);
            }
        }
        return newData;
    } else {
        let newObject = {};
            for (field of fieldArray) {
                let val = data[field];
                if (val) {
                    newObject[field] = val;
                }
            }
        return newObject;
    }
}

// /profiles?q=gold;Max
async function qData(qValues, data) {

    if (!Array.isArray(data)) {
        return data;
    }

    const searchValues = qValues.split(";");

    let newData = [];

    for (let dataObject of data) {
        let found = false;
        for (searchValue of searchValues) {
            for (key in dataObject) {
                if (dataObject[key].toString().toLowerCase().search(searchValue.toLowerCase()) != -1) {
                    newData.push(dataObject);
                    found = true;
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

// /profiles?offset=0&limit=10
async function limitData(limit, data) {
    if (!Array.isArray(data)) {
        return data;
    }


    if (data.length < limit) {
        limit = data.length;
    }

    let newData = [];

    for(var i = 0; i < limit; i++){
        newData.push(data[i]);
    }

    return newData;
}

// /profiles?offset=0&limit=10
async function offsetData(offset, data) {

    if (!Array.isArray(data)) {
        return data;
    }

    let newData = [];

    if (data.length < offset) {
        return newData;
    }

    for(var i = offset; i < data.length; i++){
        newData.push(data[i]);
    }
    return newData;
}