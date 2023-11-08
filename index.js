const express = require('express');
const axios = require('axios');
const res = require('express/lib/response');
const app = express();
require ('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const homepage = `https://api.hubapi.com/crm/v3/objects/2-20337934?properties=book_type&properties=book_author&properties=book_pages`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
    };

try {
    const response = await axios.get(homepage, {headers});
    const data = response.data.results;
    res.render('homepage', {title: 'Book', data});
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching Books data from HubSpot.');
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.'});
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
  const { book_type, book_author, book_pages } = req.body;

  const newCustomObject = {
      properties: {
          book_type,
          book_author,
          book_pages,
      }
  };

  const createCustomObjectEndpoint = `https://api.hubspot.com/crm/v3/objects/2-20337934`;
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
      await axios.post(createCustomObjectEndpoint, newCustomObject, { headers });
      console.log('Custom object created successfully');
      res.redirect('/');
  } 
  catch (error) {
      console.error('Error creating custom object:', error);
      res.status(500).send('An error occurred while creating a custom object in HubSpot.');
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));