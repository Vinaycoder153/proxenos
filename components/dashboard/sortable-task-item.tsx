"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, GripVertical, Trash2 } from "lucide-react";
import { cn, getPriorityStyles } from "@/lib/utils";

interface SortableTaskItemProps {
    task: Task;
    status: TaskStatus;
    updateStatus: (id: string, status: TaskStatus) => void;
    deleteTask: (id: string) => void;
}

export function SortableTaskItem({
    task,
    status,
    updateStatus,
    deleteTask,
}: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "glass border-white/10 hover:border-primary/40 transition-all group relative overflow-hidden",
                isDragging ? "opacity-50 ring-2 ring-primary border-primary" : ""
            )}
        >
            {/* Holographic background effect when dragging */}
            {isDragging && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
            )}

            <CardContent className="p-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded transition-colors"
                    >
                        <GripVertical className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>

                    <Checkbox
                        checked={status === 'completed'}
                        onCheckedChange={(checked) => {
                            if (checked) updateStatus(task.id, 'completed');
                            else updateStatus(task.id, 'pending');
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    <div className="flex-1 min-w-0">
                        <h4 className={cn(
                            "font-medium text-base transition-all duration-300",
                            status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                        )}>
                            {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <Badge variant="outline" className={cn("text-[10px] font-mono uppercase px-2 py-0 border-white/10", getPriorityStyles(task.priority))}>
                                {task.priority}
                            </Badge>
                            {task.due_date && (
                                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                    <Clock className="h-3 w-3" />
                                    {task.due_date}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {status === 'pending' && (
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => updateStatus(task.id, 'completed')}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-[10px] font-mono uppercase tracking-wider text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                >
                                    Finish
                                </Button>
                                <Button
                                    onClick={() => updateStatus(task.id, 'missed')}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-[10px] font-mono uppercase tracking-wider text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
                                >
                                    Miss
                                </Button>
                            </div>
                        )}
                        <Button
                            onClick={() => deleteTask(task.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
