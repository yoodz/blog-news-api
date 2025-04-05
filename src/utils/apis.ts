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
    console.log(data, 'pis-14')
}

export async function updateRss(reqData) {
    console.log(reqData, 'apis-18')
    const response = await fetch(`${BASE_URL}/rss/update`, {
        method: 'post',
        body: JSON.stringify(reqData),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data, 'pis-12')
}

export async function getRss(init) {
    const response = await fetch(`${BASE_URL}/rss?init=${init}`);
    const data = await response.json();
    console.log(data, 'apis-34')
    return data.result || [];
}

export async function insertArticle(reqData) {
    const response = await fetch(`${BASE_URL}/article/addMany`, {
        method: 'post',
        body: JSON.stringify({list: reqData}),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data, 'pis-41')
}