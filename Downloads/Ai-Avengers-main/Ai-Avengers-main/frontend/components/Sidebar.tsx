import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, MessageSquare, Download, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'My Brands', href: '/dashboard' },
    { icon: PlusCircle, label: 'New Brand', href: '/create' },
    { icon: MessageSquare, label: 'Brand Assistant', href: '/chat' },
    { icon: Download, label: 'Export Kit', href: '/export' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-dark-card">
            <div className="flex h-16 items-center px-6 border-b border-gray-100 dark:border-gray-800">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 mr-2" />
                <span className="text-xl font-bold font-display text-gray-900 dark:text-white">BrandCraft</span>
            </div>

            <div className="flex h-[calc(100vh-4rem)] flex-col justify-between px-4 py-6">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-1 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
