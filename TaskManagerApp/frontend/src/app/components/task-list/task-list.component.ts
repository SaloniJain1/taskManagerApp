import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskPage } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h2>Task Management</h2>
      
      <div class="controls">
        <button [routerLink]="['/tasks/new']" class="btn-primary">Add New Task</button>
        
        <div class="filters">
          <select [(ngModel)]="filterStatus" (change)="loadTasks()">
            <option [ngValue]="null">All Status</option>
            <option [ngValue]="true">Completed</option>
            <option [ngValue]="false">Pending</option>
          </select>
          
          <select [(ngModel)]="sortBy" (change)="loadTasks()">
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
          </select>
          
          <select [(ngModel)]="sortDir" (change)="loadTasks()">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <table class="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let task of taskPage?.content">
            <td>{{ task.id }}</td>
            <td><a [routerLink]="['/tasks', task.id]">{{ task.title }}</a></td>
            <td>
              <span [class.completed]="task.completed">
                {{ task.completed ? 'Completed' : 'Pending' }}
              </span>
            </td>
            <td>{{ task.dueDate | date:'medium' }}</td>
            <td>
              <button [routerLink]="['/tasks/edit', task.id]" class="btn-sm">Edit</button>
              <button (click)="deleteTask(task.id!)" class="btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Prev</button>
        <span>Page {{ currentPage + 1 }} of {{ taskPage?.totalPages }}</span>
        <button [disabled]="currentPage >= (taskPage?.totalPages ?? 0) - 1" (click)="changePage(currentPage + 1)">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .controls { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .filters { display: flex; gap: 10px; }
    .task-table { width: 100%; border-collapse: collapse; }
    .task-table th, .task-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .completed { color: green; font-weight: bold; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    .btn-danger { background: #dc3545; color: white; border: none; }
    .btn-sm { padding: 5px 10px; margin-right: 5px; cursor: pointer; }
    .pagination { margin-top: 20px; display: flex; gap: 10px; align-items: center; justify-content: center; }
  `]
})
export class TaskListComponent implements OnInit {
  taskPage?: TaskPage;
  currentPage = 0;
  pageSize = 10;
  sortBy = 'id';
  sortDir = 'desc';
  filterStatus: boolean | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const sortParam = `${this.sortBy},${this.sortDir}`;
    this.taskService.getTasks(this.currentPage, this.pageSize, sortParam, this.filterStatus ?? undefined)
      .subscribe(page => this.taskPage = page);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }
}
