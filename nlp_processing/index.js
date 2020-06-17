// This file exports a function which analyses text and entities in a text.

require('dotenv').config({path: '../.env'});
const language = require('@google-cloud/language');
const API_link = 'https://programming-quotes-api.herokuapp.com/quotes';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const client = new MongoClient(process.env.DB_CONNECT, { useNewUrlParser: true});
const connection = client.connect();

async function processtoDB()
{
  var result = await axios.get(API_link);
  const collection = client.db("Briq").collection("quotes");

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
  return 'The function has started putting data in the database';
}

async function analyze(text) {
    // Name of Project on Google Cloud Platform
    const projectId = 'quote-similarity';

    // Path to Private key of Service Account related to the project on
    // Google Cloud Platform. Use own private key.
    const keyFilename = `./Quote similarity-3d8976df566b.json`
       

    // Instantiates a client
    const client = new language.LanguageServiceClient({projectId,keyFilename});
  
    // The text to analyze
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment and entities of the text
    const [result] = await client.analyzeEntities({document});
    const sentimentresult = await client.analyzeSentiment({document});
    const categories = [];
    result.entities.forEach( category => {
        categories.push(
            category.name
        )
    });
    return {
      categories,
      sentimentScore:sentimentresult[0].documentSentiment.score
    };
  }

processtoDB();
