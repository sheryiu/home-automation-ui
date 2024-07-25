import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AirConditionerComponent } from './air-conditioner/air-conditioner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AirConditionerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'home-automation-ui';
}
