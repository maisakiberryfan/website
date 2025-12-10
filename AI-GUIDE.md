# AI-GUIDE.md

這是 `maisakiberryfan/website` 專案的 AI 開發指南。

## 專案概述

VTuber「苺咲べりぃ（Maisaki Berry）」的非官方粉絲網站前端。主要功能是記錄和展示歌枠配信的歌唱數據。

**v2 版本重大改變**：資料來源從靜態 JSON 檔案改為透過 Hyperdrive API 連接 MariaDB 資料庫。

## 相關專案

此專案為多 repo 架構的一部分：

| Repo | 說明 | Branch |
|------|------|--------|
| `maisakiberryfan/website` | 前端網站（本專案） | v2 |
| `katy50306/berry_hyperdrive` | 後端 API（Cloudflare Workers + Hyperdrive + MariaDB） | v2 |
| `katy50306/m-b-setlist-parser` | Setlist 解析工具 | v2 |
| `katy50306/getyoutubevideoid` | YouTube 影片資訊取得工具 | v2 |

## 技術架構

### 前端
- 純 HTML/CSS/JavaScript（ES Modules）
- **所有依賴從 CDN 載入**（unpkg/cdnjs），不打包
- Bootstrap 5（UI）
- Tabulator 6.3（表格）
- Select2 4.0（下拉選單）
- jQuery 3.7、Day.js、Marked、Video.js

### 資料來源（v2 重點）
- **不使用靜態 JSON 檔案**
- 透過 `berry_hyperdrive` API 連接 MariaDB
- 本地開發 API：`http://localhost:8785`
- 生產環境 API：Cloudflare Workers

### 部署
- Cloudflare Pages
- 本地開發：`npm run dev`（Wrangler）

## 重要檔案

```
/
├── index.html              # 主頁面，包含 Modal
├── fileUpload.html         # 檔案上傳工具
├── assets/
│   ├── js/
│   │   ├── tool.js         # 主要邏輯（~1000 行）
│   │   └── uploadtool.js   # 上傳工具邏輯
│   └── css/
│       └── tabulator-bootstrap5-custom.css
├── pages/
│   ├── main.md             # 首頁內容
│   ├── profile.htm         # 個人資料（含 Video.js BGM 播放器）
│   ├── history.md          # 活動歷史
│   ├── clothes.htm         # 衣裝展示（Fancybox 畫廊）
│   └── howTo.md            # 編輯說明
├── admin/                  # 管理工具
└── docs/                   # 文件
```

## 開發指令

```bash
# 本地開發（需同時啟動 berry_hyperdrive 在 port 8785）
npm run dev

# 編譯 Tabulator 自訂樣式
npm run build:tabulator
```

## 程式碼慣例

### CDN Import 方式（v2 特色）
```javascript
// 不使用 npm 依賴，直接從 CDN 載入
import 'https://unpkg.com/jquery@3.7.1/dist/jquery.min.js'
import 'https://unpkg.com/bootstrap@5.3.3/dist/js/bootstrap.min.js'
import "https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.1/js/tabulator.min.js"
```

### 全域變數
- `jsonTable` - Tabulator 表格實例
- `uniqueData` - 下拉選單資料（從 API 動態取得）
- `window.tableDataLoaded` - 表格資料載入完成旗標

### 日期處理
- 使用 Day.js + UTC 插件
- 儲存格式：`YYYY-MM-DDTHH:mm:ssZ`（UTC）
- 顯示格式：本地時區

## API 端點（透過 berry_hyperdrive）

| 端點 | 說明 |
|------|------|
| `/songlist` | 歌曲清單 CRUD |
| `/streamlist` | 配信列表 CRUD |
| `/setlist` | 歌單 CRUD |
| `/aliases` | 別名管理 |

## 資料格式

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

### Category 分類
- `歌枠 / Singing` - 歌唱配信
- `ゲーム / Gaming` - 遊戲配信
- `雑談 / Chatting` - 閒聊配信
- `オリジナル曲 / Original Songs` - 原創歌曲
- `歌ってみた動画 / Cover movie` - 翻唱影片
- `ショート / Shorts` - 短影片
- `Subchannel` - 子頻道內容

## 注意事項

1. **v2 架構改變**：不再使用 `/assets/data/*.json`，改用 API 連接資料庫
2. **CDN 依賴**：不打包 JS，直接從 unpkg/cdnjs 載入
3. **Songlist 資料**：仍從 HackMD 取得（外部來源）
4. **YouTube API**：透過 `getyoutubevideoid` Worker 代理
5. **Berry 頻道 ID**：
   - 主頻道：`UC7A7bGRVdIwo93nqnA3x-OQ`
   - 子頻道：`UCBOGwPeBtaPRU59j8jshdjQ`、`UC2cgr_UtYukapRUt404In-A`

## 常見任務

### 新增頁面
1. 在 `pages/` 新增 `.htm` 或 `.md` 檔案
2. 在 `assets/js/tool.js` 的 `nav` 變數中新增連結

### 修改表格欄位
修改 `assets/js/tool.js` 中的：
- `setlistColDef` - 歌單表格定義
- `streamlistColDef` - 配信列表表格定義

### 新增 Category
修改 `preCategory()` 函數
