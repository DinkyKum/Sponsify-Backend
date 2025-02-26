const express = require('express')
const app = express()
const connectDB=require('./config/db')
const cookieParser=require('cookie-parser');
const authRouter=require('./Routes/auth');
const profileRouter=require('./routes/profile')

require('dotenv').config();
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  console.log("Connection established successfully");
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT + "....");
  });
})
.catch((err) => {
  console.error("Cannot connect to DB: " + err);
});

app.use('/', authRouter);
app.use('/', profileRouter)
