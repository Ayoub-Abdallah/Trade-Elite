const mongoose = require("mongoose")
const client = mongoose.Schema({
    "telegram": { type: String, required: true },
    "link": { type: String, required: true },
    "id": { type: String, required: true },
    "cash": { type: String, required: true },
    "date": { type: String, required: true },
    "hour": { type: String, required: true },
    "delay": { type: String, required: true }
})
module.exports = mongoose.model("Client", client)
