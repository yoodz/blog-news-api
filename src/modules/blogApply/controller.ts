/**
 * 博客 rss 申请
 */
import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { BlogApplyService } from './service';
import IModules from './module';

@Controller('blogApply')
export class BlogApplyController {
  constructor(private readonly blogApplyService: BlogApplyService) {}

  @Get()
  async getList(): Promise<any[]> {
    const result = await this.blogApplyService.getList();
    return result;
  }

  @Post()
  async insert(@Body() blogData: IModules, @Headers() header) {
    blogData = {
      ...blogData,
      deleted: 0,
      errorCount: 0,
      status: 0,
      init: 0
    }
    const result = await this.blogApplyService.insert(blogData);
    console.log(result, 'controller-27')
    return result.insertedId
  }
}
