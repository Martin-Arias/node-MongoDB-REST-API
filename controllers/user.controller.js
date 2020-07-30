const mongoose = require('mongoose');

const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const userController = {
    
    createUser: async(req,res,next) => {
        //VERIFICA SI EL EMAIL YA EXISTE EN LA BASE DE DATOS
      try {
        const userExist = await User.findOne({email:req.body.email})
        console.log(userExist);
        if (userExist) {
            res.status(409).json({
                message: 'Usuario y/o contraseña invalido'
            })
        }else{//SI EL EMAIL NO SE ENCUENTRA ALMACENADO, CREA UN NUEVO USUARIO
            const user = new User ({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: await bcrypt.hash(req.body.password,10)
            })
            try {
                const queryResponse = await user.save()
                console.log(queryResponse);
                res.status(200).json({
                    message:'Usuario creado',
                    usuario: {
                        _id: queryResponse._id,
                        email: queryResponse.email
                    }
                })
            } catch (error) {
                res.status(500).json({
                    error: error.message
                })
            }
            console.log(user);
        }
      } catch (error) {
          res.status(500).json({
              error: error.message
          })
      }
    },
    deleteUser: async (req,res,next) => {
        const userId = req.params.userId
    
        try {
            const queryResponse = await User.deleteOne({_id:userId})
            res.status(200).json({
                message: 'Usuario eliminado'
            })
        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    
    },
    getAllUsers: async (req,res,next) => {
        try {
            const queryResponse = await User.find();
            res.status(200).json({
                queryResponse
            })
        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    }
}
module.exports = userController;