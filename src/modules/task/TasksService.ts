import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { parserFeedUrl } from 'src/utils/feedUtil'
import { MongoDBService } from 'src/modules/mongo/mongo.service';
import dayjs from 'dayjs';

@Injectable()
export default class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly mongoDBService: MongoDBService) { }

  // 每日执行一次，检查库里的rss地址是否有更新
  @Cron('0 9 * * *')
  async handleCron() {
    this.logger.debug('start every day check');
    const rssUrl = await this.mongoDBService.find('rss-url', { deleted: 0, status: 1 })
    const validUrls = rssUrl?.map(item => item.rssUrl) || []
    const { result, requsetStatus } = await parserFeedUrl(validUrls)
    console.log(result, 'TasksService-19')


    for (let index = 0; index < requsetStatus.length; index++) {
      const element = requsetStatus[index];
      const { errorCount, rssUrl: _rssUrl } = rssUrl[index] || {}
      console.log(element, 'TasksService-32')
      if (element) {
        if (result.length) {
          this.mongoDBService.insertMany('article', result)
        }
        await this.mongoDBService.update('rss-url', { rssUrl: _rssUrl }, { updateAt: dayjs().format('YYYY-MM-DD HH:mm') })
      } else {
        this.logger.debug(` ${_rssUrl} 每天定时获取失败`);
        await this.mongoDBService.update('rss-url', { rssUrl: _rssUrl }, { errorCount: errorCount + 1, updateAt: dayjs().format('YYYY-MM-DD HH:mm') })
      }
    }
    await this.mongoDBService.insertOrUpdate('config', {}, { updateAt: dayjs().valueOf() })
  }

  // 5min 执行一次，检查有没有新审核通过的rss地址，进行初始化
  @Cron('*/5 * * * *')
  async initRssList() {
    this.logger.debug('[initRssList] Called when the current second is 5');
    const rssUrl = await this.mongoDBService.find('rss-url', { deleted: 0, status: 1, init: 0 })
    const validUrls = rssUrl?.map(item => item.rssUrl) || []
    const { result, requsetStatus } = await parserFeedUrl(validUrls, 999)
    console.log(result, requsetStatus, 'TasksService-46')

    // 更新rss url 初始化状态
    for (let index = 0; index < requsetStatus.length; index++) {
      const element = requsetStatus[index];
      const { errorCount, rssUrl: _rssUrl } = rssUrl[index] || {}
      if (element) {
        if (result.length) {
          // 更新获取到文章
          await this.mongoDBService.insertMany('article', result)
        }
        await this.mongoDBService.update('rss-url', { rssUrl: _rssUrl }, { init: 1, updateAt: dayjs().format('YYYY-MM-DD HH:mm') })
      } else {
        this.logger.debug(`[initRssList] ${_rssUrl} 初始化失败`);
        await this.mongoDBService.update('rss-url', { rssUrl: _rssUrl }, { errorCount: errorCount + 1, updateAt: dayjs().format('YYYY-MM-DD HH:mm') })
      }
    }
  }
}
