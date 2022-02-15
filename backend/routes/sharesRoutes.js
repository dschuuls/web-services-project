var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var shares = require('../resources/shares');
var errorHandler = require('../tools/errorHandler');

//API: https://iextrading.com/developer/

module.exports = router;
router.use(bodyParser.json());

router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    next();
  });

/**
 * @swagger
 * definition:
 *   addStockSymbol:
 *     properties:
 *       symbol:
 *         type: string
 *         example: aapl
 *       company:
 *         type: string
 *         example: Apple
 *       notes:
 *         type: string
 *         example: Notes
 */

 /**
  * @swagger
  * definition:
  *   detailedStockInformation:
  *     properties:
  *       quote: 
  *         properties: 
  *           symbol:
  *             type: string
  *             example: AAPL
  *           companyName:
  *             type: string
  *             example: Apple Inc.
  *           primaryExchange:
  *             type: string
  *             example: Nasdaq Global Select
  *           sector:
  *             type: string
  *             example: Technology
  *           calculationPrice:
  *             type: string
  *             example: close
  *           open:
  *             type: float
  *             example: 160.19
  *           openTime:
  *             type: Unix timestamp
  *             example: 1545316200816
  *           close:
  *             type: float
  *             example: 156.83
  *           closeTime:
  *             type: Unix timestamp
  *             example: 1545316200816
  *           high:
  *             type: float
  *             example: 156.83
  *           low:
  *             type: float
  *             example: 156.83
  *           latestPrice:
  *             type: float
  *             example: 156.83
  *           latestSource:
  *             type: string
  *             example: close
  *           latestTime:
  *             type: Date
  *             example: December 20, 2018
  *           latestUpdate:
  *             type: Unix timestamp
  *             example: 1545339600397
  *           latestVolume:
  *             type: int
  *             example: 64217639
  *           iexRealtimePrice:
  *             type: float
  *             example: 150.13
  *           iexLastUpdated: 
  *             type: Unix timestamp
  *             example: 1545339600397
  *           delayedPrice: 
  *             type: float
  *             example: 156.83
  *           delayedPriceTime: 
  *             type: Unix timestamp
  *             example: 1545339600397
  *           extendedPrice: 
  *             type: Unix timestamp
  *             example: 157.88
  *           extendedChange: 
  *             type: float
  *             example: 1.058
  *           extendedChangePercent: 
  *             type: float
  *             example: 0.0067
  *           extendedPriceTime: 
  *             type: Unix timestamp
  *             example: 1545343196069
  *           previousClose: 
  *             type: float
  *             example: 160.89
  *           change: 
  *             type: float
  *             example: -4.06
  *           changePercent: 
  *             type: float
  *             example: -0.02525
  *           iexMarketPercent:
  *             type: float
  *             example: 0.003
  *           iexVolume: 
  *             type: int
  *             example: 34243288
  *           avgTotalVolume: 
  *             type: int
  *             example: 43276492
  *           iexBidPrice: 
  *             type: float
  *             example: 150.22
  *           iexBidSize:
  *             type: int
  *             example: 32
  *           iexAskPrice: 
  *             type: float
  *             example: 150.22
  *           iexAskSize: 
  *             type: int
  *             example: 32
  *           marketCap:
  *             type: int
  *             example: 744220768340
  *           peRatio:
  *             type: float
  *             example: 14.22
  *           week52High:
  *             type: float
  *             example: 233.47
  *           week52Low:
  *             type: float
  *             example: 150.24
  *           ytdChange:
  *             type: float
  *             example: -0.110103921
  *       news:
  *         properties:
  *           datetime: 
  *             type: date
  *             example: 2018-12-20T17:09:00-05:00
  *           headline: 
  *             type: string
  *             example: Morgan Stanley chief strategist defends Powell's policy -- 'This is not the place to be selling'
  *           source: 
  *             type: string
  *             example: CNBC
  *           url: 
  *             type: string
  *             example: https://api.iextrading.com/1.0/stock/aapl/article/4523212601998432
  *           summary: 
  *             type: string
  *             example: No summary available.
  *           related: 
  *             type: string
  *             example: AAPL, AMZN
  *           image: 
  *             type: string
  *             example: https://api.iextrading.com/1.0/stock/aapl/news-image/4523212601998432
  *       chart:
  *         properties:
  *           date:
  *             type: date
  *             example: 2018-11-19
  *           open:
  *             type: float
  *             example: 190.1
  *           high:
  *             type: float
  *             example: 190.1
  *           low:
  *             type: float
  *             example: 190.1
  *           close:
  *             type: float
  *             example: 190.1
  *           volume:
  *             type: int
  *             example: 41920872
  *           unadjustedVolume:
  *             type: int
  *             example: 41920872
  *           change:
  *             type: float
  *             example: -7.67
  *           changePercent:
  *             type: float
  *             example: -3.963
  *           vwap: 
  *             type: float
  *             example: 186.9198
  *           label: 
  *             type: string
  *             example: Nov 19
  *           changeOverTime: 
  *             type: float
  *             example: 0.3
  */

