const con = require("../config");

const registerUser = (req, res) =>{
    const {username , password} = req.body;
    con.query(`SELECT username FROM user WHERE username = ?`,[username],(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            if(result.length>0){
                res.send({message:"Username already exist"})
            }
            else{
                con.query('INSERT INTO user( username ,password) VALUES (?,?)',[username,password], (err,result2)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(result2)
                    }
                })            
            }
        }
    })
}

module.exports = registerUser;