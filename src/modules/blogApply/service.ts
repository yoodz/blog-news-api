import { Injectable } from '@nestjs/common';
import { MongoDBService } from 'src/modules/mongo/mongo.service';
import IModules from './module'

const tableName = 'rss-url'
@Injectable()
export class BlogApplyService {
  constructor(private readonly mongoDBService: MongoDBService) { }

  getList() {
    return this.mongoDBService.find(tableName)
  }

  insert(data: IModules) {
    return this.mongoDBService.insert(tableName, data)
  }
}
