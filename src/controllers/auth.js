const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

const logIn = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales invalidas'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales invalidas'
            });
        }
        
        //Generar token
        const token = await generarJWT( usuarioDB._id );
        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

module.exports = {
    logIn
};