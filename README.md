# kurashi-partner-site
## GA4

Googleタグは `assets/analytics.js` で共通管理しています。測定IDは `G-28D2LPB1XC` です。
現在の全ページ（`index.html`）の `<head>` から読み込み、Googleの `gtag.js` を非同期で取得します。
新しいHTMLページを追加する場合も、`<head>` に `<script src="assets/analytics.js"></script>` を1回追加してください。サブディレクトリ内のページでは `../assets/analytics.js` など、階層に合わせて相対パスを調整します。測定IDを変更する場合は共通ファイルだけを更新してください。
