import connectToRabbitMQ from "./connection.js";

let orderExchange;

async function connectToOrderExchange() {
    const exchangeName = 'order';
    let channel;
    if (orderExchange) {
        return orderExchange
    }

    try {
        channel = await connectToRabbitMQ();
        orderExchange = await channel.assertExchange(exchangeName, 'fanout', {
        durable: true
    });
    }
    catch (error) {
        console.log(error);
    }
    return {
        exchangeName,
        channel
    }
}

async function publishOrderStartedEvent(orderInformation) {
    console.log(orderInformation);
    const { exchangeName, channel} = await connectToOrderExchange();
    channel.publish(exchangeName, '', Buffer.from(JSON.stringify(orderInformation)));
}

export {
    publishOrderStartedEvent
}