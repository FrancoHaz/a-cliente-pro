
import { GoogleGenAI, Type } from '@google/genai';
import { GenerationMode, GeneratedEmail } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getHtmlTemplate = (customerEmail: string, contentInstructions: string) => {
  return `
    The "body" value in the JSON MUST be a single HTML string.
    
    **DESIGN DIRECTIVE (PREMIUM BRANDING):**
    You are using the "Franco AI Automations" Corporate Identity. 
    The brand colors are Gold/Bronze (#D4AF37) and Black/Dark Grey.
    The design must feel expensive, authoritative, and clean.
    
    **INSTRUCTIONS FOR HTML BODY:**
    1.  **Language:** Same as customer's email.
    2.  **Structure:** Use the provided HTML structure.
    3.  **Tone:** Professional, authoritative yet empathetic.
    4.  **Links:** Use \`https://INSERT_LINK_HERE\` for placeholders.
    5.  **Refinement:** If this is a refinement, strictly follow the user's new instruction.

    **HTML TEMPLATE:**
    ---html
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      
      <!-- Main Wrapper -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f8f8; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <!-- Email Container -->
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 0px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 0px solid #e5e5e5;">
              
              <!-- Unified Header Block (Black) -->
              <tr>
                <td style="background-color: #000000; padding: 45px 40px 15px 40px; text-align: center;">
                   <img src="https://res.cloudinary.com/dytb3hwko/image/upload/v1763935327/5845775451836582972_thjnvm.jpg" alt="Franco AI Automations" style="height: 65px; width: auto; display: block; margin: 0 auto;">
                </td>
              </tr>
              
              <!-- Status Text (Merged with Header) -->
              <tr>
                <td style="background-color: #000000; padding: 0px 40px 25px 40px; border-bottom: 4px solid #D4AF37;">
                   <p style="margin: 0; font-size: 10px; color: #D4AF37; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center; opacity: 0.9;">Official Communication</p>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 50px 40px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <!-- Internal styles for highlighting placeholders in the preview -->
                  <style>
                    a[href*="INSERT_LINK_HERE"] {
                      background-color: #FFF8E1 !important;
                      border: 2px dashed #D4AF37 !important;
                      color: #B45309 !important;
                      font-weight: bold !important;
                      text-decoration: none !important;
                      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
                    }
                  </style>

                  <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 400; color: #111111; letter-spacing: -0.5px;">Hello [Customer Name],</h1>
                  
                  <p style="margin: 0 0 16px 0;">[${contentInstructions}]</p>
                  
                  <!-- Resolution / Action Block (Gold Branding) -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFCF5; border-left: 4px solid #D4AF37; margin: 35px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <p style="margin: 0; font-size: 15px; color: #4a4a4a;">
                          <strong style="color: #D4AF37; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Resolution Summary</strong><br><br>
                          [Provide concise solution or approved action here]
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px 0;">[Closing statement reassuring the customer]</p>

                  <!-- Call to Action Button (Premium Gold) -->
                  <table border="0" cellspacing="0" cellpadding="0" style="margin: 10px 0 30px 0; width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="https://INSERT_LINK_HERE" target="_blank" style="font-size: 14px; font-family: Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; border-radius: 0px; padding: 16px 40px; background-color: #D4AF37; display: inline-block; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">[Action Button Text]</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; font-size: 15px; color: #666;">Sincerely,<br><strong style="color: #111;">Franco AI Team</strong></p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #111111; padding: 40px 40px; text-align: center; border-top: 1px solid #222;">
                  <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666;">
                    &copy; 2024 Franco AI Automations. All rights reserved.
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #444444;">
                    <a href="#" style="color: #888888; text-decoration: none;">Privacy Policy</a> &nbsp;|&nbsp; <a href="#" style="color: #888888; text-decoration: none;">Support Center</a>
                  </p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
    ---
  `;
};

