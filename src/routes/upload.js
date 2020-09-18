/**
 * @example
 *  Ruta: /api/uploads
 */

const { Router } = require("express");
const expressFileUpload = require("express-fileupload");

const { fileUpload, retornarImagen } = require("../controllers/upload");

const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();
 
router.use(expressFileUpload());

router.put("/:filter/:id", validarJwt, fileUpload);
router.get("/:filter/:foto", retornarImagen);

module.exports = router;
