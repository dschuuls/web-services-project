var compression = require('compression');
var express = require("express");
var app = express();
app.use(compression());

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./documentation/swaggerDefiniton');

app.use(require('./routes/MensaRoutes'));
app.use(require('./routes/sharesRoutes')); 
app.use(require('./routes/coursesRoutes'));
app.use(require('./routes/transportRoutes'));

//Swagger Doku
const swaggerOptions = {
    swaggerDefinition,
    apis: [
      "./routes/*.js",
    ],
  };

//initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(swaggerOptions);

//serve swagger 
app.get('/swagger.json', function(req, res) {   
    res.setHeader('Content-Type', 'application/json');   
    res.send(swaggerSpec); 
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});