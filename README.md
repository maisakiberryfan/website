# 苺咲べりぃ非官方粉絲網站

VTuber「苺咲べりぃ」的非官方粉絲網站，提供歌唱直播追蹤、歌單管理和相關內容展示功能。

## 🌟 功能特色

- **歌單管理**：完整的歌曲資料庫和演唱記錄
- **直播追蹤**：歌唱直播的時間線和內容記錄
- **個人資料**：べりぃ的詳細介紹和服裝展示
- **歷史記錄**：重要事件和里程碑時間線
- **檔案上傳**：透過 GitHub API 的內容管理功能

## 🚀 快速開始

### 前置需求

- 現代瀏覽器（支援 ES6 模組）
- 靜態檔案伺服器（開發用）

### 本地開發

1. **取得專案**
   ```bash
   git clone https://github.com/maisakiberryfan/website.git
   cd website
   ```

2. **啟動開發伺服器**
   ```bash
   # 使用 Python 3
   python -m http.server 8000
   
   # 或使用 Node.js serve
   npx serve .
   
   # 或使用 VS Code Live Server 擴充功能
   ```

3. **開啟瀏覽器**
   ```
   http://localhost:8000
   ```

## 📁 專案結構

```
├── index.html              # 主要 HTML 模板
├── tool.js                 # 核心 JavaScript 功能
├── uploadtool.js          # GitHub 上傳工具
├── firebase.json          # Firebase Hosting 配置
├── 
├── *.htm                  # 靜態內容頁面
├── *.md                   # Markdown 內容文件
├── setlist.json           # 歌單資料
├── streamlist.json        # 直播資料
└── worker/                # AI 歌單解析服務（獨立專案）
```

### 主要檔案說明

- `index.html` - 單頁應用程式的主要模板
- `tool.js` - 包含路由、內容載入、資料處理等核心功能
- `uploadtool.js` - GitHub API 整合和檔案上傳功能
- `setlist.json` - 完整歌曲資料庫和演唱記錄
- `streamlist.json` - 歌唱直播的詳細資料
- `main.md` - 首頁內容
- `profile.htm` - 個人資料頁面
- `history.md` - 歷史時間線
- `clothes.htm` - 服裝展示頁面

## 🛠 技術架構

### 前端技術棧

- **核心框架**：jQuery 3.7.1 + Bootstrap 5.3.3
- **模組載入**：ES6 模組 + CDN
- **UI 元件**：
  - Tabulator 5.5.0 - 資料表格展示
  - video.js 8.21.1 - 影片播放器
  - select2 4.0.13 - 進階選擇器
  - @fancyapps/ui - 彈窗和圖片檢視器
- **工具函式**：
  - marked.js 12.0.1 - Markdown 渲染
  - dayjs 1.11.10 - 日期處理
- **第三方整合**：
  - Octokit - GitHub API 操作
  - HackMD API - 外部內容抓取

### 資料格式

**setlist.json 結構**：
```json
{
  "歌名": {
    "artist": "演唱者",
    "note": "備註",
    "streams": ["直播ID1", "直播ID2"]
  }
}
```

**streamlist.json 結構**：
```json
{
  "直播ID": {
    "title": "標題",
    "date": "YYYY-MM-DD",
    "youtube": "YouTube URL",
    "duration": "時長",
    "type": "類型"
  }
}
```

## 🌐 路由系統

網站使用 Hash-based 路由系統：

- `/` - 首頁 (main.md)
- `/profile` - 個人資料 (profile.htm)
- `/history` - 歷史記錄 (history.md)
- `/clothes` - 服裝展示 (clothes.htm)
- `/songlist` - 歌曲清單 (HackMD 來源)
- `/streamlist` - 直播清單 (streamlist.json)
- `/setlist` - 歌單資料 (setlist.json)
- `/howTo` - 編輯說明 (howTo.md)
- `/fileUpload` - 檔案上傳頁面

## 🚀 部署

### Firebase Hosting

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 部署
firebase deploy
```

### GitHub Pages

推送到 `gh-pages` 分支或設定 GitHub Actions 自動部署。

### Cloudflare Pages

連結 GitHub repository 並設定自動部署。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善專案！

### 開發指南

1. Fork 專案
2. 建立功能分支：`git checkout -b feature/新功能`
3. 提交變更：`git commit -m "新增: 功能描述"`
4. 推送到分支：`git push origin feature/新功能`
5. 提交 Pull Request

## 📄 授權

MIT License

## 🔗 相關連結

- [官方網站](https://www.maisakiberry.com/)
- [YouTube 頻道](https://www.youtube.com/channel/UC7A7bGRVdIwo93nqnA3x-OQ)
- [Twitter](https://twitter.com/MaisakiBerry)
- [粉絲 Discord](https://discord.gg/sXdaXB7)

## 📞 聯絡

如有問題或建議，歡迎透過 GitHub Issues 與我們聯絡。