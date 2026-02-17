export interface Task {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
}

export interface TaskPage {
    content: Task[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
