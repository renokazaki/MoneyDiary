import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { TrendingUp, BarChart3, Calendar, ArrowRight } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";
import GuestLogin from "./(auth)/GuestLogin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MoneyDiary</h1>
          <SignedOut>
            <GuestLogin />
          </SignedOut>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* テキスト部分 - モバイルで中央寄せ */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              シンプルな
              <br />
              <span className="text-blue-600">家計簿アプリ</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              収支を記録して、お金の流れを見える化。
              <br />
              カレンダーとグラフで簡単管理。
            </p>
            {/* ボタン部分 - 常に中央寄せ、レスポンシブで縦並び */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up">
                <Button className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                  新規登録
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                  ログイン
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 画像部分 - 常に中央寄せ */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-xl overflow-hidden shadow-lg max-w-full">
              <Image
                src="/MoneyDiary.PNG"
                alt="MoneyDiary アプリ画面"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            主な機能
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                収支管理
              </h4>
              <p className="text-gray-600">
                収入・支出・貯金額を
                <br />
                一目で確認できます
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                カテゴリ別グラフ
              </h4>
              <p className="text-gray-600">
                支出をカテゴリ別に分析
                <br />
                グラフで分かりやすく表示
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                カレンダー記録
              </h4>
              <p className="text-gray-600">
                日付を選んで簡単に
                <br />
                収支を記録・確認
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            使い方はとてもシンプル
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">登録</h4>
              <p className="text-gray-600">簡単登録</p>
            </div>

            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">記録</h4>
              <p className="text-gray-600">カレンダーから収支を入力</p>
            </div>

            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">確認</h4>
              <p className="text-gray-600">グラフで支出パターンを分析</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            今すぐ始めましょう
          </h3>
          <p className="text-xl text-blue-100 mb-8">無料で利用できます</p>
          <div className="flex justify-center items-center gap-4">
              <Link href="/sign-up">
                <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-8 rounded-lg text-lg font-semibold flex items-center gap-2 transition-colors">
                  新規登録
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="bg-white text-black px-8 py-8 rounded-lg text-lg font-semibold flex items-center gap-2 transition-colors">
                  ログイン
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
