# 個人事業主 税金・社会保険料控除シミュレーター

個人事業主（フリーランス）向けに、所得税・住民税・事業税・消費税・国民健康保険料などを概算するブラウザ上のシミュレーターです。

## 機能

- 売上・経費から各種税金・社会保険料を一括試算
- 青色申告 / 白色申告、簡易課税・インボイス制度などの確定申告条件に対応
- 所得税・住民税・事業税・消費税・国民健康保険料の内訳表示
- 各種所得控除（基礎・配偶者・扶養・小規模企業共済等掛金 など）の設定
- 入力値の変更に追従するリアルタイム再計算

## 技術スタック

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- React 19 / TypeScript
- [Chakra UI v3](https://chakra-ui.com/) + [Panda CSS](https://panda-css.com/)
- [Recharts](https://recharts.org/) (`@chakra-ui/charts`)
- [Bun](https://bun.sh/) (パッケージマネージャ)

## セットアップ

```bash
bun install
bun run dev
```

[http://localhost:3000](http://localhost:3000) を開くとシミュレーターが表示されます。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `bun run dev` | 開発サーバを起動 (Turbopack) |
| `bun run build` | 本番ビルド |
| `bun run start` | 本番サーバを起動 |
| `bun run lint` | Lint を実行 |

## ディレクトリ構成

```
src/
├── app/                   # Next.js App Router エントリ
├── components/            # 各税目セクション・集計カード
│   └── ui/                # 汎用 UI（入力・表示プリミティブ）
└── lib/
    └── calculations/      # 税額・社会保険料の計算ロジック
```

計算ロジックは `src/lib/calculations/` に集約されており、ユニットテストは `src/lib/calculations/__tests__/` にあります。

## 注意事項

- 本シミュレーターは概算計算です。実際の税額は確定申告の結果に基づきます。
- 国民健康保険料は自治体によって計算方法が異なるため、目安としてご利用ください。
- 個別の事情によって控除や税額は変動します。正確な判断は税理士にご相談ください。
