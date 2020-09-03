const jwt = require('jsonwebtoken');

const validarJwt = (req, res, next) => {
	//Leer el token
	const token = req.header("x-token");

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: "No hay token",
		});
    }
    
    try {
        
        const { id } = jwt.verify( token, process.env.JWT_SECRET );
        req.id = id;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token invalido"
        });
    }
};

module.exports = {
	validarJwt,
};
