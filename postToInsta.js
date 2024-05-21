import { IgApiClient } from "instagram-private-api";
import { getGasPriceImage } from "./gasPriceImage.js";

// Load environment variables from .env file if not running in GitHub Actions
if (!process.env.GITHUB_ACTIONS) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

export async function postToInsta() {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  try {
    const imageBuffer = await getGasPriceImage();

    // Post to feed
    await ig.publish.photo({
      file: imageBuffer,
      caption: "Toronto Gas Price Update!",
    });

    // Post to story
    await ig.publish.story({
      file: imageBuffer,
    });

    console.log("The image was posted successfully to feed and story!");
  } catch (error) {
    console.error("Error posting image to Instagram: ", error);
  }
}

// Example usage (uncomment to test):
// postToInsta().catch(console.error);
