import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Authentication } from './authentication/authentication';

@Component({
  selector: 'app-root',
  imports: [Authentication,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FeedbackFrontEnd');
}
