import Link from "next/link";
import { Icons } from "@/components/icons";

export function Navbar() {
  return (
    <div className="bg-primary text-primary-foreground border-b h-16 flex items-center justify-between px-4">
      <Link href="/" className="font-bold text-lg">
        AI Duel
      </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/" className="hover:underline">
          Reverse Prompt
        </Link>
        <Link href="/ai-arena" className="hover:underline">
          AI Arena
        </Link>
        <Link href="/leaderboard" className="hover:underline">
          Leaderboard
        </Link>
      </nav>
    </div>
  );
}
