
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    console.log("Upgrading to WebSocket connection");
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to OpenAI's Realtime API
    console.log("Connecting to OpenAI Realtime API");
    const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01");

    openAISocket.onopen = () => {
      console.log("Connected to OpenAI");
      // Send initial configuration after connection is established
      const config = {
        "type": "session.update",
        "session": {
          "modalities": ["text", "audio"],
          "instructions": "You are a helpful sales assistant. Engage in conversation naturally and help the user understand our product offerings.",
          "voice": "alloy",
          "input_audio_format": "pcm16",
          "output_audio_format": "pcm16",
          "input_audio_transcription": {
            "model": "whisper-1"
          },
          "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 1000
          }
        }
      };
      openAISocket.send(JSON.stringify(config));
      console.log("Sent initial configuration to OpenAI");
    };

    // Forward messages from client to OpenAI
    socket.onmessage = (event) => {
      console.log("Forwarding message to OpenAI:", event.data);
      openAISocket.send(event.data);
    };

    // Forward messages from OpenAI to client
    openAISocket.onmessage = (event) => {
      console.log("Received message from OpenAI:", event.data);
      socket.send(event.data);
    };

    // Handle errors
    socket.onerror = (e) => console.error("WebSocket error:", e);
    openAISocket.onerror = (e) => console.error("OpenAI WebSocket error:", e);

    socket.onclose = () => console.log("Client WebSocket closed");
    openAISocket.onclose = () => console.log("OpenAI WebSocket closed");

    return response;
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
