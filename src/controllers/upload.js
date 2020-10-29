const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {
	const { filter, id } = req.params;

	const tiposValidos = ["hospitales", "medicos", "usuarios"];
	
	if (!tiposValidos.includes(filter)) {
		return res.status(400).json({
			ok: false,
			msg: "No es un medico, usuario u hospital",
		});
	}

	//validar que exista un archivo
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({
			ok: false,
			msg: "No se hay ningun archivo",
		});
	}

	//procesar la imagen...

	const file = req.files.imagen;
	const nombreCortado = file.name.split(".");
	const extensionArchivo = nombreCortado[nombreCortado.length - 1];

	const extensionesValidas = ["png", "jpg", "jpeg", "gif"];

	if (!extensionesValidas.includes(extensionArchivo)) {
		return res.status(400).json({
			ok: false,
			msg: `La extension .${extensionArchivo} no es valida`,
	});
    }
    
	// generar el nombre del archivo
	const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

	//path para mover la imagen
	const path = `src/uploads/${filter}/${nombreArchivo}`;

	//mover imagen
	file.mv(path, (err) => {
		if (err) {
			console.log(err);
			res.status(500).json({
				ok: false,
                msg: "Error al subir la imagen",
	});
      }
        
        actualizarImagen(filter, id, nombreArchivo);

		res.json({
			ok: true,
			msg: "Imagen subida",
			nombreArchivo,
		});
	});
};

const retornarImagen = (req, res = response) => {
	const { filter, foto } = req.params;

	const pathImg = path.join(__dirname,  `../uploads/${filter}/${foto}`);

	if( fs.existsSync(pathImg) ){
		res.sendFile(pathImg);
	}else {
		const pathImg = path.join(__dirname, '../uploads/no-img.jpg');
		res.sendFile(pathImg);
	}
} 

module.exports = {
	fileUpload,
	retornarImagen
};
