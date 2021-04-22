'use strict';

const puppeteer = require('puppeteer');
const parser = require('node-html-parser');
const fs = require('fs');

const url = 'https://www.notion.so/Paper-Notes-by-Vitaly-Kurin-97827e14e5cd4183815cfe3a5ecf2f4c';


async function getNotionPage(page, url) {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const content = await page.content();
    const root = parser.parse(content);

    const notionPage = root.querySelector('#notion-app');
    return notionPage;
}

async function parse(url, stop_pt) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const notionPage = await getNotionPage(page, url);
    const links = notionPage.querySelectorAll('a');

    let notionLinks = [];
    links.forEach(link => {
        const l = link.rawAttrs.split('href="')[1].split('" ')[0];
        if (l.startsWith("/")) {
            notionLinks.push("https://www.notion.so" + l);
        }
    });


    if (stop_pt !== undefined) {
        notionLinks = notionLinks.slice(0, stop_pt)
    }

    for (const l of notionLinks) {
        await new Promise(resolve => setTimeout(resolve, 500 + 500*Math.random()));
        const p = await getNotionPage(page, l);
        const spans = p.querySelectorAll('span');
        let aLink = undefined;
        for (let s of spans) {
            let text = s.childNodes[0].rawText;
            if (text.indexOf("arxiv.org") !== -1) {
                aLink = text;
                break;
            }
        }
        fs.appendFile('new_pairs.txt', aLink + ',' + l  + '\n', () => {});
    }
    browser.close();

    // console.log(notionLinks);
    // console.log(arXivLinks);

    return;
};


parse(url);
