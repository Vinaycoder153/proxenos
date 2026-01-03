"use client";

import { use } from "react";
import { login, signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, UserPlus, Fingerprint } from "lucide-react";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = use(searchParams);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden selection:bg-primary/30 selection:text-white">
            {/* Immersive background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Global grid background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <div className="mb-12 text-center space-y-4 relative z-10 animate-slide-in">
                <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-primary/5 mb-4 ring-1 ring-primary/20 animate-pulse-glow shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                    <Shield className="h-12 w-12 text-primary drop-shadow-[0_0_8px_var(--primary)]" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-5xl font-black tracking-tighter text-white gradient-text flex items-center justify-center gap-2">
                        NEXUS <span className="text-primary tracking-widest text-lg font-mono">v4.0</span>
                    </h1>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.4em]">Personal AI Operating System</p>
                </div>
            </div>

            <Card className="w-full max-w-lg border-white/10 bg-black/40 backdrop-blur-3xl relative z-10 shadow-2xl animate-slide-in hover:border-primary/20 transition-all duration-500">
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40 animate-[scanning_3s_ease-in-out_infinite] z-20 pointer-events-none" />

                {params?.error && (
                    <div className="mx-6 mt-6 p-4 text-xs font-mono uppercase tracking-wider text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 animate-pulse">
                        Authentication Failed: {params.error}
                    </div>
                )}

                <Tabs defaultValue="login" className="w-full">
                    <CardHeader className="pt-8 px-8 flex flex-col items-center">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 h-12 rounded-xl">
                            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
                                <Lock className="h-4 w-4 mr-2" />
                                Login
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Initialize
                            </TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 pt-2">
                        <TabsContent value="login" className="space-y-6 mt-0 animate-in fade-in zoom-in-95 duration-300">
                            <form action={login} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Operator Identity</label>
                                    <div className="relative group">
                                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="commander@nexus.ai"
                                            required
                                            className="bg-white/5 border-white/10 pl-10 h-12 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Secure Passkey</label>
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white/5 border-white/10 h-12 focus:border-primary/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 hover:glow-active transition-all group overflow-hidden relative">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Access System <Shield className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                                    </span>
                                </Button>
                                <div className="text-center">
                                    <button type="button" className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
                                        Forgot Authorization Code?
                                    </button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-6 mt-0 animate-in fade-in zoom-in-95 duration-300">
                            <form action={signup} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Personnel Name</label>
                                    <Input
                                        name="full_name"
                                        type="text"
                                        placeholder="Commander Doe"
                                        className="bg-white/5 border-white/10 h-12 focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Entity Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="commander@nexus.ai"
                                        required
                                        className="bg-white/5 border-white/10 h-12 focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">New Passkey</label>
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white/5 border-white/10 h-12 focus:border-primary/50 transition-all"
                                        minLength={6}
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full h-12 border border-primary/30 text-primary bg-primary/5 font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                                    Initialize New Entity
                                </Button>
                            </form>
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>

            <div className="mt-12 flex items-center gap-8 relative z-10 animate-slide-in">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">Secure</span>
                    <div className="h-px w-8 bg-green-500/20" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">Encrypted</span>
                    <div className="h-px w-8 bg-primary/20" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">AI Managed</span>
                    <div className="h-px w-8 bg-blue-500/20" />
                </div>
            </div>

            <style jsx global>{`
                @keyframes scanning {
                    0%, 100% { top: 0%; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
