# html-color-scheme-test

`color-scheme` の宣言方法の違いによって、ブラウザやアプリ内ブラウザ（WebView）の強制ダーク化の挙動がどう変わるかを検証するための静的サイト。

## 検証ケース

| # | 条件 | 確認したいこと |
| --- | --- | --- |
| 01 | 宣言なし | ベースライン |
| 02 | `<meta name="color-scheme" content="light">` | `only` なしで強制ダーク化を防げるか |
| 03 | `<meta name="color-scheme" content="only light">` | `only` による上書き禁止が効くか |
| 04 | `content="light dark"` + `prefers-color-scheme` 実装 | サイト側のダークテーマが尊重されるか |
| 05 | `<meta name="color-scheme" content="dark">` | ダーク宣言時の UA 既定スタイル |
| 06 | CSS の `:root { color-scheme: only light; }` のみ | meta タグと CSS プロパティの差 |
| 07 | `manifest.json` の `theme_color` / `background_color` | 強制ダーク化に影響するか |

## 各ページの表示項目

- `matchMedia('(prefers-color-scheme: dark)')` と `(light)` の実測値
- 自動ダーク化の適用有無（`background-color: canvas` かつ `color-scheme: light` の要素の計算値が白かどうかで判定）
- `body` の `background-color` / `color` の計算値
- `navigator.userAgent`（Android WebView の UA には `; wv)` が含まれる）

## デプロイ

`main` への push で GitHub Actions が `public/` を GitHub Pages にデプロイする。

初回のみ、リポジトリの Settings → Pages で Source を「GitHub Actions」に変更しておく必要がある。設定前に push すると `github-pages` 環境が存在せずワークフローが失敗する。

## 構成

```
public/
  index.html          各ケースへのリンク
  style.css           共通スタイル（color-scheme は宣言しない）
  detect.js           検出スクリプト
  manifest.json       ケース 07 用
  cases/              各検証ページ
.github/workflows/deploy.yml
```

共通スタイルで `color-scheme` を宣言していないのは、宣言するとケース 01 と 07 の条件が成立しなくなるため。ケース 04 と 06 はページ内の `<style>` で指定している。

ビルドステップを持たないため、素の HTML / CSS / JavaScript で書いている。

## 参考

- [Darken web content in WebView - Android Developers](https://developer.android.com/develop/ui/views/layout/webapps/dark-theme)
- [Auto Dark Theme - Chrome for Developers](https://developer.chrome.com/blog/auto-dark-theme)
- [Dark Mode Support in WebKit](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)
- [`<meta name="color-scheme">` - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme)

<!-- TODO: 記事を公開したらリンクを追加する -->
