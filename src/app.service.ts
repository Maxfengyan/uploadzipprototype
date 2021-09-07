/* eslint-disable */

import { Injectable } from '@nestjs/common';
const fs = require('fs');
const AdmZip = require('adm-zip');
const iconv = require('iconv-lite');
const Excel = require('exceljs');
const { resolve } = require('path');
// zip上传预览
@Injectable()
export class AppService {
  uploadFile(buffer) {
    const nginxUrl = 'http://10.10.8.73:9598/';
    const dirPath = '/data/nginxapps/BossYuanXing/boss.zip';
    const reviewPath = '/data/nginxapps/BossYuanXing/';
    /* const dirPath = './file/boss.zip';
      const reviewPath = './file/'; */
    // 获取buffer读入zip
    const zip = new AdmZip();
    zip.writeZip(dirPath);
    fs.writeFileSync(dirPath, buffer);
    var dirpathName;

    // 创建zip流读取数据解压
    var zip1 = new AdmZip(dirPath);
    zip1.getEntries().forEach((entry) => {
      entry.entryName = iconv.decode(entry.rawEntryName, 'gbk');
      if (entry.entryName.lastIndexOf('index.html') >= 0) {
        dirpathName = entry.entryName;
      }
    });

    zip1.extractAllTo(reviewPath, true);

    return nginxUrl + dirpathName;
  }

  // excel上传预览
  async uploadExcel(buffer, originalname) {
    const dirPath = './file/' + originalname;
    fs.writeFileSync(dirPath, buffer);
    const resultPath =
      '/excelreview.html?excelname=' + encodeURIComponent(originalname);
    return resultPath;
  }

  async readExcel(query) {
    const dirname = query.excelname;
    const buffers = fs.readFileSync('./file/' + dirname);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffers);
    var workbookArr = [];

    workbook.eachSheet(function (worksheet, sheetId) {
      let data = [];
      const defaultHeight = worksheet.properties.defaultRowHeight;
      const defaultWidth = worksheet.properties.defaultColWidth || 10;
      worksheet.eachRow(function (row, rowNumber) {
        var cellItem = [];
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          // 比对是不是合并单元格

          // 文本颜色
          let color;
          if (
            cell.style.font &&
            cell.style.font.color &&
            cell.style.font.color.argb
          ) {
            let color16 = cell.style.font.color.argb;
            color = '#' + color16.substr(2, color16.length);
          }

          if (cell.model.address === cell.master._address) {
            // 富文本干掉提取文字
            if (
              typeof cell.value === 'object' &&
              cell.value &&
              cell.value.richText
            ) {
              var str = '';

              cell.value.richText.forEach((element) => {
                str = str + element.text;
              });
              cellItem.push({
                value: str,
                merge: false,
                width: cell._column.width || defaultWidth,
                height: row.height || defaultHeight,
                address: cell.model.address,
                color: color,
              });
            } else {
              // 普通文字
              cellItem.push({
                value: cell.value,
                merge: false,
                width: cell._column.width || defaultWidth,
                height: row.height || defaultHeight,
                address: cell.model.address,
                color: color,
              });
            }
          } else {
            // 存个空值
            cellItem.push({
              value: '',
              merge: true,
              width: cell._column.width || defaultWidth,
              height: row.height || defaultHeight,
              address: cell.model.address,
              color: color,
            });
          }
        });
        data.push(cellItem);
      });
      workbookArr.push({
        data: data,
        name: worksheet.name,
      });
    });
    return workbookArr;
  }
}
