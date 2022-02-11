import { Cluster } from 'puppeteer-cluster';
import { Task } from './tasks';

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 8,
        puppeteerOptions: {
            // headless: false,
            // devtools: true,
        }
    });

    cluster.on('taskerror', (err, data) => console.error(`Error crawling ${data}: ${err.message}`));

    cluster.queue('https://gamewith.jp/uma-musume/article/show/258835', Task.RaceListPage);
    cluster.queue('https://gamewith.jp/uma-musume/article/show/268763', Task.RacePage);
    cluster.queue('https://gamewith.jp/uma-musume/article/show/268848', Task.RacePage);


    await cluster.idle();
    await cluster.close();
})();

