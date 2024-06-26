import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderCreatedDate: { 
        type: Date, // Need to find a standard for what 'Date' means
        required: true 
    },
    orderStatus: {
        type: String,
        enum: ['order_started', 'order_waiting', 'order_completed', 'order_shipped', 'order_failed'], // Need to discuss this (sega pattern)
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderLineItems: [
        {
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            productId: {
                type: Number, // Location independance?
                required: true
            },
            totalPrice: {
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
        },
    paymentIntent: {
        type: String,
        required: true
    }         
});

const Order = mongoose.model("Order", orderSchema);
export default Order;