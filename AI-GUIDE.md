# CLAUDE.md

這是 `maisakiberryfan/website` 專案的 AI 開發指南。

## 專案概述

VTuber「苺咲べりぃ（Maisaki Berry）」的非官方粉絲網站前端。主要功能是記錄和展示歌枠配信的歌唱數據。

## 相關專案

此專案為多 repo 架構的一部分：

| Repo | 說明 | Branch |
|------|------|--------|
| `maisakiberryfan/website` | 前端網站（本專案） | v2 |
| `katy50306/berry_hyperdrive` | 後端 API（Cloudflare Workers + D1） | v2 |
| `katy50306/m-b-setlist-parser` | Setlist 解析工具 | v2 |
| `katy50306/getyoutubevideoid` | YouTube 影片資訊取得工具 | v2 |

## 技術架構

### 前端
- 純 HTML/CSS/JavaScript（ES Modules）
- Bootstrap 5（UI 框架）
- Tabulator（表格元件）
- Select2（下拉選單）
- jQuery、Day.js、Marked、Video.js
- 所有依賴從 CDN 載入（unpkg）

### 部署
- Cloudflare Pages
- 本地開發使用 Wrangler

### 後端連接
- 本地：`http://localhost:8785`
- 生產：`https://hyperdrive-v2.katani.workers.dev`

## 重要檔案

```
/
├── index.html              # 主頁面，包含所有 Modal
├── config.js               # API 設定（已棄用，改用 CDN）
├── assets/js/tool.js       # 主要邏輯（約 1000 行）
├── assets/js/uploadtool.js # 上傳工具邏輯
├── assets/js/analytics.js  # 統計分析邏輯
├── pages/
│   ├── main.md             # 首頁內容
│   ├── profile.htm         # 個人資料頁
│   ├── history.md          # 活動歷史
│   ├── clothes.htm         # 衣裝展示
│   └── analytics.htm       # 統計頁面
└── admin/
    ├── fileUpload.html     # 檔案上傳工具
    └── songlist-converter.html
```

## 開發指令

```bash
# 本地開發（需要同時執行 berry_hyperdrive）
npm run dev

# 建置 Tabulator 自訂 CSS
npm run build:tabulator
```

## 程式碼慣例

### JavaScript
- 使用 ES Modules（`import from CDN`）
- jQuery 風格的 DOM 操作
- 全域變數：`jsonTable`（Tabulator 實例）、`uniqueData`（下拉選單資料）
- 日期處理使用 Day.js，統一存為 UTC 格式

### 資料格式

**Setlist（歌單）**
```json
{
  "date": "2024-01-01T12:00:00Z",
  "track": 1,
  "song": "歌曲名",
  "singer": "原唱者",
  "note": "備註",
  "YTLink": "https://youtube.com/watch?v=xxx"
}
```

**Streamlist（配信列表）**
```json
{
  "id": "YouTube影片ID",
  "title": "配信標題",
  "time": "2024-01-01T12:00:00Z",
  "category": ["歌枠 / Singing", "other"],
  "note": ""
}
```

### Category 分類邏輯
- `歌枠 / Singing` - 歌唱配信
- `ゲーム / Gaming` - 遊戲配信
- `雑談 / Chatting` - 閒聊配信
- `オリジナル曲 / Original Songs` - 原創歌曲
- `歌ってみた動画 / Cover movie` - 翻唱影片
- `ショート / Shorts` - 短影片
- `Subchannel` - 子頻道內容

## 注意事項

1. **資料來源**：Songlist 資料從 HackMD 取得（外部來源）
2. **YouTube API**：透過 `getyoutubevideoid` Worker 代理查詢
3. **ETag 快取**：API 回應使用 ETag 機制減少重複請求
4. **Berry 頻道 ID**：
   - 主頻道：`UC7A7bGRVdIwo93nqnA3x-OQ`
   - 子頻道：`UCBOGwPeBtaPRU59j8jshdjQ`、`UC2cgr_UtYukapRUt404In-A`

## 常見任務

### 新增頁面
1. 在 `pages/` 新增 `.htm` 或 `.md` 檔案
2. 在 `assets/js/tool.js` 的 navbar 區塊新增連結

### 修改表格欄位
修改 `assets/js/tool.js` 中的：
- `setlistColDef` - 歌單表格定義
- `streamlistColDef` - 配信列表表格定義

### 新增 Category
修改 `preCategory()` 函數（約第 944 行）
