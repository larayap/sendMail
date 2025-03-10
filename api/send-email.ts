import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  try {
    // Aquí implementas la lógica para enviar el email.
    // Por ejemplo: const result = await sendEmail(req.body);
    
    res.status(200).json({ message: 'Email enviado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el email' });
  }
}