const app = require('../../src/app')();
const Visit = require('../../src/models/schemas/Visit');
const Rule = require('../../src/models/schemas/Rule');

const request = require('supertest');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/test_db';
mongoose.connect(mongoURL);

let server;

let visit1 = {
  userGeneratedCode: '1',
}

let visit2 = {
  userGeneratedCode: '2',
}

let visitNotSaved = {
  userGeneratedCode: 'notFound',
}

let ruleHighRisk = {
  "index": 1,
  "contagionRisk": "Alto",
  "m2Value": 10,
  "m2Cmp": "<"
}

let ruleMidRisk = {
  "index": 2,
  "contagionRisk": "Medio",
  "m2Value": 10,
  "m2Cmp": ">"
}

beforeAll(async () => {
  server = await app.listen(5007);
});

afterAll(async (done) => {
  await mongoose.connection.close();
  await server.close(done);
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
        await request(server).post('/infected').send({ visits: [visit1, visit2] }).then(res => {
          expect(res.status).toBe(201);

          Visit.find({}).then((visits) => {
            visits.forEach((visit) => expect(visit.detectedTimestamp).toBeTruthy())
          }) 
        })
      });

      test('should return 400 when visit not found', async () => {
        await request(server).post('/infected').send({ visits: [visitNotSaved] }).then(res => {
          expect(res.status).toBe(404);
          expect(res.body.reason).toBe('1 visits not found')
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
  });
});
