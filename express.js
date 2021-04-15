var express = require("express")
var app = express();

async function init() {
    app.set("views", "express_views")
    app.set("view engine", "ejs")

    app.get("/", (req, res) => {
        res.render("index.ejs", {data: "None"})
    })

    app.get("/:data", async (req, res) => {
        res.render("index.ejs", {data: req.params.data})
    })

    app.listen(12971)
}


module.exports = {
    init: init
}