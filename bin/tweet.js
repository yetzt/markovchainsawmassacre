#!/usr/bin/env node

/** send markov chain tweet **/

// node modules
var path = require("path");

// npm modules
var twitter = require("twitter");
var debug = require("debug")("mcsm");

// local modules
var generate = require(path.resolve(__dirname, "chain.js"));

// config
var config = require(path.resolve(__dirname, "../config.js"));

// get new twitter client
new twitter(config).post('statuses/update', { status: generate() },  function(err, tweet, response){
	if (err) return debug("error", err);
	debug("<3");
});