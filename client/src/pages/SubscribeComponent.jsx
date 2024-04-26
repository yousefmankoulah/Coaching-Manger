import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CardElement, Elements } from "@stripe/react-stripe-js";

const SubscribeComponent = () => {
  const [status, setStatus] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    try {
      const fetchCustomerInfo = async () => {
        try {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/getAPlan/${id}`
          );
          const data = await res.json();
          if (res.ok) {
            setFormData(data);
          } else {
            // Handle unauthorized access or other errors
            console.error("Error fetching customers:", data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCustomerInfo();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const requestData = {
        plan: id,
        userId: currentUser._id,
      };

      const response = await fetch(
        "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/create-subscription/${id}",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.session.url;
      } else {
        throw new Error(data.message || "Failed to create subscription.");
      }
    } catch (error) {
      setStatus("Failed to create subscription.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Subscribe to {formData.name}</h1>
      <Elements>
        <CardElement />
      </Elements>

      <button onClick={handleSubscribe}>Subscribe</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SubscribeComponent;
