import { Controller, Get, HttpException } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('error')
  throwError() {
    throw new Error('This is a test error');
  }

  @Get('http-error')
  throwHttpError() {
    throw new HttpException('This is an HTTP error', 400);
  }
}
