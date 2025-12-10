# AI-GUIDE.md

這是 `maisakiberryfan/website` 專案的 AI 開發指南。

## 專案概述

VTuber「苺咲べりぃ（Maisaki Berry）」的非官方粉絲網站前端。透過 Hyperdrive API 連接 MariaDB 資料庫，記錄和展示歌枠配信的歌唱數據。

## 相關專案

| Repo | 說明 | Branch |
|------|------|--------|
| `maisakiberryfan/website` | 前端網站（本專案） | v2 |
| `katy50306/berry_hyperdrive` | 後端 API（Cloudflare Workers + Hyperdrive + MariaDB） | v2 |
| `katy50306/m-b-setlist-parser` | Setlist 解析工具 | v2 |
| `katy50306/getyoutubevideoid` | YouTube 影片資訊取得工具 | v2 |

## 功能

- **Setlist** - 配信歌單管理（透過 API）
- **Streamlist** - 配信列表管理（透過 API）
- **Songlist** - 歌曲清單（從 HackMD 取得）
- **Profile / History / Clothes** - 靜態內容頁面

## 技術架構

- 純 HTML/CSS/JavaScript（ES Modules）
- 所有依賴從 CDN 載入（unpkg/cdnjs），不打包
- Bootstrap 5、Tabulator 6.3、Select2、jQuery、Day.js、Marked、Video.js
- 部署：Cloudflare Pages

## 重要檔案

```
/
├── index.html              # 主頁面
├── fileUpload.html         # 檔案上傳工具
├── assets/js/tool.js       # 主要邏輯
├── pages/                  # 靜態內容頁面
└── admin/                  # 管理工具
```

## 開發指令

```bash
npm run dev              # 本地開發（需同時啟動 berry_hyperdrive）
npm run build:tabulator  # 編譯 Tabulator 自訂樣式
```

## 注意事項

1. **Songlist 例外**：從 HackMD 取得，非 API（見 `tool.js:174`）
2. **YouTube API**：透過 `getyoutubevideoid` Worker 代理
3. **Berry 頻道 ID**：
   - 主頻道：`UC7A7bGRVdIwo93nqnA3x-OQ`
   - 子頻道：`UCBOGwPeBtaPRU59j8jshdjQ`、`UC2cgr_UtYukapRUt404In-A`

## 常見任務

### 新增頁面
1. 在 `pages/` 新增 `.htm` 或 `.md` 檔案
2. 在 `tool.js` 的 `nav` 變數中新增連結

### 修改表格欄位
修改 `tool.js` 中的 `setlistColDef` 或 `streamlistColDef`
