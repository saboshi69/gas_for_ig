import axios from "axios";
import cheerio from "cheerio";
import nodeHtmlToImage from "node-html-to-image";

export async function getGasPriceImage() {
  try {
    const response = await axios.get(
      "https://stockr.net/Toronto/GasPrice.aspx"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const todayPrice = $(".gasprice .result:first-child .price").text();
    const todayDate = $(".gasprice .result:first-child .date").text();
    const tomorrowPrice = $(".gasprice .result:last-child .price").text();

    const priceChange =
      parseFloat(tomorrowPrice.replace(",", ".")) -
      parseFloat(todayPrice.replace(",", "."));

    let changeSymbol = "";
    if (priceChange > 0) {
      changeSymbol = '<span style="color: green;">▲</span>';
    } else if (priceChange < 0) {
      changeSymbol = '<span style="color: red;">▼</span>';
    } else {
      changeSymbol = "";
    }

    const imageHtml = `
    <html>
    <head>
      <style>
        body {
            background-color: #707070;
            color: #ffffff;
            font-family: Arial, sans-serif;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 1080px;
            height: 1920px;
            border-top: 150px solid #303030;
            border-bottom: 150px solid #303030;
            box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <div>
        <div style="text-align: left; font-size: 58px; line-height: 1;">
            <h3>Toronto Gas Price</h3>
            <h4 style="display: block; margin-top: -45px;">${todayDate.trim()}</h4>
        </div>
        <h2 style="font-size: 120px;">¢${todayPrice.trim()} /L</h2>
        <p style="font-size: 55px; text-align: left;">Tomorrow's price: ${changeSymbol} ${
      priceChange === 0
        ? "No change"
        : `Change by ¢${Math.abs(priceChange).toFixed(2)} /L`
    }</p>
      </div>
    </body>
    </html>
    `;

    const imageBuffer = await nodeHtmlToImage({
      html: imageHtml,
      quality: 66,
      type: "jpeg",
      encoding: "buffer",
    });

    return imageBuffer;
  } catch (error) {
    console.error("Error generating image: ", error);
    throw error;
  }
}
