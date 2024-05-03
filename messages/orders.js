import connectToRabbitMQ from "./connection.js";

let orderExchange;
let channel;

async function connectToOrderExchange() {
    const exchangeName = 'order_direct';

    if (!orderExchange || !channel) {
        try {
            channel = await connectToRabbitMQ();
            console.log(`Conneting to RabbitMQ exchange: ${exchangeName}...`)
            orderExchange = await channel.assertExchange(exchangeName, 'direct', {
                durable: true
            });
            console.log(`Established connection to RabbitMQ exchange: ${exchangeName}`)
        }
        catch (error) {
            console.log(error);
        }
    }
    return {
        exchangeName,
        channel
    }
}

async function publishOrderStartedEvent(orderInformation) {
    console.log(orderInformation);
    const { exchangeName, channel} = await connectToOrderExchange();
    channel.publish(exchangeName, 'order started', Buffer.from(JSON.stringify(orderInformation)));
}

export {
    publishOrderStartedEvent
}