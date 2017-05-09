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
  ],
  template: `
              <nav-bar>Loading NavBar...</nav-bar>
              <router-outlet></router-outlet>
            `
})
export class AppComponent implements OnInit {

  public ngOnInit() {
    console.log();
  }

}
