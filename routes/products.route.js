const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const checkAuth = require('../middleware/checkAuth')


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)  
    }
  });
  const fileFilter = (req, file, cb) => {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted  
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        // To accept the file pass `true`, like so:
        cb(null, true)
    }else{
         // To reject this file pass `false`, like so:
        cb(null, false)
    }
  }
  

const upload = multer({ 
      storage: storage,
      limits: {
          fileSize: 1024 * 1024 * 5 //Hasta 5 MB
      },
      fileFilter: fileFilter
    });



//Get all products
router.get('/',productController.getAllProducts);

//Create new product
router.post('/', checkAuth , upload.single('productImage'), productController.createNewProduct);

//Get product by id
router.get('/:productId', productController.getProductById);

//Delete by id
router.delete('/:productId',checkAuth,productController.deleteProductById)

//Update product 
router.patch('/:productId',checkAuth,productController.updateProduct)









module.exports = router;