# Markov Chainsaw Massacre

a markov twitter bot. hacked together on a train. just for the fun of it.

## Setup

1. get your twitter archive
2. `node bin/import.js < /path/to/your/tweets.csv`
3. `cp config.js.dist config.js`
4. [create a twitter app and generate yourself an access token](https://apps.twitter.com/)
5. put those in config.js

## Usage

### Generate a chain

`node bin/chain.js`

### Tweet a chain

`node bin/tweet.js`

