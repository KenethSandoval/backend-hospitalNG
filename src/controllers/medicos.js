const { response } = require("express");

const Medico = require("../models/medicos");

const getMedico = async (req, res = response) => {
	const medicos = await Medico.find()
		.populate("usuario", "nombre img")
		.populate("hospital", "nombre img");

	res.json({
		ok: true,
		medicos
	});
};

const getMedicoById = async (req, res = response) => {
	try {
		const id = req.params.id;

		const medico = await Medico.findById(id)
			.populate("usuario", "nombre img")
			.populate("hospital", "nombre img");

		res.json({
			ok: true,
			medico
		});
	} catch (error) {
		console.log(error);
		res.json({
			ok: false,
			msg: "Hable con el administrador"
		});
	}
};

const crearMedico = async (req, res = response) => {
	const uid = req.id; //id del usuario (Token)

	const medico = new Medico({
		usuario: uid,
		...req.body
	});

	try {
		const medicoDB = await medico.save();
		res.json({
			ok: true,
			medico: medicoDB
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador"
		});
	}
};

const actualizarMedico = async (req, res = response) => {
	const id = req.params.id;
	const usuario = req.id;

	try {
		const medicoDB = await Medico.findById(id);

		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: "El hospital con ese id no existe"
			});
		}

		const cambiosMedico = {
			...req.body,
			usuario
		};

		const medicoActualizado = await Medico.findByIdAndUpdate(
			id,
			cambiosMedico,
			{ new: true }
		);

		res.json({
			ok: true,
			medicoActualizado
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador"
		});
	}
};

const borrarMedico = async (req, res = response) => {
	const id = req.params.id;

	try {
		const medicoDB = await Medico.findById(id);

		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: "El hospital con ese id no existe"
			});
		}

		await Medico.findByIdAndDelete(id);

		res.json({
			ok: true,
			msg: "Medico eliminado"
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador"
		});
	}
};

module.exports = {
	getMedico,
	crearMedico,
	actualizarMedico,
	borrarMedico,
  	getMedicoById
};
