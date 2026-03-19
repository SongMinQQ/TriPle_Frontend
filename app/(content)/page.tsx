import Image from "next/image";
import Link from "next/link";

import GroupList from "@/features/main/GroupList";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[420px] w-full overflow-hidden lg:h-[480px]">
        <Image
          src="/TriPle_thumbnail.png"
          alt="여행하는 친구들"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
          <h1 className="text-center text-3xl font-extrabold text-[#ffffff] drop-shadow-lg sm:text-4xl lg:text-5xl text-balance">
            {"일정, 비용, 추억을 하나로 TriPle"}
          </h1>
          <Link
            href="/group/create"
            className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:opacity-90 sm:text-lg"
          >
            {"여행 그룹 만들기"}
          </Link>
        </div>
      </section>
      <GroupList />
    </main>
  );
}
