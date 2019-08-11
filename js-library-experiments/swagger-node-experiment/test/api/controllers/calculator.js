var request = require('supertest');
var server = require('../../../app');

describe('controllers', function () {
    describe('calculator', () => {
        it('should add numbers', (done) => {
            request(server)
                .post('/api/add')
                .send({
                    a: 22,
                    b: 33
                })
                .expect(200, {
                    result: 55
                }, done);
        });

        it('should subtract numbers', (done) => {
            request(server)
                .get('/api/sub')
                .query({
                    a: 22,
                    b: 33
                })
                .expect(200, {
                    result: -11
                }, done);
        });
    });
});
