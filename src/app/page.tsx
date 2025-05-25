import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {

  const { userId } = await auth();

  

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      ログイン前の画面
    </div>
  );
}
