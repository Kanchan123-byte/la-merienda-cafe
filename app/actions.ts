'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailProps {
  orderId: string;
  total: string;
  items: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export async function sendOrderEmail(orderDetails: OrderEmailProps) {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'jhakankan3001@gmail.com', // Your registered inbox for receiving order alerts
      subject: `New Order Received! #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #9E0038; margin-top: 0;">La Merienda Cafè - New Order</h2>
          <p style="font-size: 16px; color: #333;">You have received a new pickup order from your website!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
          <p><strong>Customer Name:</strong> ${orderDetails.customerName}</p>
          <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>
          
          <h3 style="color: #3D2314; margin-top: 20px;">Order Items:</h3>
          <p style="background: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-line;">${orderDetails.items}</p>
          
          <h3 style="color: #9E0038;">Total Amount: €${orderDetails.total}</h3>
          
          <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
            PEP Einkaufszentrum (PEP Mall Neuperlach), Munich<br/>
            Fresh. Fast. Feel-good.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send Resend email:', error);
    return { success: false, error };
  }
}