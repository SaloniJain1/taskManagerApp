import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="task">
      <h2>Task Details</h2>
      <div class="detail-card">
        <p><strong>Title:</strong> {{ task.title }}</p>
        <p><strong>Description:</strong> {{ task.description }}</p>
        <p><strong>Status:</strong> 
          <span [class.completed]="task.completed">
            {{ task.completed ? 'Completed' : 'Pending' }}
          </span>
        </p>
        <p><strong>Due Date:</strong> {{ task.dueDate | date:'medium' }}</p>
      </div>
      <div class="actions">
        <button [routerLink]="['/tasks/edit', task.id]" class="btn-primary">Edit</button>
        <button [routerLink]="['/tasks']" class="btn-secondary">Back to List</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: auto; }
    .detail-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #ddd; }
    .completed { color: green; font-weight: bold; }
    .actions { margin-top: 20px; display: flex; gap: 10px; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    .btn-secondary { background: #6c757d; color: white; border: none; padding: 10px 20px; cursor: pointer; }
  `]
})
export class TaskDetailComponent implements OnInit {
  task?: Task;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTaskById(+id).subscribe(data => this.task = data);
    }
  }
}
