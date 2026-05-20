import Link from "next/link";
import { ArrowRight, Wallet, ListChecks, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Wallet,
    title: "Expenses",
    desc: "Track every spend with categories, budgets, charts, and CSV export.",
  },
  {
    icon: ListChecks,
    title: "Smart Tasks",
    desc: "Priorities, due dates, tags, and drag-to-reorder.",
  },
  {
    icon: TrendingUp,
    title: "Crypto",
    desc: "Live tracker, watchlist, portfolio simulator, and the classic max-price calculator.",
  },
  {
    icon: ShieldCheck,
    title: "Vault",
    desc: "AES-encrypted passwords with strength meter and generator.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              A
            </div>
            <span className="font-semibold tracking-tight">Atlas</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="flex-1 grid place-items-center px-6 py-16">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground">
            Your personal control center
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Everything that matters,{" "}
            <span className="text-primary">in one place.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Atlas is a personal life dashboard — expenses with charts and budgets,
            smart tasks, live crypto tracking, and an encrypted password vault.
            Built for you and only you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">
                Create your account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="container mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>Atlas — personal dashboard</span>
          <span>Built with Next.js, Firebase, and care.</span>
        </div>
      </footer>
    </main>
  );
}
