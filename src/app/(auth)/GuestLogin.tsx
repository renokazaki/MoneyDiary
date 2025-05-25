"use client"
import { Button } from '@/components/ui/button';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function GuestLogin() {
 const { signIn, setActive } = useSignIn();

 const router = useRouter();

 const handleGuestLogin = async () => {
   if (!signIn) return;

   const result = await signIn.create({
     identifier: "testuser",
     password: "TESTuser"
   });

   if (result.status === 'complete') {
     await setActive({ session: result.createdSessionId });
     router.push('/');

   }
 };

 return (
    <Button onClick={handleGuestLogin} className="bg-green-500 hover:bg-green-600 cursor-pointer rounded-full text-white">
     ゲストログイン
   </Button>    
 );
}