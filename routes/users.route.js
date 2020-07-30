const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('../models/user.model');
const bcrypt = require('bcrypt');

//CREATE NEW USER
router.post('/signup', userController.createUser)

//DELETE USER
router.delete('/:userId', userController.deleteUser)

//GET ALL USERS 
router.get('/all', userController.getAllUsers)

//LOGIN USER
router.post('/login', async (req, res, next) => {
    try {
        const userData = await User.findOne({ email: req.body.email })
        if (userData) {
            bcrypt.compare(req.body.password, userData.password, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: err
                    })
                };
                if (result) {
                    //GENERO UN TOKEN DE ACCESO
                 const token = jwt.sign({
                        email:userData.email,
                        userId:userData._id
                    },
                    process.env.TOKEN_KEY,//!! PONER EN UN ARCHIVO .ENV
                    {
                        expiresIn: "1h"
                    }
                    );
                    res.status(200).json({
                        message: 'Usuario loguado',
                        token: token //No hace falta escribir token 2 veces
                    })
                } else {
                    res.status(401).json({
                        message: 'Usuario y/o contraseña invalido'
                    })
                }
            })

        } else {
            res.status(401).json({
                message: 'Usuario y/o contraseña invalido'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})
module.exports = router