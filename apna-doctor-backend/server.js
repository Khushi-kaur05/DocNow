require("dotenv").config();
const express = require ("express"); 
const cors = require ("cors");
const app = express(); 
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const testRoute = require("./routes/test");
const authRoute = require("./routes/auth");
const doctorRoute = require("./routes/doctor");
const appointmentRoute = require("./routes/appointment");
const doctorAvailabilityRoutes = require( "./routes/doctorAvailability.js");
const errorHandler = require ("./middleware/errorHandlerMiddleware");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true // if you are sending cookies or tokens
}));
app.use(express.json()); // Global middleware used for all the routes to parse json response

app.use("/api", testRoute);  //testing

app.use("/api/auth", authRoute);  //Login/register route

app.use("/api/doctors", doctorRoute);   //doctor route

app.use("/api/appointments", appointmentRoute);  //Appointments route

app.use("/api/doctor/availability", doctorAvailabilityRoutes);

app.use(errorHandler);

app.get("/", (req,res) => {
    console.log("Apna Doctor API Running");
    res.send({name : "user"})
});

app.listen(5000, () => {
    console.log("Server running on the port 5000");
});