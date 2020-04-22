const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../config/auth');

require('../models/User');
const User = mongoose.model('user');
require('../models/List');
const Movie = mongoose.model('movie');

router.get('/', (req, res) => {
    res.send('working');
});

router.get('/login', (req, res) => {
    res.render('users/login', {title: 'login'})
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    let errors = [];
  
    if(req.body.password != req.body.password2){
      errors.push({text:'Passwords do not match'});
    }
  
    if(req.body.password.length < 4){
      errors.push({text:'Password must be at least 4 characters'});
    }
  
    if(errors.length > 0){
      res.render('users/register', {
        errors: errors,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2
      });
    } else {
      User.findOne({username: req.body.username})
        .then(user => {
          if(user){
            req.flash('error_msg', 'Email already regsitered');
            res.redirect('/user/register');
          } else {
            const newUser = new User({
              name: req.body.name,
              username: req.body.username,
              password: req.body.password
            });
            
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/user/login');
                  })
                  .catch(err => {
                    console.log(err);
                    return;
                  });
              });
            });
          }
        });
    }
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next);
  });

  router.get('/newlist', ensureAuthenticated, (req, res) => {
    res.render('list/createlist');
  })

  router.post('/newlist', ensureAuthenticated, (req, res) => {
    const newList = {
      name: req.body.movielist,
      user: req.user.id
    };
    new Movie(newList)
    .save()
    .then(movie => {
      req.flash('success_msg', 'new list created');
      res.redirect('/');})
  });

  router.get('/list', ensureAuthenticated, (req, res) => {
    Movie.find({ user: req.user.id })
    .then(list => {
      res.render('list/mylist', {list})
  })
  });

  router.get('/list/id/:listid', ensureAuthenticated, (req, res) => {
    Movie.findOne({ _id: req.params.listid })
    .then(list => {
      list.movies.forEach(movie => movie.listid = req.params.listid);
      res.render('list/moviesinlist', {list})})
  });

  router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    Movie.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Video playlist removed');
      res.redirect('/');
    })
  });

  router.get('/deletemovie/:listid/:movieid', ensureAuthenticated, (req, res) => {
    Movie.findOne({ _id: req.params.listid })
    .then(list => {
      list.movies = list.movies.filter(movie => movie._id != req.params.movieid);
      console.log(list.movies);
      console.log(req.params.movieid);
      list.save();
      
    })
    res.redirect('/user/list');
  });

  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });


module.exports = router;