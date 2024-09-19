//Cuando creamos modelos usualmente podemos ponerle como nombre Veterinario.js en mayusculas
//Hay personas que le gusta ponder veterinarioModels.js

import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js'

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

//De esta manera podemos ejecutar funciones que funcionen en ese modelo solamente en veterinarioSchema
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    // bcrypt.compare compara el password del formulario en el primero argumento con el password guardado, por eso le pasamos this.password que seria el hash
    //Retorna tru or false
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;
