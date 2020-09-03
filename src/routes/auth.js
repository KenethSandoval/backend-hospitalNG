/*
 *  Ruta: /api/auth
 */

const { Router } = require("express");
const { logIn } = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/",
	[
		check("email", "El email es obligatorio").isEmail(),
        check("password", "El password es obligatorio").not().isEmpty(),
        validarCampos
	],
	logIn
);

module.exports = router;
