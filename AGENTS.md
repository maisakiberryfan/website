# 歌單資料來源更新計畫

## 目標概述
- 將現有以 HackMD 與 JSON 靜態檔案為主的資料來源，遷移至 MariaDB + Cloudflare Hyperdrive + Cloudflare Worker（Hono）架構。
- 維持既有前端 `assets/js/tool.js` 與 Tabulator 表格顯示行為，API 回傳欄位需與 `assets/data/*.json` 一致，確保可無縫切換。
- 以新 branch 進行開發，避免影響線上服務。

## 既有資料來源
- songlist: https://hackmd.io/NSAM_dezTrWPQJ0nGWViIQ/download
- streamlist: `assets/data/streamlist.json`
- setlist: `assets/data/setlist.json`

## 目前問題
1. songlist 依賴外部 HackMD，若被異動會導致 setlist 找不到對應歌名。
2. 單一 stream 對應多筆 setlist，setlist 內的 stream 資訊易重複且難管理；時間欄位與 streamlist 不一定一致。
3. 曲名或歌手異動、streamlist 更新時，setlist 需逐筆搜尋修改，成本高。

## 新資料庫與 Worker 架構
- 在 `D:\xampp\htdocs\berry_hyperdrive` 建立 Hono/Cloudflare Worker 專案，透過 Hyperdrive 連 MariaDB。
- `wrangler.toml` 參考現有 `D:\xampp\htdocs\hyperdrive\wrangler.jsonc`：
  - `name`: `berry-worker`
  - `main`: `src/index.js`
  - `compatibility_date`: `2025-02-24`
  - `compatibility_flags`: `nodejs_compat`
  - `hyperdrive` 綁定 `HYPERDRIVE`，ID `3794cb90bec64a1f9e92bc3b4a60ea41`，`localConnectionString` 同測試專案。
- 資料流程：Worker 暴露 REST API，前端依原表格行為讀寫；每日匯出 SQL 備份於 GitHub。

## 資料庫結構建議
- `songlist`
  - `songID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT`
  - `songName VARCHAR(512)`
  - `artist VARCHAR(512)`
  - `genre VARCHAR(512)`
  - `tieup VARCHAR(512)`
  - `songNote VARCHAR(512)`
  - `created_at`、`updated_at` (`DATETIME(6)`，UTC)

- `streamlist`
  - `streamID VARCHAR(64) PRIMARY KEY`
  - `title VARCHAR(512)`
  - `time DATETIME(6) NOT NULL`（UTC，維持 ISO8601 格式）
  - `categories JSON NOT NULL`（字串陣列，例 `["Singing","Chatting"]`）
  - `note VARCHAR(512)`
  - `created_at`、`updated_at`

- `setlist_ori`
  - `streamID VARCHAR(64) NOT NULL`
  - `track_no INT NOT NULL`
  - `segment_no TINYINT UNSIGNED NOT NULL DEFAULT 0`
  - `songID INT`
  - `note TEXT`
  - `YTLink VARCHAR(512)`
  - `UNIQUE (streamID, track_no, segment_no)`
  - `FOREIGN KEY (streamID) REFERENCES streamlist(streamID) ON DELETE RESTRICT`
  - `FOREIGN KEY (songID) REFERENCES songlist(songID) ON DELETE RESTRICT`

- `view setlist`
  - JOIN 三表，以輸出與現有 JSON 相同欄位：`streamID`、`time`、`track`（字串 `"track_no-segment_no+1"`）、`songID`、`songName`、`artist`、`note`、`YTLink`。

## REST API 契約（草案）
### songlist
- `GET /songlist`
  - 回傳 `{ data: Song[] }`。
- `POST /songlist`
  - body `{ songName, artist?, genre?, tieup?, songNote? }`。
  - 建立新歌，回傳 `{ data: Song }`。
- `PUT /songlist/:songID`
  - 局部更新欄位。
- `DELETE /songlist/:songID`
  - 若仍被 setlist 參照，回傳 409 錯誤。

### streamlist
- `GET /streamlist`
  - 回傳 `{ data: Stream[] }`；`time` 使用 ISO8601 UTC 字串，`categories` 直接為字串陣列。
- `POST /streamlist`
  - body `{ streamID, title, time, categories, note? }`。
- `PUT /streamlist/:streamID`
  - 更新 `title`、`time`、`categories`、`note`。
- `DELETE /streamlist/:streamID`
  - 若 setlist 有引用則 409。
- `PATCH /streamlist/bulk-categories`
  - body `{ streamIDs: string[], categories: string[] }`，供多選分類一次更新。

### setlist
- `GET /setlist`
  - 回傳 `{ data: SetEntry[] }`。
- `POST /setlist`
  - body `{ streamID, trackNo, segmentNo?, songID?, note?, YTLink? }`（`segmentNo` 預設 0）。
- `PUT /setlist/:streamID/:trackNo/:segmentNo`
  - 更新 `songID`、`note`、`YTLink`。
- `DELETE /setlist/:streamID/:trackNo/:segmentNo`
  - 刪除特定曲目。

- 錯誤格式統一為 `{ error: { code, message, fieldErrors? } }`；常見狀態碼：400（驗證失敗）、404（不存在）、409（外鍵限制）。

## 前端（tool.js）調整要點
- `streamlist` 表格改從 `GET /streamlist` 取得，`categories` 欄位使用 Tabulator formatter 顯示陣列（例如換行顯示），Select2 編輯傳回陣列；勾選多筆分類時，呼叫 bulk API。
- `setlist` 按既有 Modal 行為逐筆新增；刪除/編輯即改即存。
- 建立共用 `apiRequest(method, url, payload)`；錯誤時顯示 Bootstrap alert 或將訊息貼在 modal/欄位旁。
- 保留即改即存，無需批次儲存；僅在分類需要時提供多選 bulk。

## SQL 備份策略
- 在 DB server（cron）執行 `mysqldump`，輸出 `latest_mbdb.sql` 覆蓋於 repo `db/latest_mbdb.sql`，Git commit & push。
- README 描述還原步驟與 AUTO_INCREMENT 延續方式（透過 dump 中的 `AUTO_INCREMENT` 或手動 `ALTER TABLE` 調整）。

## 已完成
1. 建立 `D:\xampp\htdocs\berry_hyperdrive` Git repo 並完成初始 commit/push。
2. 初始化 Worker 專案（Hono + JavaScript），設定 `wrangler.toml`。
3. 安裝 `mysql2` 並在 `/health` 路由完成 Hyperdrive 連線測試。
4. 將 Worker 原始碼改為 JavaScript（ESM），移除 TypeScript 依賴。
5. 實測連線並取得 `songlist`、`streamlist`、`setlist`、`setlist_ori` 表格結構與樣本資料。
6. 撰寫 `db/migrations/README.md` 規劃資料表 migration 草案腳本。

## 後續計畫
1. 實作 Worker 路由、資料驗證與錯誤格式，依計 Hyperdrive。
2. 調整 `assets/js/tool.js` 讓 Tabulator 使用 API，並新增 streamlist 分類多選更新流程。
3. 撰寫每日 SQL 備份腳本及 README，記錄匯出與還原流程。

