const mongoose = require('mongoose');
const Product = require('../models/product.model');




const productController = {

    //GET ALL PRODUCTS
    getAllProducts:  async (req, res, next) => {   
        try {
           queryResponse = await Product.find().select('name price _id productImage') 
                console.log(queryResponse);
                if (queryResponse.length > 0) {
                    const serverResponse = {
                        count: queryResponse.length,
                        products: queryResponse.map( queryResponse => {
                            return {
                                name: queryResponse.name,
                                price: queryResponse.price,
                                _id: queryResponse._id,
                                productImage: queryResponse.productImage,
                                request: {
                                    type: 'GET',
                                    URL: `${req.get('host')}/products/${queryResponse._id}`
                                }
                            }
                        })
                    };
                    res.status(200).json(serverResponse);
                }else{
                    res.status(404).json({
                        message: 'No products found'
                    });
                };
             
        } catch (err) {
            console.log(err);
             res.status(500).json(err.message)
        };
       
    },

    /*CREATE PRODUCT

    PARA CREAR UN PRODUCTO SE DEBEN ENVIAR LOS DATOS POR UNA PETICION POST
    name: String
    price: Number
    productImage: image/jpeg || image/png

    ADEMAS EL TOKEN DE AUTHORIZATION DEBE ESTAR ALMACENADO EN HEADERS 
    SE PUEDE CREAR UN TOKEN AL LOGUEARSE

    */
    //CREATE NEW PRODUCT
    createNewProduct: async (req, res, next) => {
        console.log(req.file);
        if (req.file) {
            const product = new Product({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path
            });

            try {
                const queryResponse = await product.save()
                console.log(queryResponse);
                res.status(201).json({
                    message: 'Producto creado exitosamente',
                    createdProduct: {
                        name: queryResponse.name,
                        price: queryResponse.price,
                        _id: queryResponse._id,
                        productImage: queryResponse.productImage,
                        request: {
                            type: 'GET',
                            URL: `${req.get('host')}/products/${queryResponse._id}`
                        }
          
                    }
                });
              } catch (error) {
                  console.log(error);
                  res.status(500).json({
                      message: error.message
                  })
              }
        
        }else{
            res.status(500).json({
                message: 'La imagen es obligatoria !'
            })
        }
       

       
    },
    //GET PRODUCT BY ID
    getProductById: async (req, res, next) => {
        const id = req.params.productId
        try {
            const queryResponse = await Product.findById(id).select('name price _id productImage')
            console.log(queryResponse);
            if (queryResponse) {
                serverResponse = {
                    name: queryResponse.name,
                    price: queryResponse.price,
                    _id: queryResponse._id,
                    productImage: queryResponse.productImage,
                    request: {
                        type: 'POST',
                        description: 'Create new product',
                        URL: `${req.get('host')}/products`,
                        body: {
                            name:'String',
                            price:'Number',
                            productImage: 'image/jpeg || image/png'
                        }
                    }
                }
                res.status(200).json(serverResponse);
            } else {
                res.status(404).json({
                    message: 'Product doesnt exists'
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message
            })
        }
       
    },
    //DELETE PRODUCT
    deleteProductById: async (req, res, next) => {
        const id = req.params.productId
        try {
          const queryResponse = await Product.deleteOne({_id:id})
          console.log(queryResponse);
          res.status(200).json({
             message: 'Product deleted',
             request: {
                type: 'POST',
                description: 'Create new product',
                URL: `${req.get('host')}/products`,
                body: {
                    name:'String',
                    price:'Number'
                }
            }
          })
        } catch (error) {
            console.log(error);
            res.status(500).json({
              message: error.message
            })
        }
    },
    
    /*UPDATE PRODUCT

    PARA ACTUALIZAR UN PRODUCTO SE DEBEN ENVIAR LOS DATOS POR UNA PETICION PATCH A LA RUTA /products/:productId
    NO ES NECESARIO ENVIAR TODOS LOS CAMPOS, SOLO LOS QUE SE DESEE ACTUALIZAR

    name: String
    price: Number
    productImage: image/jpeg || image/png

    ADEMAS EL TOKEN DE AUTHORIZATION DEBE ESTAR ALMACENADO EN HEADERS 
    SE PUEDE CREAR UN TOKEN AL LOGUEARSE

    */
    //UPDATE PRODUCT
    updateProduct: async (req,res,next) => {
        const id = req.params.productId
        const fieldsToUpdate = req.body
        console.log(req.body);
        try {
            const queryResponse = await Product.updateOne({_id:id},fieldsToUpdate);
            console.log(queryResponse);
              res.status(200).json({
                 message: 'Producto actualizado',
                 request: {
                     type: 'GET',
                     description: 'Ver el producto modificado',
                     URL:`${req.get('host')}/products/${id}`,
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

module.exports = productController


/*UPDATE PRODUCT

PARA ACTUALIZAR UN PRODUCTO SE DEBEN ENVIAR LOS DATOS POR UNA PETICION POST
NO ES NECESARIO ENVIAR TODOS LOS CAMPOS, SOLO LOS QUE SE DESEE ACTUALIZAR

name: String
price: Number
productImage: image/jpeg || image/png

ADEMAS EL TOKEN DE AUTHORIZATION DEBE ESTAR ALMACENADO EN HEADERS 
SE PUEDE CREAR UN TOKEN AL LOGUEARSE

*/