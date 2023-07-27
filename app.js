require('dotenv').config();
require('express-async-errors')

const express = require('express');
const cors = require('cors')
const app = express();

const products = require('./routes/products');
const users = require('./routes/users');
const utils = require('./routes/utils');

const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');


// middleware
app.use(express.json());
app.use(cors())
// routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome!</h1>');
})
app.use('/api/v1/products', products);
app.use('/api/v1/auth', users);
app.use('/api/v1', utils);

app.use(notFound);
app.use(errorHandler)



const port = process.env.PORT || 6000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
