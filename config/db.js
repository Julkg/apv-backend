import mongoose from "mongoose";


////////////////////////////////////////////
///////LA BASE DE DATOS SOLEMOS/////////////
//////INSTALARLA EN UN ARCHIVO ////////////
/////QUE LLAMAMOS db.js en una/////////////
/////CARPETA config///////////////////////
///////////////////////////////////////////
const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI,
            {serverApi: { version: '1', strict: true, deprecationErrors: true }}
        );

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`)
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;