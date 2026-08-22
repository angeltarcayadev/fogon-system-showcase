/**
 * Servicio de Envío de Entradas QR usando Resend
 * 
 * Este fragmento demuestra la integración con la API de Resend 
 * para enviar correos electrónicos transaccionales con el ticket 
 * generado dinámicamente.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(userEmail, userName, ticketUrl) {
  try {
    const data = await resend.emails.send({
      from: 'Entradas <entradas@sytemfogon.digital>',
      to: [userEmail],
      subject: 'Tu Entrada Oficial - Fogón Institucional',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>¡Hola, ${userName}!</h2>
          <p>Tu entrada ha sido generada exitosamente.</p>
          <p>Presenta el siguiente código QR en la puerta el día del evento:</p>
          <!-- Generamos el QR dinámicamente -->
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketUrl)}" alt="Código QR" />
        </div>
      `
    });
    
    console.log("Correo enviado:", data);
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
}
