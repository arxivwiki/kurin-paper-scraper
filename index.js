#!/usr/bin/env node
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

async function getExistingUrls() {
    const data = await fs.promises.readFile('pairs.txt');
    const lines = ("" + data)
                    .split('\n')
                    .map(x => x.split(',')[1])
                    .filter(x => x)
                    .map(x => x.split('https://www.notion.so')[1])
                    .filter(x => x);
    return lines;
}

async function parse(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const existingUrls = await getExistingUrls();

    const notionPage = await getNotionPage(page, url);
    const links = notionPage.querySelectorAll('a');

    let notionLinks = [];
    for (let idx = 0; idx < links.length; idx++) {
        let link = links[idx];
        let l = link.rawAttrs.split('href="')[1].split('" ')[0];
        if (l.startsWith("/")) {
            // have we reached a known url yet?
            if (existingUrls.indexOf(l) !== -1) {
                break;
            }
            notionLinks.push("https://www.notion.so" + l);
        }
    }
    console.log("Number of new links: ", notionLinks.length);

    notionLinks.reverse();
    for (const l of notionLinks) {
        await new Promise(resolve => setTimeout(resolve, 500 + 500*Math.random()));
        const p = await getNotionPage(page, l);
        const spans = p.querySelectorAll('span');
        let aLink = undefined;
        for (let s of spans) {
            let text = (s.childNodes[0] || {}).rawText || "";
            if (text.indexOf("arxiv.org") !== -1) {
                aLink = text;
                break;
            }
        }
        fs.appendFile('pairs.txt', aLink + ',' + l  + '\n', () => {});
    }
    browser.close();
    return;
};

parse(url);
