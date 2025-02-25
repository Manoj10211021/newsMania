import puppeteer from "puppeteer";
import fs from "fs";

async function main() {
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  let headlines = {
    ET: {},
    Hindu: {},
    HT: {},
    TOI: {},
    covid: {},
  };

  let page = await browser.newPage();

  try {
    await page.goto("https://economictimes.indiatimes.com/", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".latestTopstry.flt", { visible: true });

    let ETnews = await page.$$eval(".latestTopstry.flt", (elements) =>
      elements.map((el) => el.getAttribute("alt"))
    );

    headlines["ET"] = ETnews.slice(0, 7);
    console.log("Fetched Economic Times headlines successfully!");
  } catch (error) {
    console.error("Error while scraping Economic Times:", error);
  }

  // The Hindu
  try {
    await page.goto("https://www.thehindu.com/", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector("h3 a", { visible: true });

    let HinduNews = await page.$$eval("h3 a", (elements) =>
      elements.map((el) => el.innerText)
    );

    headlines["Hindu"] = HinduNews.slice(0, 7);
    console.log("Fetched The Hindu headlines successfully!");
  } catch (error) {
    console.error("Error while scraping The Hindu:", error);
  }

  // Hindustan Times
  try {
    await page.goto("https://www.hindustantimes.com/", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".hdg3 a", { visible: true });

    let HTNews = await page.$$eval(".hdg3 a", (elements) =>
      elements.map((el) => el.innerText)
    );

    headlines["HT"] = HTNews.slice(0, 7);
    console.log("Fetched Hindustan Times headlines successfully!");
  } catch (error) {
    console.error("Error while scraping Hindustan Times:", error);
  }

  // Times of India
  try {
    await page.goto("https://timesofindia.indiatimes.com/india", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".headline a", { visible: true });

    let TOINews = await page.$$eval(".headline a", (elements) =>
      elements.map((el) => el.innerText)
    );

    headlines["TOI"] = TOINews.slice(0, 7);
    console.log("Fetched TOI headlines successfully!");
  } catch (error) {
    console.error("Error while scraping TOI:", error);
  }

  // Save results to JSON file
  fs.writeFileSync("finalDa.json", JSON.stringify(headlines, null, 2));
  console.log("News data saved to finalDa.json");

  await browser.close();
}

main();
