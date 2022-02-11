import { Browser, Page } from 'puppeteer';
import { BaseCrawler } from '../crawler';

export default class TestCrawler extends BaseCrawler {
    protected async crawl(_: Browser, page: Page) {
        await page.goto('https://gamewith.jp/uma-musume/article/show/268763');
        const a = await page.evaluate(() => document.querySelector("#article-body > table:nth-child(13)")?.innerHTML ?? '');
        console.log(a);
    }
}