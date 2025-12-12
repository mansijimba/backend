const express = require ("express")
const cors = require("cors")
const connectDB = require ("./config/db")
const path = require("path")
const app = express();

let corsOptions = {
    origin: "*" // or list of domain to whitelist
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(cors());

app.use("/uploads",express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT
const userRoute = require('./routes/UserRoute')
const sellerProductRoute = require('./routes/SellerProductRoute')
const CategoryRoute = require('./routes/CategoryRoute')

app.use('/api/auth', userRoute)
app.use('/api/product', sellerProductRoute)
app.use('/api/category', CategoryRoute)

module.exports = app