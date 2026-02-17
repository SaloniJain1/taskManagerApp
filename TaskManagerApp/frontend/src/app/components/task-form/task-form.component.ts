import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>{{ editMode ? 'Edit' : 'Add' }} Task</h2>
      <form (ngSubmit)="saveTask()">
        <div class="form-group">
          <label>ID</label>
          <input type="number" [(ngModel)]="task.id" name="id" [disabled]="editMode" required class="form-control" placeholder="Enter Task ID">
        </div>
        <div class="form-group">
          <label>Title</label>
          <input type="text" [(ngModel)]="task.title" name="title" required class="form-control">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="task.description" name="description" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>Due Date</label>
          <input type="datetime-local" [(ngModel)]="task.dueDate" name="dueDate" required class="form-control">
        </div>
        <div class="form-group checkbox">
          <label>
            <input type="checkbox" [(ngModel)]="task.completed" name="completed"> Completed
          </label>
        </div>
        <div class="actions">
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" [routerLink]="['/tasks']" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: auto; }
    .form-group { margin-bottom: 15px; }
    .form-control { width: 100%; padding: 8px; box-sizing: border-box; }
    .checkbox { display: flex; align-items: center; }
    .actions { margin-top: 20px; display: flex; gap: 10px; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    .btn-secondary { background: #6c757d; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  task: Task = { title: '', description: '', completed: false, dueDate: '' };
  editMode = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.taskService.getTaskById(+id).subscribe(data => {
        this.task = data;
        // Format date for datetime-local input
        if (this.task.dueDate) {
          this.task.dueDate = new Date(this.task.dueDate).toISOString().slice(0, 16);
        }
      });
    } else {
      // Set default due date to 1 hour from now
      const now = new Date();
      now.setHours(now.getHours() + 1);
      this.task.dueDate = now.toISOString().slice(0, 16);
    }
  }

  saveTask(): void {
    if (this.editMode) {
      this.taskService.updateTask(this.task.id!, this.task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(this.task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
