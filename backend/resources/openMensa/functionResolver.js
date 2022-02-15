var functions = require('./functions');


module.exports = {
    getResolvedData: async function(req, data) {
        return await getResolvedData(req, data);
    }
 };

async function getResolvedData(req, data) {

    filterPropNames = getFilterPropsOfReq(req);
    if (filterPropNames.length > 0) {
        data = await functions.getFilterData(filterPropNames, req, data);
    }
    
    if (req.query.hasOwnProperty("q")) {
        const q = req.query.q;
        data = await functions.getQData(q, data);
    };

    if (req.query.hasOwnProperty("sort")) {
        const sort = req.query.sort;
        data = await functions.getSortData(sort, data);
    };

    if (req.query.hasOwnProperty("offset")) {
        const offset = req.query.offset;
        data = await functions.getOffsetData(offset, data);
    };

    if (req.query.hasOwnProperty("limit")) {
        const limit = req.query.limit;
        data = await functions.getLimitData(limit, data);
    };

    if (req.query.hasOwnProperty("fields")) {
        const fields = req.query.fields;
        data = await functions.getSelectData(fields, data);
    };

    if (Array.isArray(data)) {
        if (data.length === 0) {
            throw "1001";
        }
    } else {
        if (data === {}) {
            throw "1001";
        }
    }
    return data;
}

function getFilterPropsOfReq(req) {
    let filterProps = [];

    for (var propName in req.query) {

        if (propName !== "fields" && 
            propName !== "limit" &&
            propName !== "offset" &&
            propName !== "sort" &&
            propName !== "q") {
                if (req.query.hasOwnProperty(propName)) {
                    filterProps.push(propName);
                    // ((console.log(propName, req.query[propName]);
                }
            }
    }
    return filterProps;
}

