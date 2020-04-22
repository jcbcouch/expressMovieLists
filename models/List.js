const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const listSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required:true
  },
  movies: [
    {
      imdbID: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        required: true
      }
    }
  ]
});

mongoose.model('movie', listSchema);