import 'dotenv/config';
import amqp from 'amqplib';

let channel;

async function connectToRabbitMQ() {
    if (!channel) {
        try {
            const connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}`);channel = await connection.createChannel();
        }
        catch(error) {
            console.log(error);
        }
        
    }
    return channel;
}

export default connectToRabbitMQ;