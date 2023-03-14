// const express = require('express');
// const port = process.env.PORT || 5000;

// const app = express();
// const cors = require('cors')

// //middelware
// app.use(cors())
// app.use(express.json());

// const categoryRoute = require('./routes/categoryRoutes.js');
// const blogRoute = require('./routes/blogRoutes.js');
// const ctaRoute = require('./routes/ctaRoutes.js');
// const imageRoute = require('./routes/imageRoutes.js');
// const testRoute=require('./routes/testRoutes')
// const parentCategoryRoute=require('./routes/parentCategoryRoutes')

// app.use('/api/test',testRoute );
// app.use('/api/category',categoryRoute );
// app.use('/api/blog',blogRoute );
// app.use('/api/cta',ctaRoute );
// app.use('/api/image',imageRoute );
// app.use('/api/parentcategory', parentCategoryRoute);


// app.listen(port,()=>{
//     console.log(`server is started on port ${port}`);
// })



// const express = require('express');
// const port = process.env.PORT || 5000;

// const app = express();
// const cors = require('cors')

// //middelware
// app.use(cors())
// app.use(express.json());

// const categoryRoute = require('./routes/categoryRoutes.js');
// const blogRoute = require('./routes/blogRoutes.js');
// const ctaRoute = require('./routes/ctaRoutes.js');
// const imageRoute = require('./routes/imageRoutes.js');
// const testRoute=require('./routes/testRoutes')
// const parentCategoryRoute=require('./routes/parentCategoryRoutes')

// app.use('/api/test',testRoute );
// app.use('/api/category',categoryRoute );
// app.use('/api/blog',blogRoute );
// app.use('/api/cta',ctaRoute );
// app.use('/api/image',imageRoute );
// app.use('/api/parentcategory', parentCategoryRoute);


// app.listen(port,()=>{
//     console.log(`server is started on port ${port}`);
// })


const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require ('cors')
const con = require("./config");

// middleware
app.use(bodyParser.json())
app.use(cors())

// category get

app.get("/api/category", (req, res) => {
    con.query('select * from categories', (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.get("/api/category/:id", (req, res) => {
    const id = req.params.id
    con.query(`SELECT categoryname FROM category WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

// category post

app.post("/api/category", (req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, parent_cat, status, date } = req.body;
    con.query('INSERT INTO `categories`( `cat_name`, `cat_slug`, `cat_title`, `cat_desc`, `parent_category`, `status`, `date`) VALUES (?,?,?,?,?,?,?)', [cat_name, cat_slug, cat_title, cat_desc, parent_cat, status, date], (err, response) => {
        if (err) console.log(err)
    })
    res.send('record added')
})

// category delete

app.delete("/api/category/:id", (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`)
    console.log(newid);

    con.query('DELETE FROM categories WHERE id IN (?)', [newid], (err, response) => {
        // if(err) console.log(err)
        res.send(response)
    })
})

// category update

app.put("/api/category/:id", (req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, cat_status, status, date } = req.body;
    const id = req.params.id;
    con.query('UPDATE `categories` SET cat_name=? ,cat_slug=? ,cat_title=? ,cat_desc=? ,cat_status=? ,status=? ,date=?  WHERE id IN (?)', [cat_name, cat_slug, cat_title, cat_desc, cat_status, status, date, id], (err, result) => {
        res.send('updated')
    })
})


app.listen(5000, () => {
    console.log("server started");
})

