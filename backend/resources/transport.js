var axios = require('axios');
var bodyParser = require('body-parser');
var errorHandler = require('../tools/errorHandler');
var tranportData = require('./exampleTransportData');

module.exports = {
    getTransportNetworks: async function (req) {
        return await getTransportNetworks(req);
    },
    getTransportNetwork: async function (transportNetworkId) {
        return await getTransportNetwork(transportNetworkId);
    },
    getStations: async function (transportNetworkId, query) {
        return await getStations(transportNetworkId, query);
    },
    getStation: async function (transportNetworkId, stationId, query) {
        return await getStation(transportNetworkId, stationId, query);
    },
    searchStations: async function (transportNetworkId, q, query) {
        return await searchStations(transportNetworkId, q, query);
    },
    getStationDepartures: async function (transportNetworkId, stationId, query) {
        return await getStationDepartures(transportNetworkId, stationId, query);
    },
};


async function getTransportNetworks(req) {
    console.log(req.query);

    //check allowed filters
    Object.keys(req.query).map((filter) => {
        if (filter != "acronym") {
            throw "2001"
        }
    });

    let response = [];
    console.log(typeof (req.query.acronym))
    if (req.query.acronym != undefined) {
        Object.keys(tranportData.transportNetworks).map((key, index) => {
            if (tranportData.transportNetworks[key].acronym == req.query.acronym) {
                response.push({
                    id: tranportData.transportNetworks[key].id,
                    name: tranportData.transportNetworks[key].name,
                    acronym: tranportData.transportNetworks[key].acronym,
                });
            }
        });
    } else {
        response = Object.keys(tranportData.transportNetworks).map((key, index) => {
            return {
                id: tranportData.transportNetworks[key].id,
                name: tranportData.transportNetworks[key].name,
                acronym: tranportData.transportNetworks[key].acronym,
            };
        });
    }


    if (response.length == 0) {
        throw "2001";
    }

    return response;

};

async function getTransportNetwork(transportNetworkId) {

    if (!tranportData.transportNetworks[transportNetworkId]) {
        throw "2002"
    }

    return {
        id: tranportData.transportNetworks[transportNetworkId].id,
        name: tranportData.transportNetworks[transportNetworkId].name,
        acronym: tranportData.transportNetworks[transportNetworkId].acronym
    };
};

async function getStations(transportNetworkId, query) {
    let data = undefined;

    if (!(transportNetworkId in tranportData.transportNetworks)) {
        throw "2002";
    }
    if (transportNetworkId !== "288") {
        throw "2001";
    }

    const url = "https://efa-api.asw.io/api/v1/station/";
    let json = await axios.get(url);

    data = json.data.map((station) => {
        return {
            id: station.stationId,
            name: station.name,
            fullName: station.fullName
        }
    });

    if(query.sort){
        let sorts = query.sort.split(",");
        for(sort in sorts){
        data.sort(dynamicSort(sorts[sort]));
        }

        return data;
    }
    return data;
};

async function getStation(transportNetworkId, stationId, query) {


    if (!(transportNetworkId in tranportData.transportNetworks)) {
        throw "2002";
    }
    if (transportNetworkId !== "288") {
        throw "2002";
    }

    if (query.fields) {

        let fields = query.fields.split(",");
        console.log(fields);

        const url = "https://efa-api.asw.io/api/v1/station/" + stationId;
        return await axios.get(url)
            .then(json => {
                let result = {};

                if (fields.includes("id")) {
                    result.id = json.data.stationId;
                }
                if (fields.includes("name")) {
                    result.name = json.data.name;
                }
                if (fields.includes("fullName")) {
                    result.fullName = json.data.fullName;
                }
                return result;
            })
            .catch(error => {
                console.log(error);
                return Promise.reject(2003);
            })

    } else {

        const url = "https://efa-api.asw.io/api/v1/station/" + stationId;
        return await axios.get(url)
            .then(json => {
                return {
                    id: json.data.stationId,
                    name: json.data.name,
                    fullName: json.data.fullName
                };
            })
            .catch(error => {
                console.log(error);
                return Promise.reject(2003);
            })
    }
};

async function searchStations(transportNetworkId, q, query) {

    let data = undefined;

    if (!(transportNetworkId in tranportData.transportNetworks)) {
        throw "2002";
    }
    if (transportNetworkId !== "288") {
        throw "2001";
    }

    const url = "https://efa-api.asw.io/api/v1/station/?search=" + q;
    return await axios.get(url)
        .then(json => {
            if (json.data.length == 0) {
                return Promise.reject(2001);
            }

            let data = json.data.map((station) => {
                return {
                    id: station.stationId,
                    name: station.name,
                    fullName: station.fullName
                }
            });

            if(query.sort){
                let sorts = query.sort.split(",");
                for(sort in sorts){
                    console.log(sorts[sort])
                data.sort(dynamicSort(sorts[sort]));
                }
                return data;
            }

            return data;
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(2001);
        })
};

async function getStationDepartures(transportNetworkId, stationId, query) {

    let limit = undefined;
    if (query.limit) {
        limit = parseInt(query.limit);
    }

    let offset = undefined;
    if (query.offset) {
        offset = parseInt(query.offset);
    }


    if (!(transportNetworkId in tranportData.transportNetworks)) {
        throw "2002";
    }
    if (transportNetworkId !== "288") {
        throw "2002";
    }

    const url = "https://efa-api.asw.io/api/v1/station/" + stationId + "/departures/"
    return await axios.get(url)
        .then(json => {

            let data = [];
            json.data.map((departure) => {
                let delay = departure.delay;
                if (!(delay < 0 || delay > 60)) {
                    delay = 0;
                }

                if (query.direction) {
                    if(query.direction == departure.direction){
                        data.push( {
                            line: departure.number,
                            minutesDelay: delay,
                            direction: departure.direction,
                            departureTime: {
                                year: parseInt(departure.departureTime.year),
                                month: parseInt(departure.departureTime.month),
                                day: parseInt(departure.departureTime.day),
                                hour: parseInt(departure.departureTime.hour),
                                minute: parseInt(departure.departureTime.minute)
                            }
                        });
                    }

                } else {

                    data.push({
                        line: departure.number,
                        minutesDelay: delay,
                        direction: departure.direction,
                        departureTime: {
                            year: parseInt(departure.departureTime.year),
                            month: parseInt(departure.departureTime.month),
                            day: parseInt(departure.departureTime.day),
                            hour: parseInt(departure.departureTime.hour),
                            minute: parseInt(departure.departureTime.minute)
                        }
                    });

                }
            }
            );

            if(data[0] == null){
                throw "2001";
            }

            if(offset && offset <= data.length){
                data = data.slice(offset);
            }else if (offset && offset > data.length){
                throw "2001";
            }

            if (limit && limit < data.length) {
                return data.slice(0, limit);
            } else {
                return data;
            }


        })
        .catch(error => {
            if(error == "2001"){
                return Promise.reject(2001);
            }
            return Promise.reject(2003);
        })
};






//Helper

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
    }
    property = property.substr(1);

    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}