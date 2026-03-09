const mongoose = require("mongoose")

const connectdb = async () => {
    await mongoose.connect("mongodb+srv://DHRUVNAG:Dhruvang0011@yumzy.jgu41c2.mongodb.net/Yumzy")
}

module.exports = connectdb;