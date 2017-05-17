import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConnectionService {
    private port = 8000;
    private host = 'http://localhost';
    private url: string;

    constructor(private _http: Http) {
        this.url = `${this.host}:${this.port}`;
    }

    public executeQuery(query: string, id: number){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { sql: query };
        return this._http.post(`${this.url}/query/${id}`, params, {headers: headers}).map(
            res => res.json()
            );
    }

    public insertOnTable(data: any, table: string, id: number){
        alert('llego aqui');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { data: data };
        return this._http.post(`${this.url}/connection/${id}/table/${table}/insert`, params, {headers: headers}).map(res => res.json());
    }

    public deleteOnTable(data: any, table: string, id: number){
        alert('llego aqui');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { data: data };
        return this._http.post(`${this.url}/connection/${id}/table/${table}/delete`, params, {headers: headers}).map(res => res.json());
    }

    public updateOnTable(oldData: any, newData: any, table: string, id: number){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { oldData: oldData, newData: newData };
        return this._http.put(`${this.url}/connection/${id}/table/${table}/update`, params, {headers: headers}).map(
            res => res.json()
            );
    }

    public getTableColumns(id: number, table: string){
        return this._http.get(`${this.url}/connection/${id}/table/${table}/cols`).map(res => res.json());
    }

    public getTableData(id: number, table: string){
        return this.executeQuery(`select * from ${table}`, id);
    }

    public getDDL(id: number, objectName: string, objectType: string){
        return this._http.get(`${this.url}/connection/${id}/${objectType}/${objectName}/ddl`).map(res => res.json());
    }

    public getConnections(){
    	return this._http.get(`${this.url}/connections`).map(res => res.json());
    }

    public addConnection(credentials){
    	let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { credentials: credentials };
        return this._http.post(`${this.url}/connections`, params, {headers: headers}).map(
            res => res.json()
            );
    }

    public editConnection(credentials, id){
    	let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let params = { credentials: credentials };
        return this._http.put(`${this.url}/connections/${id}`, params, {headers: headers}).map(
            res => res.json()
            );
    }

    public deleteConnection(id){
    	return this._http.delete(`${this.url}/connections/${id}`).map(res => res.json());
    }

    public getAll(id: Number, objectName: string){
        return this._http.get(`${this.url}/connection/${id}/${objectName}`).map(res => res.json());
    }

    public drop(id: Number, objType: string, objName: string){
        return this._http.delete(`${this.url}/connection/${id}/drop/${objType}/${objName}`).map(res => res.json());
    }

    // public getDbs(id){
        //     return this.getAll(id, 'databases');
        // }

        // public getTables(id){
            //     return this.getAll(id, "tables");
            // }

            // public getIndexes(id){
                //     return this.getAll(id, 'indexes');
                // }

                // public getChecks(id){
                    //     return this.getAll(id, 'checks');
                    // }

                    // public getFunctions(id){
                        //     return this.getAll(id, 'functions');
                        // }

                        // public getSchemas(id){
                            //     return this.getAll(id, 'schemas');
                            // }

                            // public getViews(id){
                                //     return this.getAll(id, 'views');
                                // }

                                // public getUsers(id){
                                    //     return this.getAll(id, 'users');
                                    // }
                                }
