import nodemailer from "nodemailer";


const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;


    const myPass= process.env.ELASTIC_EMAIL_API_KEY

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'julianjfn13@gmail.com', // tu correo
    pass: myPass, // tu contraseña de aplicación
  },
});
    
    const enlace =`${process.env.FRONTEND_URL}/confirmar/${token}`


  const mailOptions = {
    from: 'julianjfn13@gmail.com',
    to: email,
    subject: 'Confirma tu cuenta de APV Julian.Dev',
    text: `Haz clic en este enlace para confirmar tu cuenta: ${enlace} `,
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
    <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> 
    </p>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });


// Usa la función cuando sea necesario
// sendConfirmationEmail('usuario@example.com', 'http://tu-app.com/confirmar?token=tuToken');





    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT ,
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS
    //     }
    // });
    
    // const { email, nombre, token } = datos;

    // //Enviar el email
    // const info = await transporter.sendMail({
    //     from: "APV- Administrador de Pacientes de Veterinaria",
    //     to: email,
    //     subject: 'Comprueba tu cuenta en APV',
    //     text: 'Comprueba tu cuenta en APV',
    //     html: `
    //     <p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
    //     <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
    //     <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> 
    //     </p>

    //     <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje
        
        
    //     `
    // });

    // console.log("Mensaje enviado : %s", info.messageID)
};

export default emailRegistro