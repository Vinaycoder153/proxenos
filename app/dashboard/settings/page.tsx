"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Settings as SettingsIcon,
    User,
    Shield,
    Monitor,
    Cpu,
    Globe,
    Bell,
    Volume2,
    Database,
    Binary,
    Terminal
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

import { useSettings } from "@/lib/hooks/use-settings";

export default function SettingsPage() {
    const { toast } = useToast();
    const { settings, updateSettings } = useSettings();

    const handleSave = () => {
        toast({
            title: "Configuration Saved",
            description: "System parameters updated successfully.",
            variant: "success",
        });
    };

    const resetToDefaults = () => {
        updateSettings({
            noise: true,
            scanlines: false,
            glow: true,
            audio: true,
        });
        toast({
            title: "Registry Reset",
            description: "System parameters restored to default safety levels.",
        });
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <PageHeader
                title={
                    <>CORE <span className="gradient-text">SETTINGS</span></>
                }
                subtitle="Optimize parameters. Define operational boundaries."
                label="System Configuration Module"
                icon={SettingsIcon}
            >
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary font-black uppercase tracking-widest">Protocol: V4-STABLE</span>
                </div>
            </PageHeader>

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Navigation Categories */}
                <div className="lg:col-span-4 space-y-4">
                    {[
                        { icon: User, label: "Operator Identity", active: true },
                        { icon: Monitor, label: "Visual Interface" },
                        { icon: Shield, label: "Neural Security" },
                        { icon: Bell, label: "Signal Broadcasts" },
                        { icon: Globe, label: "Network Synapse" },
                        { icon: Database, label: "Memory Storage" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${item.active
                                ? "bg-primary/10 border-primary/40 text-primary"
                                : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${item.active ? "text-primary" : "group-hover:text-white"}`} />
                            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}

                    <div className="pt-10">
                        <div className="p-6 rounded-2xl bg-black border border-dashed border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <Binary className="h-4 w-4 text-muted-foreground" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Build ID</span>
                            </div>
                            <div className="text-[11px] font-mono text-white/40 break-all leading-tight">
                                8f_2a_7e_c1_0d_9b_4a_5e_bc_32_1f_09
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Main Settings Content */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="glass border-white/5 bg-black/40">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <User className="h-5 w-5 text-primary" />
                                Operator Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Callsign</label>
                                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 text-sm text-white font-black italic">
                                        OPERATOR_ALPHA
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Operational Sector</label>
                                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 text-sm text-white font-black italic">
                                        A-01 (Productivity Core)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5 bg-black/40">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <Cpu className="h-5 w-5 text-primary" />
                                Interface Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-white uppercase italic">Neural Noise Filter</div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Enable global grain/noise overlay for tactile depth</p>
                                </div>
                                <Switch
                                    checked={settings.noise}
                                    onCheckedChange={(checked) => updateSettings({ noise: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-white uppercase italic">CRT Scanlines</div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Simulate retro-high-tech visual display artifacts</p>
                                </div>
                                <Switch
                                    checked={settings.scanlines}
                                    onCheckedChange={(checked) => updateSettings({ scanlines: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-white uppercase italic">Holographic Glow</div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Allow neon-emissive borders on primary containers</p>
                                </div>
                                <Switch
                                    checked={settings.glow}
                                    onCheckedChange={(checked) => updateSettings({ glow: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5 bg-black/40">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <Volume2 className="h-5 w-5 text-primary" />
                                Signal Auditory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-white uppercase italic">Completion Ping</div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Play high-frequency signal on protocol success</p>
                                </div>
                                <Switch
                                    checked={settings.audio}
                                    onCheckedChange={(checked) => updateSettings({ audio: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="ghost"
                            onClick={resetToDefaults}
                            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-white"
                        >
                            Reset to Defaults
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-12 px-10 bg-primary text-black font-black uppercase tracking-[0.2em] hover:glow-active transition-all"
                        >
                            Sync Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
