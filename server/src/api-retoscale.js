const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const {sequelize} = require('./models');
const morgan = require('morgan');
const config = require('./config/config');


const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


require('./routes')(app);

sequelize.sync({force: false})
    .then(() => {
    app.listen(config.port);
console.log(`Server started on port ${config.port}`)
});
