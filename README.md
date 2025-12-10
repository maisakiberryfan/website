# maisakiberryfan/website

苺咲べりぃ（Maisaki Berry）非公式ファンサイトのフロントエンド。

## 概要

VTuber「苺咲べりぃ」の歌枠データを記録・閲覧するためのウェブサイト。主に歌唱履歴のデータベース機能を提供する。

## 関連リポジトリ

| リポジトリ | 説明 |
|-----------|------|
| `maisakiberryfan/website` | フロントエンド（本リポジトリ） |
| `katy50306/berry_hyperdrive` | バックエンド API（Cloudflare Workers） |
| `katy50306/m-b-setlist-parser` | セットリスト解析ツール |
| `katy50306/getyoutubevideoid` | YouTube 動画 ID 取得ユーティリティ |

## 機能

### メイン機能
- **Setlist（歌単）** - 配信ごとの歌唱曲リストの管理・閲覧
- **Streamlist（配信リスト）** - YouTube 配信の一覧管理
- **Songlist（曲リスト）** - 歌った曲のデータベース
- **Analytics（統計）** - 歌唱データの統計・分析

### サブ機能
- **Profile** - VTuber のプロフィール情報
- **History** - 活動履歴（マイルストーン）
- **Clothes** - 衣装ギャラリー
- **Aliases** - アーティスト名・曲名の別名管理

### 管理機能
- ファイルアップロード（`/admin/fileUpload.html`）
- 曲リストコンバーター（`/admin/songlist-converter.html`）

## 技術スタック

### フロントエンド
- HTML5 / CSS3 / JavaScript (ES Modules)
- [Bootstrap 5](https://getbootstrap.com/) - UI フレームワーク
- [Tabulator](https://tabulator.info/) - テーブル表示
- [Select2](https://select2.org/) - セレクトボックス
- [jQuery](https://jquery.com/)
- [Day.js](https://day.js.org/) - 日付処理
- [Marked](https://marked.js.org/) - Markdown パーサー

### ビルドツール
- [esbuild](https://esbuild.github.io/) - JavaScript バンドラー
- [Sass](https://sass-lang.com/) - CSS プリプロセッサ

### デプロイ
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - ローカル開発

## ディレクトリ構成

```
website/
├── index.html          # メインページ
├── config.js           # API 設定
├── package.json
├── admin/              # 管理ツール
│   ├── fileUpload.html
│   └── songlist-converter.html
├── assets/
│   ├── js/             # ソースコード
│   │   ├── tool.js     # メインロジック
│   │   ├── uploadtool.js
│   │   └── analytics.js
│   ├── dist/           # ビルド出力
│   └── css/            # スタイルシート
├── pages/              # コンテンツページ
│   ├── main.md
│   ├── profile.htm
│   ├── history.md
│   ├── clothes.htm
│   └── analytics.htm
└── img/                # 画像ファイル
```

## セットアップ

### 必要条件
- Node.js >= 18
- npm

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### ビルド

```bash
# JavaScript と CSS をビルド
npm run build
```

### スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | Wrangler でローカル開発サーバー起動 |
| `npm run build` | JS/CSS をビルド |
| `npm run build:js` | JavaScript のみビルド |
| `npm run build:tabulator` | Tabulator CSS をビルド |
| `npm run clean` | dist ディレクトリをクリア |

## API 接続

バックエンド API への接続設定は `config.js` で管理：

- **ローカル開発**: `http://localhost:8785`
- **本番環境**: `https://hyperdrive-v2.katani.workers.dev`

## 開発メモ

### ETag キャッシュ
API レスポンスは ETag ベースのキャッシュを実装。データ更新時に自動でキャッシュを無効化。

### エラーハンドリング
API リクエストは自動リトライ（最大 3 回）、4xx エラーはリトライしない。

## ライセンス

ISC

## 関連リンク

- [苺咲べりぃ 公式 YouTube](https://www.youtube.com/@MaisakiBerry)
- [苺咲べりぃ 公式 X](https://x.com/MaisakiBerry)
- [苺咲べりぃ非公式 wiki](https://seesaawiki.jp/maisakiberry/)
