import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto('https://www.ofx.com/en-au/exchange-rates/usd-to-pkr/');

    // Wait for the data to load (you might need to adjust the selector and waiting time)
    await page.waitForSelector('.ofx-historical-rates__table tbody');

    // Click the "Monthly" radio button
    await page.click('#choice_frequency_monthly');

    // Extract the data from the table
    const data = await page.evaluate(() => {
      const tableRows = Array.from(document.querySelectorAll('.ofx-historical-rates__table tbody tr'));
    
      // Get the last 3 rows
      const lastThreeRows = tableRows.slice(-3);
    
      return lastThreeRows.map(row => {
        const columns = row.querySelectorAll('td');
        return {
          date: columns[0].textContent,
          rate: columns[1].textContent,
        };
      });
    });

    // Close the browser
    await browser.close();

    // Send the data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
}
