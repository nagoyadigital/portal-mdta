import TopAppBar from "./TopAppBar";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <TopAppBar />
      <main className="pt-20 pb-28 px-4 md:px-8 max-w-[1200px] mx-auto">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
