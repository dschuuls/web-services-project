var express = require('express');
var router = express.Router();
var courses = require('../resources/courses');
var errorHandler = require('../tools/errorHandler');
var cache = require('memory-cache');

module.exports = router;

let memCache = new cache.Cache();

let cacheMiddleware = (duration) => {

    return (req, res, next) => {

        res.setHeader('Content-Type', 'application/json');

        let key =  '__express__' + req.originalUrl || req.url;
        let cacheContent = memCache.get(key);

        if (req.get("cache-control") !== "no-cache" && cacheContent) {
            res.send(cacheContent);
        }
        else if (req.get("if-modified-since")) {
            res.sendStatus(304);
        }
        else {
            res.sendResponse = res.send;
            res.send = (body) => {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body)
            };
            next();
        }
    }
};

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * @swagger
 * /courses:
 *   get:
 *     tags:
 *       - courses
 *     description: Returns the IDs of all courses.
 *     parameters:
 *       - in: query
 *         name: q
 *         type: string
 *         description: A search term. Searches inside the IDs.
 *       - in: header
 *         name: cache-control
 *         type: string
 *         description: Use 'no-cache' to bypass the cache.
 *       - in: header
 *         name: if-modified-since
 *         type: string
 *         description: Using this will only return a result with status code 200 if it has been last modified after the given date. An empty response with status code 304 will be returned otherwise. Use dates in the following format. 'Mon, 01 Oct 2018 00:00:00 GMT'.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/course'
 *       204:
 *         description: No Content. Either the website of HS Esslingen or a search returned no content.
 *       304:
 *         description: Not Modified. Using the request header 'if-modified-since' this endpoint will only return a result with status code 200 if it has been last modified after the given date. Otherwise an empty response with status code 304 will be returned.
 *       500:
 *         description: Server Error. This can happen if the website of HS Esslingen is unreachable or it's content changed so that it can't be parsed.
 */

/**
 * @swagger
 * definition:
 *   course:
 *     properties:
 *       courseId:
 *         type: string
 *         example: AIM1
 */

router.get('/courses', cacheMiddleware(30), function(req, res) {
    courses.getCoursesList(req.query.q ? req.query.q : undefined)
        .then(data => {
            if (data.length === 0) throw "3000";
            else res.json(data);
        })
        .catch(function (error) {
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});

/**
 * @swagger
 * /courses:
 *   options:
 *     tags:
 *       - courses
 *     description: Available methods of the path '/courses'.
 *     responses:
 *         200:
 *           description: Success.
 */

router.options('/courses', function(req,res)
{
    res.status(200).header("Allow", "GET, OPTIONS").send();
});

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     tags:
 *       - courses
 *     description: Returns one course addressed by its ID.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         type: string
 *         description: The ID of one course.
 *         required: true
 *       - in: header
 *         name: cache-control
 *         type: string
 *         description: Use 'no-cache' to bypass the cache.
 *       - in: header
 *         name: if-modified-since
 *         type: string
 *         description: Using this will only return a result with status code 200 if it has been last modified after the given date. An empty response with status code 304 will be returned otherwise. Use dates in the following format. 'Mon, 01 Oct 2018 00:00:00 GMT'.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success.
 *         schema:
 *           $ref: '#/definitions/courseFull'
 *       304:
 *         description: Not Modified. Using the request header 'if-modified-since' this endpoint will only return a result with status code 200 if it has been last modified after the given date. Otherwise an empty response with status code 304 will be returned.
 *       404:
 *         description: Not Found. The course with the given ID was not found.
 *       500:
 *         description: Server Error. This can happen if the website of HS Esslingen is unreachable or it's content changed so that it can't be parsed.
 */

/**
 * @swagger
 * definition:
 *   courseFull:
 *     properties:
 *       courseId:
 *         type: string
 *         example: AIM1
 *       scheduleUrl:
 *         type: string
 *         example: https://www3.hs-esslingen.de/qislsf/rds...
 */

router.get('/courses/:courseId', cacheMiddleware(30), function(req, res) {
    courses.getCourseDetails(req.params.courseId)
        .then(data => {
            if (data.length === 0) throw "3000";
            else res.json(data);
        })
        .catch(function (error) {
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});

/**
 * @swagger
 * /courses/{courseId}:
 *   options:
 *     tags:
 *       - courses
 *     description: Available methods of the path '/courses/{courseId}'.
 *     parameters:
 *      - name: courseId
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *         200:
 *           description: Success.
 */

router.options('/courses/:courseId', function(req,res)
{
    res.status(200).header("Allow", "GET, OPTIONS").send();
});

/**
 * @swagger
 * /courses/{courseId}/lectures:
 *   get:
 *     tags:
 *       - courses
 *     description: Returns the lectures of a course.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         type: string
 *         description: The ID of one course.
 *         required: true
 *       - in: query
 *         name: q
 *         type: string
 *         description: A search term. Searches inside the lecture names.
 *       - in: query
 *         name: date
 *         type: string
 *         description: A date to filter scheduled lectures for, e.g. '2019-01-11'.
 *       - in: header
 *         name: cache-control
 *         type: string
 *         description: Use 'no-cache' to bypass the cache.
 *       - in: header
 *         name: if-modified-since
 *         type: string
 *         description: Using this will only return a result with status code 200 if it has been last modified after the given date. An empty response with status code 304 will be returned otherwise. Use dates in the following format. 'Mon, 01 Oct 2018 00:00:00 GMT'.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/lecture'
 *       204:
 *         description: No Content. Either a search returned no content or a date was passed where there's no lectures scheduled.
 *       304:
 *         description: Not Modified. Using the request header 'if-modified-since' this endpoint will only return a result with status code 200 if it has been last modified after the given date. Otherwise an empty response with status code 304 will be returned.
 *       400:
 *         description: Bad Request. Probably the date string was in an incorrect format.
 *       404:
 *         description: Not Found. The course with the given ID was not found.
 *       500:
 *         description: Server Error. This can happen if the website of HS Esslingen is unreachable or it's content changed so that it can't be parsed. Other errors might occur if an iCal file can't be downloaded or parsed.
 */

/**
 * @swagger
 * definition:
 *   lecture:
 *     properties:
 *       name:
 *         type: string
 *         example: Web Services (Gebhart)
 *       location:
 *         type: string
 *         example: F 01.-111
 *       dates:
 *         type: string
 *         example: [ "2019-01-11T13:00:00.000Z" ]
 */

router.get('/courses/:courseId/lectures', cacheMiddleware(30), function(req, res) {
    courses.getCourseLectures(req.params.courseId, req.query.date ? req.query.date : undefined, req.query.q ? req.query.q : undefined)
        .then(data => {
            if (data.length === 0) throw "3000";
            else res.json(data);
        })
        .catch(function (error) {
            errorResponse = errorHandler.handleErrors(error);
            res.status(errorResponse.problem.status).send(errorResponse);
        })
        .then(function () {
            // always executed
        });
});

/**
 * @swagger
 * /courses/{courseId}/lectures:
 *   options:
 *     tags:
 *       - courses
 *     description: Available methods of the path '/courses/{courseId}/lectures'.
 *     parameters:
 *      - name: courseId
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *         200:
 *           description: Success.
 */

router.options('/courses/:courseId/lectures', function(req,res)
{
    res.status(200).header("Allow", "GET, OPTIONS").send();
});