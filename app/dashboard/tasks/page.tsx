"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Search, Filter, Download, Trash2, Clock, Calendar, CheckSquare } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableTaskItem } from "@/components/dashboard/sortable-task-item";
import { cn, getTodayDate } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function EnhancedTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("Medium");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [dueDate, setDueDate] = useState("");
    const { toast } = useToast();

    // DND sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchTasks = async () => {
        const res = await fetch("/api/tasks");
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
        setLoading(false);
    };

    const filterTasks = () => {
        let filtered = [...tasks];
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (filterPriority !== "all") {
            filtered = filtered.filter(task => task.priority === filterPriority);
        }
        setFilteredTasks(filtered);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, searchQuery, filterPriority]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((t) => t.id === active.id);
                const newIndex = items.findIndex((t) => t.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Here you would typically persist the new order to the backend
                // For now, it's just local reordering
                return newItems;
            });

            toast({
                title: "Priority Updated",
                description: "Operation sequence modified",
            });
        }
    };

    async function addTask() {
        if (!newTask.trim()) {
            toast({
                title: "Error",
                description: "Task title cannot be empty",
                variant: "destructive",
            });
            return;
        }

        const optimisticTask: Task = {
            id: Math.random().toString(),
            user_id: "temp",
            title: newTask,
            priority,
            due_date: dueDate || getTodayDate(),
            status: "pending",
            created_at: new Date().toISOString()
        };

        setTasks([optimisticTask, ...tasks]);
        setNewTask("");
        setDueDate("");

        const res = await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: newTask,
                priority,
                due_date: dueDate || getTodayDate()
            }),
        });

        if (res.ok) {
            fetchTasks();
            toast({
                title: "Protocol Initialized",
                description: "New objective verified and added to registry",
                variant: "success",
            });
        }
    }

    async function updateStatus(id: string, status: TaskStatus) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));

        await fetch("/api/tasks", {
            method: "PATCH",
            body: JSON.stringify({ id, status })
        });

        toast({
            title: status === 'completed' ? "Mission Accomplished! 🎖️" : "Protocol Updated",
            description: `Objective status set to ${status.toUpperCase()}`,
            variant: status === 'completed' ? "success" : "default",
        });
    }

    async function deleteTask(id: string) {
        setTasks(tasks.filter(t => t.id !== id));

        await fetch("/api/tasks", {
            method: "DELETE",
            body: JSON.stringify({ id })
        });

        toast({
            title: "Registry Purged",
            description: "Data segment removed from mission logs",
        });
    }

    function exportTasks() {
        const exportData = {
            system: "NEXUS OS v4.0",
            timestamp: new Date().toISOString(),
            personnel: "OPERATOR",
            tasks: tasks
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nexus-mission-log-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
            title: "Data Link Established",
            description: "Mission logs encrypted and exported successfully",
            variant: "success",
        });
    }



    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="MISSION LOG"
                label="Registry Module"
                icon={CheckSquare}
                count={`${tasks.length} OBJECTIVES`}
            >
                <Button
                    onClick={exportTasks}
                    variant="outline"
                    className="h-10 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest gap-2"
                >
                    <Download className="h-4 w-4" />
                    Export Data
                </Button>
            </PageHeader>

            {/* Quick Command Bar */}
            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-8 glass border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.02)]">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter new objective..."
                                    className="h-12 pl-10 bg-black/40 border-white/10 focus:border-primary/50 transition-all font-medium"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                />
                            </div>
                            <Button
                                onClick={addTask}
                                className="h-12 px-8 bg-primary text-black font-black uppercase tracking-widest hover:glow-active transition-all"
                            >
                                <span className="hidden sm:inline">Initialize</span>
                                <Plus className="h-4 w-4 sm:ml-2" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="date"
                                    className="bg-transparent text-[10px] font-mono uppercase outline-none text-muted-foreground border-none p-0 cursor-pointer"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mr-1">Priority:</span>
                                {(['High', 'Medium', 'Low'] as TaskPriority[]).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-[10px] font-mono uppercase transition-all border",
                                            priority === p
                                                ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                                                : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-4 glass border-white/10 bg-white/5">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <Input
                                    placeholder="Search logs..."
                                    className="h-10 pl-10 text-xs font-mono bg-black/20 border-white/5 focus:border-primary/30"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="h-10 text-xs font-mono uppercase bg-black/20 border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5" />
                                        <SelectValue placeholder="All Priorities" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    <SelectItem value="all">System: All</SelectItem>
                                    <SelectItem value="High">Priority: High</SelectItem>
                                    <SelectItem value="Medium">Priority: Medium</SelectItem>
                                    <SelectItem value="Low">Priority: Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="pending" className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white/5 border border-white/10 p-1 h-12 rounded-xl">
                        {(['pending', 'completed', 'missed'] as TaskStatus[]).map((s) => (
                            <TabsTrigger
                                key={s}
                                value={s}
                                className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                {s} <span className="ml-2 py-0.5 px-1.5 rounded-full bg-black/20 text-[8px]">{filteredTasks.filter(t => t.status === s).length}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <span className="text-[10px] font-mono text-primary animate-pulse tracking-[0.4em] uppercase">Decrypting Mission Logs...</span>
                        </div>
                    </div>
                ) : (
                    (['pending', 'completed', 'missed'] as TaskStatus[]).map((status) => (
                        <TabsContent key={status} value={status} className="mt-0 focus-visible:outline-none">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <div className="space-y-4">
                                    {filteredTasks.filter(t => t.status === status).length === 0 ? (
                                        <Card className="glass border-dashed border-white/10 bg-transparent">
                                            <CardContent className="p-20 text-center">
                                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-4 border border-white/5">
                                                    <CheckSquare className="h-8 w-8 text-muted-foreground/20" />
                                                </div>
                                                <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/40">No objectives match this segment.</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <SortableContext
                                            items={filteredTasks.filter(t => t.status === status).map(t => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {filteredTasks.filter(t => t.status === status).map((task) => (
                                                <SortableTaskItem
                                                    key={task.id}
                                                    task={task}
                                                    status={status}
                                                    updateStatus={updateStatus}
                                                    deleteTask={deleteTask}
                                                />
                                            ))}
                                        </SortableContext>
                                    )}
                                </div>
                            </DndContext>
                        </TabsContent>
                    ))
                )}
            </Tabs>

            {/* Status Footer */}
            <div className="pt-8 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-mono uppercase text-muted-foreground/40 tracking-widest">Efficiency</span>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-24 bg-white/5 rounded-full">
                                <div className="h-full bg-primary w-2/3" />
                            </div>
                            <span className="text-[10px] font-mono text-primary">68%</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-mono uppercase text-muted-foreground/40 tracking-widest">Network</span>
                        <span className="text-[10px] font-mono text-green-500 uppercase">Secure Link</span>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground/20 uppercase tracking-[0.5em]">
                    Segment [T-LOG-SYS]
                </div>
            </div>
        </div>
    );
}
