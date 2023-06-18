import {browser} from "@wdio/globals";
import * as fs from 'fs';

describe('Data-Scraping', () => {
    let allLinks: any = [];
    it('Collecting All Links ', async () => {
        await browser.url('https://www.cancerandwork.ca/sitemap/');
        await browser.pause(9000);
        for await (const links of $$('//ul[@class=\'wsp-pages-list\']//a')) {
            allLinks.push(await links.getAttribute('href'));
        }
    })
    it('Traverse Each Link and Scrap Data from it', async () => {
        console.log("Started traversing each link");
        let x = 0;
        for (const link of allLinks) {
            console.log('Total Files Created as of now => '+ x );
            let name = link.replaceAll("https://www.cancerandwork.ca/", "");
            name = name.replaceAll("/","-");
            name = name.slice(0,-1);
            await browser.url(link);
            await browser.pause(4000);
            try {
                let contents = await $("//*[contains(@class,'site-content')]").getText();
                let txtFile = "scrappedData/" + name + ".txt";
                console.log('Total Files Created as of now => |'+ x + "| " + txtFile);
                // @ts-ignore
                fs.appendFile(txtFile, contents, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                x++;
            } catch (e) {
                console.log(e);
            }
        }

        console.log('Total Files Created as of now => '+ x );
        console.log('Total Pages Traversed => '+ allLinks.length );
    })
})
