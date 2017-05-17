import { Component, OnInit, Input } from '@angular/core';
import { ConnectionService } from '../../services/connections.service';

@Component({
  selector: 'home',
  templateUrl: `./home.html`
})
export class HomeComponent implements OnInit {
  @Input() connectionId: number;
  @Input() query: string;
  public rows = [];
  public colds = [];
  public errors = "";
  public ctab = 0;

  public constructor(private _connection: ConnectionService){}

  public ngOnInit() {
    // this.rows = [{name: "nexer", lastname: "rodriguez"}];
    // this.load_colds();
    console.log();
  }

  public execute(){
    if(this.query != "" && this.connectionId >= 0){
      this._connection.executeQuery(this.query, this.connectionId).subscribe(
        res => {this.rows = res; this.load_colds(); this.errors = ''; this.ctab=0;},
        err => {this.errors = err._body; console.log(err); this.ctab=1;}
        );
    }
  }

  public load_colds(){
    this.colds = [];
    if(this.rows.length == 0){
      this.colds = [{field: 'result', header:'RESULT'}];
      this.rows = [{result: 'Success'}];
      return;
    }
    for (let property in this.rows[0]) {
      if (this.rows[0].hasOwnProperty(property)) {
        this.colds.push({field: property.toString(), header: property.toString().toUpperCase()});
      }
    }
  }

}
