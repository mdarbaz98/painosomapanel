const con = require("../config");

const registerUser = (req, res) =>{
    const {name , password} = req.body;
    con.query('INSERT INTO user( username ,password) VALUES (?,?)',[name,password], (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })

}

module.exports = registerUser;