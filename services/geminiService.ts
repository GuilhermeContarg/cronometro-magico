
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gera um som de "buzina de festa" ou "fanfarra" mais potente e claro.
 */
export async function playFinishSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playLayeredNote = (frequency: number, startTime: number, duration: number) => {
    // Sawtooth for a brassy/horn feel
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    
    osc1.frequency.setValueAtTime(frequency, startTime);
    osc2.frequency.setValueAtTime(frequency * 1.01, startTime); // detune for thickness

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  };

  const now = audioContext.currentTime;
  // Strong fanfare: G4 -> C5 -> E5 -> G5 (Grand chord)
  playLayeredNote(392.00, now, 0.4);       // G4
  playLayeredNote(523.25, now + 0.2, 0.4); // C5
  playLayeredNote(659.25, now + 0.4, 0.4); // E5
  playLayeredNote(783.99, now + 0.6, 1.2); // G5 (sustained)
}

export async function speakMessage(text: string) {
  try {
    // Prompt improved for more prosody and fluidity
    const systemPrompt = `Você é uma educadora infantil muito carinhosa e animada. 
    Use uma entonação suave, pausada e muito expressiva, como se estivesse conversando com um bebê de 1 ou 2 anos. 
    Diga de forma fluida e doce: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: systemPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Kore is good, but we ensure the system prompt guides the delivery style
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioContext,
        24000,
        1
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
  }
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
