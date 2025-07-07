const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./router/user");
const categoryRouter = require("./router/category");
const addressRouter = require("./router/address");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use(categoryRouter);
app.use(userRouter);
app.use(addressRouter);

app.listen(5000, () => console.log("Server started on port 5000"));
