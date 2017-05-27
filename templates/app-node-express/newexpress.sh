#!/usr/bin/env bash
mkdir $1
cd $1

# .gitignore
cat > .gitignore << EOF
node_modules/
npm-debug.log
.idea/
.DS_Store
.clever.json
EOF

# README.md
cat > README.md << EOF
application name: $1
EOF

# package.json
cat > package.json << EOF
{
  "name": "$1",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "node index.js"
  },
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.17.2",
    "express": "^4.15.3"
  }
}
EOF

# index.js
cat > index.js << EOF
const express = require("express");
const bodyParser = require("body-parser");

let port = process.env.PORT || 8080;

let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send({message:"😀", remark:"hello 🐼"});
})

app.get('/hello', (req, res) => {
  res.send({message:"💙", remark:"hello 🌍"});
})

app.get('/hi', (req, res) => {
  res.send({message:"🐼", remark:"hi 🌍"});
})

app.listen(port)
console.log("🌍 Web Server is started - listening on ", port)
EOF
