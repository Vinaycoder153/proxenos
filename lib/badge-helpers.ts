import { TaskPriority, TaskStatus } from "./types";

/**
 * Get badge variant for task priority
 */
export function getPriorityBadgeVariant(priority: TaskPriority): "priority_high" | "priority_medium" | "priority_low" {
    switch (priority) {
        case 'High': return 'priority_high';
        case 'Medium': return 'priority_medium';
        case 'Low': return 'priority_low';
        default: return 'priority_medium';
    }
}

/**
 * Get badge variant for task status
 */
export function getStatusBadgeVariant(status: TaskStatus): "status_pending" | "status_completed" | "status_missed" {
    switch (status) {
        case 'pending': return 'status_pending';
        case 'completed': return 'status_completed';
        case 'missed': return 'status_missed';
        default: return 'status_pending';
    }
}

/**
 * Get priority label text
 */
export function getPriorityLabel(priority: TaskPriority): string {
    return `${priority} Priority`;
}

/**
 * Get status label text
 */
export function getStatusLabel(status: TaskStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}
