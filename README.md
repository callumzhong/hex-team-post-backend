![](https://jordan-ttc-design.github.io/hex-team-post/img/logo.f2912138.svg)

## Overview

此為 Secret Diary API Server Repository

服務項目

1. 代幣交易系統
2. 貼文管理及兌換
3. 使用者管理
4. 第三方 imgur 圖床
5. Email 寄送

## Deploy

此專案佈署於 heroku 平台。

## 主要技術

|          | 技術       |
| -------- | ---------- |
| 核心語言 | Node.js    |
| 框架     | Express.js |
| 模板引擎 | EJS        |
| 資料庫   | MongoDB    |
| 單元測試 | Mocha      |

- 此 App 的核心體系為 Node.js + Express.js，以 Yarn 來管理套件。
- 單元測試部分，僅有初步的金流 API 測試
- 其他依賴套件請參考專案 [package.json](./package.json)

## Installation

如欲在本地端啟動，必須先安裝 [Node.js](https://nodejs.org/en/) 與 [Yarn](https://yarnpkg.com/)。<br>
推薦使用 [nvm](https://github.com/coreybutler/nvm-windows) 來安裝指定版本的 Node.js。

- Node.js v16.14.2
- Yarn v1.22.15

### 下載專案

請先從 Github clone 本專案:

```
$ git clone https://github.com/callumzhong/hex-team-post-backend.git
```

並安裝依賴套件 `$ yarn install`

### 設置 .env file

請參考專案檔案 [.env.example](./.env.example)。

- DATABASE： MongoDB 資料庫連線字串 (example 是亂打的請替換)
- JWT： https://www.npmjs.com/package/jsonwebtoken
- Imgur： 圖床
- Gmail： 請輸入個人可使用的 Gamil 帳戶，做為通知信發送用
- Newebpay： 藍新金流參數請至官方文件查詢

Ps. 藍新金流 API，不支持 localhost 串接。請使用 [ngrok](https://ngrok.com/) 虛擬出一個網域。並將該網域填入 env 的 HOST_URL 條目。

## 開發人員

- [Callum](https://github.com/callumzhong)
- [EmptyWu](https://github.com/EmptyWu)
