import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { parserFeedUrl } from 'src/utils/feedUtil'
import { MongoDBService } from 'src/modules/mongo/mongo.service';
import { updateTimeInConfig, updateRss, getRss, insertArticle, postWithFetch } from 'src/utils/apis'
import dayjs from 'dayjs';

@Injectable()
export default class TasksService {
  private readonly logger = new Logger(TasksService.name);
  // constructor(private readonly mongoDBService: MongoDBService) { }

  // 每日执行一次，检查库里的rss地址是否有更新
  // @Cron('* * * * *')
  @Cron('50 5 * * *')
  async handleCron() {
    try {
      this.logger.debug('start every day check in 5:50');
      const rssUrl: any = await getRss(1)
      const validUrls = rssUrl?.map(item => item.rssUrl) || []
      const { result, requsetStatus } = await parserFeedUrl(validUrls, 5)
      for (let index = 0; index < requsetStatus.length; index++) {
        const element = requsetStatus[index];
        const { errorCount, rssUrl: _rssUrl } = rssUrl[index] || {}
        if (element) {
          if (result[index]?.length) {
            this.logger.debug(`get new article in every day check,${_rssUrl} - ${JSON.stringify(result[index])}`);
            await insertArticle(result[index])
          }
          await updateRss({ rssUrl: _rssUrl, updateAt: dayjs().format('YYYY-MM-DD HH:mm') })
        } else {
          this.logger.debug(` ${_rssUrl} 每天定时获取失败`);
          await updateRss({ rssUrl: _rssUrl, updateAt: dayjs().format('YYYY-MM-DD HH:mm'), errorCount: errorCount + 1 })
        }
      }
      updateTimeInConfig(dayjs().format('YYYY-MM-DD HH:mm'))
      await postWithFetch("https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/1127d4e5-ca37-4855-bfcb-ada9ae76c7df")
    } catch (error) {
      console.log(error, 'TasksService-42')
    }
  }

  // 5min 执行一次，检查有没有新审核通过的rss地址，进行初始化
  @Cron('*/5 * * * *')
  async initRssList() {
    try {
      this.logger.debug('[initRssList] Called when the current second is 5');
      // const rssUrl = await this.mongoDBService.find('rss-url', { deleted: 0, status: 1, init: 0 })
      const rssUrl: any = await getRss(0)
      const validUrls = rssUrl?.map(item => item.rssUrl) || []
      const { result, requsetStatus } = await parserFeedUrl(validUrls, 999)
      let flag = false
      // 更新rss url 初始化状态
      for (let index = 0; index < requsetStatus.length; index++) {
        const element = requsetStatus[index];
        const { errorCount, rssUrl: _rssUrl } = rssUrl[index] || {}
        if (element) {
          if (result[index]?.length) {
            // 更新获取到文章
            await insertArticle(result[index])
            flag = true
          }
          await updateRss({ rssUrl: _rssUrl, updateAt: dayjs().format('YYYY-MM-DD HH:mm'), errorCount: errorCount + 1, init: 1 })
        } else {
          this.logger.debug(`[initRssList] ${_rssUrl} 初始化失败`);
          await updateRss({ rssUrl: _rssUrl, updateAt: dayjs().format('YYYY-MM-DD HH:mm'), errorCount: errorCount + 1 })
        }
      }

      this.logger.debug(`flag: ${flag}`);
      if (flag) {
        await postWithFetch("https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/1127d4e5-ca37-4855-bfcb-ada9ae76c7df")
      }

    } catch (error) {

    }
  }
}
