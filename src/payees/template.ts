import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PayeeSchema } from './schemas';

export const template = new PromptTemplate({
  template: `You are a precise matching assistant. Match input text to names in the CSV below.

Available Items:
{csv}

CRITICAL RULES:
1. Confidence Score Scale (0.0 to 1.0):
   1.0 = exact character match
   0.9 = exact match with different case/spacing
   0.7-0.8 = clear partial match
   0.4 or less = business category match only

2. If confidence < 0.7:
   - Use createPayeeObject with:
     id: null (not string "null")
     name: null (not string "null")
     confidence: your score (number between 0.0-0.6)
     thinking: your analysis
     reason: why no match

3. If confidence >= 0.7:
   - Use createPayeeObject with exact CSV id and name

4. Never score above 0.4 for category-only matches

Example low confidence call:
createPayeeObject({{
  id: null,
  name: null,
  confidence: 0.4,
  thinking: "Only matches store category",
  reason: "No specific name match"
}})

Input: {input} 
`,
  inputVariables: ['csv', 'input'],
  partialVariables: {
    format_instructions:
      StructuredOutputParser.fromZodSchema(PayeeSchema).getFormatInstructions(),
  },
});
