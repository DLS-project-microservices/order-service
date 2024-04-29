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

export {
    createOrder,
    findAllOrders
}