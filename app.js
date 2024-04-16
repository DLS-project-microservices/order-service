import mongoose from "mongoose";
import express from "express";
import "dotenv/config"
import routes from './routes/routes.js';
import Order from "./models/orderModel.js";

await mongoose.connect(process.env.DB_URL);

const app = express();

app.use(express.json());
app.use('/api/orders', routes);

/*await Order.create(
    {
       order_created_date: "2002-12-09",
       order_status: 'order_waiting',
       order_number: "12345",
       total_price: 25.99,
       order_line_items: [
        {
            quantity: 5,
            product_id: 1,
            total_price: 10.00,
        }
       ],
       customer: {
            firstName: "Jason",
            lastname: "Vorhees",
            email: "thisisanemail@gmail.com",
            city: "New York",
            street: "Streetname",
            postalCode: "2121"
       }
    }
);

const order = await Order.find();
console.log(order);
*/

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server is listening on port', PORT));