const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

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

const validarADMIN_ROL = async (req, res, next) => {
  const id = req.id;

  try{
     const usuarioDB = await Usuario.findById(id);

     if(!usuarioDB) {
     	return res.status(404).json({
	   ok: false,
	   msg: 'El usuario no existe'
	})
     }

    if(usuarioDB.rol !== 'ADMIN_ROL' ){
	return res.status(403).json({
 	   ok: false,
	   msg: 'No tienes privilegios de administrador'
	});
    }

    next();
   }catch(error) {
     console.log(error);

     return res.status(500).json({
	ok: false,
        msg: 'Hable con el administrado'
     });
   }
}

const validarADMIN_ROL_ACTUALIZAR = async (req, res, next) => {
  const id = req.id;
  const uid = req.params.id;

  try{
     const usuarioDB = await Usuario.findById(id);

     if(!usuarioDB) {
     	return res.status(404).json({
	   ok: false,
	   msg: 'El usuario no existe'
	})
     }

    if(usuarioDB.rol === 'ADMIN_ROL' || id === uid ){
    	next();
    } else {
	return res.status(403).json({
 	   ok: false,
	   msg: 'No tienes privilegios de administrador'
	});

    }

   }catch(error) {
     console.log(error);

     return res.status(500).json({
	ok: false,
        msg: 'Hable con el administrado'
     });
   }
}



module.exports = {
	validarJwt,
  	validarADMIN_ROL,
        validarADMIN_ROL_ACTUALIZAR
};
