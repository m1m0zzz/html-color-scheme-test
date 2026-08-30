# html-color-scheme-test

`color-scheme` の宣言方法の違いによって、ブラウザやアプリ内ブラウザ（WebView）の algorithmic darkening（アルゴリズムによるダーク化）の挙動がどう変わるかを検証するための静的サイト。

## 検証ケース

| # | 条件 | 確認したいこと |
| --- | --- | --- |
| 01 | 宣言なし | ベースライン |
| 02 | `<meta name="color-scheme" content="light">` | `only` なしでアルゴリズムによるダーク化を防げるか |
| 03 | `<meta name="color-scheme" content="only light">` | `only` による上書き禁止が効くか |
| 04 | `content="light dark"` + `prefers-color-scheme` 実装 | サイト側のダークテーマが尊重されるか |
| 05 | `<meta name="color-scheme" content="dark">` | ダーク宣言時の UA 既定スタイル |
| 06 | CSS の `:root { color-scheme: only light; }` のみ | meta タグと CSS プロパティの差 |
| 07 | `manifest.json` の `theme_color` / `background_color` | アルゴリズムによるダーク化に影響するか |
| 08 | 宣言なし + `prefers-color-scheme` 実装 | meta タグなしでページのダークテーマが尊重されるか |

## 各ページの表示項目

- `matchMedia('(prefers-color-scheme: dark)')` と `(light)` の実測値
- UA の algorithmic darkening が有効か（probe A: `color-scheme: light` を指定した `background-color: canvas` の要素の計算値で判定）
- このページの実効カラースキーム（probe B: `color-scheme` を指定せずルートから継承した要素の計算値で判定）
- `body` の `background-color` / `color` の計算値
- `navigator.userAgent`（Android WebView の UA には `; wv)` が含まれる）

## デプロイ

`main` への push で GitHub Actions が `public/` を GitHub Pages にデプロイする。

初回のみ、リポジトリの Settings → Pages で Source を「GitHub Actions」に変更しておく必要がある。設定前に push すると `github-pages` 環境が存在せずワークフローが失敗する。

## 結果の記録

各ケースページには目視結果（ライト / ダーク / 判別不能）のラジオボタンがある。計算値と実際の描画は食い違う可能性があるため、測定値とは別に記録する。

測定結果は各ケースページで Markdown / JSON としてコピーできる。結果は保存しないため、ページごとにその場でコピーする。

クリップボード API が使えない環境では、選択済みの textarea を表示して手動コピーにフォールバックする。

## 構成

```
public/
  index.html          各ケースへのリンク
  style.css           共通スタイル（color-scheme は宣言しない）
  detect.js           測定・目視記録・コピー
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
