import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

// Define the schema using zod
const repoSummarySchema = z.object({
  summary: z.string().describe("A concise 2-3 sentence summary of the repository's main purpose and features"),
  cool_facts: z.array(z.string()).describe("A list of 3-5 interesting facts or key features about the repository"),
  tech_stack: z.string().describe("Comma separated list of technologies used in the project"),
  target_audience: z.string().describe("Primary intended users or developers for this project")
});

/**
 * Generates a summary of a GitHub repository from its README content
 * @param {string} readmeContent - The README content of the repository
 * @returns {Promise<Object>} - Object containing summary and cool facts
 */
export const generateGitHubSummary = async (readmeContent) => {
  try {
    console.log("[LangChain] Initializing AI model for GitHub summary");
    
    // Initialize the model
    const model = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create a model that outputs according to the schema
    const modelWithStructuredOutput = model.withStructuredOutput(repoSummarySchema);

    // Create prompt template
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant that summarizes GitHub repositories.
      Please analyze this README content and provide a concise summary and interesting facts.
      
      README Content:
      {readme_content}
    `);

    console.log("[LangChain] Creating chain and processing README content");
    
    // Create a sequence for processing the README content
    const chain = promptTemplate.pipe(modelWithStructuredOutput);

    // Run the chain
    const result = await chain.invoke({
      readme_content: readmeContent
    });

    console.log("[LangChain] Successfully processed README content with structured output");
    
    return {
      summary: result.summary,
      cool_facts: result.cool_facts,
      tech_stack: result.tech_stack,
      target_audience: result.target_audience
    };
  } catch (error) {
    console.error(`[LangChain ERROR] ${error.message}`);
    console.error(`[LangChain ERROR STACK] ${error.stack}`);
    
    // Return a fallback response if model or parsing fails
    return {
      summary: "Failed to generate summary due to error",
      cool_facts: ["Could not extract facts from the repository"],
      tech_stack: "Unknown",
      target_audience: "Unknown"
    };
  }
}; 