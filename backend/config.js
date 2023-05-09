
const mysql = require ('mysql');

const sqlconnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'pos'
})

sqlconnection.connect((err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to database')
    }
})

module.exports = sqlconnection;