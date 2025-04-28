import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

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

    // Create prompt template
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are a helpful assistant that summarizes GitHub repositories.
      Please analyze this README content and provide a concise summary and interesting facts.
      Format your response as a JSON object with exactly these fields:
      {
        "summary": "A concise 2-3 sentence summary of the repository's main purpose and features",
        "cool_facts": ["fact1", "fact2", "fact3"],
        "tech_stack": "Comma separated list of technologies used",
        "target_audience": "Primary intended users or developers"
      }
      
      README Content:
      {readme_content}
      
      Your response must be valid JSON that can be parsed with JSON.parse().
    `);

    console.log("[LangChain] Creating chain and processing README content");
    
    // Create a sequence for processing the README content
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);

    // Run the chain
    const response = await chain.invoke({
      readme_content: readmeContent
    });

    console.log("[LangChain] Successfully processed README content");
    
    try {
      // Parse the JSON response
      // Find JSON content in the response (in case the model adds extra text)
      let jsonStr = response;
      
      // Try to extract just the JSON part if there's additional text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(jsonStr);
      
      return {
        summary: parsedResponse.summary || "No summary available",
        cool_facts: parsedResponse.cool_facts || [],
        tech_stack: parsedResponse.tech_stack || "Not specified",
        target_audience: parsedResponse.target_audience || "Not specified"
      };
    } catch (parseError) {
      console.error(`[LangChain ERROR] Failed to parse JSON: ${parseError.message}`);
      console.error(`[LangChain ERROR] Raw response: ${response}`);
      
      // Return a fallback response if parsing fails
      return {
        summary: "Failed to generate summary due to parsing error",
        cool_facts: ["Could not extract facts from the response"],
        tech_stack: "Unknown",
        target_audience: "Unknown"
      };
    }
  } catch (error) {
    console.error(`[LangChain ERROR] ${error.message}`);
    console.error(`[LangChain ERROR STACK] ${error.stack}`);
    throw new Error(`Failed to generate GitHub summary: ${error.message}`);
  }
}; 