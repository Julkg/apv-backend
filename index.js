//Instalamos express
import express from 'express';
//instalamos un env que son las variables de entorno, las cuales nos ayudan a ocultar en variables informacion sensible, se llaman usando process.env.VARIABLE en mayusculas la variable
import dotenv from 'dotenv'
import cors from 'cors';
//La base de datos te va a dar las instrucciones de como hacer la instalacin en este caso usamos mongo db por el metodo mongoose
import conectarDB from './config/db.js';
//Importamos los routes // Lo llamamos con nombre distinto porque es el export Default
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js';



const app = express();

app.use(express.json());

//Declaramos el dotenv con .config() para poder utilizarlo
dotenv.config()

conectarDB();

//Aqui colocamos los dominios permitidos
const dominiosPermitidos = [process.env.FRONTEND_URL]

console.log(dominiosPermitidos)
console.log(`origin antes de cor option${origin}`)
console.log(`dominiosPermitidos.indexOf(origin) antes de cor option${dominiosPermitidos.indexOf(origin)}`)



const corsOptions = {
  origin: function (origin, callback) {
    //Si es distinto a menos uno significa que si lo encontro
    
    console.log(dominiosPermitidos)
console.log(`origin entre de cor option${origin}`)
console.log(`dominiosPermitidos.indexOf(origin) entre de cor option${dominiosPermitidos.indexOf(origin)}`)

    if (dominiosPermitidos.indexOf(origin) !== -1) {
  // El Origen del reques esta permitido
      callback(null, true);
} else {
  callback(new Error('No permitido por CORS'))
}
 }
}

console.log(dominiosPermitidos)
console.log(`origin despues de cor option${origin}`)
console.log(`dominiosPermitidos.indexOf(origin) despues de cor option${dominiosPermitidos.indexOf(origin)}`)

app.use(cors(corsOptions));

//Recuerda que app.use es para cuando hagan cualquier accion sobre esa url de /api/veterinarios, se llama el routing
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

 // esta dependencia la tendran en automatico
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidos Funcionnado en el puerto ${PORT}`)
});
