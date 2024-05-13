import express from 'express';
import { Stripe } from "stripe";
import { 
    createOrder,
    findOrderByOrderNumber
     } from '../service/order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
})


const webhooksRouter = express.Router(); 


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


webhooksRouter.post('/checkout-session-completed-webhook', express.raw({type: 'application/json'}), async  (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
    const endpointSecret = "whsec_g9EkzlOtTZHpCo3pFEQqv6f8YLfyMEZ7"
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        //console.log(checkoutSessionCompleted);
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ['line_items'],
            }
          );
          const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id, {
            expand: ['data.price.product'],
          });
          /*
          console.log(sessionWithLineItems.line_items.data);
          console.log("-----------------------------------");
          console.log("-----------------------------------");
          console.log("-----------------------------------");
          console.log(sessionWithLineItems);
          console.log("************************");
          console.log(line_items.data[0].price);

*/
          const orderLineItems = line_items.data.map(item => {
            const id = parseInt(item.price.product.metadata.product_id, 10);
            return {
                productId: id,
                productName: item.price.product.metadata.product_name,
                quantity: item.quantity,
                totalPrice: item.amount_total,
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
            totalPrice: sessionWithLineItems.amount_total,
            orderLineItems: orderLineItems,
            customer: {
                firstName: sessionWithLineItems.metadata.firstName,
                lastname: sessionWithLineItems.metadata.lastName,
                email: sessionWithLineItems.metadata.email,
                city: sessionWithLineItems.metadata.city,
                street: sessionWithLineItems.metadata.address,
                postalCode: sessionWithLineItems.metadata.postalCode,
            }
          }
          
          await createOrder(newOrder);
        break;
 
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });


export default webhooksRouter;