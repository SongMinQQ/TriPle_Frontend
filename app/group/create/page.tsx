import { Header } from "@/widgets/layout/header"
import { Footer } from "@/widgets/layout/footer"
import GroupGenerateForm from "@/features/group/generate/GroupGenerateForm"

export default function GroupCreatePage() {
  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">{"그룹 생성"}</h1>

        <GroupGenerateForm/>
      </main>
      <Footer />
    </div>
  )
}
