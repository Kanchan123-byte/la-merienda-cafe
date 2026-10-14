'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(orderDetails: { orderId: string; total: string; items: string }) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'jhakankan3001@gmail.com', // Your verified Resend/testing email
      subject: `New Order Received! #${orderDetails.orderId}`,
      html: `
        <h2>New Order at La Merienda!</h2>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Total:</strong> ${orderDetails.total}</p>
        <p><strong>Items:</strong> ${orderDetails.items}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}