import { handler } from './LoadMoreStoryItemsLambda';
import fs from 'fs';

// Read the contents of payload.json
const payloadData = fs.readFileSync('./src/lambda/payload.json', 'utf-8');

// Parse the JSON data into a JavaScript object
const payload = JSON.parse(payloadData);

// Invoke the RegisterHandler function with the payload
handler(payload)
  .then((response) => {
    // Handle the response
    console.log(response);
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });