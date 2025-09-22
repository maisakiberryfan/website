# 苺咲べりぃ非官方粉絲網站

VTuber「苺咲べりぃ」的非官方粉絲網站，提供歌唱直播追蹤、歌單管理和 AI 自動解析功能。

## 🌟 功能特色

- **AI 歌單解析**：自動從 YouTube 留言中解析歌單
- **直播追蹤**：歌唱直播的時間線和內容記錄
- **歌曲資料庫**：完整的歌曲資料庫和演唱記錄
- **自動更新**：定時檢查新影片並自動更新資料
- **個人資料**：べりぃ的詳細介紹和服裝展示

## 📁 專案架構

此專案由三個子系統組成：

- **Pages** (`./`) - 前端網站 (jQuery + Bootstrap)
- **Worker** (`./worker/`) - AI 歌單解析 API (Cloudflare Workers + Hono)
- **GetYouTubeVideoId** (外部服務) - YouTube API 代理服務

## 🚀 快速開始

### 本地開發

```bash
# 啟動前端 (Port 8788)
npx wrangler pages dev . --port 8788 --compatibility-date 2024-11-01

# 啟動 Worker API (Port 8787)
cd worker && npm run dev
```

### 部署

```bash
# 部署前端到 Cloudflare Pages
firebase deploy

# 部署 Worker API
cd worker && npm run deploy
```

## 📖 詳細文件

完整的技術架構、API 文件和部署指南請參閱：

👉 **[技術架構文件](./TECHNICAL_ARCHITECTURE.md)**

## 🔗 相關連結

- [官方網站](https://www.maisakiberry.com/)
- [YouTube 頻道](https://www.youtube.com/channel/UC7A7bGRVdIwo93nqnA3x-OQ)
- [粉絲網站](https://m-b.win)

## 📄 授權

MIT License