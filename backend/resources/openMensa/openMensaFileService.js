var jsonfile = require('jsonfile');
const uuidv1 = require('uuid/v1');

module.exports = {
    addCanteen: async function(canteenId, name, city, address, coordinates) {
        return await addCanteen(canteenId, name, city, address, coordinates);
    },
    deleteCanteen: async function(canteenUUID) {
        return await deleteCanteen(canteenUUID);
    },
    updateCanteen: async function(canteenUUID, canteenId, name, city, address, coordinates) {
        return await updateCanteen(canteenUUID, canteenId, name, city, address, coordinates);
    },
    findCanteen: async function(canteenUUID) {
        return await findCanteen(canteenUUID);
    },
    findCanteens: async function() {
        return await findCanteens();
    },
 };

async function addCanteen(canteenId, name, city, address, coordinates) {
    const uuid = uuidv1();
    const canteen = {
                        "uuid": uuid,
                        "id": canteenId,
                        "name": name,
                        "city": city,
                        "address": address,
                        "coordinates": coordinates
    }
    return await jsonfile.readFile("./resources/openMensa/openMensaData.json") 
    .then(data => {
        for (dataObject of data) {
            if (dataObject.id == canteenId) {
                    throw "1008";
            }
        }
        data.push(canteen);
        writeToFile(data);
        return "successfully added canteen";
    })
    .catch(error => {
        if (error === "1005" || error === "1008") {
            throw error;
        }
        throw "1004";
    });
}

async function deleteCanteen(canteenUUID) {
    return await jsonfile.readFile("./resources/openMensa/openMensaData.json")
    .then(data => {
        for (dataIndex in data) {
            if (data[dataIndex].uuid == canteenUUID) {
                data.splice(dataIndex, 1);
                writeToFile(data);
                return "successfully delteted resource";
            }
        }
        throw "1010";
    })
    .catch(error => {
        if (error === "1005" || error === "1010") {
            throw error;
        }
        throw "1004";
    });
}

async function updateCanteen(canteenUUID, canteenId, name, city, address, coordinates) {
    return await jsonfile.readFile("./resources/openMensa/openMensaData.json")
    .then(data => {
        for (dataObject of data) {
            if (dataObject.id == canteenId && canteenUUID != dataObject.uuid) {
                    throw "1008";
            }
        }

        for (dataIndex in data) {
            if (data[dataIndex].uuid == canteenUUID) {
                data[dataIndex].id = canteenId;
                data[dataIndex].name = name;
                data[dataIndex].city = city;
                data[dataIndex].address = address;
                data[dataIndex].coordinates = coordinates;

                writeToFile(data);
                return "successfully updated resource";
            }
        }
        throw "1010";
    })
    .catch(error => {
        if (error === "1005" || error === "1010" || error === "1008") {
            throw error;
        }
        throw "1004";
    });
}

async function findCanteen(canteenUUID) {
    return await jsonfile.readFile("./resources/openMensa/openMensaData.json")
    .then(data => {
        for (dataObject of data) {
            if (dataObject.uuid == canteenUUID) {
                return dataObject;
            }
        }
        throw "1010";
    })
    .catch(error => {
        if (error === "1010") {
            throw error;
        }
        throw "1004";
    });
}

async function findCanteens() {
    return await jsonfile.readFile("./resources/openMensa/openMensaData.json")
    .then(data => {
        if (data.lenght === 0) {
            throw "1001"; 
        }
        return data;
    })
    .catch(error => {
        if (error === "1001") {
            throw error;
        }
        throw "1004";
    });
}

async function writeToFile(fileData) {
    jsonfile.writeFile("./resources/openMensa/openMensaData.json", fileData)
        .then(writtenData => {
            return writtenData;
        })
        .catch(error => {
            throw "1005";
        })
}