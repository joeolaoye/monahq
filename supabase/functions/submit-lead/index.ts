import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");
const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  businessName: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  messagingPlatform?: string;
  businessSector?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();
    console.log("Received lead submission:", leadData);

    // Validate required fields
    if (!leadData.businessName || !leadData.phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Business name and phone number are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Submit to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/Leads`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                "Name of Business": leadData.businessName,
                "Phone Number": leadData.phoneNumber,
                "Email": leadData.email || "",
                "Business Website": leadData.website || "",
                "Messaging Platform": leadData.messagingPlatform || "",
                "Business Sector": leadData.businessSector || "",
                "Signup Date": new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      console.error("Airtable error:", errorText);
      throw new Error(`Airtable submission failed: ${errorText}`);
    }

    const airtableData = await airtableResponse.json();
    console.log("Airtable submission successful:", airtableData);

    // Send email notification using Resend
    const emailHtml = `
      <h1>New CRM Waitlist Signup: ${leadData.businessName}</h1>
      <h2>Contact Details</h2>
      <ul>
        <li><strong>Business Name:</strong> ${leadData.businessName}</li>
        <li><strong>Phone Number:</strong> ${leadData.phoneNumber}</li>
        ${leadData.email ? `<li><strong>Email:</strong> ${leadData.email}</li>` : ""}
        ${leadData.website ? `<li><strong>Website:</strong> ${leadData.website}</li>` : ""}
        ${leadData.messagingPlatform ? `<li><strong>Messaging Platform:</strong> ${leadData.messagingPlatform}</li>` : ""}
        ${leadData.businessSector ? `<li><strong>Business Sector:</strong> ${leadData.businessSector}</li>` : ""}
      </ul>
      <p><em>Submitted on ${new Date().toLocaleString()}</em></p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CRM Waitlist <onboarding@resend.dev>",
        to: leadData.email || "notifications@yourcompany.com",
        subject: `New CRM Waitlist Signup: ${leadData.businessName}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
      // Don't fail the request if email fails
    } else {
      const emailData = await emailResponse.json();
      console.log("Email sent successfully:", emailData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        airtableId: airtableData.records[0].id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-lead function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
