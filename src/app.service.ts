/* eslint-disable */

import { Injectable } from '@nestjs/common';
const fs = require('fs');
const AdmZip = require('adm-zip');
const iconv = require('iconv-lite');
// const Excel = require('exceljs');

const nginxUrl = 'http://10.10.8.73:9598/';
const dirPath = '/data/nginxapps/BossYuanXing/boss.zip';
const reviewPath = '/data/nginxapps/BossYuanXing/';
/* const dirPath = './file/boss.zip';
const reviewPath = './file/'; */

@Injectable()
export class AppService {
  uploadFile(buffer) {
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
}

//   async uploadExcel(buffer) {
//     const workbook = new Excel.Workbook();
//     await workbook.xlsx.load(buffer);
//     var arr = [];
//     workbook.eachSheet(function (worksheet, sheetId) {
//       // 如果sheet name不等于变更履历和目录的话
//       // if (worksheet.name !== "变更履历" && worksheet.name !== "目录") {
//       // 整理数据
//       let data = [];
//       if (worksheet.name == '修改权重配置信息接口') {
//         worksheet.eachRow(function (row, rowNumber) {
//           if (rowNumber === 4) {
//             row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
//               // 比对是不是合并单元格
//               // console.log(cell.style);
//               console.log(cell.value);

//               /* if(cell.model.address + cell.master._address) {
//                 data.push({
//                   value: cell.value,
//                   width: cell._column.width
//                 })
//               }; */
//               // console.log(cell._column.width);
//               // if (cell.model.type)
//               // console.log(cell.model.address + '||' + cell.model.type);
//               // console.log(cell.model.address + '||' + cell.master);
//             });
//           }

//           // arr.push(JSON.stringify(row.values));
//         });
//       }
//     });

//     /* worksheet.eachRow(function (row, rowNumber) {
//       console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
//     }); */
//     return arr;
//     // const pathExcel = buffer.path;

//     // 判断文件夹有没有层级关系
//     /* if (dirpathName.lastIndexOf('/') !== -1) {
//       return nginxUrl + dirpathName + 'index.html';
//     } else {
//       return nginxUrl + 'index.html';
//     } */
//   }
// }
