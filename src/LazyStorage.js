/**
 * Storage
 * @param string dbname
 * @param integer version
 * @param array schemas
 * @returns {unresolved}
 */
var LazyStorage = function(dbname,version,schemas) {
    this.dbname = dbname;
    this.version = version;
    this.schemas = schemas;
    //from John Millikin http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    this.guid = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };    
    if(window.indexedDB) {
        return LazyStorage.iDB.call(this);
    }
    else if(window.openDatabase) {        
        return LazyStorage.webDB.call(this);
    }    
}


LazyStorage.webDB = function() {
    //open or createdb   
    var self = this;
    var db = window.openDatabase(this.dbname, this.version, this.dbname, 5*1024*1024);
    self.db = db;
    
    this.type = 'webDB';
    
    var errorCallback = function(tr,error)
    {                                                                
        console.log(error);
        if(error.code == 5) {
            alert(('Error, is pivate browsing enabled?'));
        }
    }    
    /**     
     * @param definitions array of objects name = tablename, indexes = array of objects with attr name
     * @returns {undefined}
     */
    var addSchema = function(schemas,callback) {        
        db.transaction(
            function (transaction) {
                var sql = '';
                for(i in schemas) {
                    sql += 'CREATE TABLE IF NOT EXISTS '+schemas[i].name+' ('+
                    'guid TEXT PRIMARY KEY, json TEXT';
                    for(y in schemas[i].indexes) {
                       sql += ','+schemas[i].indexes[y].name+' TEXT'; 
                    }
                    sql += ');'; 
                    transaction.executeSql(sql,[],callback,errorCallback)
                    //indexes
                    for(y in schemas[i].indexes) {
                       transaction.executeSql('CREATE INDEX IF NOT EXISTS '+schemas[i].indexes[y].name+' ON '+schemas[i].name+' ('+schemas[i].indexes[y].name+');',[],callback,errorCallback)                       
                    }   
                }                
            }
        );
    };
    addSchema(this.schemas,function() { console.log('db schema ready'); });
    //TODO get record
    this.get = function(key,schema,callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql('SELECT * FROM '+schema+' WHERE guid = ?',[key],function(transaction,result) {                    
                    var row = (result.rows.length) ? result.rows.item(0) : null;                       
                    callback(row);
                });                
            }   
        );        
    }
    //get all
    this.getAll = function(schema,callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql('SELECT * FROM '+schema,[],function(transaction,result) {
                   var items = new Array();
                   for (var i=0; i < result.rows.length; i++) {
                       var row = result.rows.item(i);                       
                       items.push(JSON.parse(row.json));
                   }
                   callback(items);
                });
            }   
        );        
    }
    //save record
    //TODO fill index values    
    this.save = function(schema,record,callback) {
        var $this = this;
        
        if(!record.guid) {
            record.guid = this.guid();
        }
        //db transaction
        db.transaction(
            function (transaction) {
                //get schema definition                
                var schemadef = $this.schemas.filter(function(element, index, array) { return (element.name == schema)})['0'];                
                //args from record
                var args = [record.guid,JSON.stringify(record)];
                //build sql
                var sql = "INSERT INTO "+schema+" (guid,json";                
                if(schemadef.indexes) {
                    for(i  in schemadef.indexes) {
                        sql += ','+$this.schemas[schema].indexes[i].name;
                    }
                }
                sql += ') VALUES (?,?';
                if(schemadef.indexes) {
                    for(i  in schemadef.indexes) {
                        sql += ',?';
                        args.push(record[$this.schemas[schema].indexes[i].name]);                    
                    }
                }
                sql += ')';                                
                //execute
                transaction.executeSql(sql,args,function(transaction,result) {
                    callback(record);
                },errorCallback);                
            }   
        );
    };
    this.update = function(schema,record,callback) {
        db.transaction(
            function (transaction) {
                var sql = "UPDATE "+schema+" SET json = ?  WHERE guid = ?";
                transaction.executeSql(sql,[JSON.stringify(record),record.guid],function(transaction,result) {
                    if(callback) { callback(record); }
                },errorCallback);                
            }   
        );        
    };
    /**
     * 
     * @param stromg schema
     * @param object record (only guid is needed)
     * @param object function callback
     * @returns NULL
     */
    this.rm = function(schema,record,callback) {
        db.transaction(
            function (transaction) {
                var sql = "DELETE FROM "+schema+" WHERE guid = ?";
                transaction.executeSql(sql,[record.guid],function(transaction,result) {                    
                    if(callback) { callback(record); }
                },errorCallback);                
            }   
        );        
    }
    
    this.clear = function(schema,callback) {
        db.transaction(
            function (transaction) {
                var sql = "DELETE FROM "+schema+"";
                transaction.executeSql(sql,[],function(transaction,result) {                    
                    if(callback) { callback(); }
                },errorCallback);                
            }   
        );        
    }
    
    return this;
    
};

