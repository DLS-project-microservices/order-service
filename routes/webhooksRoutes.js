import express from 'express';
import { Stripe } from "stripe";
import { 
    createOrder,
    generateUniqueOrderNumber
     } from '../service/order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
})


const webhooksRouter = express.Router(); 


webhooksRouter.post('/checkout-session-completed-webhook', express.json(), async  (request, response) => {
  
    let event;

    try {
      event = request.body;
      //console.log('the event is: ',event)
    } catch (err) {
      console.log(err)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  console.log('the event is: ',event)
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ['line_items'],
            }
          );
          const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id, {
            expand: ['data.price.product'],
          });

          const orderLineItems = line_items.data.map(item => {
            const id = parseInt(item.price.product.metadata.product_id, 10);
            return {
                productId: id,
                productName: item.price.product.metadata.product_name,
                quantity: item.quantity,
                totalPrice: item.amount_total / 100,
            }
          })
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString('en-US', 
          { day: '2-digit', month: '2-digit',  year: 'numeric'});

          const orderNumber = await generateUniqueOrderNumber();

          const newOrder = {
            orderCreatedDate: formattedDate,
            orderStatus: 'order_started',
            orderNumber: orderNumber,
            totalPrice: sessionWithLineItems.amount_total / 100,
            orderLineItems: orderLineItems,
            customer: {
                firstName: sessionWithLineItems.metadata.firstName,
                lastname: sessionWithLineItems.metadata.lastName,
                email: sessionWithLineItems.metadata.email,
                city: sessionWithLineItems.metadata.city,
                street: sessionWithLineItems.metadata.address,
                postalCode: sessionWithLineItems.metadata.postalCode,
            },
            paymentIntent: event.data.object.payment_intent
          }
          console.log('the new order is: ', newOrder)
          await createOrder(newOrder);
        break;
 
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });


export default webhooksRouter;