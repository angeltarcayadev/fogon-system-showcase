/**
 * Lógica de Validación de Seguridad para Escáner (Double-Flow)
 * 
 * Este fragmento se ejecuta en la PWA del personal de seguridad.
 * Extrae silenciosamente el UUID para validarlo contra la base de datos
 * evitando que un usuario común acceda a los endpoints de validación.
 */

export async function processScannedCode(scannedData) {
  try {
    const url = new URL(scannedData);
    
    if (url.hostname !== 'sistema-fogon.com') {
      throw new Error('QR Inválido.');
    }

    const ticketId = url.searchParams.get('ticket');
    
    const response = await fetch('/api/validar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('guard_token')}`
      },
      body: JSON.stringify({ ticketId })
    });

    const result = await response.json();

    if (result.status === 'valid') {
      return { success: true, message: 'Entrada Válida', color: 'green' };
    } else {
      return { success: false, message: 'Código Inválido', color: 'red' };
    }
  } catch (error) {
    console.error("Error de lectura:", error);
    return { success: false, message: 'Error', color: 'red' };
  }
}
