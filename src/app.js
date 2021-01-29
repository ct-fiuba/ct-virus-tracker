const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');
const infectedRouter = require('./routes/infectedRouter');
const monitoringRouter = require('./routes/monitoringRouter');

module.exports = function app() {
  const app = express();
  app.use(cors());
  app.disable('x-powered-by');
  app.use(bodyParser.json());
  app.use(infectedRouter());
  app.use(monitoringRouter());
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
