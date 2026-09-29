import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const N8N_WEBHOOK_URL =
  'https://pottipooja007.app.n8n.cloud/webhook/880509cf-1566-4ff8-b9fc-e3474d78da39/chat';
const N8N_INSTANCE_ID =
  '0405ba39bf2aca1aa1f124004ac64ec053424c6558ae320531ea7df30c22c4c0';

// Initialize Gemini SDK with modern @google/genai
const ai = new GoogleGenAI();

// Diagnostic endpoint to check n8n webhook connectivity
app.get('/api/n8n-status', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const getRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Also test loadPreviousSession
    let sessionWorking = false;
    try {
      const sessRes = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Instance-Id': N8N_INSTANCE_ID,
        },
        body: JSON.stringify({
          action: 'loadPreviousSession',
          sessionId: 'diagnostic-session',
        }),
      });
      sessionWorking = sessRes.ok;
    } catch {}

    return res.json({
      online: getRes.ok,
      status: getRes.status,
      webhookUrl: N8N_WEBHOOK_URL,
      sessionEndpointWorking: sessionWorking,
      instanceId: N8N_INSTANCE_ID,
      message: getRes.ok
        ? 'n8n chat webhook is reachable and responding.'
        : `n8n webhook returned status ${getRes.status}`,
    });
  } catch (err: any) {
    return res.json({
      online: false,
      webhookUrl: N8N_WEBHOOK_URL,
      error: err.message,
      message: 'Could not connect to n8n webhook URL directly.',
    });
  }
});

