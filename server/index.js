const express=require('express');
const { mongoose } = require('mongoose');
const userRouter=require('./routes/user.routes')
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app=express()
const port=process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})

app.use('/api',userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});