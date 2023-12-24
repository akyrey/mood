import { UserButton } from "@clerk/nextjs";

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-screen w-screen">
      <aside className="absolute left-0 top-0 h-full w-60 border-r border-black/10">
        Mood
      </aside>
      <div className="ml-60">
        <header className="h-16 border-b border-black/10">
          <div className="flex h-full w-full items-center justify-end px-6">
            <UserButton />
          </div>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
