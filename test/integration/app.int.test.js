const appFactory = require('../../src/app');
const Vaccine = require('../../src/models/schemas/Vaccine');
const Visit = require('../../src/models/schemas/Visit');
const Rule = require('../../src/models/schemas/Rule');
const amqp = require('amqp-connection-manager');

const request = require('supertest');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/test_db';
mongoose.connect(mongoURL);

let server;

let visit1 = {
  userGeneratedCode: '1',
  vaccinated: 0,
  illnessRecovered: false,
}

let visit2 = {
  userGeneratedCode: '2',
  vaccinated: 0,
  illnessRecovered: false,
}

let visitNotSaved = {
  userGeneratedCode: 'notFound',
}

let ruleHighRisk = {
  "index": 1,
  "contagionRisk": 0,
  "m2Value": 10,
  "m2Cmp": "<"
}

let ruleMidRisk = {
  "index": 2,
  "contagionRisk": 1,
  "m2Value": 10,
  "m2Cmp": ">"
}

let vaccine1 = {
  "name": "Sinopharm",
  "shotsCount": 3
}

let vaccine2 = {
  "name": "Pfizer",
  "shotsCount": 2
}

const connectToRabbitMQ = () => {
  const queueAddress = process.env.QUEUE_ADDRESS;
  const queueName = process.env.QUEUE_NAME;

  const connection = amqp.connect([queueAddress]);

  const channel = connection.createChannel({
    json: true,
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue(queueName, {durable: true});
    }
  });
  return {connection, channel, queueName};
}

beforeAll(async () => {
  rabbitManager = connectToRabbitMQ();
  server = await appFactory(rabbitManager).listen(5007);
});

afterAll(async (done) => {
  await mongoose.connection.close();
  await rabbitManager.connection.close();
  await server.close();
  done();
});

