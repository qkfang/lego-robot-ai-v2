const request = require('supertest');
const app = require('../app'); // Adjust the path to your app file

describe('POST /chat', () => {
    it('should respond with a 200 status and a message', async () => {
        const response = await request(app)
            .post('/chat')
            .send({ prompt: 'Hello' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});