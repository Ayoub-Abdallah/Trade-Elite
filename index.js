const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const client = require("./schema/client")
const app = express()
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(cors())
app.use(express.static("./public"))
const dbURL = "mongodb+srv://user:test1234@cluster0.cjtomlx.mongodb.net/trade_elite?retryWrites=true&w=majority"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
mongoose.connect(dbURL).
    then(() => {
        app.listen(PORT, console.log("APP ON 5000"))
    })

app.get('/', (req, res) => {
    res.render("login", { state: true })
})

app.post('/login', jsonParser, (req, res) => {

    if (req.body.email === "a@b.q" && req.body.password === "test1234") {
        console.log("logged")
        const table = getTable()
        res.render("dashboard", { table })
        return
    }
    console.log("not logged")
    res.render("login", { state: false })
})

app.post('/addClient', jsonParser, async (req, res) => {
    const { telegram, link, id, cash, date, hour, delay } = req.body
    const db_res = await client.findOne({ id })
    if (!db_res) {
        client.create({
            telegram, link, id, cash, date, hour, delay
        })
        console.log("Added")
        const table = await getTable()
        console.log(table)
        res.json({ state: true, table })
        return
    }
    console.log("rejected")

    res.json({ state: false, msg: "client already exists" })
    return
})
app.get("/getClients", async (req, res) => {
    const table = await getTable()
    res.json({ state: true, table })
    return
})
app.post("/getOneClient", jsonParser, async (req, res) => {
    const _id = req.body._id
    const data = await client.findOne({ _id })
    res.json({ state: true, data })
})
app.post("/save", jsonParser, async (req, res) => {
    const { telegram, link, id, cash, date, hour, delay } = req.body
    const _id = req.body._id

    const d = await client.updateOne({ _id }, { telegram, link, id, cash, date, hour, delay })
    console.log(d)
    const table = await getTable()  
    console.log(table)
    res.json({state: true, table})
})
app.post("/delete", jsonParser, async (req, res) => {
    const {_id} = req.body
    await client.deleteOne({_id})
    const table = await getTable()
    res.json({state: true, table})
})
async function getTable() {
    const table = await client.find()
    return table;
}
