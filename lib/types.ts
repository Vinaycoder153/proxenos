export type TaskStatus = 'pending' | 'completed' | 'missed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
    id: string;
    user_id: string;
    title: string;
    priority: TaskPriority;
    due_date: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at?: string;
}

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    icon: string | null;
    created_at: string;
}

export interface HabitLog {
    id: string;
    user_id: string;
    habit_id: string;
    completed_at: string;
}

export interface Review {
    id: string;
    user_id: string;
    date: string;
    content: string | null;
    rating: number | null;
    created_at: string;
}
