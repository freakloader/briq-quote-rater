// This file exports a function which analyses text and entities in a text.

require('dotenv').config({path: '../.env'});
const language = require('@google-cloud/language');

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
module.exports = analyze;
