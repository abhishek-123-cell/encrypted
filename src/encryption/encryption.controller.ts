import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { EncryptDto } from './dto/encrypt.dto';

@Controller()
export class EncryptionController {
  constructor(private readonly service: EncryptionService) {}

  @Get()
  @Render('index')
  home() {
    return {};
  }

  @Get('api/encryption/generate')
  async generate() {
    return this.service.generateKeys();
  }

  @Post('api/encryption/encrypt')
  async encrypt(@Body() dto: EncryptDto) {
    return this.service.encryptAndStore(dto);
  }
}
