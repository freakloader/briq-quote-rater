// This file contains router handler for the vote endpoint.
// Not used in project

const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_link = 'https://programming-quotes-api.herokuapp.com/quotes/vote';

/* POST vote to quote API . */
router.post('/', async (req, res) => {
  var  {quoteId,newVote} = req.body;
  try
  {
      axios.post(API_link,{quoteId,newVote})
        .then(result=> {
            console.log(result.data);
            res.send(result.data);
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        });
  }
  catch(err)
  {
    res.send(err);
  }
});

module.exports = router;
