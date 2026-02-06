"use client"; // Client component due to usePathname in Sidebar (imported) - wait, Sidebar is client, this can be server if Sidebar is client. 
// Actually, Sidebar uses usePathname, so Sidebar must be "use client".
// Layout can be server component.

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <Sidebar />
            <div className="pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md dark:border-gray-800 dark:bg-dark-bg/80">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
