/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './style.css'
  ],
  template: `
              <nav-bar>Loading NavBar...</nav-bar>
            `
})
export class AppComponent implements OnInit {

  public ngOnInit() {
    console.log();
  }

}
