const express = require('express');
const cors = require('cors')
var multer  = require('multer'); 
const upload = multer({ dest: 'uploads/' })
const swagger = require('./swagger');
const legoAgent = require('./lego_robot/lego_robot_ai_agent');
const taskApi = require('./lego_robot/lego_robot_task_api');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(cors()); // enable all CORS requests
app.use(multer({dest:__dirname+'\\uploads\\'}).any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', taskApi);

let agentInstancesMap = new Map();

app.get('/', (req, res) => {
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
app.post('/chat', async (req, res) => {
    let agent = {};
    let prompt = req.body.prompt;

    // if (agentInstancesMap.has(session_id)) {
    //     agent = agentInstancesMap.get(session_id);
    // } else {
    agent = new legoAgent();
    //    agentInstancesMap.set(session_id, agent);
    //}
    console.log('prompt:', prompt);
    await agent.setup();
    let result = await agent.executeAgent(prompt);
    res.send({ message: result });
});

app.post('/image', async (req, res) => {
    // console.log(req)
    let agent = {};

    agent = new legoAgent();
    let result = await agent.getVector(req.files[0].path);
    res.send({ message: result });
});

swagger(app)


// parse out hosting port from cmd arguments if passed in
// otherwise default to port 4242
var port = (() => {
    const { argv } = require('node:process');
    var port = 4242; // default
    if (argv){
        argv.forEach((v, i) => {
            if (v && (v.toLowerCase().startsWith('port=')))
            {
                port = v.substring(5);
            }
        });
    }
    return port;
})();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = app;