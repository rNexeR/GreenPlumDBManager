import { Component, OnInit, Input } from '@angular/core';
// import {SessionService} from '../../../services/session.service';
// import {UsersService} from '../../../services/users.service';
// import {EventsEmitter} from '../../../services/event-emitter.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'nav-bar',
    templateUrl: './navbar.html'
})
export class NavBarComponent implements OnInit {
//   hasSession: boolean;
//   isAdmin: boolean = false;
//   event : string;
//   subscription: Subscription;
//   user: string;
//   constructor(private events: EventsEmitter, private _session: SessionService, 
// private _users: UsersService) { 
//     this.hasSession = false;
//     this.isAdmin = false;
//     this.subscription = this.events.getSessionEvents().subscribe(
//       event => {this.event = event;this.validateSession();}
//     );
//     this.hasSession = this._session.hasSession();
//     this.isAdmin= this._session.isAdmin;
//     if(this.hasSession){
//       let usr = this._session.getSession().user;
//       this.user = usr.firstname + " " + usr.lastname;
//     }
//   }

//   validateSession(){
//     this.hasSession = this._session.hasSession();
//     this.isAdmin= this._session.isAdmin;
//   }

//   logout(){
//     this._users.logout();
//     this.validateSession();
//   }

  public ngOnInit() {
      console.log();
  }

//   ngOnDestroy(){
//     this.subscription.unsubscribe();
//   }

}
