import mongoose from "mongoose";
import express from "express";
import "dotenv/config"
import routes from './routes/routes.js';
import webhooksRouter from "./routes/webhooksRoutes.js";
import { consumePaymentCaptured, consumeShipmentSent } from "./messages/orders.js";

await mongoose.connect(process.env.DB_URL);

const app = express();

app.use('/webhook/order', webhooksRouter)

app.use(express.json());

app.use('/api/orders', routes);


await consumePaymentCaptured();

await consumeShipmentSent();


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server is listening on port', PORT));