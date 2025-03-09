import { Module, Global } from '@nestjs/common';
import { MongoDBService } from './mongo.service';

@Global() // 注册为全局模块
@Module({
    providers: [
        {
            provide: MongoDBService,
            useValue: new MongoDBService(process.env.MONGO_URI || '', 'blog-news'),
        },
    ],
    exports: [MongoDBService], // 导出服务
})
export class MongoDBModule {}