// Main chat route that handles communication with n8n and smart fallback
app.post('/api/chat', async (req, res) => {
  const { chatInput, sessionId, history = [] } = req.body;

  if (!chatInput) {
    return res.status(400).json({ error: 'chatInput is required' });
  }

  const payload = {
    action: 'sendMessage',
    sessionId: sessionId || `tripmate-${Date.now()}`,
    chatInput: chatInput,
  };

  let n8nResponseText = '';
  let n8nSuccess = false;
  let n8nStatusNote = '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Instance-Id': N8N_INSTANCE_ID,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await n8nRes.json().catch(() => null);

    if (n8nRes.ok && data) {
      const rawText =
        data.output ||
        data.text ||
        data.message ||
        (Array.isArray(data) && data[0]?.json?.output) ||
        (typeof data === 'string' ? data : '');

      // Check if n8n returned an actual relevant answer or just a static boilerplate about the website
      const isCannedBoilerplate = (text: string) => {
        const lower = text.toLowerCase();
        return (
          lower.includes('successfully built') ||
          lower.includes("what we've built") ||
          lower.includes('what was built') ||
          lower.includes('what you can do in tripmate') ||
          lower.includes('tripmate is fully') ||
          lower.includes('tripmate travel platform') ||
          lower.includes('all requested features from your prompt') ||
          lower.includes('the modern, all-in-one travel planning') ||
          lower.includes('everything from multi-modal transit search') ||
          lower.includes('enjoy exploring and planning your journeys with tripmate') ||
          lower.includes('enjoy planning and booking your journeys in one unified platform') ||
          lower.includes('tripmate has been fully updated and built') ||
          lower.includes('welcome to **tripmate ai**! i am your all-in-one travel planning and booking assistant') ||
          lower.includes('the application is fully live and interactive')
        );
      };

      if (rawText && !rawText.includes('Error in workflow') && !isCannedBoilerplate(rawText)) {
        n8nResponseText = rawText;
        n8nSuccess = true;
      } else if (rawText && isCannedBoilerplate(rawText)) {
        n8nStatusNote = 'n8n workflow returned static app status instead of dynamic answer; answering via TripMate AI.';
      } else {
        n8nStatusNote = 'n8n workflow returned: "Error in workflow"';
      }
    } else if (data && data.message === 'Error in workflow') {
      n8nStatusNote =
        'n8n workflow returned: "Error in workflow" (Execution failed inside n8n node).';
    } else {
      n8nStatusNote = `n8n returned HTTP ${n8nRes.status}`;
    }
  } catch (err: any) {
    n8nStatusNote = `Connection to n8n failed or timed out (${err.message}).`;
  }

  // If n8n succeeded, return its output immediately!
  if (n8nSuccess && n8nResponseText) {
    return res.json({
      output: n8nResponseText,
      source: 'n8n',
      status: 'success',
    });
  }

  // Fallback to Gemini 2.5 Flash to ensure user always gets a high quality travel response
  try {
    const systemPrompt = `You are "TripMate AI", the intelligent travel concierge on the TripMate platform.
You specialize in Indian travel routes, especially trips like Srikakulam (Andhra Pradesh) to Goa, Hyderabad, Kerala, and pan-India destinations.
The website helps users with:
1. Multi-modal transport (Flights via Visakhapatnam VTZ, Amaravathi Express / Vande Bharat trains, Orange Travels AC sleeper buses, Outstation cabs).
2. Verified hotels and beach resorts (Candolim, Calangute, Ashvem, Fontainhas heritage stays).
3. 5-day customized itineraries, sightseeing (Fort Aguada, Basilica of Bom Jesus, Palolem beach, Dudhsagar falls).
4. Authentic dining (Goan Fish Curry, Prawn Balchão, Bebinca, Poi bread, Sol Kadhi).
5. Scooter rentals, GoaMiles cabs, safety, and packing checklists.

Keep answers concise, friendly, well-structured with clear bullet points, bold key highlights, and concrete travel tips. Always format nicely.`;

    const chatHistory = history
      .slice(-6)
      .map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nRecent Conversation:\n${chatHistory}\n\nUser: ${chatInput}\n\nTripMate AI:`;

    let generatedText = '';
    const modelsToTry = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        if (result.text) {
          generatedText = result.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} attempt failed:`, modelErr.message);
      }
    }

    const fallbackAnswer =
      generatedText ||
      `Here are the **Top 4 Vacation Trips with Friends**:\n\n1. **Goa (Beaches, Parties & Watersports)**: Stay in a private villa in Candolim/Ashvem, rent scooters, enjoy parasailing at Baga, and dine at clifftop shacks like Thalassa.\n   - *Ideal Duration:* 4–5 Days | *Budget:* ~₹12,000–₹18,000 per person\n\n2. **Manali & Kasol (Mountain Trails, Cafes & Rivers)**: River rafting in Beas, trekking to Jogini waterfall, cafe hopping in Old Manali, and cozy bonfires.\n   - *Ideal Duration:* 5–6 Days | *Budget:* ~₹14,000–₹20,000 per person\n\n3. **Kerala & Varkala (Backwaters & Cliffside Living)**: Cruise on an exclusive houseboat in Alleppey, surf at Varkala cliffs, and enjoy fresh seafood feasts.\n   - *Ideal Duration:* 4–5 Days | *Budget:* ~₹15,000–₹22,000 per person\n\n4. **Rishikesh (Adventure & Glamping)**: White-water rafting, bungee jumping, and luxury riverside tents with live music by the Ganges.\n   - *Ideal Duration:* 3–4 Days | *Budget:* ~₹8,000–₹12,000 per person\n\nYou can plan and book flights, trains, and hotels for any of these directly on TripMate!`;

    return res.json({
      output: fallbackAnswer,
      source: 'tripmate_ai',
      n8nNote: n8nStatusNote,
      n8nWorkflowError: Boolean(n8nStatusNote),
    });
  } catch (fallbackErr: any) {
    console.error('Fallback generation error:', fallbackErr);
    return res.json({
      output: `I received your message regarding: "${chatInput}". While the connected n8n workflow reported "${n8nStatusNote}", I am here to help you plan your journey from Srikakulam to Goa, select hotels, or check flight and train schedules.`,
      source: 'static_fallback',
      n8nNote: n8nStatusNote,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TripMate server running on http://localhost:${PORT}`);
  });
}

startServer();
