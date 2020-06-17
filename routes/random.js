// This file contains router handler for the random endpoint.
// The frontend hits this endpoint to fetch random results.

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const client = MongoClient(process.env.DB_CONNECT, { useNewUrlParser: true});
const connection = client.connect();
const DB_SIZE = 501;


/* GET Random quote from DB. */
router.get('/', async (req, res) => {
  try
  {
      const randnum = Math.floor(Math.random() * DB_SIZE);
      const collection = client.db("Briq").collection("quotes");
      connection.then( async () => { 
         // Skipping the cursor in the DB by a random number and limiting
         // the results to 1 record and converting it to an array.
         var result = await collection.find()
                      .limit(1).skip(randnum).toArray(); 
         res.send({
            resultLength:result.length,
            result:result[0]
         });
      });
  }
  catch(err)
  {
    res.send(err);
  }
});

module.exports = router;
