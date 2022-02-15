var mensaErrors = require('./errorcodes/MensaErrors.json');        //Error Codes 1xxx
var vvsErrors = require('./errorcodes/transportErrors.json');      //Error Codes 2xxx
var coursesErrors = require('./errorcodes/coursesErrors.json');   //Error Codes 3xxx
var sharesErrors = require('./errorcodes/sharesErrors.json');      //Error Codes 4xxx

const uuidv1 = require('uuid/v1');

module.exports = {
    handleErrors: function(errorCode) {
        return getErrorConstructForError(errorCode);
    }
}

/**
 * Problem:
 *  type: 
 *  summary:
 *  status:
 *  error_code
 *  details:
 *  information:
 *  uuid oder sonstiges:
 */

var map = new Map();

//Error Codes 1xxx
for(var errors of mensaErrors){
    map.set(errors.problem.errorcode, errors);
}

//Error Codes 2xxx
for(var errors of vvsErrors){
    map.set(errors.problem.errorcode, errors);
}

//Error Codes 3xxx
for(var errors of coursesErrors){
    map.set(errors.problem.errorcode, errors);
}

//Error Codes 4xxx
for(var errors of sharesErrors){
    map.set(errors.problem.errorcode, errors);
}

function getErrorConstructForError(errorCode) {
    errorCode = map.get(errorCode.toString());
    errorCode.problem.type = "https://httpstatuses.com/" + errorCode.problem.status.toString();
    errorCode.problem.information = "http://.../error/" + errorCode.problem.errorcode.toString();
    errorCode.problem.uuid = uuidv1();
    return errorCode
}