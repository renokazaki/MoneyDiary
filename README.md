# MoneyDiary

## デモ
[MoneyDiary](https://money-diary-woad.vercel.app)

リンクからデプロイされたアプリをお試しいただけます。
画面右上の「ゲストログイン」ボタンを押下することでゲストユーザーとしてログインできます。

![image](https://github.com/user-attachments/assets/b17d8982-73f0-47a1-afa0-aa6ea044dfb2)


## 概要

MoneyDiaryは個人の収支管理を効率化するWebアプリケーションです。
日付ごとに収入と支出を記録し、カテゴリ別の支出をグラフによる可視化を通じて、家計の状況を把握できます。
直感的なUIで簡単に取引を登録でき、カレンダー形式での履歴確認や詳細な分析機能を提供しています。

主な機能として、収入・支出の詳細記録、カテゴリ別の支出分類、グラフによる支出分析の可視化、カレンダー形式での取引履歴表示、月次・年次での集計レポート機能を備えています。

![image](https://github.com/user-attachments/assets/8929992a-4766-4a74-b78e-174186ae3afc)
![image](https://github.com/user-attachments/assets/1395e6da-e0be-4991-a42c-bad0eb7c6109)
![image](https://github.com/user-attachments/assets/0dc71e63-2ea4-40ea-8e70-ecf5e6cefe39)



## 使用技術

### フロントエンド
- **Next.js 15**: Reactフレームワーク
- **React 19**: UIライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Shadcn/UI**: UIコンポーネント
- **Lucide React**: アイコンライブラリ
- **Recharts**: データ可視化・グラフ表示
- **FullCalendar**: カレンダー機能

### バックエンド・データベース
- **Prisma**: ORM
- **Supabase**: データベース

### 認証・その他
- **Clerk**: ユーザー認証機能
- **Svix**: Webhook処理
- **Vercel**: ホスティング・デプロイ

## テーブルのモデル

```mermaid
erDiagram
    User ||--o{ Transaction : "has"
    
    User {
        int id PK
        string clerk_id UK "Clerk userId"
        string display_name
        string profile_image
        datetime created_at
        datetime updated_at
    }
    
    Transaction {
        string id PK "cuid"
        string user_clerk_id FK
        enum type "INCOME/EXPENSE"
        float amount
        string category
        string note
        datetime created_at
        datetime updated_at
    }
```

## 主な機能

### ユーザー管理
- Clerkを使用した認証機能
- プロフィール管理（表示名、プロフィール画像）
- ユーザー固有のデータ管理

### 取引記録
- 収入・支出の登録機能
- 金額の記録（浮動小数点対応）
- カテゴリ別の分類
- 取引メモ・備考の追加
- 日時による取引履歴管理

### データ可視化・分析
- カテゴリ別支出のグラフ表示
- カレンダー形式での取引履歴表示
- 期間別の集計レポート

### ユーザーインターフェース
- レスポンシブデザイン対応
- 直感的な取引登録フォーム
- モーダルを使用した詳細表示

## 取引カテゴリ例

### 支出カテゴリ
- 食費
- 交通費
- 光熱費
- 通信費
- 娯楽費
- 医療費
- 教育費
- 衣服費
- その他
