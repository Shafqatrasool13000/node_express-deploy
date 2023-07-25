require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        Product.deleteMany()
        Product.create({ name: "Hell" }, {
            validateBeforeSave: true
        })
        console.log('Sucesss!!!');
        process.exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);

    }
};

start();