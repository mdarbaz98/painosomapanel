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

// requiring routes
const categoryRoute = require("./routes/categoryRoutes.js")


// using routes
app.use("/api/category",categoryRoute)


app.listen(5000, () => {
    console.log("server started");
})



