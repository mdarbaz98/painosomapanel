const con = require("../config");

const loginUser = (req, res) =>{
    const {name , password} = req.body;
    con.query(`SELECT * from user WHERE username= ? AND password=?`,[name,password], (err,result)=>{
        if(err){
            console.log(err)
        }

        if(result) {
            res.send(result)
        } else{
            res.send({message: "Wrong combination of username and password"})
        }
    })

}

module.exports = loginUser;