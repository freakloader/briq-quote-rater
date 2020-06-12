// This file contains router handler for the similar endpoint.
// The frontend hits this endpoint to fetch similar results.

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const client = MongoClient(process.env.DB_CONNECT, { useNewUrlParser: true});
const connection = client.connect();

/* POST Similar quote from DB. */
router.post('/', async (req, res) => {
    try
    {
      const collection = client.db("Briq").collection("quotes");
      var {categories,sentimentScore,usedQuotes} = req.body;

      // Used for converting array of quote IDs to array of ObjectIDs
      // if usedQuotes array is a truthy value
      if(usedQuotes)
        usedQuotes = usedQuotes.map(item => ObjectId(item));
      
      // If sentiment of liked quote is greater than 1(positive sentiment),
      // then it means user wants a quote with a similar sentiment(positive sentiment), 
      // then do a decreasing sort otherwise do an increasing sort .
      var sentimentSort = sentimentScore >= 0 ? -1 : 1;
        
      connection.then(async () => {
        // Aggregation pipeline
        var result = await collection.aggregate([
            {$match:{"categories":{$in:categories},"_id":{$nin:usedQuotes}}},
            {$project:{"_id":true,"en":true,"author":true,"categoryCopy":"$categories","categories":true,"sentimentScore":true}},
            {$unwind:"$categories"},
            {$match:{"categories":{$in:categories}}},
            {$group:{"_id":"$_id","en":{$first:"$en"},"author":{$first:"$author"},"noOfMatches":{$sum:1},"categories":{$first:"$categoryCopy"},"sentimentScore":{$first:"$sentimentScore"}}},
            {$sort:{"sentimentScore":sentimentSort,"noOfMatches":-1}},
            {$project:{"_id":true,"en":true,"author":true,"noOfMatches":true,"categories":true,"sentimentScore":true}}
        ]).toArray();
        res.send({
          resultLength:result.length,
          result:result[0]
        });
      });
  }
  catch(err)
  {
    console.log(err)
    res.send(err);
  }
});

module.exports = router;
