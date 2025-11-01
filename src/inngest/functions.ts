import { Agent, openai, gemini, createAgent, grok } from "@inngest/agent-kit";
import { inngest } from "./client";
import { success } from "zod";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer, You summarize in two words",
      model: gemini({ model: "gemini-2.5-pro" }),
    });
    const { output } = await summarizer.run(
      `Summarize the following text: ${event.data.value} `
    );

    // await step.sleep("wait-a-moment", "5s");
    return { output };
  }
);
