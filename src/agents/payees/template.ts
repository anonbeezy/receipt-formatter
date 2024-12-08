import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PayeeSchema } from './schemas';

export const template = new PromptTemplate({
  template: `You are a precise matching assistant. Your task is to match input text to the closest name in the CSV string content below and return its corresponding ID. Do not generate any code.

Available Items:
{csv}

Matching Rules:
1. Match against the name field only, considering:
   - Case insensitive matching
   - Ignore special characters and extra spaces
   - Common misspellings
   - Abbreviated versions
   - Partial matches if they uniquely identify an item

Remember:
- Only return the exact ID from the CSV
- Never invent new IDs
- Only return JSON in the specified format
- No explanations or additional text

{format_instructions}

Examples:
Input: "alfamar"
Output: {{ "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Alfamart", "confidence": 0.9 }}

Input: "something not in list"
Output: {{ "id": null, "name": null, "confidence": 0.0 }}

Input: {input}
Output: 
`,
  inputVariables: ['csv', 'input'],
  partialVariables: {
    format_instructions:
      StructuredOutputParser.fromZodSchema(PayeeSchema).getFormatInstructions(),
  },
});
