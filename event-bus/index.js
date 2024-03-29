const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
const events = [];
app.post('/events', (req,res) => {
    const event = req.body;
    console.log("Event in event bus="+event);
    events.push(event);
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log("Error while calling events for 4000="+err.message);
      });
    axios.post('http://localhost:4001/events', event).catch((err) => {
      console.log("Error while calling events for 4001="+err.message);
      });
    axios.post('http://localhost:4002/events', event).catch((err) => {
      console.log("Error while calling events for 4002="+err.message);
      });
    axios.post('http://localhost:4003/events', event).catch((err) => {
      console.log("Error while calling events for 4003="+err.message);
      });
      
    //res.sendStatus({ status: 200});
    res.status(200).send();
});

app.get('/events', (req, res) => {
  res.send(events);
})

app.listen(4005, ()=>{
    console.log('Listening on 4005');
});