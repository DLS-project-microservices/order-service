import 'dotenv/config';
import amqp from 'amqplib';

let channel;

async function connectToRabbitMQ() {
    if (!channel) {
        try {
            console.log('Establishing connection to RabbitMQ...')
            const connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}`);channel = await connection.createChannel();
            console.log('Connection to RabbitMQ established.')
        }
        catch(error) {
            console.log(error);
        }
        
    }
    return channel;
}

export default connectToRabbitMQ;