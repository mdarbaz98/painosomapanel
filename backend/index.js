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

// using routes
app.use("/api/category",categoryRoute)
app.use("/api/blog",blogRoute)
app.use("/api/image",imageRoute)
app.use("/api/author",authorRoute)

app.listen(5000, () => {
    console.log("server started");
})



