const { response } = require("express");
const bcrypt = require("bcryptjs");

const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");
const { googleVerify } = require("../helpers/google-signin");
const { getMenuFrontend  } = require("../helpers/menu-frontend");

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

		res.json({
			ok: true,
			token,
		        menu: getMenuFrontend(usuarioDB.rol)
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
		}

		//Guardar en DB
		await usuario.save();
		const token = await generarJWT(usuario._id);

		res.json({
			ok: true,
			token,
		        menu: getMenuFrontend(usuario.rol)
		});
	} catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token invalido'
        })
    }
};

const renewToken = async (req, res = response) => {
	const id = req.id;

	const token = await generarJWT( id );

	const usuario = await Usuario.findById( id );
	res.json({
		ok: true,
		token,
		usuario,
	  	menu: getMenuFrontend(usuario.rol)
	});
}

module.exports = {
	logIn,
	googleSignIn,
	renewToken
};
