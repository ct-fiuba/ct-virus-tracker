const app = require('../../src/app')();
const Visit = require('../../src/models/schemas/Visit');

const request = require('supertest');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/test_db';
mongoose.connect(mongoURL);

let server;

let visit1 = {
  scanCode: new mongoose.Types.ObjectId(),
  isExitScan: false,
  userGeneratedCode: '1',
  timestamp: Date.now(),
}

let visit2 = {
  scanCode: new mongoose.Types.ObjectId(),
  isExitScan: false,
  userGeneratedCode: '2',
  timestamp: Date.now(),
}

let visistNotSaved = {
  scanCode: new mongoose.Types.ObjectId(),
  isExitScan: false,
  userGeneratedCode: 'notFound',
  timestamp: Date.now(),
}

beforeAll(async () => {
  server = await app.listen(5005);
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
        await request(server).post('/infected').send({ visits: [visistNotSaved] }).then(res => {
          expect(res.status).toBe(404);
          expect(res.body.reason).toBe('1 visits not found')
        });
      });
    });
  });
});
