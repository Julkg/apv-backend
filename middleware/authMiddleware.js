import jwt, { decode } from "jsonwebtoken";
//JST te permite crear el token y tambien te permite comprobarlo
import Veterinario from "../models/Veterinario.js";
import Paciente from "../models/Paciente.js";

const checkAuth = async (req, res, next) => {
  
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            //req.headers devuelve un objeto de la base de datos, en la cual tiene una key que se llama autorization que a su vez tiene el token
            token = req.headers.authorization.split(' ')[1];
            
            //Para decodificar el token importamos jwt y usamos el metodo de jwt.verify , que recibe 2 parametros (token, y la clave secreta del env process.env.JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Mandamos a llamar Veterinario por el id y utilizamos .select('-los atributos que no deseamos, por ejemplo la password')
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado'); //En vez de declarar una variable utilizamos req.veterinario para crear una sesion con la informacion de veterinario
            
            return next()
        } catch (error) {
            const e = new Error('Token no Valido');
            return res.status(403).json({ msg: e.message });
        }
    } 

    if(!token){
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({ msg: error.message });
    }
    next();
};

export default checkAuth;