describe('App test', () => {
  describe('ping', () => {
    test('should return 200', async () => {
      await request(server).get('/ping').expect(200);
    });
  });

  describe('infected', () => {

    beforeEach(async () => {
      await Visit.insertMany([visit1, visit2])
    })

    afterEach(async () => {
      await Visit.deleteMany()
    })

    describe('add infected', () => {
      test('should return 201', async () => {
        await request(server).post('/infected').send(visit1).then(res => {
          expect(res.status).toBe(201);

          Visit.find({visit1}).then((visits) => {
            visits.forEach((visit) => expect(visit.detectedTimestamp).toBeTruthy())
          })
        })
      });

      test('should return 400 when visit not found', async () => {
        await request(server).post('/infected').send(visitNotSaved).then(res => {
          expect(res.status).toBe(404);
          expect(res.body.reason).toBe('Visit not found')
        });
      });
    });
  });

  describe('rules', () => {

    afterEach(async () => {
      await Rule.deleteMany()
    })

    describe('add rule', () => {
      test('add single rule should return 201', async () => {
        await request(server).post('/rules').send({ rules: [ruleHighRisk] }).then(res => {
          expect(res.status).toBe(201);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(1);
            expect(rules[0].index).toBe(ruleHighRisk.index);
            expect(rules[0].contagionRisk).toBe(ruleHighRisk.contagionRisk);
            expect(rules[0].m2Value).toBe(ruleHighRisk.m2Value);
            expect(rules[0].m2Cmp).toBe(ruleHighRisk.m2Cmp);
          })
        })
      });

      test('add two rules should return 201', async () => {
        await request(server).post('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).then(res => {
          expect(res.status).toBe(201);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(2);

            highRisk = rules.filter(rule => rule.index === 1)[0];
            midRisk = rules.filter(rule => rule.index === 2)[0];

            expect(highRisk.index).toBe(ruleHighRisk.index);
            expect(highRisk.contagionRisk).toBe(ruleHighRisk.contagionRisk);
            expect(highRisk.m2Value).toBe(ruleHighRisk.m2Value);
            expect(highRisk.m2Cmp).toBe(ruleHighRisk.m2Cmp);

            expect(midRisk.index).toBe(ruleMidRisk.index);
            expect(midRisk.contagionRisk).toBe(ruleMidRisk.contagionRisk);
            expect(midRisk.m2Value).toBe(ruleMidRisk.m2Value);
            expect(midRisk.m2Cmp).toBe(ruleMidRisk.m2Cmp);
          })
        })
      });
    });

    describe('get rules', () => {
      let highRiskId;
      let midRiskId;

      beforeEach(async () => {
        await request(server).post('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).then(res => {
          const rules = res.body;
          highRiskId = rules.filter(rule => rule.index === 1)[0]._id;
          midRiskId = rules.filter(rule => rule.index === 2)[0]._id;
        });
      })

      test('should return all rules', async () => {
        await request(server).get('/rules').then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
      });

      test('should return high risk rule', async () => {
        await request(server).get(`/rules/${highRiskId}`).then(res => {
          expect(res.status).toBe(200);
          expect(res.body._id).toBe(highRiskId);
          expect(res.body.index).toBe(ruleHighRisk.index);
          expect(res.body.contagionRisk).toBe(ruleHighRisk.contagionRisk);
          expect(res.body.m2Value).toBe(ruleHighRisk.m2Value);
          expect(res.body.m2Cmp).toBe(ruleHighRisk.m2Cmp);
        });
      });

      test('should return mid risk rule', async () => {
        await request(server).get(`/rules/${midRiskId}`).then(res => {
          expect(res.status).toBe(200);
          expect(res.body._id).toBe(midRiskId);
          expect(res.body.index).toBe(ruleMidRisk.index);
          expect(res.body.contagionRisk).toBe(ruleMidRisk.contagionRisk);
          expect(res.body.m2Value).toBe(ruleMidRisk.m2Value);
          expect(res.body.m2Cmp).toBe(ruleMidRisk.m2Cmp);
        });
      });
    });

    describe('delete rules', () => {
      let highRiskId;
      let midRiskId;

      beforeEach(async () => {
        await request(server).post('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).then(res => {
          const rules = res.body;
          highRiskId = rules.filter(rule => rule.index === 1)[0]._id;
          midRiskId = rules.filter(rule => rule.index === 2)[0]._id;
        });
      })

      test('should delete high risk rule', async () => {
        await request(server).delete('/rules').send({ ruleIds: [highRiskId] }).then(res => {
          expect(res.status).toBe(204);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(1);
            expect(rules[0].index).toBe(ruleMidRisk.index);
            expect(rules[0].contagionRisk).toBe(ruleMidRisk.contagionRisk);
            expect(rules[0].m2Value).toBe(ruleMidRisk.m2Value);
            expect(rules[0].m2Cmp).toBe(ruleMidRisk.m2Cmp);
          })
        });
      });

      test('should delete mid risk rule', async () => {
        await request(server).delete('/rules').send({ ruleIds: [midRiskId] }).then(res => {
          expect(res.status).toBe(204);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(1);
            expect(rules[0].index).toBe(ruleHighRisk.index);
            expect(rules[0].contagionRisk).toBe(ruleHighRisk.contagionRisk);
            expect(rules[0].m2Value).toBe(ruleHighRisk.m2Value);
            expect(rules[0].m2Cmp).toBe(ruleHighRisk.m2Cmp);
          })
        });
      });

      test('should delete both rules', async () => {
        await request(server).delete('/rules').send({ ruleIds: [highRiskId, midRiskId] }).then(res => {
          expect(res.status).toBe(204);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(0);
          })
        });
      });
    });

    describe('update rules', () => {
      let highRisk;
      let midRisk;

      beforeEach(async () => {
        await request(server).post('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).then(res => {
          const rules = res.body;
          highRisk = rules.filter(rule => rule.index === 1)[0];
          midRisk = rules.filter(rule => rule.index === 2)[0];
        });
      })

      test('should update the indexes', async () => {
        let aux = highRisk.index;
        highRisk.index = midRisk.index;
        midRisk.index = aux;

        await request(server).put('/rules').send({ rules: [highRisk, midRisk] }).then(res => {
          expect(res.status).toBe(200);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(2);

            highRiskStored = rules.filter(rule => rule.index === 2)[0];
            midRiskStored = rules.filter(rule => rule.index === 1)[0];

            expect(highRiskStored.index).toBe(ruleMidRisk.index);
            expect(highRiskStored.contagionRisk).toBe(ruleHighRisk.contagionRisk);
            expect(highRiskStored.m2Value).toBe(ruleHighRisk.m2Value);
            expect(highRiskStored.m2Cmp).toBe(ruleHighRisk.m2Cmp);

            expect(midRiskStored.index).toBe(ruleHighRisk.index);
            expect(midRiskStored.contagionRisk).toBe(ruleMidRisk.contagionRisk);
            expect(midRiskStored.m2Value).toBe(ruleMidRisk.m2Value);
            expect(midRiskStored.m2Cmp).toBe(ruleMidRisk.m2Cmp);
          })
        });
      });
    });
  });

  describe('vaccines', () => {

    afterEach(async () => {
      await Vaccine.deleteMany()
    })

    describe('add vaccine', () => {
      test('add vaccine should return 201', async () => {
        await request(server).post('/vaccines').send(vaccine1).then(res => {
          expect(res.status).toBe(201);
          Vaccine.find({}).then((vaccines) => {
            expect(vaccines.length).toBe(1);
            expect(vaccines[0].name).toBe(vaccine1.name);
            expect(vaccines[0].shotsCount).toBe(vaccine1.shotsCount);
          })
        })
      });
    });

    describe('get vaccines', () => {
      let vaccine1_id;
      let vaccine2_id;
      
      beforeEach(async () => {
        await request(server).post('/vaccines').send(vaccine1).then(res => {
          vaccine1_id = res.body._id;
        });
        await request(server).post('/vaccines').send(vaccine2).then(res => {
          vaccine2_id = res.body._id;
        });
      })

      test('should return all vaccines', async () => {
        await request(server).get('/vaccines').then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
      });

      test('should return specific vaccine', async () => {
        await request(server).get(`/vaccines/${vaccine1_id}`).then(res => {
          expect(res.status).toBe(200);
          expect(res.body._id).toBe(vaccine1_id);
          expect(res.body.name).toBe(vaccine1.name);
          expect(res.body.shotsCount).toBe(vaccine1.shotsCount);
        });
      });
    });

    describe('delete vaccine', () => {
      let vaccine_id;
      
      beforeEach(async () => {
        await request(server).post('/vaccines').send(vaccine1).then(res => {
          vaccine_id = res.body._id;
        });
      })

      test('should delete vaccine', async () => {
        await request(server).delete(`/vaccines/${vaccine_id}`).send().then(res => {
          expect(res.status).toBe(204);
          Rule.find({}).then((rules) => {
            expect(rules.length).toBe(0);
          })
        });
      });
    });

    describe('update vaccine', () => {
      let vaccine_id;
      
      beforeEach(async () => {
        await request(server).post('/vaccines').send(vaccine1).then(res => {
          vaccine_id = res.body._id;
        });
      })

      test('should update vaccine', async () => {
        await request(server).put(`/vaccines/${vaccine_id}`).send(vaccine2).then(res => {
          expect(res.status).toBe(200);
          Vaccine.find({ '_id': vaccine_id }).then((vaccine) => {
            expect(vaccine.name).toBe(vaccine2.name);
            expect(vaccine.shotsCount).toBe(vaccine2.shotsCount);
          })
        });
      });
    });
  });
});
