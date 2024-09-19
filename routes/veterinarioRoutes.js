import express from 'express'
import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';


const router = express.Router();
//AREA PUBLICA//

//Se coloca solamente '/' porque ya esta ahí!
router.post('/', registrar);

//Para crear un parametro dinamico ponemos : despues de / asi /:variable
router.get('/confirmar/:token', confirmar);

router.post('/login', autenticar);

//Va a ser tipo post porque el usuario coloca el correo, para enviarle el password
router.post('/olvide-password', olvidePassword);

/*
Le vamos a enviar un token que va a leer desde la url 
router.get('olvide-password/:token', comprobarToken)

Post par aque el usuario agregue el nuevo password
router.post("/olvide-password/:token", nuevoPassword)
*/
//Esta es una syntaxis en cadena que hace lo mismo que las 2 anteriores lineas
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//AREA PRIVADA//

//esta es una buena manera de organizar el routing
/////////////////////IMPORTANTE////////////////////////
//Ya que no todo el mundo deberia entrar en tu perfil, estos se le llaman rutas sensibles, las cuales no deberian de ser de acceso publico, para esto podemos usar los middleware que estan integrados ya en express o node, se crea una carpeta llamada middleware, creamos un archivo especifico para esta authMiddleware.js y desde ahi podemos hacer una funcion que servira de autenticacion para poder acceder al perfil
//RECORDAD QUE A LAS RUTAS SE LE PUEDEN MANDAR VARIAS FUNCIONES
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;