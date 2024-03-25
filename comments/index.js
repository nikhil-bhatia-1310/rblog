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
const commentsByPostId = {};

/** APIs START */
//GET API, sends back response by getting the value out of commentsByPostId for a specific id passed through request URI
app.get('/posts/:id/comments',  (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

//POST API, receives id as URI, generates the comment id 
app.post('/posts/:id/comments',  async (req, res) => {
    const commentId = randomBytes(4).toString('hex');

    //gets the body of the request and add in content
    const {content} = req.body;

    //creates comments from the existing commentsByPostId for the id so that values could be pushed to it
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content, status:'pending'});

    //sets the comments to the commentsByPostId
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    //Return 201 and sends the comments
    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
    const {type, data} = req.body;
    if (type === 'CommentModerated'){
        const { postId, id, status, content} = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })

    }
    res.send({});
});

/** APIs END */

/** adding configurations to start the application on the specific port */
app.listen(4001, () => {
    console.log('Listening on 4001');
});
