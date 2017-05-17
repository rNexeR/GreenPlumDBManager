import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { ConnectionService } from '../../services/connections.service';

@Component({
	selector: 'table-viewer',
	templateUrl: './table-viewer.html',
	styleUrls: [],
})
export class TableViewerComponent implements OnInit {
	@Input() tableName : string;
	@Input() connectionId : number;

	public tableCols : Array<any> = [];
	public cols: Array<string> = [];

	public tableData : Array<any> = [];

	public displayDialog : boolean = false;
	public newRow : any;
	public isNew : boolean;
	public cloneRow : any;

	public constructor(private _connection: ConnectionService){}

	public ngOnInit() {
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		for (let propName in changes) {
			if(propName == 'tableName' && this.tableName != 'No object'){
				// alert('tableName change to ' + this.tableName);
				this.getTableData();
			}
		}

	}

	public getTableData(){
		this._connection.getTableColumns(this.connectionId, this.tableName).subscribe(
			res => {this.cols = res; this.transformColumns()},
			err => {alert(err._body.toString());}
			);
		this._connection.getTableData(this.connectionId, this.tableName).subscribe(
			res => {this.tableData = res;},
			err => {alert(err._body.toString());}
			);
	}

	private transformColumns(){
		this.tableCols = new Array();
		this.newRow = {};
		for (let col of this.cols) {
			this.newRow[col] = '';
			this.tableCols.push({field: col, header: col});
		}
	}

	public showDialogToAdd(){
		this.isNew = true;
		this.displayDialog = true;
	}

	public save(){
		if(this.isNew){
			this.createRow();
		}else{
			this.updateRow();
		}
	}

	public createRow(){
		this._connection.insertOnTable(this.newRow, this.tableName, this.connectionId).subscribe(
			res => {alert('Row added'); this.displayDialog = false; this.getTableData();},
			err => {alert('Error adding row')}
			);
	}

	public updateRow(){
		this._connection.updateOnTable(this.cloneRow, this.newRow, this.tableName, this.connectionId).subscribe(
			res => {alert('Row updated'); this.displayDialog = false; this.getTableData();},
			err => {alert('Error updating row')}
			);
	}

	public delete(row){
		this._connection.deleteOnTable(row, this.tableName, this.connectionId).subscribe(
			res => {alert('Row deleted'); this.displayDialog = false; this.getTableData();},
			err => {alert('Error deleting row')}
			);
	}

	onRowSelect(event) {
		//event.data
		this.isNew = false;
		this.cloneRow = JSON.parse(JSON.stringify(event.data));
		this.newRow = event.data;
		this.displayDialog = true;
	}

}