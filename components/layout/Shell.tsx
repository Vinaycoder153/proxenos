"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden md:block md:w-64 md:fixed md:inset-y-0 z-50">
                <Sidebar className="h-full" />
            </div>

            {/* Mobile Header & Content */}
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur px-6 sticky top-0 z-40">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r border-border bg-sidebar">
                            <Sidebar className="border-none" />
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1 font-bold text-lg text-primary tracking-tight">NEXUS</div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
