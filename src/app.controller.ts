import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // file对应HTML表单的name属性
  UploadedFile(@UploadedFile() file) {
    return this.appService.uploadFile(file.buffer);
  }

  @Post('uploadexcel')
  @UseInterceptors(FileInterceptor('file')) // file对应HTML表单的name属性
  UploadExcel(@UploadedFile() file) {
    return this.appService.uploadExcel(file.buffer, file.originalname);
  }

  @Get('readexcel')
  Readexcel(@Query() query) {
    return this.appService.readExcel(query);
  }
}
