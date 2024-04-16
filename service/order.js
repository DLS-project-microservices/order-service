import Order from "../models/orderModel.js";
import "dotenv/config"


async function createOrder(order) {
    const newOrder = await Order.create(order);
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