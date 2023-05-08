const con = require("../config");

const loginUser = (req, res) =>{
    const {username , password} = req.body;
    con.query(`SELECT username, password from user WHERE username= ? AND password=?`,[username,password], (err,result)=>{
        if(err){
            console.log(err)
        }

        if(result.length > 0) {
            res.send(result)
        } else{
            res.send({message: "Wrong combination of username/password"})
        }
    })

}

module.exports = loginUser;