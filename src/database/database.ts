import mongoose from 'mongoose';
const URI = process.env.URI || "mongodb://localhost/tictactoeDB";

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log("the database is up and working"))
    .catch((err) => console.log(err))

module.exports = mongoose;