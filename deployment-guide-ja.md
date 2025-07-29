# CRMシステム デプロイガイド

## 🚀 デプロイ手順

### 準備段階

まず、以下のアカウントを作成してください（すべて無料で始められます）：
- [Vercel](https://vercel.com) - フロントエンド用
- [Render](https://render.com) - バックエンドとデータベース用
- [GitHub](https://github.com) - コード管理用

### 1. GitHubにコードをアップロード

```bash
# プロジェクトフォルダで実行
cd crm-system
git init
git add .
git commit -m "Initial commit"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/あなたのユーザー名/crm-system.git
git push -u origin main
```

### 2. データベースのデプロイ（Render）

1. **Render にログイン**してダッシュボードに移動
2. **「New」→「PostgreSQL」**を選択
3. 以下の設定を入力：
   - **Name**: `crm-database`
   - **Database**: `crm_db`
   - **User**: `crm_user`
   - **Region**: Singapore（日本に近い）
4. **「Create Database」**をクリック
5. 作成後、**「Connections」**タブで`External Database URL`をコピー保存

### 3. バックエンドのデプロイ（Render）

1. Renderダッシュボードで**「New」→「Web Service」**を選択
2. GitHubリポジトリを接続
3. 以下の設定を入力：
   ```
   Name: crm-backend
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```
4. **「Advanced」**を開いて環境変数を設定：
   ```
   DATABASE_URL = [先ほどコピーしたPostgreSQLのURL]
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
   NODE_ENV = production
   CLIENT_URL = https://あなたのアプリ名.vercel.app
   ```
5. **「Create Web Service」**をクリック

### 4. フロントエンドのデプロイ（Vercel）

1. **Vercel にログイン**してダッシュボードに移動
2. **「New Project」**をクリック
3. GitHubリポジトリを選択
4. 以下の設定を入力：
   ```
   Framework Preset: React
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   ```
5. **環境変数**を追加：
   ```
   REACT_APP_API_URL = https://あなたのバックエンドURL.onrender.com
   ```
6. **「Deploy」**をクリック

### 5. データベースの初期設定

バックエンドがデプロイされた後：

1. Renderのバックエンドサービスページで**「Shell」**タブを開く
2. 以下のコマンドを実行してテーブルを作成：
```bash
psql $DATABASE_URL -f server/config/init.sql
```

## 🔧 デプロイ後の確認

### 動作確認手順：
1. Vercelから提供されたURLでフロントエンドにアクセス
2. ユーザー登録ページで新規アカウントを作成
3. ログイン後、顧客を追加/編集/削除してみる
4. レスポンシブデザインをスマホで確認

### よくある問題と解決方法：

**❌ フロントエンドでAPIエラーが出る**
- Vercelの環境変数`REACT_APP_API_URL`が正しく設定されているか確認
- バックエンドのURLが正しいか確認

**❌ データベース接続エラー**
- RenderのPostgreSQLサービスが起動しているか確認
- `DATABASE_URL`の環境変数が正しく設定されているか確認

**❌ CORS エラー**
- バックエンドの`CLIENT_URL`環境変数にVercelのURLが設定されているか確認

**❌ データベーステーブルが存在しない**
- 手順5のデータベース初期設定が完了しているか確認
- SQL実行時にエラーが出ていないか確認

**❌ ビルドエラーが発生する**
- package.jsonの依存関係が正しいか確認
- Node.jsのバージョンが対応しているか確認（推奨: 18.x）

## 📱 カスタムドメインの設定（オプション）

### Vercel（フロントエンド）:
1. Vercelプロジェクトの**「Settings」→「Domains」**
2. 独自ドメインを追加
3. DNSレコードを設定

### Render（バックエンド）:
1. Renderサービスの**「Settings」→「Custom Domains」**
2. 独自ドメインを追加
3. CNAMEレコードを設定

## 🔄 継続的デプロイ

設定完了後は、GitHubにコードをプッシュするだけで自動デプロイされます：

```bash
# 変更を加えた後
git add .
git commit -m "機能を追加"
git push origin main
```

## 🔒 本番環境でのセキュリティ設定

### 必須の環境変数更新：
1. **JWT_SECRET**: より複雑で長い文字列に変更
   ```
   例: jwt_secret_production_2024_very_long_and_secure_key_12345
   ```

2. **データベースパスワード**: Renderが自動生成する強力なパスワードを使用

3. **HTTPS**: 本番環境では必ずHTTPSを使用（VercelとRenderは自動で設定）

## 📊 監視とログ

### Renderでのログ確認：
1. サービスページの**「Logs」**タブでリアルタイムログを確認
2. エラーや警告メッセージをチェック

### Vercelでのログ確認：
1. プロジェクトページの**「Functions」**タブでログを確認
2. **「Analytics」**でアクセス状況を監視

## 💰 料金について

### 無料枠の制限：
- **Vercel**: 月間100GB転送量、無制限プロジェクト
- **Render**: 750時間/月の稼働時間、512MB RAM
- **PostgreSQL**: 1GB ストレージ、90日データ保持

### アップグレードが必要な場合：
- トラフィックが増加した場合
- より多くのストレージが必要な場合
- 24時間稼働が必要な場合

## 🆘 サポートとトラブルシューティング

### 問題が発生した場合：
1. まずこのガイドの「よくある問題と解決方法」をチェック
2. ブラウザの開発者ツールでエラーメッセージを確認
3. RenderとVercelのログを確認
4. 環境変数の設定を再確認

### 追加リソース：
- [Vercel ドキュメント](https://vercel.com/docs)
- [Render ドキュメント](https://render.com/docs)
- プロジェクト内の `CLAUDE.md` ファイル
- プロジェクト内の `docs/README.md` ファイル

---

このガイドに従ってデプロイを行うことで、本格的なCRMシステムをインターネット上で公開できます。何か問題があれば、上記のトラブルシューティングセクションを参照してください。