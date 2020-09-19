/*
 *  Ruta: /api/auth
 */

const { Router } = require("express");
const { logIn, googleSignIn, renewToken } = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJwt } = require('../middlewares/validar-jwt');

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

router.get("/renew", validarJwt ,renewToken);

router.post(
	"/google",
	[
        check("token", "El token es obligatorio").not().isEmpty(),
        validarCampos
	],
	googleSignIn
);

module.exports = router;