const generatePrompt = (customerEmail: string, isJsonMode: boolean, customInstructions: string): string => {
  const jsonInstruction = isJsonMode
    ? 'The generated response must be a valid JSON object with two keys: "subject" and "body".'
    : 'The generated response must be a JSON object with two keys: "subject" and "body", inside a JSON markdown block (```json ... ```).';

  const defaultInstructions = "Maintain a professional, authoritative, and helpful tone. Project confidence in the resolution.";
  const finalInstructions = customInstructions.trim() ? customInstructions : defaultInstructions;
  const template = getHtmlTemplate(customerEmail, "Address the issue clearly. Use the Resolution Summary block to highlight the key takeaway.");

  return `
    You are a Senior Customer Support Specialist for "Franco AI Automations", an e-commerce brand.
    
    **STYLE INSTRUCTIONS:**
    ${finalInstructions}
    
    **GOAL:**
    Generate a response that feels "Official", "Premium" and "Authoritative". Use the "Resolution Summary" style to give the customer confidence that the issue is being handled by a pro.

    **Primary Goal:** Detect the language of the customer's email and generate the entire response (subject and body) in that same language.

    Task: Analyze the customer email and generate a response formatted as a professional, branded HTML email.

    ${jsonInstruction}

    ${template}

    Customer Email:
    ---
    ${customerEmail}
    ---
  `;
};

const generateRefinementPrompt = (customerEmail: string, currentSubject: string, currentBody: string, refinementInstructions: string): string => {
  const template = getHtmlTemplate(customerEmail, "Updated content based on refinement instructions.");

  return `
    You are an expert customer support agent.
    
    **TASK: REFORMULATE/REFINE RESPONSE**
    
    Original Customer Email:
    ---
    ${customerEmail}
    ---
    
    Current Draft Response (Subject: ${currentSubject}):
    ---
    ${currentBody}
    ---
    
    **USER REFINEMENT INSTRUCTION (IMPORTANT):**
    "${refinementInstructions}"
    
    Action: Rewrite the Draft Response (Subject and Body) to incorporate the user's instruction.
    Maintain the same HTML structure (the authoritative template), styling, and branding as the original draft.
    
    Output must be a valid JSON object with "subject" and "body" keys.
    
    ${template}
   `;
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    subject: {
      type: Type.STRING,
      description: "A concise and relevant subject line for the reply email.",
    },
    body: {
      type: Type.STRING,
      description: "The full body of the email reply, formatted as a complete, branded HTML string based on the provided template.",
    },
  },
  required: ["subject", "body"],
};

const parseJsonResponse = (responseText: string): GeneratedEmail => {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (jsonErr) {
        console.error("Failed to parse JSON from markdown block:", jsonErr);
        throw new Error("Invalid JSON format received from API even after extraction.");
      }
    }
    console.error("Failed to parse JSON directly and no markdown block found:", e);
    throw new Error("Invalid response format received from API.");
  }
};


export const generateEmailResponse = async (
  customerEmail: string,
  mode: GenerationMode,
  customInstructions: string
): Promise<GeneratedEmail> => {
  let model: string;
  let config: any = {};

  // Basic configuration logic
  switch (mode) {
    case GenerationMode.Search:
      model = 'gemini-2.5-flash';
      config = { tools: [{ googleSearch: {} }] };
      break;
    case GenerationMode.Thinking:
      model = 'gemini-2.5-pro';
      config = {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema,
      };
      break;
    case GenerationMode.Standard:
    default:
      model = 'gemini-2.5-flash';
      config = {
        responseMimeType: "application/json",
        responseSchema,
      };
      break;
  }

  const prompt = generatePrompt(customerEmail, mode !== GenerationMode.Search, customInstructions);

  try {
    const response = await ai.models.generateContent({ model, contents: prompt, config });
    const responseText = response.text;
    if (!responseText) throw new Error("Received an empty response from the API.");
    return parseJsonResponse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate email response.");
  }
};

export const refineEmailResponse = async (
  customerEmail: string,
  currentSubject: string,
  currentBody: string,
  refinementInstructions: string
): Promise<GeneratedEmail> => {
  const model = 'gemini-2.5-flash';
  const config = {
    responseMimeType: "application/json",
    responseSchema,
  };

  const prompt = generateRefinementPrompt(customerEmail, currentSubject, currentBody, refinementInstructions);

  try {
    const response = await ai.models.generateContent({ model, contents: prompt, config });
    const responseText = response.text;
    if (!responseText) throw new Error("Received an empty response from the API.");
    return parseJsonResponse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API (Refine):", error);
    throw new Error("Failed to refine email response.");
  }
}
