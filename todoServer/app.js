const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");


app.use(cors());
app.use(bodyParser.json());

// app.use('/', (req, res) => {
//     res.redirect('/user/login');
// });
app.use("/user", userRouter)
app.use("/todo", todoRouter)


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
