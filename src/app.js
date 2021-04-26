const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');
const infectedRouter = require('./routes/infectedRouter');
<<<<<<< HEAD
=======
const rulesRouter = require('./routes/rulesRouter');
>>>>>>> 93ae4ffdfe5472c87e7a37c22ba164090921411d
const monitoringRouter = require('./routes/monitoringRouter');

module.exports = function app() {
  const app = express();
  app.use(cors());
  app.disable('x-powered-by');
  app.use(bodyParser.json());
  app.use(infectedRouter());
<<<<<<< HEAD
=======
  app.use(rulesRouter());
>>>>>>> 93ae4ffdfe5472c87e7a37c22ba164090921411d
  app.use(monitoringRouter());
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
