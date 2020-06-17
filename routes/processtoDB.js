// This file fetches all quotes from the quotes API and passes them 
// to the nlp_processing file in 'nlp_processing' folder.
// Then these results get stored in a MongoDB instance, which is 
// used later to get similar quotes.
// USED in an earlier iteration of the project.Discarded in the latest version.

require('dotenv').config({path: '../.env'});
const express = require('express');
const router = express.Router();
const axios = require('axios');
const analyze = require('../nlp_processing/index.js');
const API_link = 'https://programming-quotes-api.herokuapp.com/quotes';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const client = new MongoClient(process.env.DB_CONNECT, { useNewUrlParser: true});
const connection = client.connect();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try
  {
    var result = await axios.get(API_link);
    var final_res = []
    const collection = client.db("Briq").collection("quotes");

      // Iterating through all the quotes one-by-one, calling the analyze
      // function from nlp_processing on them, and inserting them into 
      // MongoDB collection one-by-one.
      for(let i=0;i <= 500;i++)
      {
        var {_id,en,author} = result.data[i];
        var {categories,sentimentScore} = await analyze(en);
        categories.push(author)
        var processed_item = {
            _id:ObjectId(_id),
            en,
            author,
            categories,
            sentimentScore
        }
        connection.then(async () => { 
            await collection.insertOne(processed_item)
            .then(result=>{
              console.log("Document inserted")
            })
            .catch(result=>{
              console.log("Document not inserted")
            })
        });
        console.log("Passing:",i)
      }
  res.send(final_res);
  }
  catch{
  }

});

module.exports = router;
