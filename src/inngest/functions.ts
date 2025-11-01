import { Agent, openai, gemini, createAgent, grok } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sanbox-id", async () => {
      const sandbox = await Sandbox.create("vibest-nextjs-maks");
      return sandbox.sandboxId;
    });
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer, You summarize in two words",
      model: gemini({ model: "gemini-2.5-pro" }),
    });
    const { output } = await summarizer.run(
      `Summarize the following text: ${event.data.value} `
    );

    const sanboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // await step.sleep("wait-a-moment", "5s");
    return { output, sanboxUrl };
  }
);
