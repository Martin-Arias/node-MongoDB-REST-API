const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const orderControler = {

    //GET ALL ORDERS
    getAllOrders: async (req, res, next) => {
        try {
            const queryResponse = await Order.find().select('quantity productId _id').populate('productId', 'name price _id');
            if (queryResponse.length > 0) {
                const serverResponse = {
                    count: queryResponse.length,
                    orders: queryResponse.map(queryResponse => {
                        return {
                            quantity: queryResponse.quantity,
                            product: queryResponse.productId,
                            _id: queryResponse._id,
                            request: {
                                type: 'GET',
                                URL: `${req.get('host')}/orders/${queryResponse._id}`
                            }
                        }
                    })
                };
                res.status(200).json(serverResponse);
            } else {
                res.status(404).json({
                    message: 'No hay ordenes aun'
                });
            };
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },

    //CREATE NEW ORDER
    createNewOrder: async (req, res, next) => {
        const queryId = req.body.productId
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            productId: req.body.productId
        });
        //PRIMERO VERIFICO QUE EL PRODUCTO EXISTA EN LA BASE DE DATOS, ANTES DE CREAR LA ORDEN
        try {
            const productExist = await Product.findById(queryId)
            console.log(productExist);
            if (productExist) { //SI EL PRODUCTO EXISTE CREA LA ORDEN
                try {
                    const queryResponse = await order.save()
                    console.log(queryResponse);
                    res.status(201).json({
                        message: 'Orden creada exitosamente',
                        createdOrder: {
                            quantity: queryResponse.quantity,
                            product: queryResponse.productId,
                            _id: queryResponse._id
                        },
                        request: {
                            type: 'GET',
                            URL: `${req.get('host')}/orders/${queryResponse._id}`
                        }
                    });
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        message: error.message
                    })
                }

            } else { //SI EL PRODUCTO NO EXISTE LE INFORMA AL USUARIO, Y ENVIA UN LINK A TODOS LOS PRODUCTOS
                res.status(404).json({
                    message: 'El producto ingresado no existe',
                    request: {
                        type: 'GET',
                        URL: `${req.get('host')}/orders`
                    }
                })
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }

    },

    //GET ORDER BY ID
    getOrderById: async (req, res, next) => {
        const orderId = req.params.orderId
        try {
            const queryResponse = await Order.findById(orderId).select('quantity productId _id').populate('productId', 'name price _id');
            console.log(queryResponse);
            if (queryResponse) {
                const serverResponse = {
                    quantity: queryResponse.quantity,
                    product: queryResponse.productId,
                    _id: queryResponse._id
                }
                res.status(200).json(serverResponse)
            } else {
                res.status(404).json({
                    message: 'El id ingresado es incorrecto o no existe'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },

    //DELETE ORDER 
    deleteOrder: async (req, res, next) => {
        const orderId = req.params.orderId;
        try {
            const queryResponse = await Order.deleteOne({
                _id: orderId
            })
            console.log(queryResponse);
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    description: 'Create new order',
                    URL: `${req.get('host')}/orders`,
                    body: {
                        quantity: 'Number',
                        productId: 'ProductId'
                    }
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            })
        }
    }

}

module.exports = orderControler;