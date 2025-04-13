'use server';

/**
 * @fileOverview Reverse prompt engineering flow. Takes AI-generated text as input and returns a likely prompt, a template prompt, and a suggestion for a better prompt.
 *
 * - reversePromptEngineering - A function that handles the reverse prompt engineering process.
 * - ReversePromptEngineeringInput - The input type for the reversePromptEngineering function.
 * - ReversePromptEngineeringOutput - The return type for the reversePromptEngineering function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ReversePromptEngineeringInputSchema = z.object({
  aiOutput: z.string().describe('The AI-generated text to reverse engineer.'),
});
export type ReversePromptEngineeringInput = z.infer<typeof ReversePromptEngineeringInputSchema>;

const ReversePromptEngineeringOutputSchema = z.object({
  likelyPrompt: z.string().describe('The most likely prompt that could have produced the AI output.'),
  templatePrompt: z.string().describe('A template version of the prompt with placeholders for variables.'),
  suggestedImprovement: z.string().describe('A suggestion for a better prompt to achieve the desired outcome.'),
});
export type ReversePromptEngineeringOutput = z.infer<typeof ReversePromptEngineeringOutputSchema>;

export async function reversePromptEngineering(
  input: ReversePromptEngineeringInput
): Promise<ReversePromptEngineeringOutput> {
  return reversePromptEngineeringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reversePromptEngineeringPrompt',
  input: {
    schema: z.object({
      aiOutput: z.string().describe('The AI-generated text to reverse engineer.'),
    }),
  },
  output: {
    schema: z.object({
      likelyPrompt: z.string().describe('The most likely prompt that could have produced the AI output.'),
      templatePrompt: z.string().describe('A template version of the prompt with placeholders for variables.'),
      suggestedImprovement: z.string().describe('A suggestion for a better prompt to achieve the desired outcome.'),
    }),
  },
  prompt: `You are an expert prompt engineer.

You will be given AI-generated text, and your job is to reverse engineer the prompt that was likely used to generate it.

In addition to the most likely prompt, you will also provide a template version of the prompt, with placeholders for variables that the user can change to generate similar output for different inputs.  Mark these placeholders with double curly braces, such as {{variableName}}.

Finally, you will also suggest a better prompt for the task, taking into account best practices for prompt engineering.

AI-generated text:
{{{aiOutput}}}

Output the following JSON:
{
  "likelyPrompt": "The most likely prompt that could have produced the AI output.",
  "templatePrompt": "A template version of the prompt with placeholders for variables.",
  "suggestedImprovement": "A suggestion for a better prompt to achieve the desired outcome."
}
`,
});

const reversePromptEngineeringFlow = ai.defineFlow<
  typeof ReversePromptEngineeringInputSchema,
  typeof ReversePromptEngineeringOutputSchema
>(
  {
    name: 'reversePromptEngineeringFlow',
    inputSchema: ReversePromptEngineeringInputSchema,
    outputSchema: ReversePromptEngineeringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
