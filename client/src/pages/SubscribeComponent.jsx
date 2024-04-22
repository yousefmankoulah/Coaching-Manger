import { useState } from "react";
import { useSelector } from "react-redux";

const SubscribeComponent = ({ plan }) => {
  const [status, setStatus] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const handleSubscribe = async () => {
    try {
      const requestData = {
        plan: plan._id,
        userId: currentUser._id,
      };

      const response = await fetch(
        "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/create-subscription",
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
      <h1>Subscribe to {plan}</h1>
      <button onClick={handleSubscribe}>Subscribe</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SubscribeComponent;
