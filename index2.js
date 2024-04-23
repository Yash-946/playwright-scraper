const { chromium } = require("playwright");
const axios = require("axios");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://rbi.org.in/Scripts/NotificationUser.aspx");

  const links = await page.$$eval("a.link2", (elements) => {
    return elements.map((element) => ({
      href: `https://rbi.org.in/Scripts/` + element.getAttribute("href"),
    }));
  });

  // console.log(links[3].href);
  // extractText(links[3].href);

  const combinedData = {
    extractedContent: [],
  };

  const extractedResults = await Promise.all(
    links.map((link) => extractText(link.href))
  );

  combinedData.extractedContent = extractedResults;

  console.log("Collected JSON Data:");
  console.log(JSON.stringify(combinedData, null, 2));

  const pdf = await page.$$eval('td[colspan="3"] a', (elements) => {
    return elements.map((element) => ({
      href: element.getAttribute("href"),
    }));
  });

  // downloading pdf files
  // for (let index = 0; index < pdf.length; index++) {
  //   downloadPDF(pdf[index].href, `downloaded-document-${index}.pdf`);
  // }

  await browser.close();
})();

async function downloadPDF(pdfUrl, outputFilePath) {
  try {
    const response = await axios({
      method: "GET",
      url: pdfUrl,
      responseType: "stream",
    });

    const fileStream = fs.createWriteStream(outputFilePath);

    response.data.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log("Download completed.");
    });

    fileStream.on("error", (error) => {
      console.error("Error while downloading the file:", error);
    });
  } catch (error) {
    console.error("Error during HTTP request:", error);
  }
}

async function extractText(url) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  const data = {
    heading: [], // Array to hold heading data
    mainContent: [], // Array for main content data
    tableData: [], // Array for table data
  };


  //heading
  const heading = await page.$$eval("td b", (headers) =>
    headers.map((header) => header.textContent.trim())
  );
  // console.log(heading.join("\n"));
  data.heading = heading;

  //main content
  const mainCont = await page.$$eval("td p", (paragraphs) =>
    paragraphs.map((paragraph) => paragraph.textContent.trim())
  );
  // console.log(mainCont.join("\n"));
  data.mainContent = mainCont

  //table data
  const table = await page.$$eval("table tbody .tablebg tr", (paragraphs) =>
    paragraphs.map((paragraph) => paragraph.textContent.trim())
  );
  // console.log(table.join("\n"));
  data.tableData = table

  // console.log(data);
  
  await browser.close();
  return data;
}