/**
 * @swagger
 * definition:
 *   stockSymbol:
 *     properties: 
 *       uuid:
 *         type: uuid
 *         example: 815f6dc7-7b59-4180-9088-1b2809a40075
 *       symbol:
 *         type: string
 *         example: aapl
 *       company:
 *         type: string
 *         example: Apple
 *       notes:
 *         type: string
 *         example: Notes
 */

/**
 * @swagger
 * definition:
 *   symbolInformation:
 *     properties:
 *       company:
 *         type: string
 *         example: Apple
 *       notes:
 *         type: string
 *         example: Notes
 */

/**
 * @swagger
 * /shares/:
 *   get:
 *     tags:
 *       - shares
 *     description: Returns a list of example symbols
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: uuid
 *         type: uuid
 *         description: The UUID of the symbol. Only an unique identifier for this list.
 *       - in: query
 *         name: symbol
 *         type: string
 *         description: Symbol of the company.
 *       - in: query
 *         name: company
 *         type: string
 *         description: Name of the company.
 *       - in: query
 *         name: notes
 *         type: string
 *         description: Additional notes added to a symbol/company.
 *       - in: query
 *         name: offset
 *         type: integer
 *         description: Number of skipped items until collection starts.
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Number of items to return.
 *       - in: query
 *         name: q
 *         type: string
 *         description: Searching for a value in every field of every object. Multiple search strings have to be seperated by semicolon (;).
 *       - in: query
 *         name: fields
 *         type: string
 *         description: Fields to be displayed. (UUID, Symbol, Company, Notes).
 *       - in: query
 *         name: sort
 *         type: string
 *         description: Sorts the result set by fields, either ascending (+) or descending (-). Multiple sort requests are seperated by comma (,), e.g. "+symbol,-notes".
 *     responses:
 *       200:
 *         description: A list of example symbols
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/stockSymbol'
 *       500: 
 *         description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.get('/shares', function(req, res) {    
    shares.getExampleStockSymbols(req.query)
    .then(data => {res.json(data);})
    .catch(function (error) {
        console.error(error);
    })
    .then(function () {
        // always executed
    });
})
/**
 * @swagger
 *  /shares/:
 *   post:
 *     tags: 
 *       - shares
 *     description:  Add a new symbol to the list of example symbols. 
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Company information to be added to the example list.
 *         schema:
 *           $ref: '#/definitions/addStockSymbol'
 *     produces:
 *       - application/json
 *     responses:
 *         201:
 *           description: successful operation, information about the added symbol
 *         400:
 *           description: invalid request body.
 *         404: 
 *           description: the symbol was not valid
 *         409:
 *           description: the symbol was already in the list and therefore not added
 *         500: 
 *           description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.post('/shares', function(req,res) {
    symbol = req.body.symbol;
    company = req.body.company;
    notes = req.body.notes;
    shares.addExampleStockSymbol(symbol, company, notes)
    .then(list =>  {
        if(list[2] === undefined){
            res.status(201).send("Successfully added " + symbol + " with the company name: " + list[1] + ". (UUID: " + list[0] + ")");
            return;
        }
        else {
            res.status(201).send("Successfully added " + symbol + " with the company name: " + list[1] + " and notes: " + list[2] + ". (UUID: " + list[0] + ")")
            return;
        }
    })
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.statusMessage = errorResponse;
        res.status(errorResponse.problem.status).send(errorResponse);
    });
})

/**
 * @swagger
 * /shares:
 *   options:
 *     tags:
 *       - shares 
 *     description: Available options of the route /shares
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/shares', function(req,res)
{
    res.status(200).header("Allow", "GET, POST, OPTIONS").send();
});

/**
 * @swagger
 * /shares/{uuid}:
 *   get:
 *     tags:
 *        - shares
 *     description: gets information about the given stock symbol
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: uuid
 *           description: uuid of a company
 *           in: path
 *           example: db
 *           required: true
 *           format: uuid
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. (UUID, Symbol, Company, Notes)
 *     responses:
 *         200:
 *           description: Successfully returned
 *           schema:
 *             $ref: '#/definitions/stockSymbol'
 *         404:
 *           description: UUID was not in the list
 *         500: 
 *           description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.get('/shares/:uuid', function(req, res) {
    const uuid = req.params.uuid;
    shares.getStockInformationFromList(uuid, req.query)
    .then(data => {res.json(data);})
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.status(errorResponse.problem.status).send(errorResponse);
    })
    .then(function () {
        // always executed
    });
})  

/**
 * @swagger
 * /shares/{uuid}:
 *   put:
 *     tags:
 *        - shares
 *     description: updates information about the given stock symbol in the list 
 *     produces:
 *         - application/json
 *     parameters:
 *      - name: uuid
 *        in: path
 *        required: true
 *        format: uuid
 *        description: UUID of the symbol to be updated in the example list.
 *      - name: symbolInformation
 *        in: body
 *        required: true
 *        description: Information (company name and notes) to be updated. A symbol can not be updated.
 *        schema:
 *           $ref: '#/definitions/symbolInformation'
 *     responses:
 *         200:
 *           description: Successfully updated, information about the updated symbol.
 *         400:
 *           description: invalid request body.
 *         404:
 *           description: UUID was not in the list
 *         500: 
 *           description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.put('/shares/:uuid', function(req, res) {
    const uuid = req.params.uuid;
    const company = req.body.company;
    const notes = req.body.notes;
    shares.updateStockInformationInList(uuid, company, notes)
    .then(symbol =>  res.status(200).send("Updated " + symbol + " with the company name: " + company + " and notes: " + notes + ". (UUID: " + uuid + ")"))
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.status(errorResponse.problem.status).send(errorResponse);
    })
    .then(function () {
        // always executed
    });
})  

/**
 * @swagger
 * /shares/{uuid}:
 *   patch:
 *     tags:
 *        - shares
 *     description: updates information about the given stock symbol in the list 
 *     produces:
 *         - application/json
 *     parameters:
 *      - name: uuid
 *        in: path
 *        required: true
 *        format: uuid
 *        description: UUID to be updated in the example list.
 *      - name: symbolInformation
 *        in: body
 *        description: Information (company name and/or notes) to be updated. A symbol can not be updated. 
 *        schema:
 *           $ref: '#/definitions/symbolInformation'
 *     responses:
 *         200:
 *           description: Successfully updated, information about the updated symbol.
 *         400:
 *           description: invalid request body.
 *         404:
 *           description: UUID was not in the list
 *         500: 
 *           description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.patch('/shares/:uuid', function(req, res) {
    const uuid = req.params.uuid;
    const company = req.body.company;
    const notes = req.body.notes;
    shares.patchStockInformationInList(uuid, company, notes)
    .then(list =>  {
        if(list[1] === undefined && list[2] === undefined){
            res.status(200).send("Symbol " + list[0] + " remains unchanged, the request was successful. (UUID: " + uuid + ")");
            return;
        }
        if(list[2] === undefined){
            res.status(200).send("Updated " + list[0] + " with the company name: " + list[1] + ". (UUID: " + uuid + ")");
            return;
        }
        if(list[1] === undefined){
            res.status(200).send("Updated " + list[0] + " with the notes: " + list[2] + ". (UUID: " + uuid + ")");
            return;
        }
        else {
            res.status(200).send("Updated " + list[0] + " with the company name: " + list[1] + " and notes: " + list[2] + ". (UUID: " + uuid + ")")
            return;
        }
    })
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.status(errorResponse.problem.status).send(errorResponse);
    })
    .then(function () {
        // always executed
    });
})  

/**
 * @swagger
 * /shares/{uuid}:
 *   delete:
 *     tags:
 *       - shares 
 *     description: Deletes a single symbol from the example symbol list
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the symbol to delete
 *         required: true
 *         format: uuid
 *     responses:
 *         200:
 *           description: Successfully deleted, information about the deleted symbol
 *         404: 
 *           description: UUID was not found in the list
 *         500: 
 *           description: The symbol file could not be accessed for some reason. Contact the developer.
 */
