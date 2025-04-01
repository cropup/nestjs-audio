import { Injectable } from '@nestjs/common';
import {
  GenerateContentRequest,
  GenerationConfig,
  GoogleGenerativeAI,
  SchemaType,
} from '@google/generative-ai';
import * as fs from 'fs/promises';
import path from 'path';
import { AnalysisError } from '../analyses/domain/analysis-error';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? '');
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });
  }

  private async loadPrompt(fileName: string): Promise<string> {
    return fs.readFile(path.join(__dirname, './prompts', fileName), 'utf8');
  }

  private getGenerationConfig(): GenerationConfig {
    return {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            original: {
              type: SchemaType.STRING,
              description:
                "The exact sentence or phrase from the student's speech containing the error",
            },
            correction: {
              type: SchemaType.STRING,
              description:
                'A corrected or improved version of the original sentence or phrase',
            },
            type: {
              type: SchemaType.STRING,
              format: 'enum',
              description: 'The category of language issue identified',
              enum: ['grammar', 'vocabulary'],
            },
            explanation: {
              type: SchemaType.STRING,
              description:
                'A concise explanation of why the original sentence or phrase is incorrect or unclear',
            },
          },
          required: ['original', 'correction', 'type', 'explanation'],
        },
      },
    };
  }

  async analyzeAudio(inlineData: {
    data: string;
    mimeType: string;
  }): Promise<AnalysisError[] | null> {
    const prompt = await this.loadPrompt('analyze-audio.txt');
    const audio = { inlineData };

    const request: GenerateContentRequest = {
      generationConfig: this.getGenerationConfig(),
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, audio],
        },
      ],
    };

    const result = await this.model.generateContent(request);

    const usage = result.response.usageMetadata;
    if (usage) {
      console.log(
        `Tokens used - Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`,
      );
    }

    try {
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('🔴 Error:', error);
      return null;
    }
  }

  async transcribeAudio(inlineData: {
    data: string;
    mimeType: string;
  }): Promise<string> {
    const prompt = `This is a recording of a student speaking during an English class. Please transcribe exactly what is said. The output should be a plain text transcript, reflecting the student's original speech as closely as possible. If the audio contains no speech or is completely silent, you must return just "No speech detected".`;
    const audio = { inlineData };

    const request: GenerateContentRequest = {
      contents: [{ role: 'user', parts: [{ text: prompt }, audio] }],
    };

    const result = await this.model.generateContent(request);

    return result.response.text();
  }
}
