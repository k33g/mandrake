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
console.log(`🌍 Web Server is started - listening on ${port}`)
