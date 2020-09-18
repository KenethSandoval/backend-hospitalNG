const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medicos");
const Hospital = require("../models/hospital");

let pathViejo = "";

const subirImagen = async (modelos, id, nombreArchivo, tipo) => {
	const model = await modelos.findById(id);
	if (!model) {
		console.log(`${modelos} no encontrado`);
		return false;
	}

	pathViejo = `src/uploads/${tipo}/${model.img}`;

	if (fs.existsSync(pathViejo)) {
		//borrar imagen anterior
		fs.unlinkSync(pathViejo);
	}

	model.img = nombreArchivo;

	await model.save();
	return true;
};

const actualizarImagen = async (filter, id, nombreArchivo) => {
	tipos = ['medicos', 'hospitales', 'usuarios'];

	switch (filter) {
		case "medicos":
			subirImagen(Medico, id, nombreArchivo, tipos[0]);
			break;
		case "hospitales":
            subirImagen(Hospital, id, nombreArchivo, tipos[1]);
			break;
		case "usuarios":
            subirImagen(Usuario, id, nombreArchivo, tipos[2]);
			break;
		default:
			console.error('Error al subir imagen');
			break;
	}
};

module.exports = {
	actualizarImagen,
};
