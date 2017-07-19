const bodyParser = require('body-parser');
const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

let db = null;
let collection = null;
async function main() {
  const DATABASE_NAME = 'cs193x-db';
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  collection = db.collection('meetings');
  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};

main();

////////////////////////////////////////////////////////////////////////////////

// TODO(you): Add at least 1 GET route and 1 POST route.

async function onSaveMeeting(req,res) {
  console.log("server.js: in on onSaveShuffle");
  const dateObj = req.body.dateObj;
  const meetingEvent = req.body.meetingEvent;
  const meetingTag = req.body.meetingTag;

  console.log('onSaveMeeting dateObj: ' + dateObj);
  const newMeeting = {
    dateObj: dateObj.toString(),
    meetingTag: meetingTag.toLowerCase(),
    meetingEvent: meetingEvent
  }
  const response = await collection.insertOne(newMeeting);
  console.log('resp ID: ' + response.insertedId);
  res.json({meetingID: response.insertedId})
}
app.post('/save',jsonParser,onSaveMeeting);

async function onGetEvents(req,res) {
  console.log("server.js: in on getEvents");
  let routeParams = req.params;
  let dateString = routeParams.date;
  let query = routeParams.query;
  console.log('dateStr: ' + dateString);
  console.log('query: ' + query);

  let dateObj = new Date(dateString);
  console.log('dateObj: ' + dateObj);

  let results = await collection.find({ dateObj: { $gte: dateString }, meetingTag: query.toLowerCase() }).toArray();
  console.log('numMeetingsFound: ' + results.length);
  res.json(results);
}
app.get('/:date/:query',onGetEvents);
