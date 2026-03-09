require("dotenv").config();
const express = require("express");
const connectdb = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();

app.use(
  cors({
    origin: "https://yumzy-food-ordering.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  })
);
app.options("*", cors());
app.use(express.json())
app.use(cookieParser());

const userRoutes = require("./routes/userRouter");
const restaurantRoutes = require("./routes/restaurantRouter");
const dishRoutes = require("./routes/dishRouter");
const cartRouter = require("./routes/cartRouter")
const orderRouter = require("./routes/orderRouter")
const adminRouter = require("./routes/admin")
const restaurantOwnerRouter = require("./routes/restaurantOwnerRouter")


app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/admin",adminRouter);
app.use("/api/restaurantOwner",restaurantOwnerRouter)


connectdb()
.then(() => {
    console.log("✅ Database Connected Successfully...");

    app.listen(2411 , ()=> {
        console.log("🚀 Server running on port 2411");
    })
})
.catch(()=> {
    console.error("❌ Database Connection Failed !!!");
})