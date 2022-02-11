import puppeteer, { Browser, Page } from 'puppeteer';

export type ClawlerConfig = puppeteer.LaunchOptions & puppeteer.BrowserLaunchArgumentOptions & puppeteer.BrowserConnectOptions & { product?: puppeteer.Product; extraPrefsFirefox?: Record<string, unknown>; };
export interface Crawler {
    config: ClawlerConfig;
    run(): Promise<void>;
}

export abstract class BaseCrawler implements Crawler {
    public config: ClawlerConfig = {};
    public setConfig(config: ClawlerConfig) {
        this.config = config;
    }
    async run(): Promise<void> {
        const browser = await puppeteer.launch(this.config);
        const _page = await browser.newPage();
        await this.crawl(browser, _page);
        await browser.close();
    }

    protected abstract crawl(browser: Browser, page: Page): any;
}