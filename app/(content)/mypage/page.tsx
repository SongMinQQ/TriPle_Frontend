import RequireUserSession from "@/features/auth/ui/RequireUserSession";
import ProfileMenuSection from "@/widgets/mypage/ui/ProfileMenuSection";
import ProfileSection from "@/widgets/mypage/ui/ProfileSection";

export default function MyPage() {
  return (
    <RequireUserSession>
      <main className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        {/* Profile Section */}
        <ProfileSection />

        {/* Menu Items */}
        <ProfileMenuSection />
      </main>
    </RequireUserSession>
  );
}
