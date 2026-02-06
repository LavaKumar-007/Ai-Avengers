"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, Copy, Share2, Download, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import DashboardLayout from '../dashboard/layout';
import Link from 'next/link';

export default function ResultsPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('brandData');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            router.push('/create');
        }
    }, [router]);

    if (!data) return <div className="flex h-screen items-center justify-center">Loading results...</div>;

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Brand Identity</h1>
                <div className="flex gap-3">
                    <Link href="/chat">
                        <Button variant="secondary">
                            <MessageSquare className="mr-2 h-4 w-4" /> Refine with AI
                        </Button>
                    </Link>
                    <Link href="/export">
                        <Button>
                            Download Kit <Download className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* LEFT COLUMN: Creative Assets */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Brand Names */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Generated Names</h3>
                        <div className="space-y-3">
                            {data.names.map((name: string, i: number) => (
                                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 hover:border-brand-300 transition-all dark:border-gray-800 dark:bg-white/5">
                                    <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-brand-600"><Copy className="h-4 w-4" /></button>
                                        <button className="text-gray-400 hover:text-brand-600"><Check className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Tagline & Description */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Brand Narrative</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tagline</label>
                                <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-lg font-medium text-brand-600 dark:border-gray-700 dark:bg-dark-bg">
                                    {data.tagline}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                                <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Logos */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Logo Concepts</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.logos.map((logo: string, i: number) => (
                                <div key={i} className="aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-200 dark:border-gray-700 relative group cursor-pointer">
                                    <img src={logo} alt={`Logo ${i}`} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button size="sm" variant="secondary">Select</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Color Palette */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Color Palette</h3>
                        <div className="flex rounded-xl overflow-hidden shadow-lg h-24">
                            {data.palette?.map((color: string, i: number) => (
                                <div key={i} className="flex-1 flex items-end justify-center pb-2 text-xs font-medium text-white/90" style={{ backgroundColor: color }}>
                                    {color}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Intelligence & Story */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Brand Score */}
                    <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col items-center py-6 text-center">
                            <h3 className="mb-6 text-lg font-medium text-white/80">Brand Success Score</h3>
                            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-white/10 bg-white/5">
                                <span className="text-4xl font-bold">89</span>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                <div className="rounded-lg bg-white/10 p-3 text-center">
                                    <div className="text-2xl font-bold">{data.scores.memorability}</div>
                                    <div className="text-xs text-white/60">Memorability</div>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3 text-center">
                                    <div className="text-2xl font-bold">{data.scores.tone_match}%</div>
                                    <div className="text-xs text-white/60">Tone Match</div>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3 text-center">
                                    <div className="text-2xl font-bold">{data.scores.audience_appeal}%</div>
                                    <div className="text-xs text-white/60">Audience Appeal</div>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3 text-center">
                                    <div className="text-2xl font-bold">{data.scores.market_uniqueness}%</div>
                                    <div className="text-xs text-white/60">Uniqueness</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Founder Story */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Founder Story</h3>
                        <div className="prose prose-sm dark:prose-invert">
                            <p>{data.founder_story}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-4 w-full text-brand-600">
                            <Sparkles className="mr-2 h-4 w-4" /> Regenerate Story
                        </Button>
                    </Card>

                    {/* Social Bio */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Social Profile</h3>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-bg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="ml-3">
                                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                                    <div className="h-2 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{data.bio}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
