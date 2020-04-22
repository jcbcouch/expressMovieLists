const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../config/auth');

require('../models/User');
const User = mongoose.model('user');
require('../models/List');
const Movie = mongoose.model('movie');

router.post('/search', (req, res) => {
    let url = `http://www.omdbapi.com/?&apikey=16c8b15a&s=${req.body.movieSearch}`;
    fetch(url)
    .then(res => res.json())
    .then(body => {
        console.log(body)
        res.render('movie/list', {body: body.Search})});
});

router.get('/details/:id', (req, res) => {
    let url = `http://www.omdbapi.com/?&apikey=16c8b15a&i=${req.params.id}`; 
    fetch(url)
    .then(res => res.json())
    .then(body => {
        res.render('movie/details', {body: body})});
});

router.get('/save/:movieid', ensureAuthenticated, (req, res) => {
    let movieId = req.params.movieid;
    Movie.find({ user: req.user.id })
    .then(list => {
        list.forEach(list=>list.movieId = req.params.movieid);
        res.render('list/savetolist', { list, movieId })
    })
});

router.get('/savetolist/:listid/:movieid', ensureAuthenticated, (req, res) => {
    let url = `http://www.omdbapi.com/?&apikey=16c8b15a&i=${req.params.movieid}`;
    fetch(url)
    .then(res => res.json())
    .then(body => { 

    Movie.findOne({ _id: req.params.listid })
    .then(list => {
        list.movies.unshift({imdbID: req.params.movieid, title: body.Title, poster: body.Poster});
        list.save().then(list => {
            
            res.redirect('/user/list');
        })
        })
        })
        });

module.exports = router;