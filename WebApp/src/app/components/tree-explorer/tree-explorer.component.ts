import { Component, OnInit, Input } from '@angular/core';
import { ENV_PROVIDERS } from "./../../environment";
import { TreeNode, MenuItem } from 'primeng/primeng';
import { ConnectionService } from '../../services/connections.service';
import { ObjectNames } from '../../structures/structures';

@Component({
    selector: 'tree-bar',
    templateUrl: './treebar.html',
    styleUrls: []
})
export class TreeExplorerComponent implements OnInit {
    public connections: TreeNode[];
    public items: MenuItem[];
    public selected: TreeNode;
    public selectedType: string;
    public title: string;
    public displayDialog: boolean;
    public connection : any;
    public credentials = [];
    public currentConnectionId = -1;
    public currentConnection = 'No connection selected';
    public navHBarOptions = [];
    public currentObject : string = 'No object';
    public currentView = 0;
    public errors : string = '';
    public output : string = '';
    
    
    public constructor(private _connections: ConnectionService){}
    
    public ngOnInit() {
        this.selectedType = "connections";
        this.displayDialog = false;
        this.title = "New Connection";
        this.InitializeHNavBar();
        this.credentials = [];
        // this.connection = {host: '', username: '', password: '', port: "", db: '', conname: ''};
        this.connection = {host: '192.168.19.134', username: 'user2', password: 'user2', port: "5432", db: 'gpadmin', conname: 'user2@localhost'};
        this.connections = [
        {
            label: "Connections",
            data: { type: 'Root' },
            leaf: false,
            expanded: true,
            children: []
        }
        ];
        this.loadCredentials();
    }
    
