const app = require('../../src/app')();
const Visit = require('../../src/models/schemas/Visit');

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
});
