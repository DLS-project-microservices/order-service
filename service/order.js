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

async function findOrderByOrderId(orderId){
    const order = await Order.findById(orderId);
    return order;
}
async function generateUniqueOrderNumber() {
    let orderNumber;
    let isUnique = false;

    while (!isUnique) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);

        orderNumber = `ORDER${randomNum}`;

        const existingOrder = await findOrderByOrderNumber(orderNumber);

        if (!existingOrder) {
            isUnique = true;
        }
    }

    return orderNumber;
}

async function updateOrderStatusByOrderId(orderId, newOrderStatus){
    try{
        const validStatuses = ['order_started', 'order_waiting', 'order_completed', 'order_shipped', 'order_failed'];
  
        if (!validStatuses.includes(newOrderStatus)) {
            throw new Error('Invalid status');
        }

        const order = await findOrderByOrderId(orderId);

        if(!order){
            throw new Error(`Order with ID ${orderId} not found`)
        }

        order.orderStatus = newOrderStatus;
        await order.save();

        return order;
    } catch(error){
        console.error("Error updating order: ", error);
    }


}
export {
    createOrder,
    findAllOrders,
    findOrderByOrderNumber,
    updateOrderStatusByOrderId,
    generateUniqueOrderNumber
}