require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
//Crear servidor express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use( express.json() );

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static('src/public'));

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medico', require('./routes/medico'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/upload'));

app.listen( process.env.PORT, ()  => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
});