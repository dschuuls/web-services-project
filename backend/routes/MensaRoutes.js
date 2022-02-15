var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var openMensa = require('../resources/openMensa');
var errorHandler = require('../tools/errorHandler');


module.exports = router;
router.use(bodyParser.json());

router.use(function timeLog(req, res, next) {
    next();
  });

/**
 * @swagger
 * definition:
 *   canteen:
 *     properties:
 *       uuid:
 *         type: string
 *         example: 300ef400-0389-11e9-b413-2b756a67cb9a
 *       id:
 *         type: number
 *         example: 1
 *       name:
 *         type: string
 *         example: Mensa UniCampus Magdeburg
 *       city:
 *         type: string
 *         example: Magdeburg
 *       address:
 *         type: string
 *         example: Pfälzer Str. 1, 39106 Magdeburg
 *       coordinates:
 *         type: string
 *         example: [52.1396188273019,11.6475999355316]
 */

 /**
 * @swagger
 * definition:
 *   canteenInformation:
 *     properties:
 *       id:
 *         type: number
 *         example: 1
 *       name:
 *         type: string
 *         example: Mensa UniCampus Magdeburg
 *       city:
 *         type: string
 *         example: Magdeburg
 *       address:
 *         type: string
 *         example: Pfälzer Str. 1, 39106 Magdeburg
 *       coordinates:
 *         type: string
 *         example: [52.1396188273019,11.6475999355316]
 */

/**
 * @swagger
 * definition:
 *   day:
 *     properties:
 *       date:
 *         type: string
 *         example: "2018-12-19"
 *       closed:
 *         type: boolean
 *         example: false
 */

/**
 * @swagger
 * definition:
 *   meal:
 *     properties:
 *       id:
 *         type: number
 *         example: 3850860
 *       name:
 *         type: string
 *         example: Linsensuppe
 *       category:
 *         type: string
 *         example: Vorspeise
 *       prices:
 *         type: number
 *         example: {
 *                       "students": 0.45,
 *                       "employees": 0.55,
 *                       "pupils": null,
 *                        "others": null
 *                   }
 *       notes:
 *         type: string
 *         example: [
 *                       "Sellerie"
 *                   ]
 */


/**
 * @swagger
 * /canteens:
 *   get:
 *     tags:
 *        - canteens
 *     description: get informations about all available canteens
 *     parameters:
 *         - in: query
 *           name: id
 *           type: number
 *           description: "OpenMensa ID"
 *         - in: query
 *           name: name
 *           type: string
 *           description: "Name of the canteen. Separated by a semicolon."
 *         - in: query
 *           name: city
 *           type: string
 *           description: "City name where the canteen is located. Separated by a semicolon."
 *         - in: query
 *           name: address
 *           type: string
 *           description: "Address where the canteen is located. Separated by a semicolon."
 *         - in: query
 *           name: offset
 *           type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: q
 *           type: string
 *           description: Search values that exists in the objects. Separated by a semicolon.
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *         - in: query
 *           name: sort
 *           type: string
 *           description: Fields by which you want to sort. Ascending marked with + and descending marked with -. Separated by a comma.
 *     produces:
 *         - application/json
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/canteen'
 *         204:
 *           description: The requested resource does not have any content
 *         500:
 *           description: Cannot open canteen ressource file to read data
 */  