LazyStorage.iDB = function() {
    
    this.type = 'iDB';
    
    var rq = window.indexedDB.open(this.dbname, this.version);
    var self = this;
    var errorCallback = function(e) {
        console.warn("Database error: " + e.target.errorCode);
    };
    
    rq.onupgradeneeded = function(event) { 
        var db = rq.result;
        // Create an objectStore for this database
        var os; //holds last created objectstore
        var schemas = self.schemas;
        for(i in schemas) {
            if(!db.objectStoreNames.contains(schemas[i].name)) {
                os = db.createObjectStore(schemas[i].name, { keyPath: "guid" });
            }
            else {
                os = rq.transaction.objectStore(schemas[i].name);
            }
            for(y in schemas[i].indexes) {
                os.createIndex(schemas[i].indexes[y].name,schemas[i].indexes[y].name,{
                    unique:false,
                    multiEntry:false
                });
            }
        } 
        
    };
    rq.onerror = errorCallback;
    rq.onsuccess = function(event) {
        self.db = rq.result;        
        var event = document.createEvent('Event');
        event.initEvent('lzReady', true, true);        
        window.dispatchEvent(event);
    };
    
    this.get = function(key,schema,callback) {   
        var fn = function() {
            var db = self.db;        
            var trans = db.transaction([schema], "readonly"); 
            var store = trans.objectStore(schema); 
            var request = store.get(key);  
            request.onerror = function(event) {  
                console.log(event);
            };  
            request.onsuccess = function(event) {  
                callback(event.target.result);
            }; 
        }
        //if db is not ready
        if(!self.db) {
            rq.addEventListener("success",function() { fn(); });
        }
        else {
            fn();
        }           
    };
    this.getAll = function(schema,callback) {            
        if(!self.db) {            
            window.addEventListener("lzReady",function() { self.getAll(schema,callback) });
            return;
        }
        var db = self.db;
        var trans = db.transaction([schema], "readwrite");
        trans.onerror = errorCallback;
        trans.oncomplete = function() { console.log("trans complete"); };
        var store = trans.objectStore(schema);     
        var data = [];
        var cursorRequest = store.openCursor(IDBKeyRange.lowerBound(0));
        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(result) {                    	
                data.push(result.value);                      
                result['continue']();
            }
            else {
                callback(data);
            }
        }
        cursorRequest.onerror = errorCallback;
        
    };
    this.save  = function(schema,record,callback) {
        var db = self.db;
        var trans = db.transaction([schema], "readwrite");
        trans.onerror = errorCallback;
        trans.oncomplete = function() { console.log("trans complete"); };
        var store = trans.objectStore(schema);     
        
        //prepare record
        if(!record.guid) {
            record.guid = this.guid();
        }
        var add = store.add(record);            
        add.onsuccess = function(e) {                
            callback(record);
        };
        add.onerror = errorCallback;          
    };
    this.update = function(schema,record,callback) {
        var db = self.db;
        var trans = db.transaction([schema], "readwrite");
        trans.onerror = errorCallback;
        trans.oncomplete = function() { console.log("trans complete"); };
        var store = trans.objectStore(schema);     
        
        var add = store.put(record);            
        add.onsuccess = function(e) {                
            callback();
        };
        add.onerror = errorCallback;         
    };
    this.rm = function(schema,record,callback) {
        var db = self.db;
        var trans = db.transaction([schema], "readwrite");
        var store = trans.objectStore(schema);      
        var request = store['delete'](record.guid);
        request.onsuccess = callback();        
    };
    this.clear = function(schema,callback) {
        var db = self.db;
        var trans = db.transaction([schema], "readwrite");
        var store = trans.objectStore(schema);  
        var request = store['clear']();
        request.onsuccess = callback(); 
    }
    
};
