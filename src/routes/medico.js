/**
 * @example
 * ruta: '/api/hospitales'
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJwt } = require("../middlewares/validar-jwt");
const {
	getMedico,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require("../controllers/medicos");

const router = Router();

router.get("/", getMedico);

router.post("/", [
    validarJwt,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
], crearMedico);

router.put("/:id", [], actualizarMedico);

router.delete("/:id", borrarMedico);

module.exports = router;