router.delete('/shares/:uuid/', function(req, res) {
    const uuid = req.params.uuid;
    shares.deleteExampleStockSymbol(uuid)
    .then(list => {
        res.send("Successfully deleted the symbol \"" + list[0] + "\" of the company \"" + list[1] + "\" (UUID was: " + uuid + ")");
    })
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.statusMessage = errorResponse;
        res.status(errorResponse.problem.status).send(errorResponse);
    });
})

/**
 * @swagger
 * /shares/{uuid}:
 *   options:
 *     tags:
 *       - shares 
 *     parameters:
 *       - name: uuid
 *         description: uuid of a symbol
 *         in: path
 *         required: true
 *         format: uuid
 *     description: Available options of the route /shares/:uuid
 *     responses:
 *         200:
 *           description: Successful
 */ 
router.options('/shares/:uuid', function(req,res)
{
    res.status(200).header("Allow", "GET, PUT, PATCH, DELETE, OPTIONS").send();
});


/**
 * @swagger
 * /shares/{uuid}/details:
 *   get:
 *     tags:
 *        - shares
 *     description: gets stock information about the given stock symbol
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: uuid
 *           description: uuid of a symbol
 *           in: path
 *           required: true
 *           format: uuid
 *         - in: query
 *           name: fields
 *           type: string
 *           format: string
 *           description: Specifies information of the stock symbol should be received. Fields are quote, news, chart. All three are received if fields query is not specified.
 *         - in: query
 *           name: newscount
 *           type: int
 *           format: int
 *           description: Specifies the retrieved amount of news related to the stock symbol. Default is 1.
 *         - in: query
 *           name: timespan
 *           format: string
 *           type: string
 *           description: Specifies the timespan of the retrieved data. Is given as "d", "m" or "y". "d" retrieves the data of every minute of the past day. "m" retrieves the data of every day of the past month. "y" retrieves the data of every day of the last year. Default is "m".  
 *         - in: query
 *           name: limit
 *           type: int
 *           format: int
 *           description: Limits the amount of datapoints returned by chart.
 *         - in: query
 *           name: offset
 *           format: int 
 *           type: int
 *           description: Number of skipped items of chart until collection starts.
 *         - in: query
 *           name: sort
 *           type: string
 *           description: Sorts the chart by fields, either ascending (+) or descending (-). Multiple sort requests are seperated by comma (,), e.g. "+high,-open".
 *         - in: query
 *           description: Searching for a value in every field of every object. Multiple search strings have to be seperated by semicolon (;).
 *           name: q
 *     responses:
 *         200:
 *           description: Successfully returned, detailed stock information about the symbol
 *           schema:
 *               $ref: '#/definitions/detailedStockInformation'
 *         404:
 *           description: Symbol was not a valid share symbol
 *         500: 
 *           description: Could not connect to the IEX Shares API or the shares file was inaccessible. 
 */  
router.get('/shares/:uuid/details', function(req, res) {
    const uuid = req.params.uuid;
    shares.getDetailedStockData(uuid, req.query)
    .then(data => {res.json(data);})
    .catch(error => {
        console.error(error);
        errorResponse = errorHandler.handleErrors(error);
        res.status(errorResponse.problem.status).send(errorResponse);
    })
    .then(function () {
        // always executed
    });
})

/**
 * @swagger
 * /shares/{uuid}/details:
 *   options:
 *     tags:
 *       - shares 
 *     parameters:
 *       - name: uuid
 *         description: uuid of a symbol
 *         in: path
 *         required: true
 *         format: uuid
 *     description: Available options of the route /shares/:uuid/details
 *     responses:
 *         200:
 *           description: Successful
 */ 
router.options('/shares/:uuid/details', function(req,res)
{
    res.status(200).header("Allow", "GET, OPTIONS").send();
});

//Mit Selection, z.B. Nur quote,news,chart