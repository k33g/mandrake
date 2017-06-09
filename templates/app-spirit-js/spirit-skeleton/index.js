const {adapter} = require("spirit").node
const route = require("spirit-router")

const hello = () => {
  return "Hello 🌍!"
}

const hi = (url, method) => {
  return "👋 Hi from " + method + " " + url
}

const app = route.define([
    route.get("/", [], hello)
  , route.get("/hi", ["url", "method"], hi)
])

let port = process.env.PORT || 8080;
const http = require("http")
const server = http.createServer(adapter(app))
server.listen(port)
console.log("🌍 Spirit web application is started - listening on ", port)
