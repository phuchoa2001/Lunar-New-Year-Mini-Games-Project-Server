const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const dotenv = require("dotenv");
const http = require('http');
const app = express();
const server = http.createServer(app);
dotenv.config();
const route = require('./routers')
const db = require('./config/db')
const methodOverride = require('method-override')
app.use(methodOverride('X-HTTP-Method-Override'))
dotenv.config();
//conneact DB
db.connect();
app.use(cors())
app.use(morgan('combined'))
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
route(app);
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

server.listen(process.env.PORT || 3001, () => {
  console.log('Server đang chay tren cong ' + process.env.PORT);
  console.log("app");
});
