#!/usr/bin/env node

/** import twitter archive csv **/

// node modules
var fs = require("fs");
var path = require("path");

// npm modules
var sv = require("sv");
var ent = require("ent");
var debug = require("debug")("mcsm");

// check for piped stdin
if (process.stdin.isTTY) debug("please provide data on stdin") || process.exit();

// filter and tokenizer
function f(str) {
	
	// decode entities
	str = ent.decode(str);
	
	// blank out mentions and retweets
	if (/^(@|RT )/.test(str)) return null;
	
	// lowercase
	str = str.toLowerCase();
	
	// remove cc
	str = str.replace(/\/cc.*$/,'');

	// filter foursquare places
	str = str.replace(/\(@[^\)]+\)/,'');

	// fix some characters
	str = str.replace(/[„“”]+/g,'"');

	// filter mentions, hashtags, links
	str = str.split(/\s+/g);
	str = str.filter(function(v){
		if (/^https?:\/\//.test(v)) return false;
		if (/^#/.test(v)) return false;
		if (/^\/?@/.test(v)) return false;
		if (!/[a-z0-9]/i.test(v)) return false;
		if (v === "") return false;
		return true;
	});

	// plenkify
	str = str.map(function(v){
		v = v.replace(/\:$/, ' <<:');
		v = v.replace(/\,$/, ' <<,');
		v = v.replace(/\!$/, ' <<!');
		v = v.replace(/\.$/, ' <<.');
		v = v.replace(/"( \.)?$/, ' <<"$1');
		v = v.replace(/^"/, '">> ');
		return v;
	});

	if (str.length === 0) return null;

	// rejoin
	str = str.join(" ");

	return str;
};

var data = {};

process.stdin.pipe(new sv.Parser().on("data", function(chunk){
	
	// get filtered text
	var tweet = f(chunk.text);
	if (tweet === null) return;
	
	// make bigrams
	var bigrams = [];
	tweet.split(/\s+/g).forEach(function(v,i,a){
		if (i === 0) {
			// start bigram
			bigrams.push(["#start", v]);
		} else if (i === (a.length-1)) {
			// end bigram
			bigrams.push([a[i-1], v]);
			if (v !== "<<:") bigrams.push([v, "#end"]);
		} else {
			bigrams.push([a[i-1], v]);
		}
	});
	
	// add bigrams to data
	bigrams.forEach(function(bg){
		if (!data.hasOwnProperty(bg[0])) data[bg[0]] = [];
		data[bg[0]].push(bg[1]);
	});
			
	
}).on("end", function(){
	
	// end of input
	// process.stdout.write(JSON.stringify(data));
	fs.writeFile(path.resolve(__dirname, "../data/chains.json"), JSON.stringify(data), function(){
		debug("done :)");
	});
	
}));