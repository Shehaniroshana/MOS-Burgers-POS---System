import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Correct module
  templateUrl: "./app.component.html", // Use double quotes
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = 'MOS-Burgers-POS';
}
