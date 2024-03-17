/** use express, body-parser, crypto, cors as standard */
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

/** use express and add bodyParser*/
const app = express();
app.use(bodyParser.json());
app.use(cors());

/** Component specific variables */
const posts = {};

/** APIs START */
//GET API, sends back response by returning back posts
app.get('/posts', (req, res) => {
    res.send(posts);
});

//POST API, generates the random id
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    
    //sets title value from req body
    const {title} = req.body;

    //sets the value of posts for id with id and title
    posts[id] = {
        id, title
    };
    
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });
    //sets status of 201
    res.status(201).send(posts[id]);
});

    app.post('/events', (req, res) => {
        console.log('Received Event', req.body.type);

        res.send({});
    });

/** APIs END */

/** adding configurations to start the application on the specific port */
app.listen(4000, () => {
    console.log('listening on 4000');
});

