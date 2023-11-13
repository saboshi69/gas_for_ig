// const axios = require("axios");
// const cheerio = require("cheerio");
// const nodeHtmlToImage = require("node-html-to-image");
// const fs = require("fs");
// const FormData = require("form-data");
import {
  PostPagePhotoMediaRequest,
  PostPublishMediaRequest,
  GetContainerRequest,
} from "instagram-graph-api";

const imageFilePath = "./gas-price-info.jpg";
const accessToken =
  "IGQWRQbk1oODdsbk1QejlqNDdQSnhpSlo4aE9mR3R3VzlYTEFmc2t1cEpMU3lIRGgyakdOUEM2TE5iRzJxeTd5WWt3ZA2c4NWFVTjYtS3FNNjVsR0FpckpxdlJlUmo0VmMwWnV6cGpLTE52bFhzSjVpdkpYTHg3MlEZD";
const pageId = "gta_gas_price";
// const pageId = "62750717607";
const imageUrl = "https://dummyimage.com/640x660/fff/aaa.jpg";
const caption = "Your photo caption";

// Create a new photo media container
const photoMediaRequest = new PostPagePhotoMediaRequest(
  accessToken,
  pageId,
  imageUrl,
  caption
);

// Execute the request to create the container
photoMediaRequest.execute().then((container) => {
  // Check the container status until it's 'FINISHED'
  const containerRequest = new GetContainerRequest(
    accessToken,
    container.getId()
  );
  // Continuously poll the container status until it's 'FINISHED', should not proceed to the next step until it's finished
  const interval = setInterval(() => {
    containerRequest
      .execute()
      .then((containerResponse) => {
        const status = containerResponse.getContainerStatus();
        console.log("Container status: ", status);
        if (status === "FINISHED") {
          clearInterval(interval);
        }
      })
      .catch((error) => {
        console.error("Error getting container status");
      });
  }, 5000);

  // Get the container status

  // containerRequest
  //   .execute()
  //   .then((containerResponse) => {
  //     containerResponse.getContainerStatus();
  //   })
  //   .catch((error) => {
  //     console.error("Error getting container status", error);
  //   });

  // Once the status is 'FINISHED', create a request to publish the container
  // If not finished, keep polling the status until it is

  //   const publishRequest = new PostPublishMediaRequest(client, {
  //     container_id: container.id,
  //   });

  //   // Execute the publish request
  //   publishRequest
  //     .execute()
  //     .then((response) => {
  //       console.log("Photo published!", response);
  //     })
  //     .catch((error) => {
  //       console.error("Error publishing photo", error);
  //     });
  // })
  // .catch((error) => {
  //   console.error("Error creating photo container", error);
  //
});

// axios
//   .get("https://stockr.net/Toronto/GasPrice.aspx")
//   .then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const todayPrice = $(".gasprice .result:first-child .price").text();
//     const todayDate = $(".gasprice .result:first-child .date").text();
//     const tomorrowPrice = $(".gasprice .result:last-child .price").text();

//     const priceChange =
//       parseFloat(tomorrowPrice.replace(",", ".")) -
//       parseFloat(todayPrice.replace(",", "."));

//     let changeSymbol = "";
//     if (priceChange > 0) {
//       changeSymbol = '<span style="color: green;">▲</span>';
//     } else if (priceChange < 0) {
//       changeSymbol = '<span style="color: red;">▼</span>';
//     }

//     const imageHtml = `
//     <html>
//     <head>
//       <style>
//         body {
//             background-color: #707070;
//             color: #ffffff;
//             font-family: Arial, sans-serif;
//             text-align: center;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             flex-direction: column;
//             width: 1080px;
//             height: 1080px;
//             border-top: 150px solid #303030;
//             border-bottom: 150px solid #303030;
//             box-sizing: border-box;
//         }
//       </style>
//     </head>
//     <body>
//       <div>
//         <div style="text-align: left; font-size: 58px; line-height: 1;">
//             <h3>Toronto Gas Price</h3>
//             <h4 style="display: block; margin-top: -45px;">${todayDate.trim()}</h4>
//         </div>
//         <h2 style="font-size: 120px;">¢${todayPrice.trim()} /L</h2>
//         <p style="font-size: 55px; text-align: left;">Tomorrow's price: ${changeSymbol} ${
//       priceChange === 0
//         ? "No change"
//         : `Change by ¢${Math.abs(priceChange).toFixed(2)} /L`
//     }</p>
//       </div>
//     </body>
//     </html>

//     `;

//     return nodeHtmlToImage({
//       output: "./gas-price-info.jpg",
//       html: imageHtml,
//       quality: 66,
//       type: "jpeg",
//       content: {
//         /* ... */
//       },
//     });
//   })
//   .then(() => {
//     console.log("The image was created successfully!");
//     postImageToInstagram();
//   })
//   .catch((error) => {
//     console.error("Error generating image: ", error);
//   });
