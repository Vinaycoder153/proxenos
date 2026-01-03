"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import {
    LayoutDashboard,
    CheckSquare,
    Zap,
    BarChart3,
    Settings,
    Timer,
    Plus,
    Target
} from "lucide-react";
import { Task } from "@/lib/types";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const handleOpen = () => setOpen(true);
        window.addEventListener("open-command-palette", handleOpen);

        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener("open-command-palette", handleOpen);
        };
    }, []);

    useEffect(() => {
        if (open) {
            fetchRecentTasks();
        }
    }, [open]);

    async function fetchRecentTasks() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data.filter((t: Task) => t.status !== 'completed').slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch tasks for command palette:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search nodes..." />
            <CommandList className="glass border-white/10">
                <CommandEmpty>No segments found in the current buffer.</CommandEmpty>

                {tasks.length > 0 && (
                    <CommandGroup heading="Active Objectives">
                        {tasks.map((task) => (
                            <CommandItem
                                key={task.id}
                                onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}
                                className="group"
                            >
                                <Target className="mr-2 h-4 w-4 text-primary opacity-40 group-hover:opacity-100" />
                                <span>{task.title}</span>
                                <span className="ml-auto text-[10px] font-mono text-muted-foreground/40">{task.priority}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                <CommandSeparator />

                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Command Center</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        <span>Mission Log</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/habits"))}>
                        <Zap className="mr-2 h-4 w-4" />
                        <span>Daily Protocols</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>System Analytics</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="System Actions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}>
                        <Plus className="mr-2 h-4 w-4 text-primary" />
                        <span>Initialize New Objective</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => {
                        window.dispatchEvent(new CustomEvent('nexus-start-timer'));
                    })}>
                        <Timer className="mr-2 h-4 w-4 text-primary" />
                        <span>Start focus session</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configure System Node</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
