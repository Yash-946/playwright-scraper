//!scraping robot
// const playwright = require('playwright');

// async function scrapeWebsite(url){
//     const browser = await playwright.chromium.launch({ headless: true });
//     const context = await browser.newContext();
//     const page = await context.newPage();
//     await page.goto(url);
//     await browser.close();
// }


// scrapeWebsite('https://rbi.org.in/').then(data => {

// console.log(data);

// }).catch(e => {

// console.error(e);

// });





//!oxylabs

// const playwright = require('playwright');

// (async () => {
//     for (const browserType of ['chromium', 'firefox', 'webkit']) {
//       const browser = await playwright[browserType].launch();
//       const context = await browser.newContext();
//       const page = await context.newPage();
//       await page.goto("https://rbi.org.in/Scripts/NotificationUser.aspx");
//       await page.screenshot({path: `nodejs_${browserType}.png`, fullPage: true});
//       await page.waitForTimeout(1000);
//       await browser.close();
//     };
// })();



// //!oxylabs 2
// (async() =>{
//     const launchOptions = {
//         headless: false,
//         proxy: {
//            server: 'http://us-pr.oxylabs.io:10000',
//            username: 'USERNAME',
//            password: 'PASSWORD'
//         }
//     };
//     const browser = await playwright.chromium.launch(launchOptions);
//     const page = await browser.newPage();
//     await page.goto('https://rbi.org.in/Scripts/NotificationUser.aspx');
//     await page.waitForTimeout(5000);

//     const products = await page.$$eval('.example-min > .doublescroll', all_products => {
//         const data = [];
//         all_products.forEach(product => {
//             const header = product.querySelector('.tablebg');
//             // const title = titleEl ? titleEl.innerText : null;
//             // const priceEl = product.querySelector('.a-price');
//             // const price = priceEl ? priceEl.innerText : null;
//             // const ratingEl = product.querySelector('.a-icon-alt');
//             // const rating = ratingEl ? ratingEl.innerText : null;
//             data.push({header});
//         });
//         return data;
//     });
//     console.log(products);
//     await browser.close();
// })();


const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://rbi.org.in/Scripts/NotificationUser.aspx');

    // Extracting the text content of all h2 tags
    const headers = await page.$$eval('h2', headers => headers.map(header => header.textContent.trim()));

    const mainCont = await page.$$eval('td', headers => headers.map(header => header.textContent.trim()));
    
    // !mid menu 
    const elements = await page.$$eval('.midmenu a', elements => elements.map(element => element.textContent.trim()));

    //!left div
    const elements1 = await page.$$eval('.menuButton a', elements => elements.map(element => element.textContent.trim()));

    const images = await page.$$eval('.logo img', images => images.map(image => image.src));

    console.log("Headers:");
    console.log(headers);
    console.log(mainCont);
    console.log(elements);
    console.log(elements1);
    console.log(images);


    await browser.close();
})();
