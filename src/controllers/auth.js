const { response } = require("express");
const bcrypt = require("bcryptjs");

const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");
const { googleVerify } = require("../helpers/google-signin");

const logIn = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//Verificar email
		const usuarioDB = await Usuario.findOne({ email });

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "Credenciales invalidas",
			});
		}

		//Verificar contraseña
		const validPassword = bcrypt.compareSync(password, usuarioDB.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Credenciales invalidas",
			});
		}

		//Generar token
		const token = await generarJWT(usuarioDB._id);
		res.status(200).json({
			ok: true,
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado",
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const googleToken = req.body.token;

	try {
		const { name, email, picture } = await googleVerify(googleToken);

		const usuarioDB = await Usuario.findOne({ email });
		let usuario;

		if (!usuarioDB) {
			usuario = new Usuario({
				nombre: name,
				email,
				password: "@@@",
				img: picture,
				google: true,
			});
		} else {
			// existe usuario
			usuario = usuarioDB;
			usuario.google = true;
			usuario.password = "@@@";
		}

		//Guardar en DB
		await usuario.save();
		const token = await generarJWT(usuario._id);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token invalido'
        })
    }
};

module.exports = {
	logIn,
	googleSignIn,
};
