import mongoose from "mongoose";
import { double, object } from "webidl-conversions";

const orderSchema = new mongoose.Schema({
    order_created_date: { 
        type: Date, // Need to find a standard for what 'Date' means
        required: true 
    },
    order_status: {
        type: String,
        enum: ['order_started', 'order_waiting', 'order_completed'], // Need to discuss this (sega pattern)
        required: true
    },
    order_number: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    order_line_items: [
        {
            quantity: {
                type: Number,
                required: true
            },
            product_id: {
                type: Number, // Location independance?
                required: true
            },
            total_price: {
                type: Number,
                required: true
            },
        }
    ],
    customer: {
            firstName: {
                type: String,
                required: true
            },
            lastname: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            }
        }         
});

const Order = mongoose.model("Order", orderSchema);
export default Order;