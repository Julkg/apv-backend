import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
//Utilizamos los controllers para que nuestro routing no sea tan pesado
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email })

    if (existeUsuario) { 
        const error = new Error('Usuario Ya registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        //.save de mongo sirve para guardar un objeto en la base de datos, o si tomas un objeto, lo modificas y lo guardas
        const veterinarioGuardado = await veterinario.save();

        //Aqui es un buen lugar para enviar el email, porque nos aseguramos que ya se registro el usuario
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error)
    }
}
//Ya que este es el backend, necesitamos respuestas tipo json para que puedan ser interpretadas por cualquier navegador y/o DB

const perfil = (req, res) => {
    
    const { veterinario } = req;


    res.json(veterinario)
};

//Cuando llenamos un formulario usamos req.body, pero cuando leemos del url usamos req.params
// Utilizamos req.params para leer lo que se esta escribiendo el en url req.params.NombreDeVariableQuePusimosEnElRouter '/confirmar/:token' en esta cso el token
const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        //recuerda que después de generar cambios hay que guardarlo con .save a la base de datos como tal
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario Confirmado Correctamente' })
        
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprar si el usuario existe
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error('Usuario no existe');
        return res.status(404).json({ msg: error.message });
    }
    //Comprobar si el usuario esta confirmado o no...
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada revisa tu correo, y confirma tu cuenta')
        return res.status(404).json({ msg: error.message });
    } 

    //Revisar el password el usuario
    if (await usuario.comprobarPassword(password)) {
        console.log('Password Correcto');

        // console.log(usuario)
        //Autenticar
        //Lo hacemos de esta manera para solo retornar los datos que queramos
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(404).json({ msg: error.message });
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    const existeVeterinario = await Veterinario.findOne({ email });
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId()
        console.log(existeVeterinario);
        await existeVeterinario.save();

        //Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })


        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }

};
const comprobarToken = async (req, res) => {
    const { token } = req.params; //Ten en cuenta que al encerrar el token en llaves si no haces la separacion genera un error
    
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        //El token es válido el usuario existe
        res.json({msg: 'Token Valido y el usuario existe'})

    } else {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
    }
};
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Hubo un error');
        res.status(400).json({ msg: error.message });
    }
    
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg:"Mensaje modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })
        if (existeEmail) {
            const error = new Error('Este email ya esta en uso')
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado);
        //Se retorna porque cuando se presione, guardar Cambios y se obtenga una respuesta correcta, esta es la misma información que estara en la base de datos, después con nuetro useAuth vamos a poder actualizar el state y tener todo sincronizado

    } catch (error) {
        console.log(error)
    }
};

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body
    
    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message });
    }
    //Comprobar su password

    //IMPORTANTE esto es un metodo que se creo en \backend\models\Veterinario.js line 52 para comprobar el password ingresado en el almacenado en la base de datos  
    if (await veterinario.comprobarPassword(pwd_actual)) {
    //Almacenar el nuevo password
        // En  \backend\models\Veterinario.js line:43 tenemos un método que antes de guardar el password lo hashea asi tenemos seguridad
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado correctamente'})
    } else {
        const error = new Error('El Password Actual es Incorecto')
        return res.status(400).json({msg: error.message})
    }


}



export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};