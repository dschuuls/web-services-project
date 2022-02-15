//Todo:
// - xml?

var express = require('express');
var router = express.Router();
var transport = require('../resources/transport');
var errorHandler = require('../tools/errorHandler');

module.exports = router;

router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    next();
});

/**
 * @swagger
 * definition:
 *   transport-network:
 *     properties:
 *       id:
 *         type: number
 *         example: 1
 *       name:
 *         type: string
 *         example: Münchner Verkehrs- und Tarifverbund
 *       acronym: 
 *         type: string
 *         example: MVV
 */



/**
 * @swagger
 *  /transport-networks:
 *   get:
 *     tags:
 *       - transport
 *     description: receive informations about all available transport-networks
 *     parameters:
 *         - in: query
 *           name: acronym
 *           type: string
 *           description: acronym of the transport-network
 *     produces:
 *       - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/transport-network'
 *         204:
 *           description: no content was found for the requested ressource
 */

router.get('/transport-networks', function (req, res) {
    transport.getTransportNetworks(req)
        .then(data => { res.json(data); })
        .catch(function (error) {
            console.error(error);
            errorResponse = errorHandler.handleErrors(error);
            console.log(errorResponse);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});

/**
 * @swagger
 * /transport-networks:
 *   options:
 *     tags:
 *       - transport
 *     description: Available options for /transport-network
 *     responses:
 *         200:
 *           description: Successful Operation
 */
router.options('/transport-networks', function(req,res)
{
   res.status(200).header("Allow", "GET, OPTIONS").send();
});





/**
 * @swagger
 *  /transport-networks/{transport-network-id}:
 *   get:
 *     tags:
 *       - transport
 *     description: get informations about a specific station
 *     parameters:
 *       - name: transport-network-id
 *         in: "path"
 *         description: id of the transport-network
 *         required: true
 *         type: "string"
 *     produces:
 *       - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *               $ref: '#/definitions/transport-network'
 *         404:
 *           description: requested resource could not be found
 */
router.get('/transport-networks/:transportNetworkId', function (req, res) {
    transport.getTransportNetwork(req.params.transportNetworkId)
        .then(data => { res.json(data); })
        .catch(function (error) {
            console.error(error);
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});





/**
* @swagger
* definition:
*   station:
*     properties:
*       id:
*         type: string
*         example: 5003998
*       name:
*         type: string
*         example: Hochschulzentrum
*       fullName:
*         type: string
*         example: Esslingen (N) Hochschulzentrum
*/



/**
 * @swagger
 *  /transport-networks/{transport-network-id}/stations:
 *   get:
 *     tags:
 *       - transport
 *     description: get informations about all station of a specific transport-network
 *     parameters:
 *       - name: transport-network-id
 *         in: "path"
 *         description: id of the transport-network
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: q
 *         type: string
 *         description: search value that exists in the full station name
 *       - in: query
 *         name: sort
 *         type: string
 *         description: sorting by field, ascending with prefixed + and descending with prefixed - (use comma as seperator)
 *     produces:
 *       - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/station'
 *         204:
 *           description: no content was found for the requested ressource 
 *         404:
 *           description: requested resource could not be found
 */
router.get('/transport-networks/:transportNetworkId/stations', function (req, res) {

    if (req.query['q']) {
        transport.searchStations(req.params.transportNetworkId, req.query.q, req.query)
            .then(data => { res.json(data); })
            .catch(function (error) {
                console.error(error);
                errorResponse = errorHandler.handleErrors(error);
                res.status(errorResponse.problem.status).send(errorResponse);
            })
            .then(function () {
                // always executed
            });

    } else {

        transport.getStations(req.params.transportNetworkId, req.query)
            .then(data => {
                res.json(data);
            })
            .catch(function (error) {
                console.error(error);
                errorResponse = errorHandler.handleErrors(error);
                res.status(errorResponse.problem.status).send(errorResponse);
            })
            .then(function () {
                // always executed
            });

    }
});

/**
 * @swagger
 *  /transport-networks/{transport-network-id}/stations/{station-id}:
 *   get:
 *     tags:
 *       - transport
 *     description: get informations about a specific station of a specific transport-network
 *     parameters:
 *       - name: transport-network-id
 *         in: "path"
 *         description: id of the transport-network
 *         required: true
 *         type: "string"
 *       - name: station-id
 *         in: "path"
 *         description: id of the station
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: fields
 *         type: string
 *         description: fields that will be displayed (use comma as seperator)
 *     produces:
 *       - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             $ref: '#/definitions/station'
 *         404:
 *           description: requested resource could not be found    
 */
router.get('/transport-networks/:transportNetworkId/stations/:stationId', function (req, res) {

    transport.getStation(req.params.transportNetworkId, req.params.stationId, req.query)
        .then(data => { res.json(data); })
        .catch(function (error) {
            console.error(error);
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });

});






/**
* @swagger
* definition:
*   departure:
*     properties:
*       line:
*         type: string
*         example: 105
*       minutesDelay:
*         type: number
*         example: 0
*       direction:
*         type: string
*         example: Esslingen (N) ZOB
*       departureTime:
*         type: object
*         properties:
*           year:
*             type: number
*             example: 2018
*           month:
*             type: number
*             example: 12
*           day:
*             type: number
*             example: 2
*           hour:
*             type: number
*             example: 12
*           minute:
*             type: number
*             example: 46
*/



/**
 * @swagger
 *  /transport-networks/{transport-network-id}/stations/{station-id}/departures:
 *   get:
 *     tags:
 *       - transport
 *     description: get informations about the max 100 next departures until the end of the day of a specific station 
 *     parameters:
 *       - name: transport-network-id
 *         in: "path"
 *         description: id of the transport-network
 *         required: true
 *         type: "string"
 *       - name: station-id
 *         in: "path"
 *         description: id of the station
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: direction
 *         type: string
 *         description: direction for departure
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: max number of departures to return
 *       - in: query
 *         name: offset
 *         type: integer
 *         description: number of next departures to skip
 *     produces:
 *       - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/departure'
 *         204:
 *           description: no content was found for the requested ressource 
 *         404:
 *           description: requested resource could not be found  
 */
router.get('/transport-networks/:transportNetworkId/stations/:stationId/departures', function (req, res) {
    transport.getStationDepartures(req.params.transportNetworkId, req.params.stationId, req.query)
        .then(data => { res.json(data); })
        .catch(function (error) {
            console.error(error);
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});

