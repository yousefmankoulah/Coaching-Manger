import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useState, useEffect, useCallback } from "react";

// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import CardInput from './CardInput';
import { Elements } from "@stripe/react-stripe-js";


import axios from 'axios';
import { Button, Card, TextInput } from "flowbite-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);


const SubscribeComponent = () => {
  const [email, setEmail] = useState('');
  const { planId } = useParams();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await axios.post('https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/pay/${planId}', {email: email});

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Money is in the bank!');
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const handleSubmitSub = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const res = await axios.post('https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/sub/${planId}', {'payment_method': result.paymentMethod.id, 'email': email});
      // eslint-disable-next-line camelcase
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            console.log('You got the money!');
            // Show a success message to your customer
          }
        });
      } else {
        console.log('You got the money!');
        // No additional information was needed
        // Show a success message to your customer
      }
    }
  };

  return (
    <Card>
      <div>
        <TextInput
          label="Email"
          id="outlined-email-input"
          helperText="Email you'll receive updates and receipts on"
          margin="normal"
          variant="outlined"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
        <div>
          <Button variant="contained" color="primary" onClick={handleSubmitPay}>
            Pay
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmitSub}>
            Subscription
          </Button>
        </div>
      </div>
    </Card>
  );
  // const [error, setError] = useState(null);

  // const { planId } = useParams();
  // const [formData, setFormData] = useState({});
  // const [clientSecret, setClientSecret] = useState(null);

  // useEffect(() => {
  //   const fetchCustomerInfo = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/getAPlan/${planId}`
  //       );
  //       const data = await response.json();
  //       if (response.ok) {
  //         setFormData(data);
  //       } else {
  //         throw new Error("Error fetching plan details: " + data.message);
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //       console.error("Fetch error:", error.message);
  //     }
  //   };
  //   fetchCustomerInfo();
  // }, [planId]);

  // const fetchClientSecret = useCallback(() => {
  //   fetch(
  //     `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/create-subscription/${planId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP status ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (!data.clientSecret) {
  //         throw new Error("Client secret is missing in the response");
  //       }
  //       console.log("Client secret:", data.clientSecret);
  //       setClientSecret(data.clientSecret);
  //       setError(null); // Clear any previous errors
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching client secret:", error);
  //       setError(error.message);
  //     });
  // }, [planId]); // Make sure to include token in the dependency array

  // const options = { fetchClientSecret };
  // return (
  //   <div id="checkout">
  //     <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
  //       <EmbeddedCheckout />
  //     </EmbeddedCheckoutProvider>
  //   </div>
  // );
};

export default SubscribeComponent;
