import mongoose from "mongoose";
import express from "express";
import SmeeClient from 'smee-client';
import "dotenv/config"
import routes from './routes/routes.js';
import webhooksRouter from "./routes/webhooksRoutes.js";
import { consumePaymentCaptured, consumeShipmentSent, consumItemReservedFailed } from "./messages/orders.js";

const smee = new SmeeClient({
    source: process.env.SMEE_SOURCE,
    target: process.env.SMEE_TARGET,
    logger: console
})
  
smee.start()

await mongoose.connect(process.env.DB_URL);

const app = express();

app.use('/webhook/order', webhooksRouter)

app.use(express.json());

app.use('/api/orders', routes);


await consumePaymentCaptured();
await consumeShipmentSent();
await consumItemReservedFailed();


const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log('Server is listening on port', PORT));