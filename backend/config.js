const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pos',
});

conn.connect((err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to database')
    }
})


module.exports = conn;