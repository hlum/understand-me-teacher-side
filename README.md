# KnowYourCode Teacher Side

KnowYourCode Teacher Sideは、教師用の管理システムです。

## 重要な注意事項

学生アカウントとして登録されたGmailアカウントは、教師アカウントとして使用することができません。教師としてログインする場合は、学生アカウントに登録していない別のGmailアカウントを使用してください。

## デプロイスクリプト

このプロジェクトには、デプロイを簡単にするための2つのスクリプトが含まれています。

### deploy.sh

アプリケーションを初めてデプロイする際、または通常のデプロイを行う際に使用するスクリプトです。

#### 機能

1. **依存関係のチェック**
   - Gitがインストールされているか確認
   - Dockerがインストールされているか確認
   - Dockerデーモンが起動しているか確認
   - 必要に応じてDockerの自動インストールを提供（Linux、macOS対応）

2. **Firebase設定の検証**
   - `src/firebase/firebase.ts` ファイルの存在を確認
   - テンプレートファイル（`firebase.ts.example`）が存在する場合は、そこから設定ファイルを作成
   - プレースホルダーの値が残っていないか確認
   - Firebase設定の取得方法を案内

3. **教師用認証キーの設定**
   - `.env.production` ファイルをチェック
   - `VITE_TEACHER_APIKEY` が設定されているか確認
   - 未設定の場合は、対話的に入力を求める
   - このキーは新しい教師アカウントを登録する際の認証に使用される

4. **Dockerでのデプロイ**
   - 既存のコンテナを停止・削除
   - 古いDockerイメージを削除
   - 新しいDockerイメージをビルド（キャッシュなし）
   - コンテナをポート3000で起動
   - 自動再起動を有効化（`--restart unless-stopped`）

#### 使用方法

```bash
sudo ./deploy.sh
```

このスクリプトは管理者権限（sudo）での実行が必要です。理由は以下の通りです。

- Dockerの操作（起動・停止・ビルド）
- systemctlによるサービス操作
- 必要なファイルの作成・編集

#### 初回実行時の準備

1. **Firebase設定**
   - `src/firebase/firebase.ts.example` を `src/firebase/firebase.ts` にコピー
   - Firebase Console（https://console.firebase.google.com/）から認証情報を取得
   - 以下の値を設定:
     - apiKey
     - authDomain
     - projectId
     - storageBucket
     - messagingSenderId
     - appId
     - measurementId（オプション）

2. **教師用認証キーの決定**
   - 新しい教師アカウントを登録する際に使用するキーを決定
   - セキュリティのため、推測されにくいキーを設定
   - このキーは外部に漏れないよう安全に管理してください

#### デプロイ後の確認

デプロイが成功すると、アプリケーションは http://localhost:3000 でアクセス可能になります。

ログを確認するには:
```bash
docker logs -f teacherside-container
```

### change_teacher_key.sh

教師用認証キーを変更し、アプリケーションを再デプロイするスクリプトです。

#### 機能

1. **教師用認証キーの変更**
   - 既存の `.env.production` ファイルの `VITE_TEACHER_APIKEY` を更新
   - ファイルが存在しない場合は新規作成
   - 古いキーのバックアップを作成（`.env.production.bak`）

2. **自動再デプロイ**
   - キーの変更後、自動的に `deploy.sh` を実行
   - 新しいキーでアプリケーションを再ビルド・再起動

#### 使用方法

```bash
sudo ./change_teacher_key.sh
```

このスクリプトも管理者権限（sudo）での実行が必要です。

#### 使用例

教師用認証キーを変更する必要がある場合:

1. セキュリティ上の理由でキーを定期的に変更したい
2. キーが漏洩した可能性がある
3. 新しい管理体制でキーを変更したい

スクリプトを実行すると、新しいキーの入力を求められます。入力後、自動的にアプリケーションが再デプロイされ、新しいキーが有効になります。

#### 注意事項

- キーを変更すると、古いキーは使用できなくなります
- 変更前に、新しいキーを関係者に共有してください
- キーは推測されにくいものを設定してください

## システム要件

- OS: Linux（Debian/Ubuntu、RHEL/CentOS/Fedora）、またはmacOS
- Git
- Docker
- sudo権限

## トラブルシューティング

### Dockerデーモンが起動していない

エラーメッセージ:
```
Dockerデーモンが起動していません
```

解決方法:
```bash
# Linuxの場合
sudo systemctl start docker

# macOSの場合
Docker Desktopアプリケーションを起動してください
```

### Firebase設定エラー

エラーメッセージ:
```
Firebase設定にプレースホルダーの値が含まれています
```

解決方法:
1. `src/firebase/firebase.ts` を編集
2. `YOUR_API_KEY` などのプレースホルダーを実際のFirebase認証情報に置き換える

### 教師用認証キーが未設定

スクリプトの実行中に教師用認証キーの入力を求められます。セキュリティのため、推測されにくいキーを設定してください。

## サポート

問題が発生した場合は、プロジェクトの管理者に連絡してください。
