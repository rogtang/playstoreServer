const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));
const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { genres = "", sort} = req.query;
    
    //.includes(sort) is what the user is inputing and must be either 'rating' or 'app'
    if (sort) {
      if (!['rating', 'app'].includes(sort)) {
        return res
          .status(400)
          .send('Sort must be one of rating or app');
      }
    }

    if (genres) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)) {
          return res
            .status(400)
            .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
        }
      }


    let results = playstore
            .filter(playapp =>
              playapp
                 .Genres
                 //make title lowercase
                 .toLowerCase()
                 //make genre query lowercase
                 .includes(genres.toLowerCase()));
  
    if (sort === 'app') {
    results.sort((a, b) => {
      let x = a['App'].toLowerCase();
      let y = b['App'].toLowerCase();

      return x > y ? 1 : x < y ? -1 : 0;
    });
    }
    else if (sort === 'rating') {
    results.sort((a, b) => {
      return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
    })
  }
    res.json(results);
  });

  module.exports = app;