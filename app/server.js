const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const routes = require('./routes');
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
routes(app)
const port = 3000
app.listen(port, () => {
    console.log("listening to port", port)
})
