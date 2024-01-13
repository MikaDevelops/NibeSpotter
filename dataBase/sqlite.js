const sqlite = require('sqlite3').verbose();
const dataBase = new sqlite.Database('./db/nibespotter.db',  (error) => {
    if (error) console.log (error.message);
});
dataBase.exec('create table ty')
dataBase.serialize(()=>{
    dataBase.each('SELECT * FROM kanta', (error,row)=>{
        if(error)console.log(error.message);
        console.log(row);
    })
});
dataBase.close();