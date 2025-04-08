import fetch from 'node-fetch';

const BASE_URL = 'https://cf.afunny.top'
// const BASE_URL = 'http://127.0.0.1:8787'
export async function updateTimeInConfig(date) {
    const response = await fetch(`${BASE_URL}/config/update_at`, {
        method: 'post',
        body: JSON.stringify({
            "value": date
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(`更新config配置成功：reqData：${JSON.stringify(data)}`);
}

export async function updateRss(reqData) {
    const response = await fetch(`${BASE_URL}/rss/update`, {
        method: 'post',
        body: JSON.stringify(reqData),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data, 'pis-12')
    console.log(`更新rss成功：reqData：${JSON.stringify(reqData)}`);
}

export async function getRss(init) {
    const response = await fetch(`${BASE_URL}/rss?init=${init}`);
    const data = await response.json();
    console.log(`获取到${init ? '初始化的' : "未初始化"}rss的列表长度为  ${data.result?.length}`);
    return data.result || [];
}

export async function insertArticle(reqData) {
    const response = await fetch(`${BASE_URL}/article/addMany`, {
        method: 'post',
        body: JSON.stringify({ list: reqData }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(`新增文章成功, ${JSON.stringify(reqData)}`);
}