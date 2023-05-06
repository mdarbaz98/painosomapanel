const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require ('cors')

// middleware
app.use(bodyParser.json())
app.use(cors())

// requiring routes
const categoryRoute = require("./routes/categoryRoutes.js");
const blogRoute = require("./routes/blogRoutes.js");
const imageRoute = require("./routes/imageRoutes.js")
const authorRoute = require("./routes/authorRoutes.js")
const productsRoute = require("./routes/productsRoutes.js")
const registerRoute = require("./routes/registerRoutes.js")
const loginRoute = require("./routes/loginRoutes.js")


// using routes
app.use("/api/category",categoryRoute)
app.use("/api/blog",blogRoute)
app.use("/api/image",imageRoute)
app.use("/api/author",authorRoute)
app.use("/api/products",productsRoute)
app.use("/api/register",registerRoute)
app.use("/api/login",loginRoute)

app.listen(5000, () => {
    console.log("server started");
})



