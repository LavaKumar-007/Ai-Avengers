"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import clsx from 'clsx';
import DashboardLayout from '../dashboard/layout'; // Reuse layout

const steps = [
    { id: 1, title: "Business Basics", desc: "What are you building?" },
    { id: 2, title: "Target Audience", desc: "Who is it for?" },
    { id: 3, title: "Brand Vibe", desc: "How should it feel?" },
];

const industries = ["SaaS", "E-commerce", "Fintech", "Health & Wellness", "Education", "Consulting", "Fashion", "Food & Bev", "Other"];
const audiences = ["Gen Z", "Millennials", "Professionals", "Parents", "Small Business Owners", "Enterprise", "Gamers"];
const tones = ["Professional", "Fun", "Luxury", "Tech", "Minimal", "Bold", "Friendly", "Trustworthy"];

export default function CreateBrandPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        industry: "",
        audience: "",
        tone: [] as string[]
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const toggleTone = (t: string) => {
        setFormData(prev => ({
            ...prev,
            tone: prev.tone.includes(t)
                ? prev.tone.filter(x => x !== t)
                : [...prev.tone, t]
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/generate-brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Generation failed');

            const data = await res.json();

            // Store data in sessionStorage to pass to results page
            sessionStorage.setItem('brandData', JSON.stringify(data));
            router.push('/results');
        } catch (error) {
            console.error(error);
            alert("Failed to generate brand. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="relative flex justify-between">
                        <div className="absolute top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-gray-200 dark:bg-gray-800" />
                        <div
                            className="absolute top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-brand-500 transition-all duration-300"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center bg-gray-50 dark:bg-dark-bg px-2">
                                <div className={clsx(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                    step >= s.id
                                        ? "border-brand-500 bg-brand-500 text-white"
                                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-dark-card"
                                )}>
                                    {step > s.id ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                                </div>
                                <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Crafting your brand identity...</h2>
                            <p className="text-gray-500">Our AI is analyzing {formData.industry} trends and brainstorming ideas.</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tell us about your idea</h2>
                                        <p className="text-gray-500 dark:text-gray-400">Describe your product or service in a few sentences.</p>
                                    </div>

                                    <Input
                                        label="Brand Name (Optional)"
                                        placeholder="e.g. BrandCraft"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Business Description</label>
                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-dark-card dark:text-white"
                                            rows={4}
                                            placeholder="e.g. An AI-powered tool that helps founders build their brand identity in minutes..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-dark-card dark:text-white"
                                            value={formData.industry}
                                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        >
                                            <option value="">Select an industry</option>
                                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Who are you targeting?</h2>
                                        <p className="text-gray-500 dark:text-gray-400">Select your primary audience.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {audiences.map(a => (
                                            <div
                                                key={a}
                                                onClick={() => setFormData({ ...formData, audience: a })}
                                                className={clsx(
                                                    "cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-brand-500",
                                                    formData.audience === a
                                                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                                                        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-dark-card"
                                                )}
                                            >
                                                {a}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Define your Vibe</h2>
                                        <p className="text-gray-500 dark:text-gray-400">Select keywords that describe your brand personality.</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {tones.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => toggleTone(t)}
                                                className={clsx(
                                                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                                    formData.tone.includes(t)
                                                        ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 dark:border-gray-700 dark:bg-dark-card dark:text-gray-300"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex justify-between">
                                {step > 1 ? (
                                    <Button variant="ghost" onClick={handleBack}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                ) : <div />}

                                {step < 3 ? (
                                    <Button onClick={handleNext} disabled={!formData.description && step === 1}>
                                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} className="w-full sm:w-auto">
                                        Generate Brand <Sparkles className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
