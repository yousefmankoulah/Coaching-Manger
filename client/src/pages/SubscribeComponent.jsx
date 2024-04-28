import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useState, useEffect, useCallback } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const SubscribeComponent = () => {
  const [error, setError] = useState(null);

  const { planId } = useParams();
  const [formData, setFormData] = useState({});
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(
          `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/getAPlan/${planId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFormData(data);
        } else {
          throw new Error("Error fetching plan details: " + data.message);
        }
      } catch (error) {
        setError(error.message);
        console.error("Fetch error:", error.message);
      }
    };
    fetchCustomerInfo();
  }, [planId]);

  const fetchClientSecret = useCallback(() => {
    fetch(
      `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/create-subscription/${planId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data.clientSecret) {
          throw new Error("Client secret is missing in the response");
        }
        console.log("Client secret:", data.clientSecret);
        setClientSecret(data.clientSecret);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
        setError(error.message);
      });
  }, [planId]); // Make sure to include token in the dependency array

  const options = { fetchClientSecret };
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default SubscribeComponent;