    private InitializeHNavBar(){
        this.navHBarOptions = [
        [
        {label: "New Schema", icon: 'fa-plus', command: (event) => this.CreateSchema()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New Database", icon: 'fa-plus', command: (event) => this.CreateDatabase()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New Table", icon: 'fa-plus', command: (event) => this.CreateTable()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New Index", icon: 'fa-plus', command: (event) => this.CreateIndex()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New View", icon: 'fa-plus', command: (event) => this.CreateView()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New Check", icon: 'fa-plus', command: (event) => this.CreateCheck()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New User", icon: 'fa-plus', command: (event) => this.CreateUser()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "New Function", icon: 'fa-plus', command: (event) => this.CreateFunction()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        
        
        [
        {label: "Delete Schema", icon: 'fa-remove', command: (event) => this.Delete('schema')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete Database", icon: 'fa-remove', command: (event) => this.Delete('database')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('database')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Edit Table", icon: 'fa-edit', command: (event) => this.EditTable()},
        {label: "View Table", icon: 'fa-eye', command: (event) => this.ViewTable()},
        {label: "Delete Table", icon: 'fa-remove', command: (event) => this.Delete('table')},
        {label: "DDL", icon: 'fa-file-text', command: (event) => this.DDL('table')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete Index", icon: 'fa-remove', command: (event) => this.Delete('index')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('index')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete View", icon: 'fa-remove', command: (event) => this.Delete('view')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('view')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete Check", icon: 'fa-remove', command: (event) => this.Delete('check')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('check')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete User", icon: 'fa-remove', command: (event) => this.Delete('user')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('user')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        {label: "Delete Function", icon: 'fa-remove', command: (event) => this.Delete('function')},
        {label: `DDL`, icon: 'fa-file-text', command: (event) => this.DDL('function')},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        
        [
        {label: "Close Connection", icon: 'fa-sign-out', command: (event) => this.CloseConnection()},
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ],
        [
        { label: 'New Connection', icon: 'fa-plus', command: (event) => this.addConnection() },
        { label: 'Update Connections', icon: 'fa-refresh', command: (event) => this.loadCredentials() },
        {label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}}
        ]
        ];
    }
    
    private CreateSchema(){
        this.output = `CREATE SCHEMA [IF NOT EXISTS] schema_name [ AUTHORIZATION user_name ]`;
        this.currentView = 0;
    }

    private CreateDatabase(){
        this.output = `
        CREATE DATABASE name
        [[ WITH ] [ OWNER [=] user_name ]
           [ TABLESPACE [=] tablespace ]
           [ CONNECTION LIMIT [=] connlimit ] ]
           `;
        this.currentView = 0;
    }

    private CreateUser(){
        this.output = `
        CREATE USER name [ [ WITH ] option [ ... ] ]

        where option can be:
        | CREATEDB | NOCREATEDB
        | CREATEUSER | NOCREATEUSER
        | IN GROUP groupname [, ...]
        | [ ENCRYPTED | UNENCRYPTED ] PASSWORD 'password'
        `;
        this.currentView = 0;
    }

    private CreateIndex(){
        this.output = `
        ALTER TABLE distributors ADD PRIMARY KEY (dist_id);
        ALTER TABLE distributors ADD CONSTRAINT distfk FOREIGN KEY (address) REFERENCES addresses (address) MATCH FULL;
        ALTER TABLE distributors ADD CONSTRAINT dist_id_zipcode_key UNIQUE (dist_id, zipcode);
        `;
        this.currentView = 0;
    }

    private CreateCheck(){
        this.output = `
        ALTER TABLE table_name ADD CONSTRAINT constraint-name CHECK ( expression );
        `;
        this.currentView = 0;
    }

    private CreateFunction(){
        this.output = `CREATE FUNCTION function_name([parameter type, ...]) returns type_ot_void as
        $$
        DECLARE
        var type;
        BEGIN
        --BODY
        END;
        $$
        LANGUAGE 'lang';
        `;
        this.currentView = 0;
    }

    private CreateTable(){
        this.output = `
        CREATE TABLE [IF NOT EXIST] table_name(
        attribute_name type [NOT NULL] [CHECK (expression)],
        ...
        [PRIMARY KEY (attibute, ...)],
        [FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)],
        [UNIQUE (a, c)]
        ); `;
        this.currentView = 0;
    }

    private CreateView(){
        this.output = `CREATE VIEW viewname as
        //VIEW_BODY(SQL)
        ;`;
        this.currentView = 0;
    }
    
    private Delete(typeName){
        // alert('Delete ' + typeName + ' ' + this.currentObject);
        this._connections.drop(this.currentConnectionId, typeName, this.currentObject).subscribe(
        res => {alert('typeName dropped!')},
        err => {this.errors = 'Error dropping ' + typeName;}
        );
    }
    
    private EditTable(){
        this.output = `
        ALTER TABLE  ${this.currentObject} 
        SET SCHEMA new_schema
        
        ADD [ COLUMN ] column data_type
        DROP [ COLUMN ] [ IF EXISTS ] column [ RESTRICT | CASCADE ]
        DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
        OWNER TO new_owner
        SET TABLESPACE new_tablespaces
        `;
        this.currentView = 0;
    }
    
    private ViewTable(){
        this.currentView = 1;
    }
    
    private DDL(typeName){
        // alert('DDL ' + typeName + ' ' + this.currentObject);
        this._connections.getDDL(this.currentConnectionId, this.currentObject, typeName).subscribe(
        res => {this.output = res; this.currentView = 2;},
        err => {this.errors = err._body;}
        );
    }
    
    private CloseConnection(){
        this._connections.deleteConnection(this.currentConnectionId).subscribe(
            res => {this.loadCredentials()},
            err => {this.errors = err._body}
        );
    }
    
    private InitializeConnections(){
        this.connections[0].expanded = true;
        this.connections[0].children = new Array();
        
        for(let credPos in this.credentials){
            // alert(credPos);
            let cred = this.credentials[credPos];
            let conn = {label: cred.conname, data:{ type:  'Connection', connectionId: credPos}, leaf: false};
            this.connections[0].children.push(conn);
        }
        if(this.credentials.length > 0){
            // alert(this.credentials[0].conname);
            this.currentConnection = this.credentials[0].conname;
            this.currentConnectionId = 0;
            this.connections[0].children[0].expanded = true;
            this.loadConnectionSubTree(0);
        }else{
            this.currentConnection = 'No connection selected';
            this.currentConnectionId = -1;
        }
        this.items = new Array();
        this.items = this.navHBarOptions[17];
    }
    
    public addConnection() {
        this.displayDialog = true;
    }
    
    public createConnection(){
        if(this.connection.username == '' || this.connection.password == '' || this.connection.port == '' || this.connection.host == '' || this.connection.conname == '' || this.connection.db == '')
        return;
        this._connections.addConnection(this.connection).subscribe(
        res => {this.loadCredentials(); this.displayDialog = false; this.errors = '';},
        err => {this.errors = 'Bad Credentials';}
        );
    }
    
    private updateCurrentConnection(id){
        this.currentConnectionId = id;
        this.currentConnection = this.credentials[id].conname;
        this.InitializeHNavBar();
    }
    
    public NodeSelected(event) {
        this.selectedType = event.node.data.type;
        console.log(event.node);
        // alert(ObjectNames[<string>this.selectedType]);
        this.items = new Array();
        this.currentView = 0;
        this.items = this.navHBarOptions[ObjectNames[<string>this.selectedType]];
        // this.items.push({label: `   Run Query`, icon: 'fa-black-tie', command: (event) => {this.currentView = 0}});
        // this.items.push({label: `|| ${this.currentConnection}`, disabled: true});
        
        // alert(this.selectedType + ' - ' + event.node.label);
        if(this.selectedType != 'Root'){
            if(this.selectedType == 'Connection'){
                let conid = this.credentials.map(x => x.conname).indexOf(event.node.label);
                this.updateCurrentConnection(conid);
            }else
            this.updateCurrentConnection(event.node.data.connectionId);
        }
        
        if(ObjectNames[<string>this.selectedType] >= ObjectNames.Schema && ObjectNames[<string>this.selectedType] <= ObjectNames.Function){
            this.currentObject = event.node.label;
        }else{
            this.currentObject = 'No object';
        }
        
    }
    
    private loadCredentials(){
        this._connections.getConnections().subscribe(
        res => {this.credentials = res; this.InitializeConnections(); this.errors = '';},
        err => {this.errors = 'Error loading connections';}
        );
    }
    
    private arrayToNodeArray(arr: Array<any>, connectionId, type: string) : TreeNode[]{
        let ret = [];
        for(let value of arr){
            let node = {label: value, data: {type: type, connectionId: connectionId}, leaf: true};
            ret.push(node);
        }
        return ret;
    }
    
    private loadSubTree(connectionId, endpoint, objectPos, dataType){
        this._connections.getAll(connectionId, endpoint).subscribe(
        res => {this.connections[0].children[connectionId].children[objectPos].children = this.arrayToNodeArray(res, connectionId, dataType); this.errors = '';},
        err => {this.errors = 'Error Loading Content';}
        );        
    }
    
    private loadConnectionSubTree(connectionId){
        // alert("ConnectionId: " + connectionId);
        if(connectionId < 0 || connectionId >= this.credentials.length)
        return;
        
        let connection = this.connections[0].children[connectionId];
        
        connection.children = [
        {label: "Schemas", data:{ type:  'Schemas', connectionId: connectionId}, leaf: false, children: []},
        {label: "Databases", data:{ type:  'Databases', connectionId: connectionId}, leaf: false, children: []},
        {label: "Tables", data:{ type:  'Tables', connectionId: connectionId}, leaf: false, children: []},
        {label: "Indexes", data:{ type:  'Indexes', connectionId: connectionId}, leaf: false, children: []},
        {label: "Views", data:{ type:  'Views', connectionId: connectionId}, leaf: false, children: []},
        {label: "Checks", data:{ type:  'Checks', connectionId: connectionId}, leaf: false, children: []},
        {label: "Users", data:{ type:  'Users', connectionId: connectionId}, leaf: false, children: []},
        {label: "Functions", data:{ type:  'Functions', connectionId: connectionId}, leaf: false, children: []},
        ];
    }
    
    public loadNode(event){
        let node = event.node;
        if(node.data.type != 'Root'){
            this.currentConnectionId = node.data.connectionId;
            this.currentConnection = this.credentials[this.currentConnectionId].conname;
        }
        // alert(node.data.type);
        switch(node.data.type){
            case 'Root' : this.loadCredentials(); break;
            
            case 'Connection' : this.loadConnectionSubTree(node.data.connectionId);break;
            
            case 'Databases' : this.loadSubTree(node.data.connectionId, 'databases', ObjectNames.Databases, 'Database');break;
            case 'Schemas': this.loadSubTree(node.data.connectionId, 'schemas', ObjectNames.Schemas, 'Schema');break;
            case 'Indexes': this.loadSubTree(node.data.connectionId, 'indexes', ObjectNames.Indexes, 'Index');break;
            case 'Tables': this.loadSubTree(node.data.connectionId, 'tables', ObjectNames.Tables, 'Table');break;
            case 'Views': this.loadSubTree(node.data.connectionId, 'views', ObjectNames.Views, 'View');break;
            case 'Checks': this.loadSubTree(node.data.connectionId, 'checks', ObjectNames.Checks, 'Check');break;
            case 'Users': this.loadSubTree(node.data.connectionId, 'users', ObjectNames.Users, 'User');break;
            case 'Functions': this.loadSubTree(node.data.connectionId, 'functions', ObjectNames.Functions, 'Function');break;
            
            
        }
    }
    
}
