var express = require('express');
var bodyParser = require('body-parser')
var pg = require('pg');
var cors = require('cors')

var app = express();

app.use(cors());
app.options('*', cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var connectionsCredentials = [];
var connections = [];

app.get('/', function (req, res) {
    res.send("Hello world");
});

//QUERIES
app.post('/query/:id', function (req, res) {
    let id = req.params.id;
    let sql = req.body.sql;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let client = connections[id];

        var query = client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows);
            }
        });
        //query.on("err")
        // query.on("row", function (row, result) {
        //     result.addRow(row);
        // });
        // query.on("end", function (result) {
        //     res.status(200).json(result.rows);
        // });
    }
});

//CONNECTIONS
app.get('/connections', function (req, res) {
    res.status(200).json(connectionsCredentials);
});

app.post('/connections', function (req, res) {
    let credentials = req.body.credentials;

    let connString = `pg://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.db}`;
    console.log(connString);
    // let connString = `pg://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}`;
    let client = new pg.Client(connString);

    client.connect(function (err) {
        if (err)
            res.status(500).json(err);
        else {
            credentials.password = '********';
            connectionsCredentials.push(credentials);
            connections.push(client);

            res.status(200).json("Connection added");
        }
    });
});

app.put('/connections/:id', function (req, res) {
    res.status(200).json("success");
});

app.delete('/connections/:id', function (req, res) {
    let id = req.params.id;
    console.log(connections.length);
    if (id >= connections.length)
        res.status(500).json("Connection not found");
    else {
        let client = connections[id];
        client.end();
        connections.splice(id, 1);
        connectionsCredentials.splice(id, 1);
    }
});

//SESSIONS
app.get("/sessions", function (req, res) {
    if (connections.length == 0 && id < connections.length)
        res.status(500).json("No connections availables");
    else {
        let client = connections[0];

        var query = client.query("select * from pg_stat_activity;");
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            res.status(200).json(result.rows);
        });
    }
});

//ALL
app.delete('/connection/:id/drop/:objectType/:objectName', function (req, res) {
    let id = req.params.id;
    let objType = req.params.objectType;
    let objName = req.params.objectName;
    console.log();
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `drop ${objType} ${objName};`;
        if (objType == 'user') {
            sql = `drop${objType} ${objName};`

            console.log(sql);

            client.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    console.log(result.rows);
                    res.status(200).json("success");
                }
            });

        } else if (objType == 'check') {
            //nothing
            res.status(404).json("Method not found");
            return;
        } else if (objType == 'function') {
            client.query(`select pg_catalog.pg_get_function_arguments(pg_proc.oid) as args from pg_proc where proname = '${objName}'`, function (err, result) {
                if (err) {
                    console.log("|", err);
                    res.status(500).json(err);
                } else {
                    let args = result.rows[0].args;
                    sql = `drop function if exists ${objName}( ${args} )`;
                    console.log(sql);
                    client.query(sql, function (err, result) {
                        if (err) {
                            console.log("||",err);
                            res.status(500).json(err);
                        } else {
                            res.status(200).json("success");

                        }
                    });
                }
            });
        }
        // else if(objType == 'function'){
        //     sql = ``;
        // }
    }
});

//DATABASES
app.get("/connection/:id/databases", function (req, res) {
    let id = req.params.id;
    console.log();
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select datname from pg_database pd inner join pg_user pu on pd.datdba = pu.usesysid where pu.usename = '${cred.username}'`;
        console.log(sql);

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result.rows);
                res.status(200).json(result.rows.map(x => x.datname));
            }
        });
    }
});

app.post("/connection/:id/databases/:dbname", function (req, res) {
    let id = req.params.id;
    let dbname = req.params.dbname;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `create database ${dbname} owner ${cred.username}`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json('Database created');
            }
        });
    }
});

//SCHEMAS
app.get('/connection/:id/schemas', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select pn.nspname from pg_namespace pn inner join pg_user pu on pu.usesysid= pn.nspowner where pu.usename = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.nspname));
            }
        });
    }
});

//TABLES
app.get('/connection/:id/tables', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select pt.tablename from pg_tables pt inner join pg_user pu on pu.usename= pt.tableowner where pu.usename = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.tablename));
            }
        });
    }
});

app.get('/connection/:id/table/:tablename/cols', function (req, res) {
    let id = req.params.id;
    let table = req.params.tablename;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select column_name from information_schema.columns where table_name = '${table}'`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.column_name));
            }
        });
    }
});

app.post('/connection/:id/table/:tablename/insert', function (req, res) {
    let id = req.params.id;
    let table = req.params.tablename;
    let newRow = req.body.data;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let cols = '';
        let values = '';

        for (let property in newRow) {
            if (newRow.hasOwnProperty(property)) {
                cols += `${property}, `;
                values += `'${newRow[property]}', `;
            }
        }

        cols = cols.slice(0, -2);
        values = values.slice(0, -2);

        let sql = `insert into ${table} (${cols}) values (${values})`;
        console.log(sql);
        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.column_name));
            }
        });
    }
});

