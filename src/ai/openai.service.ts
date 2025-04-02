import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import path from 'path';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import fs from 'fs';
import * as fsPromises from 'fs/promises';
import { AnalysisError } from '../analyses/domain/analysis-error';

const ErrorItem = z.object({
  original: z
    .string()
    .describe('The exact sentence or short phrase with the error'),
  correction: z
    .string()
    .describe(
      'A corrected or improved version of the original sentence or phrase',
    ),
  type: z
    .enum(['grammar', 'vocabulary'])
    .describe("Specify either 'grammar' or 'vocabulary'"),
  explanation: z
    .string()
    .describe(
      'A brief and clear explanation of why this is incorrect, inappropriate, or unclear',
    ),
});

const ErrorsResponse = z.object({
  errors: z.array(ErrorItem).describe('List of errors found in transcription'),
});

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async loadPrompt(fileName: string): Promise<string> {
    return fsPromises.readFile(
      path.join(__dirname, './prompts', fileName),
      'utf8',
    );
  }

  async analyzeTranscript(transcript: string): Promise<AnalysisError[] | null> {
    const systemPrompt = await this.loadPrompt('openai-analyze-transcript.txt');

    try {
      const completion = await this.openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-11-20',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: systemPrompt.trim(),
          },
          {
            role: 'user',
            content: `Analyze the following transcript:\n\n${transcript}`,
          },
        ],
        response_format: zodResponseFormat(ErrorsResponse, 'errors'),
      });

      const responseMessage = completion.choices[0].message;

      // If the model refuses to respond, you will get a refusal message
      if (responseMessage.refusal) {
        console.log('🔴 Refusal:', responseMessage.refusal);
        throw new Error('Refusal from OpenAI: ' + responseMessage.refusal);
      }

      console.log(
        `💬 Tokens: ${completion.usage?.prompt_tokens} + ${completion.usage?.completion_tokens}`,
      );
      const inputCost = (completion.usage?.prompt_tokens || 0) * 0.000005;
      const outputCost = (completion.usage?.completion_tokens || 0) * 0.000015;
      console.log(`💰 Estimated Cost: $${(inputCost + outputCost).toFixed(4)}`);

      return responseMessage.parsed?.errors || null;
    } catch (error) {
      console.error('🔴 analyzeAudio Error:', error);
      return null;
    }
  }

  async transcribeAudio(filePath: string): Promise<string> {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'gpt-4o-transcribe',
      });

      return transcription.text;
    } catch (error) {
      console.error('🔴 transcribeAudio Error:', error);
      return '';
    }
  }
}
