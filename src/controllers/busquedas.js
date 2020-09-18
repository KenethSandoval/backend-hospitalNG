const { response } = require("express");

const Usuario = require("../models/usuario");
const Hospital = require("../models/hospital");
const Medico = require("../models/medicos");

const busqueda = async (req, res = response) => {
	const search = req.params.filter;
	const regex = new RegExp(search, "i"); //'i' para hacer insensible la busqueda

	const [usuarios, hospital, medico] = await Promise.all([
		Usuario.find({ nombre: regex }),
		Hospital.find({ nombre: regex }),
		Medico.find({ nombre: regex }),
	]);

	res.json({
		ok: true,
		usuarios,
		hospital,
		medico,
	});
};

const collectionDocument = async (req, res = response) => {
	const collection = req.params.document;
	const search = req.params.filter;
	const regex = new RegExp(search, "i"); //'i' para hacer insensible la busqueda
	let data = [];

	switch (collection) {
		case "medicos":
			data = await Medico.find({ nombre: regex })
				.populate("usuario", "nombre img")
				.populate("hospital", "nombre img");
			break;

		case "usuarios":
			data = await Usuario.find({ nombre: regex });
			break;
		case "hospitales":
			data = await Hospital.find({ nombre: regex })
				.populate("usuario", "nombre img");
			break;
		default:
			return res.status(400).json({
				ok: false,
				msg: "el path debe ser /medicos, /hospitales o /usuarios",
			});
	}

	res.json({
		ok: true,
		resultado: data,
	});
};

module.exports = {
	busqueda,
	collectionDocument,
};
