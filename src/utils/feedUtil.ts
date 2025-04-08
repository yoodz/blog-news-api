import { hostname } from 'os';
import Parser from 'rss-parser';
import dayjs from 'dayjs'

import { IResult } from 'src/interface/common'

type CustomFeed = { foo: string };
type CustomItem = { bar: number };

const parser: Parser<CustomFeed, CustomItem> = new Parser({
    customFields: {
        feed: ['foo'],
        item: ['bar']
    }
});

/**
 * 
 * @param date 
 * @param inXDay 在 inXDay 以内
 * @returns 
 */
function isWithinXHours(date, inXDay: number = 1) {
    const now = dayjs(); // 当前时间
    const targetDate = dayjs(date); // 目标日期

    // 计算时间差（毫秒）
    const diffInMilliseconds = now.diff(targetDate);

    // 判断时间差是否在 24 小时内（24 小时 = 24 * 60 * 60 * 1000 毫秒）
    return Math.abs(diffInMilliseconds) <= inXDay * 24 * 60 * 60 * 1000;
}

/**
 * 
 * @param inXDay 在 inXDay 以内
 * @returns 
 */
async function parserFeedUrl(validUrls, inXDay: number = 1) {
    // const url = 'https://hadb.me/atom.xml'
    // const url = 'https://innei.in/feed'
    if (!validUrls?.length) return { result: [], requsetStatus: [] }
    const result: IResult[][] = [];
    // 记录多个rss地址的初始化状态
    const requsetStatus = Array.from({length: validUrls.length}).fill(false);
    for (let index = 0; index < validUrls.length; index++) {
        const url = validUrls[index];
        const currentResut: IResult[] = []
        try {
            let feed = await parser.parseURL(url);
            requsetStatus[index] = true;
            feed.items.forEach(item => {
                const { title = '', link = '', pubDate = '' } = item || {}
                if (isWithinXHours(pubDate, inXDay)) {
                    const urlFormat = new URL(link || '')
                    currentResut.push({
                        title,
                        link,
                        pubDate: dayjs(pubDate).format('YYYY-MM-DD HH:ss'),
                        hostname: urlFormat.hostname,
                        createAt: dayjs().valueOf(),
                        pv: 0,
                        like: 0
                    })
                }

            });
        } catch (error) {
            console.error(`request new article error, ${JSON.stringify(error)}`);
            continue
        }
        result[index] = currentResut
    }
    return { result, requsetStatus }
}

export {
    parserFeedUrl
}