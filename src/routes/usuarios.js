/*
 *  Ruta: /api/usuarios
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require("../controllers/usuarios");
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJwt, getUsuarios);

router.post(
	"/",
	[
		check("nombre", 'Nombre es requerido').not().isEmpty(),
		check("password", 'Contraseña es requerida').not().isEmpty(),
        check("email", 'Correo invalido').isEmail(),
        validarCampos
	],
	crearUsuario
);

router.put(
	"/:id", 
	[
		validarJwt,
		check("nombre", 'Nombre es requerido').not().isEmpty(),
		check("email", 'Correo invalido').isEmail(),
		check("rol", 'Rol invalido').not().isEmpty(),
		validarCampos
	],
	actualizarUsuario
	);

router.delete("/:id", validarJwt, eliminarUsuario);

module.exports = router;
