"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, User, Sparkles } from "lucide-react";
import DashboardLayout from '../dashboard/layout';
import { Card } from "@/components/ui/Card";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Brand Assistant. How can I help you refine your brand today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMsg.content }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-8rem)] flex-col">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brand Assistant</h1>
                    <p className="text-gray-500">Refine your strategy with AI.</p>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden p-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-dark-bg/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-200' : 'bg-brand-500 text-white'}`}>
                                        {m.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl ${m.role === 'user'
                                            ? 'bg-gray-900 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none dark:bg-dark-card dark:border-gray-800 dark:text-gray-300'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex max-w-[80%] gap-3">
                                    <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-gray-200 rounded-tl-none dark:bg-dark-card dark:border-gray-800">
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200 dark:bg-dark-card dark:border-gray-800">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask to refine the tagline or suggest blog topics..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            />
                            <Button onClick={sendMessage} disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
