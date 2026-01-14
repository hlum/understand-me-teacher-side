# Understand Me - Teacher Side

教師用クラス管理アプリケーション

## 特徴

- React + Vite + TypeScript
- Tailwind CSS v4 でスタイリング
- システム設定に基づくダーク/ライトモード自動切り替え
- Firebase 認証

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# Lintの実行
npm run lint
```

## テーマシステム

このプロジェクトは、ユーザーのシステム設定に基づいて自動的にダーク/ライトモードを切り替える機能を備えています。

### テーマの動作

- **システム設定の自動検出**: macOS、Windows、Linuxのシステム設定（ダークモード/ライトモード）を自動検出
- **手動切り替え**: ユーザーがライト/ダーク/システムの3つのモードから選択可能
- **設定の保存**: ユーザーの選択は`localStorage`に保存され、次回アクセス時も維持
- **フラッシュなし**: Reactマウント前にテーマを適用するため、画面のちらつきなし

### 再利用可能なユーティリティクラス

`src/styles/theme.css`で定義された共通スタイル：

- `page-bg` / `page-bg-auth` - ページ背景グラデーション
- `card` / `card-hover` / `card-auth` - カードコンポーネント
- `btn-primary` / `btn-primary-sm` / `btn-disabled` - ボタンスタイル
- `input` / `input-error` - フォーム入力
- `badge-blue` / `badge-green` - バッジ
- `heading-gradient` - グラデーション見出し
- `spinner` / `spinner-sm` - ローディングスピナー

### テーマのカスタマイズ

CSS変数を`src/styles/theme.css`で編集することで、アプリ全体のテーマをカスタマイズできます：

```css
@theme {
	--color-primary: #3b82f6;
	--color-accent: #10b981;
	/* その他の色変数 */
}
```

## 技術スタック

- **React 19** + **Vite 7** - 高速な開発体験
- **TypeScript** - 型安全性
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **Firebase** - 認証とデータベース
- **React Router** - ルーティング
