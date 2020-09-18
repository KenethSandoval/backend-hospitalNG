const { response } = require("express");
const { genSaltSync, hashSync } = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
	const desde = Number(req.query.by) || 0;

	const [usuarios, total] = await Promise.all([
		Usuario.find({}, "nombre email rol google img")
			.skip(desde) //esto es de la paginacion
			.limit(5), //limite para los datos

		Usuario.countDocuments(),
	]);

	res.json({
		ok: true,
		usuarios,
		total,
	});
};

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const existEmail = await Usuario.findOne({ email });

		if (existEmail) {
			return res.status(400).json({
				ok: false,
				msg: "Correo duplicado",
			});
		}

		const usuario = new Usuario(req.body);

		//Encriptar contraseña
		const salt = genSaltSync();
		usuario.password = hashSync(password, salt);

		const token = await generarJWT(usuario._id);

		await usuario.save();

		res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Error inesperado",
		});
	}
};

const actualizarUsuario = async (req, res = response) => {
	//TODO: validar token y comprobar si es el usuario es correcto

	const id = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(id);

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "Usuario no encontrado",
			});
		}

		//Actualizaciones
		const { password, google, email, ...campos } = req.body;

		if (usuarioDB.email !== email) {
			const existEmail = await Usuario.findOne({ email });
			if (existEmail) {
				return res.status(400).json({
					ok: false,
					msg: "Ya existe un usuario con ese email",
				});
			}
		}

		campos.email = email;
		const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, {
			new: true,
		});

		res.json({
			ok: true,
			usuario: usuarioActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado",
		});
	}
};

const eliminarUsuario = async (req, res = response) => {
	const id = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(id);

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "Usuario no encontrado",
			});
		}

		await Usuario.findByIdAndDelete(id);

		res.status(200).json({
			ok: true,
			msg: "Usuario eliminado",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado",
		});
	}
};

module.exports = {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	eliminarUsuario,
};
