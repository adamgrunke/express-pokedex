var express = require('express');
var router = express.Router();
const axios = require('axios'); 

// notes from Steve
var db = require('../models'); // have to go up a directory and then down into models

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  // TODO: Get all records from the DB and render to view
  // call the db.pokemon.findAll
  // Get data and render it into an ejs
  db.pokemon.findAll().then(function(data){
    
   
    
    res.render('pokemon', {data});
    // res.json(pokemon);
  });
  // res.send('Render a page of favorites here');
});

// POST /pokemon - receive the name of a pokemon and add it to the database
// TODO: Get form data and add a new record to DB
// call db.pokemon.create and pass in the dat a from the form
// When the promise returns, we need to redirect to /pokemon
router.post('/', function(req, res) {
  db.pokemon.findAll().then(function(data){
    let repeatCount = 0;
    data.forEach(function(pokemon){
      if (req.body.name === pokemon.name){
        repeatCount++;
      }
    })
    if (repeatCount === 0) {
      db.pokemon.create({
        name: req.body.name
      }).then(function(data){
      })
    }    
    res.redirect('pokemon');
  });
});

// GET /pokemon id. Gets one pokemon id from the database and uses it to look up details
// about that one pokemon. 
// look up pokemon in our db by its ID. HINT: (findByPk)
// use the pokemon name from the db to query the api for 
// details on that one pokemon 
// Take data from the api and render a detal/show page for this one pokemon. 'show' or 'details' page.
// res.send('This is the route for showing one pokemon');
router.get('/:id', function(req, res) {
  var id = req.params.id;
  db.pokemon.findByPk(id).then(function(pokemon) {
    var pokemonName = pokemon.name  
    var pokemonUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    axios.get(pokemonUrl).then( function(response) {
      var pokemon = response.data;
      res.render('show', { pokemon, id });
    })   
  })
});

// Delete ONE record route 
// this currently requires Postman
router.delete('/:id', function(req, res) {
 console.log("destroy: " + parseInt(req.params.id))
  db.pokemon.destroy({
    where: {id: parseInt(req.params.id)}
  }).then(function() {
    res.redirect('/pokemon');
  });
});
// PUT /pokemon/:id
// router.put('/:id')
module.exports = router;