app.put('/connection/:id/table/:tablename/update', function (req, res) {
    let id = req.params.id;
    let table = req.params.tablename;
    let newRow = req.body.newData;
    let oldRow = req.body.oldData;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let set_st = '';
        let where_st = '';

        for (let property in newRow) {
            if (newRow.hasOwnProperty(property)) {
                if (newRow[property] != oldRow[property])
                    set_st += `${property} = '${newRow[property]}', `;
                where_st += `${property} = '${oldRow[property]}' and `;
            }
        }

        set_st = set_st.slice(0, -2);
        where_st = where_st.slice(0, -4);

        let sql = `update ${table} set ${set_st} where ${where_st}`;
        console.log(sql);
        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.column_name));
            }
        });
    }
});

app.post('/connection/:id/table/:tablename/delete', function (req, res) {
    let id = req.params.id;
    let table = req.params.tablename;
    let delRow = req.body.data;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sub_sql = '';

        for (let property in delRow) {
            if (delRow.hasOwnProperty(property)) {
                sub_sql = `${property} = '${delRow[property]}' and `;
            }
        }

        sub_sql = sub_sql.slice(0, -4);

        let sql = `delete from ${table} where ${sub_sql}`;
        console.log(sql);
        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows.map(x => x.column_name));
            }
        });
    }
});

//DDL's
app.get('/connection/:id/table/:tablename/ddl', function (req, res) {
    let id = req.params.id;
    let table = req.params.tablename;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select get_table_ddl('${table}', '${cred.username}');`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].get_table_ddl);
            }
        });
    }
});

app.get('/connection/:id/view/:viewname/ddl', function (req, res) {
    let id = req.params.id;
    let view = req.params.viewname;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select fn_get_view_ddl('${view}');`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].fn_get_view_ddl);
            }
        });
    }
});

app.get('/connection/:id/user/:username/ddl', function (req, res) {
    let id = req.params.id;
    let user = req.params.username;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select fn_get_user_ddl('${user}');`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].fn_get_user_ddl);
            }
        });
    }
});

app.get('/connection/:id/database/:dbname/ddl', function (req, res) {
    let id = req.params.id;
    let db = req.params.dbname;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select fn_get_database_ddl('${db}');`;

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].fn_get_database_ddl);
            }
        });
    }
});

app.get('/connection/:id/index/:idxname/ddl', function (req, res) {
    let id = req.params.id;
    let idxname = req.params.idxname;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select indexdef from pg_indexes where indexname = '${idxname}';`;
        //create index idxname on test(name);

        client.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].indexdef);
            }
        });
    }
});

app.get('/connection/:id/check/:checkname/ddl', function (req, res) {
    let id = req.params.id;
    let checkname = req.params.checkname;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        client.query(`select 'ALTER TABLE ' || pcl.relname || ' ADD CONSTRAINT ' || pg_get_constraintdef(pc.oid) as ddl
        from pg_constraint pc
        inner join  pg_class pcl on pc.conrelid = pcl.oid
        where conname = '${checkname}'`, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(404).json(err);
                } else {
                    console.log(result);
                    res.status(200).json(result.rows[0].ddl);
                    // let oid = result.rows[0].oid;
                    // let sql = `select pg_get_constraint_def(${oid});`;
                    // //create index idxname on test(name);

                    // client.query(sql, function (err, result) {
                    //     if (err) {
                    //         console.log(err);
                    //         res.status(500).json(err);
                    //     } else {
                    //         res.status(200).json(result.rows[0].pg_get_constraint_def);
                    //     }
                    // });
                }
            })
    }
});

//INDEXES
app.get('/connection/:id/indexes', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select indexname from pg_indexes pi inner join pg_tables pt on pi.tablename = pt.tablename where pt.tableowner = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.indexname));
            }
        });
    }
});

//CHECKS
app.get('/connection/:id/checks', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select 
        pci.conname 
        from pg_constraint pci 
        --inner join pg_namespace pn on pci.connamespace = pn.oid 
        --inner join pg_user pu on pu.usesysid = pn.nspowner
        where pci.contype = 'c' OR pci.contype = 'f'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.conname));
            }
        });
    }
});

//FUNCTIONS
app.get('/connection/:id/functions', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select proname from pg_proc pp inner join pg_user pu on pu.usesysid = pp.proowner where pu.usename = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.proname));
            }
        });
    }
});


app.get('/connection/:id/function/:fn_name/ddl', function (req, res) {
    let id = req.params.id;
    let fn_name = req.params.fn_name;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select fn_get_function_definition('${fn_name}');`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(result.rows[0].fn_get_function_definition);
            }
        });
    }
});

//VIEWS
app.get('/connection/:id/views', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select viewname from pg_views where viewowner = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.viewname));
            }
        });
    }
});

//USERS
app.get('/connection/:id/users', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select usename from pg_user`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.usename));
            }
        });
    }
});

//TRIGERS
app.get('/connection/:id/trigers', function (req, res) {
    let id = req.params.id;
    if (connections.length == 0 || id >= connections.length)
        res.status(500).json("No connections availables");
    else {
        let cred = connectionsCredentials[id];
        let client = connections[id];

        let sql = `select tgname from pg_trigger ptr inner join pg_class pc on pc.oid = ptr.tgrelid inner join pg_user pu on pu.usesysid = pc.relowner where pu.usename = '${cred.username}'`;

        client.query(sql, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                console.log(result);
                res.status(200).json(result.rows.map(x => x.tgname));
            }
        });
    }
});

app.listen(8000);

/*
--select * from pg_tables pt inner join pg_namespace pn on pt.schemaname = pn.nspname limit 10;
--select * from pg_namespace limit 10;

*/