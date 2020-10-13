const express = require('express');
const morgan = require('morgan');
const app = express();
const store = require('./store');
const cors = require('cors')
const helmet = require('helmet')

require('dotenv').config()

app.use(morgan());
app.use(helmet())
app.use(cors())
console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next();
})

function handleGetMovie(req, res) {
  const { genre = '', country = '', avg_vote = '' } = req.query;

  let response = store;
  if (genre) {
    response = response.filter(movie => {
      let genreIteration = movie.genre.toLowerCase();
      return genreIteration.includes(genre.toLowerCase())
    })
  }

  if (country) {
    response = response.filter(movie => {
      let countryIteration = movie.country.toLowerCase();
      return countryIteration.includes(country.toLowerCase())
    })
  }

  if (avg_vote) {

    response = response.filter(movie => {
      let avg_voteIteration = movie.avg_vote;
      if (avg_voteIteration >= avg_vote) {
        return movie
      }
    })
  }
  console.log(response)
  res.json(response)
}
app.get('/movie', handleGetMovie)

app.listen(8000, () => console.log('listening at port 8000'))