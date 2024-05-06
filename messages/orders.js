import connectToRabbitMQ from "./connection.js";

let orderDirectExchange;
let orderFanoutExchange;
let channel;

async function connectToOrderDirectExchange() {
    const exchangeName = 'order_direct';

    if (!orderDirectExchange || !channel) {
        try {
            channel = await connectToRabbitMQ();
            console.log(`Conneting to RabbitMQ exchange: ${exchangeName}...`)
            orderDirectExchange = await channel.assertExchange(exchangeName, 'direct', {
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

async function connectToOrderFanoutExchange() {
    const exchangeName = 'order_fanout';

    if (!orderFanoutExchange || !channel) {
        try {
            channel = await connectToRabbitMQ();
            console.log(`Connecting to RabbitMQ exchange: ${exchangeName}...`)
            orderFanoutExchange = await channel.assertExchange(exchangeName, 'fanout', {
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
    const { exchangeName, channel} = await connectToOrderDirectExchange();
    try {
        channel.publish(exchangeName, 'order started', Buffer.from(JSON.stringify(orderInformation)));
        console.log('order_started event published successfully')
    }
    catch(error) {
        console.error('Error publishing order_started message', error);
    }
}

async function consumePaymentCaptured() {
    const queueName = "order_service_consume_payment_captured";
    const { exchangeName, channel } = await connectToOrderDirectExchange();

    await channel.assertQueue(queueName, {
        durable: true
    });
    channel.bindQueue(queueName, exchangeName, 'payment captured');

    console.log('Waiting for payment_captured events...');

    channel.consume(queueName, async (msg) => {
        try {
            if (msg?.content) {
                const messageContent = JSON.parse(msg.content.toString());
                    console.log(messageContent);
                    await publishOrderCompleted(messageContent);
                    console.log('payment_captured event processed successfully');
                    
                    channel.ack(msg);
            }
        }
        catch(error) {
            console.error('Error consuming payment_captured event:', error);
        }
    })
}

async function publishOrderCompleted(message) {
    const { exchangeName, channel} = await connectToOrderDirectExchange();
    try {
        channel.publish(exchangeName, 'order completed', Buffer.from(JSON.stringify(message)));
        console.log('order_completed event published successfully');
    }
    catch(error) {
        console.error('Error publishing order_completed message', error);
    }
}

async function consumeShipmentSent() {
    const queueName = "order_service_consume_shipment_sent";
    try {
        const { exchangeName, channel } = await connectToOrderFanoutExchange();

        await channel.assertQueue(queueName, {
        durable: true
        });
        channel.bindQueue(queueName, exchangeName, 'shipment sent');

        console.log('Waiting for shipment_sent events...');

        channel.consume(queueName, async (msg) => {
            if (msg?.content) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log(messageContent);
                console.log('shipment_sent event processed successfully');
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('Error consuming shipment_sent event:', error);
    }
};

export {
    consumePaymentCaptured,
    publishOrderStartedEvent,
    consumeShipmentSent
}