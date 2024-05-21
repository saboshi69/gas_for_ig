import { IgApiClient } from "instagram-private-api";
import { getGasPriceImage } from "./gasPriceImage.js";

// Load environment variables from .env file if not running in GitHub Actions
if (!process.env.GITHUB_ACTIONS) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

async function postToInsta() {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);

  try {
    console.log("Attempting to log in to Instagram...");
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log("Login successful!");

    const imageBuffer = await getGasPriceImage();

    try {
      console.log("Attempting to post to feed...");
      await ig.publish.photo({
        file: imageBuffer,
        caption: "Toronto Gas Price Update!",
      });
      console.log("The image was posted successfully to the feed!");
    } catch (feedError) {
      console.error("Error posting image to Instagram feed:", feedError);
      throw feedError;
    }

    try {
      console.log("Attempting to post to story...");
      await retry(
        async () => {
          await ig.publish.story({
            file: imageBuffer,
          });
        },
        3,
        2000
      );
      console.log("The image was posted successfully to the story!");
    } catch (storyError) {
      console.error("Error posting image to Instagram story:", storyError);
      throw storyError;
    }
  } catch (loginError) {
    console.error("Error logging in to Instagram:", loginError);
    throw loginError;
  }
}

async function retry(fn, retries = 3, delay = 2000) {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= retries) {
        throw error;
      }
      console.log(`Retrying... Attempt ${attempts} of ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Example usage (uncomment to test):
// postToInsta().catch(console.error);

export { postToInsta };
