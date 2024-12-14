import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PayeeSchema } from './schemas';

export const template = new PromptTemplate({
  template: `You are a precise matching assistant. Your task is to match input text to the closest name in the CSV string content below and return its corresponding ID. Do not generate any code.

Available Items:
{csv}

CRITICAL CONFIDENCE SCORE RULES:
- If confidence score is less than 0.7, you MUST return:
  * id: null
  * name: null
  * confidence: your calculated score (0.0 to 0.6)
  * thinking: your analysis
  * reason: why the match wasn't strong enough

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
- ANY confidence score below 0.7 MUST return null for id and name


{format_instructions}

Examples:
Input: "alfamar"
Output: {{ "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Alfamart", "confidence": 0.9, "thinking": "Close name match with minor spelling variation", "reason": "Name matches with only 't' missing" }}

Input: "some store"
Output: {{ "id": null, "name": null, "confidence": 0.3, "thinking": "Only matches generic store category", "reason": "No specific name match, only business category similarity" }}


Input: {input}
Output: 
`,
  inputVariables: ['csv', 'input'],
  partialVariables: {
    format_instructions:
      StructuredOutputParser.fromZodSchema(PayeeSchema).getFormatInstructions(),
  },
});
