export function request(ctx) {
    const { ingredients = [] } = ctx.args;
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
    return {
      resourcePath: `/model/anthropic.claude-sonnet-4-20250514-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    if (ctx.error) {
      util.error(ctx.error.message, ctx.error.type);
    }
    if (ctx.result.statusCode !== 200) {
      util.error(ctx.result.body, "BedrockError");
    }
    const parsedBody = JSON.parse(ctx.result.body);
    const res = {
      body: parsedBody.content[0].text,
    };
    return res;
  }
