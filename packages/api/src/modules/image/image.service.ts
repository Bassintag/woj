import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../interfaces/app-config.interface';
import * as fs from 'node:fs/promises';

@Injectable()
export class ImageService {
  private readonly rootPath: string;

  constructor(private readonly config: ConfigService<AppConfig>) {
    this.config.getOrThrow('IMAGES_DIRECTORY');
  }

  async save(path: string, data: Parameters<(typeof fs)['writeFile']>[1]) {
    await fs.writeFile(path, data);
  }
}
