# kurashi-partner-site

## トップページのデザイン（2026-10-04）

- `index.html` に静的コンテンツ、`assets/kurashi-portal.css` にレスポンシブデザイン、`assets/kurashi-portal.js` にメニューと控えめなスクロール演出を分離しています。ビルド不要で GitHub Pages のルートから配信できます。
- 参考にした考え方：[キナリノ](https://kinarino.jp/) の写真と余白、[RoomClip](https://roomclip.jp/) の暮らしのシーン、[mybest](https://my-best.com/) の明確な比較・カテゴリー導線。コード・画像・文章は転載していません。
- 大型ヒーロー／Bento のおすすめ／テーマ／比較特集／全面写真／おすすめの読む順番／新着・更新／専門メディア／ブランド紹介で構成。現時点で公開中の専門メディアは猫パートナーのみです。写真はイメージであり、商品検証・実使用の証拠ではありません。
- 「まず読みたい、5つの話」はおすすめの読む順番です。アクセス数や人気順位は捏造していません。実測の人気ランキングに替える場合は GA4 等の根拠と集計期間を明示してください。
- 新着・更新の日時は猫サイトの `sitemap.xml` の lastmod に基づきます。記事更新時はトップのリンク・タイトル・日時も合わせて更新してください。
- 公開カテゴリーの追加は `.theme-rail` 内へ `a.theme` を追加。未公開テーマはリンクのない `div.theme` と COMING SOON にします。専門メディアは `.media-feature` を追加できます。検索は未実装で、動かない入力欄は設置していません。
- モバイルは常設ショートカット、横スクロールのテーマ、縦写真、独自のトリミングを使用。JavaScript 無効時も内容とナビは表示されます。動きは prefers-reduced-motion に対応します。
- 写真はローカルの WebP と srcset、表示領域予約、lazy-loading を使用。ヒーローのみ preload／fetchpriority=high。外部フォント・UIライブラリを追加していません。
- canonical／OGP／favicon／構造化データ／GA4／Search Console 認証／CNAME／robots.txt は既存設定を維持しています。

### 写真の出典・利用条件

2026-10-04 に [Pexels License](https://www.pexels.com/license/) を確認しました。無料のウェブサイト利用・加工が可能です。未加工素材の再販売、素材サイトとしての再配布、被写体による推薦の示唆、商標利用などの禁止条件を守り、生活情報サイトのイメージ写真として使用しています。ホットリンクせずローカル配信します。

`assets/photos/` の各ファイル末尾の数値は幅（px）です。撮影者・出典は下表のとおりです。

| ファイル名（WebP） | 撮影者 | 元写真 |
| --- | --- | --- |
| quiet-room-600 / 900 / 1800 | Fadime Demirtaş | [植物と光のある部屋](https://www.pexels.com/photo/interior-of-a-living-room-with-potted-plants-14525744/) |
| living-900 / 1800 | Max Vakhtbovych | [リビングとキッチン](https://www.pexels.com/photo/living-room-and-kitchen-8089261/) |
| cooking-600 / 1000 | Ivan S | [キッチンで料理する日常](https://www.pexels.com/photo/a-woman-cooking-at-the-kitchen-7901540/) |
| ceramics-600 / 1000 | İrem Meriç | [木の棚と器](https://www.pexels.com/photo/stocks-of-ceramic-mugs-and-cups-displayed-on-wooden-shelf-12498494/) |
| coffee-600 / 1000 | Min An | [カップとコーヒーの道具](https://www.pexels.com/photo/selective-focus-photography-of-piled-containers-1441587/) |
| plants-600 / 1000 | Tiia Pakk | [植物のあるリビング](https://www.pexels.com/photo/interior-details-of-stylish-room-with-assorted-houseplants-4510955/) |
| cat-home-600 / 1000 | Han | [ソファでくつろぐ猫](https://www.pexels.com/photo/relaxed-cat-lounging-on-sofa-at-home-29471679/) |
| mii-600 / 1000 | 既存素材 | リポジトリの `assets/mii-mix-cat.jpg` を縮小・WebP化。元画像は維持。 |

`assets/kurashi-partner-logo-compact.webp` と `assets/neko-partner-logo-compact.webp` は既存の同名 PNG の透明余白をトリミングした軽量表示用素材です。ロゴの図柄・色は変更していません。元 PNG、OGP、favicon はそのままです。

## GA4

Googleタグは `assets/analytics.js` で共通管理しています。測定IDは `G-28D2LPB1XC` です。
現在の全ページ（`index.html`）の `<head>` から読み込み、Googleの `gtag.js` を非同期で取得します。
新しいHTMLページを追加する場合も、`<head>` に `<script src="assets/analytics.js"></script>` を1回追加してください。サブディレクトリ内のページでは `../assets/analytics.js` など、階層に合わせて相対パスを調整します。測定IDを変更する場合は共通ファイルだけを更新してください。
