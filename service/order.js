import Order from "../models/orderModel.js";
import { publishOrderStartedEvent } from "../messages/orders.js";
import "dotenv/config"


async function createOrder(order) {
    let newOrder;
    try {
        newOrder = await Order.create(order);
        await publishOrderStartedEvent(newOrder);
    }
    catch(error) {
        console.log(error);
    }
    return newOrder;
}

async function findAllOrders() {
    const products = await Order.find();
    return products;
}

async function findOrderByOrderNumber(orderNumber) {
    const order = await Order.findOne({ orderNumber: orderNumber });;
    return order;
}

export {
    createOrder,
    findAllOrders,
    findOrderByOrderNumber
}