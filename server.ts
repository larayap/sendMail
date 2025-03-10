import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';

dotenv.config(); // Carga las variables de entorno definidas en .env

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://larayap.com'];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite peticiones sin origen (por ejemplo, desde herramientas de testing)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.post('/sendEmail', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // Configura el transporter con tus variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    // Envío del correo principal
    await transporter.sendMail({
      from: process.env.SMTP_USER as string,
      to: process.env.MY_EMAIL as string,
      subject: `Nuevo mensaje: ${subject}`,
      text: `Has recibido un nuevo mensaje desde el formulario de contacto:

De: ${email}
Asunto: ${subject}
Mensaje:
${message}`,
      replyTo: email,
    });

    // Envío de correo de confirmación al usuario
    await transporter.sendMail({
      from: process.env.SMTP_USER as string,
      to: email,
      subject: "Confirmación: He recibido tu mensaje",
      text: `
Hola,

He recibido tu mensaje correctamente y me pondré en contacto contigo a la brevedad.

¡Gracias por comunicarte conmigo!

Saludos,
Luis Araya`,
    });

    res.status(200).json({ message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ message: "Error al enviar email" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});