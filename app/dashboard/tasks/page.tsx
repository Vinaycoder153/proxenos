"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Task, TaskPriority, TaskStatus } from "@/lib/types";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("Medium");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        const res = await fetch("/api/tasks");
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
        setLoading(false);
    }

    async function addTask() {
        if (!newTask) return;

        // Optimistic Update
        const optimisticTask: Task = {
            id: Math.random().toString(), // Temp ID
            user_id: "temp",
            title: newTask,
            priority,
            due_date: new Date().toISOString().split('T')[0],
            status: "pending",
            created_at: new Date().toISOString()
        };
        setTasks([optimisticTask, ...tasks]);
        setNewTask("");

        const res = await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: newTask,
                priority,
                due_date: new Date().toISOString().split('T')[0]
            }),
        });

        if (res.ok) {
            // Refresh to get real ID
            fetchTasks();
        }
    };

    async function updateStatus(id: string, status: TaskStatus) {
        // Optimistic Update
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));

        await fetch("/api/tasks", {
            method: "PATCH",
            body: JSON.stringify({ id, status })
        });
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mission Log</h1>
                    <p className="text-muted-foreground">Manage and track your daily objectives.</p>
                </div>
            </div>

            <Card className="bg-card/40 border-primary/20">
                <CardContent className="p-4 flex gap-4">
                    <Input
                        placeholder="New objective..."
                        className="bg-background/50 border-input"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High">High Priority</SelectItem>
                            <SelectItem value="Medium">Medium Priority</SelectItem>
                            <SelectItem value="Low">Low Priority</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={addTask} className="shrink-0 bg-primary text-black hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
                </CardContent>
            </Card>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="missed">Missed</TabsTrigger>
                </TabsList>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    ["pending", "completed", "missed"].map((status) => (
                        <TabsContent key={status} value={status} className="mt-4 space-y-4">
                            {tasks.filter(t => t.status === status).map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/60 hover:bg-card/80 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-4 w-4 rounded-sm border ${status === 'completed' ? 'bg-primary border-primary' : 'border-muted-foreground'}`}></div>
                                        <div>
                                            <h4 className={`font-medium ${status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <span>Due: {task.due_date}</span>
                                                <Badge variant="secondary" className="text-[10px] h-5">{task.priority}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {status === 'pending' && (
                                            <>
                                                <Button onClick={() => updateStatus(task.id, 'completed')} size="sm" variant="ghost" className="text-green-500 hover:text-green-400 hover:bg-green-500/10">Done</Button>
                                                <Button onClick={() => updateStatus(task.id, 'missed')} size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">Missed</Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === status).length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">No {status} tasks.</div>
                            )}
                        </TabsContent>
                    ))
                )}
            </Tabs>
        </div>
    );
}
