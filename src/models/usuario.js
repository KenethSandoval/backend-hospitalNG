const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
	nombre: {
        type: String,
        require: true
    },
	email: {
        type: String,
        require: true,
        unique: true
    },
	password: {
        type: String,
        require: true
    },
	img: {
        type: String
    },
	rol: {
        type: String,
        require: true,
        default: 'USER_ROLE'
    },
	google: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();  //extrae los campos del objeto para no mostrarlos
    
    object._id = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);