router.get('/canteens', function (req, res) {
    openMensa.getPreparedCanteensData(req)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 *  /canteens:
 *   post:
 *     tags: 
 *       - canteens
 *     description:  Add a new canteen to the list of canteens. 
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Canteen information to be added to the example list.
 *         schema:
 *           $ref: '#/definitions/canteenInformation'
 *     produces:
 *       - application/json
 *     responses:
 *         201:
 *           description: successful operation
 *         400:
 *           description: invalid request body.
 *         409:
 *           description: the openMensa canteen does already exists in the list
 *         500:
 *           description: could not read/write file
 */
router.post('/canteens', function (req, res) {
    openMensa.addCanteen(req)
        .then(data => { 
            res.status(201).json(data).send(); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens', function(req,res)
{
   res.status(200).header("Allow", "GET, POST, OPTIONS").send();
});

/**
 * @swagger
 * /canteens/{canteenUUID}:
 *   get:
 *     tags:
 *        - canteens
 *     description: get informations about one available canteen
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of the canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             $ref: '#/definitions/canteen'
 *         204:
 *           description: The requested resource does not have any content
 *         404:
 *           description: The requested resource does not exists in file
 *         500:
 *           description: could not read file
 */  
router.get('/canteens/:canteenUUID', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    openMensa.getPreparedOneCanteenData(req, canteenUUID)
        .then(data => { 
            res.json(data).send(); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}:
 *   delete:
 *     tags:
 *       - canteens
 *     description: Deletes a single canteen from the canteen list
 *     parameters:
 *       - name: canteenUUID
 *         in: path
 *         description: Canteen UUID of the canteen to delete
 *         required: true
 *         type: string
 *     responses:
 *         200:
 *           description: Successfully deleted, information about the deleted symbol
 *         404: 
 *           description: Canteen was not found in the list
 *         500:
 *           description: could not read/write file
 */
router.delete('/canteens/:canteenUUID', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    openMensa.deleteCanteen(canteenUUID)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}:
 *   put:
 *     tags:
 *        - canteens
 *     description: updates information about the given canteen in the list 
 *     produces:
 *         - application/json
 *     parameters:
 *      - name: canteenUUID
 *        in: path
 *        required: true
 *        type: string
 *        description: Canteen UUID to be updated in the example list.
 *      - name: canteenInformation
 *        in: body
 *        required: true
 *        description: Information to be updated.
 *        schema:
 *           $ref: '#/definitions/canteenInformation'
 *     responses:
 *         200:
 *           description: Successfully updated
 *         400:
 *           description: invalid request body.
 *         409:
 *           description: the openMensa canteen id already exists in the list
 *         500:
 *           description: could not read/write file
 */
router.put('/canteens/:canteenUUID', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    openMensa.updateCanteen(req, canteenUUID)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens/{canteenId}
 *     parameters:
 *      - name: canteenUUID
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens/:canteenUUID', function(req,res)
{
   res.status(200).header("Allow", "GET, PUT, DELETE, OPTIONS").send();
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days:
 *   get:
 *     tags:
 *        - canteens
 *     description: get informations about all available days
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           required: true
 *           type: string
 *         - in: query
 *           name: closed
 *           type: boolean
 *           description: "Indicates whether the canteen is closed or open"
 *         - in: query
 *           name: offset
 *           type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: q
 *           type: string
 *           description: Search values that exists in the objects. Separated by a semicolon.
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *         - in: query
 *           name: sort
 *           type: string
 *           description: Fields by which you want to sort. Ascending marked with + and descending marked with -. Separated by a comma.
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/day'
 *         204:
 *           description: The requested resource does not have any content
 *         404:
 *           description: The requested resource does not exists in file or on OpenMensa
 *         500:
 *           description: Read file or OpenMensa Connection Error
 */  
router.get('/canteens/:canteenUUID/days', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    openMensa.getPreparedDaysData(req, canteenUUID)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens/{canteenId}/days
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           required: true
 *           type: string
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens/:canteenUUID/days', function(req,res)
{
   res.status(200).header("Allow", "GET, OPTIONS").send();
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}:
 *   get:
 *     tags:
 *        - canteens
 *     description: get informations about one day
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             $ref: '#/definitions/day'
 *         204:
 *           description: The requested resource does not have any content
 *         404:
 *           description: The requested resource does not exists in file or on OpenMensa
 *         500:
 *           description: Read file or OpenMensa Connection Error
 */  
router.get('/canteens/:canteenUUID/days/:date', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    const date = req.params.date;
    openMensa.getPreparedOneDayData(req, canteenUUID, date)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens/{canteenId}/days/{date}
  *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens/:canteenUUID/days/:date', function(req,res)
{
   res.status(200).header("Allow", "GET").send();
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}/meals:
 *   get:
 *     tags:
 *        - canteens
 *     description: get informations about all available meals
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *         - in: query
 *           name: name
 *           type: string
 *           description: The name of the meal. Separated by a semicolon.
 *         - in: query
 *           name: category
 *           type: string
 *           description: The category of the meal. Separated by a semicolon.
 *         - in: query
 *           name: offset
 *           type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: q
 *           type: string
 *           description: Search values that exists in the objects. Separated by a semicolon.
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *         - in: query
 *           name: sort
 *           type: string
 *           description: Fields by which you want to sort. Ascending marked with + and descending marked with -. Separated by a comma.
 *     responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/meal'
 *         204:
 *           description: The requested resource does not have any content
 *         404:
 *           description: The requested resource does not exists in file or on OpenMensa
 *         500:
 *           description: Read file or OpenMensa Connection Error
 */  
router.get('/canteens/:canteenUUID/days/:date/meals', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    const date = req.params.date;
    openMensa.getPreparedMealsData(req, canteenUUID, date)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}/meals:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens/{canteenId}/days/{date}/meals
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens/:canteenUUID/days/:date/meals', function(req,res)
{
   res.status(200).header("Allow", "GET, OPTIONS").send();
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}/meals/{mealId}:
 *   get:
 *     tags:
 *        - canteens
 *     description: get information about a specific meal
 *     produces:
 *         - application/json
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *         - name: mealId
 *           description: ID of a meal
 *           in: path
 *           example: 3850860
 *           required: true
 *           type: number
 *         - in: query
 *           name: fields
 *           type: string
 *           description: Fields to be displayed. Separated by a comma.
 *     responses:
 *         200:
 *           description: One meal of a selected canteen and day
 *           schema:
 *             $ref: '#/definitions/meal'
 *         204:
 *           description: The requested resource does not have any content
 *         404:
 *           description: The requested resource does not exists in file or on OpenMensa
 *         500:
 *           description: Read file or OpenMensa Connection Error
 */  
router.get('/canteens/:canteenUUID/days/:date/meals/:mealId', (req, res) => {
    const canteenUUID = req.params.canteenUUID;
    const date = req.params.date;
    const mealId = req.params.mealId;
    openMensa.getPreparedOneMealData(req, canteenUUID, date, mealId)
        .then(data => { 
            res.json(data); 
        })
        .catch(error => {
            errorResponse = errorHandler.handleErrors(error);
            if (errorResponse.problem.summary !== "") {
                res.status(errorResponse.problem.status).send(errorResponse);
            } else {
                res.status(errorResponse.problem.status).send();
            }
        });
});

/**
 * @swagger
 * /canteens/{canteenUUID}/days/{date}/meals/{mealId}:
 *   options:
 *     tags:
 *       - canteens
 *     description: Available options of the route /canteens/{canteenId}/days/{date}/meals/{mealId}
 *     parameters:
 *         - name: canteenUUID
 *           description: UUID of a canteen
 *           in: path
 *           example: "3762de60-0389-11e9-b413-2b756a67cb9a"
 *           required: true
 *           type: string
 *         - name: date
 *           description: Date of a day
 *           in: path
 *           example: 2018-12-21
 *           required: true
 *           type: string
 *         - name: mealId
 *           description: ID of a meal
 *           in: path
 *           example: 3850860
 *           required: true
 *           type: number
 *     responses:
 *         200:
 *           description: Successful
 */
router.options('/canteens/:canteenUUID/days/:date/meals/:mealId', function(req,res)
{
   res.status(200).header("Allow", "GET, OPTIONS").send();
});