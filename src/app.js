const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');
const infectedRouter = require('./routes/infectedRouter');
const rulesRouter = require('./routes/rulesRouter');
const vaccinesRouter = require('./routes/vaccinesRouter');
const monitoringRouter = require('./routes/monitoringRouter');

module.exports = function app(rabbitManager) {
  const app = express();
  app.use(cors());
  app.disable('x-powered-by');
  app.use(bodyParser.json());
  app.use(infectedRouter(rabbitManager));
  app.use(rulesRouter());
  app.use(vaccinesRouter());
  app.use(monitoringRouter());
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
