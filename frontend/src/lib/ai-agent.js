import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// This client will talk to Amazon Bedrock
const client = new BedrockRuntimeClient({ 
  region: "us-east-1", 
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
  }
});

export const askFinancialAgent = async (prompt) => {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    }),
  });

  const response = await client.send(command);
  return JSON.parse(new TextDecoder().decode(response.body));
};