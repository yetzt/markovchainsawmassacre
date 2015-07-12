#!/usr/bin/env node

/** import twitter archive csv **/

// node modules
var fs = require("fs");
var path = require("path");

// check if chains file exists
var CHAINSFILE = path.resolve(__dirname, "../data/chains.json");
if (!fs.existsSync(CHAINSFILE)) debug("please create data/chains.json") || process.exit();

var chains = JSON.parse(fs.readFileSync(CHAINSFILE));

var makechain = function(){
	// get chain
	var chain = ["#start"];
	while (chain[chain.length-1] !== '#end' && chain.join(' ').length < 120) {
		if (!chains[chain[chain.length-1]]) {
			chain.push("<3");
		} else {
			chain.push(chains[chain[chain.length-1]][(chains[chain[chain.length-1]].length*Math.random()|0)]);
		}
	};

	chain = chain
		.filter(function(v){
			return (v !== '#start' && v !== '#end');
		})
		.join(" ")
		.replace(/\s+\<\<(.)/g, "$1")
		.replace(/(.)\>\>\s+/g, "$1")
	
	return chain;
	
};

module.exports = makechain;

if (!module.parent) console.log(makechain());
