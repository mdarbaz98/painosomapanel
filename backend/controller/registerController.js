const con = require("../config");

const registerUser = (req, res) =>{
    const {username , password} = req.body;
    con.query('INSERT INTO user( username ,password) VALUES (?,?)',[username,password], (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })

}

module.exports = registerUser;