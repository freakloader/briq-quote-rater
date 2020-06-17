const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const cors = require('cors');

const homeDBRouter = require('./routes/home');
const processtoDBRouter = require('./routes/processtoDB');
const randomRouter = require('./routes/random');
const similarRouter = require('./routes/similar');
const oppRouter = require('./routes/opposite');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// This endpoint was used to GET all quotes from the quotes API,
// put them through the NLP API and get their entities and sentiment,
// and then put this data to a MongoDB collection.
app.use('/api/processtoDB', processtoDBRouter);

// This endpoint was used to GET random quote from MongoDB collection
app.use('/api/random', randomRouter);

// This endpoint was used to fetch similar quotes from MongoDB collection
// through POST
app.use('/api/similar', similarRouter);

// This endpoint was used to fetch similar quotes from MongoDB collection
// through POST
app.use('/api/opposite', oppRouter);

//Production mode
if(process.env.NODE_ENV === 'production')
{  
  app.use(express.static('frontend/build'));
}

app.get('*', (req, res) => {
  res.sendfile(path.resolve(__dirname,'frontend','build','index.html'));
})

app.listen(PORT,() =>{
  console.log(`Listening to ${PORT}`);
})
