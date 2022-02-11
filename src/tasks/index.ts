import fs from 'fs/promises';
import { Page } from 'puppeteer';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';

export namespace Task {
    interface TaskFunctionArguments<JobData> { page: Page; data: JobData; worker: { id: number; }; }
    async function task_function<JobData, ReturnData>(args: TaskFunctionArguments<JobData>, callback: (args: TaskFunctionArguments<JobData>) => Promise<ReturnData>): Promise<ReturnData> {
        const { page } = args;
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') req.abort(); else req.continue();
        });
        return callback(args);
    }


    export const RaceListPage: TaskFunction<string, string> = async (args) => task_function(args, async (args) => {
        const { page, data: url } = args;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const target_element_value = await page.evaluate(() => document.querySelector<HTMLTableElement>("#article-body > div.w-instant-database-list > div > table")?.innerHTML ?? '');
        fs.writeFile('a.txt', target_element_value);

        return target_element_value
    });


    export const RacePage: TaskFunction<string, string> = async (args) => task_function(args, async (args) => {
        const { page, data: url } = args;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const target_element = await page.evaluate(() => document.querySelector<HTMLTableElement>("#article-body > table:nth-child(13)"));
        return target_element?.innerHTML ?? '';
    });
}
