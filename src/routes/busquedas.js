/**
 * @example
 *  Ruta: /api/todo/
 */

const { Router } = require("express");
const { busqueda, collectionDocument } = require("../controllers/busquedas");
const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/:filter", validarJwt, busqueda);
router.get("/collection/:document/:filter", validarJwt, collectionDocument);

module.exports = router;
