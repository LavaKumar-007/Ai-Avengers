import Link from 'next/link';
import { Button } from './ui/Button';

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-dark-bg/80 dark:border-white/5">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600" />
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-display">BrandCraft</span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300">How it Works</Link>
                    <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden md:block text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300">Login</Link>
                    <Link href="/dashboard">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
