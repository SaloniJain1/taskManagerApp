import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `
    <header>
      <h1>Task Manager App</h1>
      <nav>
        <a routerLink="/tasks" routerLinkActive="active">My Tasks</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <p>&copy; 2024 Task Manager Project</p>
    </footer>
  `,
    styles: [`
    header { background: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; margin-left: 20px; text-decoration: none; }
    nav a.active { font-weight: bold; border-bottom: 2px solid white; }
    main { min-height: 80vh; }
    footer { text-align: center; padding: 1rem; background: #f1f1f1; border-top: 1px solid #ddd; }
  `]
})
export class AppComponent { }
