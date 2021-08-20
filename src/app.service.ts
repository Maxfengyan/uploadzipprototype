/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { join } from 'path';
const fs = require('fs');
const AdmZip = require('adm-zip');
const iconv = require('iconv-lite');

const nginxUrl = 'http://10.10.8.73:9598/';
const dirPath = '/data/nginxapps/BossYuanXing/boss.zip';
const reviewPath = '/data/nginxapps/BossYuanXing/';
// const dirPath = join(__dirname, '..', 'upload', `boss.zip`);

@Injectable()
export class AppService {
  uploadFile(buffer) {
    const zip = new AdmZip();
    zip.writeZip(dirPath);
    fs.writeFileSync(dirPath, buffer);
    var dirpathName;
    var zip1 = new AdmZip(dirPath);
    zip1.getEntries().forEach((entry, index) => {
      entry.entryName = iconv.decode(entry.rawEntryName, 'gbk');
      if (index === 0) {
        dirpathName = entry.entryName;
      }
    });

    zip1.extractAllTo(reviewPath);
    // 判断文件夹有没有层级关系
    if (dirpathName.lastIndexOf('/') !== -1) {
      return nginxUrl + dirpathName + 'index.html';
    } else {
      return nginxUrl + 'index.html';
    }
  }
}
