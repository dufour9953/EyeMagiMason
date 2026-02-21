#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node describe-audio.mjs <audio-file-path>");
  process.exit(1);
}

async function transcribeAudio(filePath) {
  const bytes = await readFile(filePath);
  const fileName = path.basename(filePath);

  const formData = new FormData();
  formData.append("model", "gpt-4o-mini-transcribe");
  formData.append("response_format", "text");
  formData.append("file", new Blob([bytes]), fileName);

  const response = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Transcription failed (${response.status}): ${errorBody}`);
  }

  return response.text();
}

async function describeTranscript(transcriptText) {
  const prompt = [
    "You are an expert audio analyst.",
    "Given a transcript of an audio file, write a concise description with:",
    "1) Main topic or event",
    "2) Speaker style or tone",
    "3) Key moments or takeaways",
    "4) Any uncertainty if parts are unclear",
    "",
    "Keep it under 140 words.",
    "",
    "Transcript:",
    transcriptText,
  ].join("\n");

  const response = await fetch(`${OPENAI_BASE_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Description generation failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.output_text?.trim() ?? "(No description returned)";
}

try {
  const transcript = await transcribeAudio(inputPath);
  const description = await describeTranscript(transcript);

  console.log("=== Transcript ===");
  console.log(transcript.trim());
  console.log("\n=== Description ===");
  console.log(description);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
