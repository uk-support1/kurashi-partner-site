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

Googleタグは `assets/analytics.js` で共通管理し、既存の測定ID `G-28D2LPB1XC` を使用します。GTMではなくgtag.js直接設置です。トップと防犯ポータル配下を含む全10ページのheadから、共通ファイルを同期的に一度だけ読み込みます。独自GA4イベント、Cookie同意管理、他のアクセス解析タグは現在ありません。

新しいページでも、階層に合わせた `assets/analytics.js?v=20261013-1` の同期scriptをhead内の最初のscriptとして追加してください。async/deferを付けたり、別のGoogleタグを重複設置したりしないでください。共通ファイルの更新時は、各ページのバージョンも揃えて更新します。

### ブラウザ単位の計測除外（2026-10-13）

- Googleタグを読み込む前に除外を判定し、`window['ga-disable-G-28D2LPB1XC']` を設定します。除外時はgtag.js自体を読み込まず、ページビュー・拡張計測・独自イベントのキュー投入も抑止します。send_page_viewだけを無効にする実装ではありません。[Google公式のオプトアウト仕様](https://developers.google.com/tag-platform/security/guides/privacy?hl=ja)に準拠した無効化フラグを利用しています。
- 設定Cookieは `__Host-kurashi-analytics-preference`。Secure、SameSite=Lax、Path=/、Domain属性なしのホスト限定です。有効期間は保存から365日。各ブラウザごとに保存し、登録台数に上限はありません。別ブラウザ・別プロファイルでは再設定が必要です。
- `kurashi-partner-ku.com` 全パスだけが対象です。別リポジトリの `cat.kurashi-partner-ku.com` やその他サブドメインにはCookieを共有しません。
- 保存後にCookieを読み返して結果を検証します。保存拒否・例外時には成功表示せず、そのページの計測を停止して保存失敗を通知します。解除時も保存を確認してから計測を再開します。既存のGA Cookieやブラウザ拡張等が設定した無効化フラグは消しません。
- 操作用クエリだけを除去し、他のクエリの元のエンコード・重複キー・ハッシュを維持します。矛盾する操作指定では計測停止を優先します。URL整理はGA4の初期化より前に行います。
- 成功表示は6秒、保存失敗は9秒で消えます。画面操作を遮らず、スクリーンリーダーに対応したstatus表示です。通常アクセス時には何も表示しません。
- 同一オリジンの別タブへlocalStorageのstorageイベントで変更を通知します。localStorageが利用できなくてもCookie保存には影響せず、タブのfocus・pageshow・visibilitychangeで状態を再確認します。ブラウザが停止中のタブ等は再開時に反映します。
- 操作は認証ではなく、そのブラウザ自身の解析送信だけを制御するものです。他人やサイト全体の設定を変更する権限はありません。操作用リンクは公開メニュー、サイトマップ、検索向けページには掲載しません。
- Cookie削除、プライベートブラウズ終了、ブラウザ側の保存期間制限等で設定は失われる場合があります。その場合は再登録してください。IPフィルタやGTM管理画面での追加設定は不要です。

### 自動テスト

`node --test tests/analytics-exclusion.test.cjs tests/security-portal.test.cjs`

除外・解除の初期化順、保存失敗、他パラメータの保持、複数タブ、二重初期化防止、全ページへの同期設置をテストします。Cookieはテスト用モデルのため、このテストだけで実ブラウザの通信停止・Cookieの永続化・実機でのブラウザ再起動を検証したことにはなりません。公開後の実ブラウザではNetworkのGoogleタグ・GA4 collectリクエストの有無を別途確認してください。
