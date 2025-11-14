import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryEmailRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  productName: string;
  adminEmail: string;
  isCartInquiry?: boolean;
  cartItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    price_inr: number;
    price_usd: number;
    price_eur: number;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      productName, 
      adminEmail, 
      isCartInquiry = false,
      cartItems = []
    }: InquiryEmailRequest = await req.json();

    console.log("Sending inquiry email:", { name, email, productName, isCartInquiry });

    let emailBody = '';
    
    if (isCartInquiry && cartItems.length > 0) {
      const cartItemsHtml = cartItems.map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #e0e0e0;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0;">₹${item.price_inr}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0;">$${item.price_usd}</td>
          <td style="padding: 8px; border: 1px solid #e0e0e0;">€${item.price_eur}</td>
        </tr>
      `).join('');

      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Cart Order Inquiry
          </h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #0066cc; font-size: 18px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 8px; border: 1px solid #e0e0e0; text-align: left;">Product</th>
                  <th style="padding: 8px; border: 1px solid #e0e0e0;">Quantity</th>
                  <th style="padding: 8px; border: 1px solid #e0e0e0;">INR</th>
                  <th style="padding: 8px; border: 1px solid #e0e0e0;">USD</th>
                  <th style="padding: 8px; border: 1px solid #e0e0e0;">EUR</th>
                </tr>
              </thead>
              <tbody>
                ${cartItemsHtml}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #0066cc; font-size: 18px;">Customer Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Company:</strong> ${company || 'Not provided'}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This inquiry was submitted through the Jabra website.</p>
          </div>
        </div>
      `;
    } else {
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Product Inquiry
          </h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #0066cc; font-size: 18px;">Product Details</h2>
            <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #0066cc; font-size: 18px;">Customer Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Company:</strong> ${company || 'Not provided'}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This inquiry was submitted through the Jabra website.</p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Jabra <onboarding@resend.dev>",
      to: [adminEmail],
      subject: isCartInquiry ? `New Cart Order from ${name}` : `New Product Inquiry: ${productName}`,
      html: emailBody,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-inquiry-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
