const con = require('../config');

const  getAllCta = (request, response) => {
    con.query("select * from cta", (err, res) => {
        if (err) {
            response.send(err);
        } else {
            response.send(res);
        }
    });
}

const  addCta = (request, response) => {
    response.send('working');
}

const  updateCta = (request, response) => {
    response.send('working');
}

const  deleteCta = (request, response) => {
    response.send('working');
}

module.exports = {
    getAllCta,
    addCta,
    updateCta,
    deleteCta
}