require('dotenv').config();
require('express-async-errors')

const express = require('express');
const app = express();

const products = require('./routes/products');
const users = require('./routes/users');

const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');


// middleware
app.use(express.json());

// routes
app.get('/', () => {
    res.send('Hello World')
})
app.use('/api/v1/products', products);
app.use('/api/v1', users);

app.use(notFound);
app.use(errorHandler)



const port = process.env.PORT || 5000;

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
