"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs = require('fs');
const AdmZip = require('adm-zip');
const iconv = require('iconv-lite');
const nginxUrl = 'http://10.10.8.14:9598/';
const dirPath = '/data/nginxapps/BossYuanXing/boss.zip';
let AppService = class AppService {
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
        zip1.extractAllTo(path_1.join(__dirname, '..', 'upload'));
        if (dirpathName.lastIndexOf('/') !== -1) {
            return nginxUrl + dirpathName + 'index.html';
        }
        else {
            return nginxUrl + 'index.html';
        }
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map