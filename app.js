require('dotenv').config();
require('express-async-errors')

const express = require('express');
const cors = require('cors')
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session)
const app = express();

const auth = require('./src/routes/authRoutes');
const utils = require('./src/routes/utilRoutes');

const connectDB = require('./src/db/connect');
const notFound = require('./src/middleware/not-found');
const errorHandler = require('./src/middleware/error-handler');


// middleware
app.use(express.json());

// mongodb store setup for session
const store = new MongodbStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})
app.use(cors()); 1
app.use(session({
    secret: 'ev_web_secret', resave: false, saveUninitialized: false, store
}))

// routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Ev Web!</h1>');
})

app.use('/api/v1/auth', auth);
app.use('/api/v1', utils);

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
