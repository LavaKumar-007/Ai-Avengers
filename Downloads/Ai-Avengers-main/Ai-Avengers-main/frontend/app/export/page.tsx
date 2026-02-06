"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, CheckCircle, FileText, Image as ImageIcon, Share2 } from "lucide-react";
import DashboardLayout from '../dashboard/layout';

export default function ExportPage() {
    return (
        <DashboardLayout>
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Brand Kit is Ready!</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Everything you need to launch your brand in one package.</p>
                </div>

                <Card className="p-8">
                    <div className="mb-8 space-y-4">
                        {[
                            { icon: ImageIcon, text: "High-resolution Logo Files (PNG, SVG)" },
                            { icon: FileText, text: "Brand Style Guide (PDF)" },
                            { icon: Share2, text: "Social Media Assets & Bio" },
                            { icon: FileText, text: "Founder Story & Messaging" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{item.text}</span>
                                <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button className="w-full flex-1" onClick={() => alert("Downloading PDF...")}>
                            <Download className="mr-2 h-5 w-5" /> Download Brand Kit (PDF)
                        </Button>
                        <Button variant="secondary" className="w-full flex-1">
                            Preview Assets
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
