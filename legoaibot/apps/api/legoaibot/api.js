const legowebchat = require('../models/legowebchat');
const express = require('express');
const swagger = require('../swagger');
const legoAgent = require('./agent');
const router = express.Router();

/* CREATE */
router.post('/webchat', (req, res) => {
  legowebchat.create({ message: req.body.message })
    .then((result) => {
      console.log('CREATED. ' + req.body.message);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log('CREATE Error: ' + err);
      res.status(400).send('Error');
    })
});


let agentInstancesMap = new Map();

router.get('/', (req, res) => {
    res.send({ "status": "ready" });
});

/**
 * @openapi
 * /chat:
 *   post:
 *     summary: Execute a chat command
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt to send to the agent
 *               session_id:
 *                 type: string
 *                 description: The session ID for the agent instance
 *             required:
 *               - prompt
 *               - session_id
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The result from the agent
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 * 
 */
router.post('/chat', async (req, res) => {
    let agent = {};
    let prompt = req.body.prompt;
    let session_id = req.body.session_id;

    if (agentInstancesMap.has(session_id)) {
        agent = agentInstancesMap.get(session_id);
    } else {
        agent = new legoAgent();
        await agent.setup();
        agentInstancesMap.set(session_id, agent);
    }

    let result = await agent.executeAgent(prompt);
    res.send({ message: result });
});

router.post('/image', async (req, res) => {
    // console.log(req)
    let agent = {};

    agent = new legoAgent();
    let result = await agent.getVector(req.files[0].path);
    res.send({ message: result });
});

swagger(router)

module.exports = router;