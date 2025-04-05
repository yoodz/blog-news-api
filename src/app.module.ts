import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { BlogApplyController } from './modules/blogApply/controller';
import { AppService } from './app.service';
import TasksService from './modules/task/TasksService'
import { BlogApplyService } from './modules/blogApply/service'
// import { MongoDBModule } from './modules/mongo/mongo.module';

@Module({
  imports: [ScheduleModule.forRoot()],
  // controllers: [AppController, BlogApplyController],
  controllers: [],
  // providers: [AppService, TasksService, BlogApplyService],
  providers: [TasksService,],
})
export class AppModule { }
