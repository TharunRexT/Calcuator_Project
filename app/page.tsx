import Calculator from "@/components/calculator"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">Advanced Calculator</h1>
      <Calculator />
    </main>
  )
}
