const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');


//ENVIRONMENT VARIABLES
require('dotenv').config()

const productsRoutes = require('./routes/products.route');
const ordersRoutes = require('./routes/orders.route');
const userRoutes = require('./routes/users.route');


//DDBB CONNECTION
require('./dbConnection')


const app = express();
//CORS config
app.use(cors({
    origin: '*',
    methods: ['GET','POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: 'content-Type, Authorization, Origin, X-Requested-With, Accept'
}))


//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

//Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users',userRoutes)


//Error handler
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next) => {    
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;
