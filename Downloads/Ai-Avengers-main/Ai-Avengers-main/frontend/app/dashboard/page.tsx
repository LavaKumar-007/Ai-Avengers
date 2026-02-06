import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Founder</h2>
                    <p className="text-gray-600 dark:text-gray-400">Ready to build your next big thing?</p>
                </div>
                <Link href="/create">
                    <Button>
                        <PlusCircle className="mr-2 h-5 w-5" /> New Brand
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Empty State Card */}
                <Link href="/create" className="group">
                    <Card className="flex h-full flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-transparent p-12 hover:border-brand-500 hover:bg-brand-50/50 dark:border-gray-700 dark:hover:border-brand-500/50 dark:hover:bg-brand-500/5 transition-all">
                        <div className="mb-4 rounded-full bg-brand-100 p-4 text-brand-600 group-hover:scale-110 transition-transform dark:bg-brand-500/20">
                            <PlusCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create a New Brand</h3>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Start from scratch with AI</p>
                    </Card>
                </Link>

                {/* Placeholder for existing brands */}
                <Card className="group cursor-pointer hover:border-brand-200 dark:hover:border-brand-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                            RL
                        </div>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Score: 92
                        </span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">Radiant Logic</h3>
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">AI-powered analytics for SaaS companies.</p>
                    <div className="flex items-center text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                        View Brand Kit <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
