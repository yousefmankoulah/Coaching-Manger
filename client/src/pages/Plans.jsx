import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button } from "flowbite-react";

export default function Plans() {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/plans"
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlans();
  }, []);
  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-5xl font-extrabold mt-10 mb-10 text-center">Plans</h1>
      <div className="border-dashed border-2 border-white mt-10 p-10 container mr-auto ml-auto rounded-2xl">
        <stripe-pricing-table
          pricing-table-id="prctbl_1P8pUfJbnMJW8yX9U4eimD0J"
          publishable-key="pk_live_51P7igQJbnMJW8yX9puQNf6PUpHs1OmHTu9QC0RO7nw8tNtjGHp7ILltrUXeJkLiP6zPpHTqh0mKXdr3KbmiNfSSE00xWKBzKZH"
        ></stripe-pricing-table>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-10 max-w-6xl mr-auto ml-auto">
        {formData &&
          formData.length > 0 &&
          formData.map((plan) => (
            <div
              key={plan._id}
              className="bg-white shadow-md rounded-lg p-6 xl:w-96 lg:w-90 md-80" // Increased padding and width
            >
              <h3 className="text-xl font-bold text-left mb-7 mt-5">
                {plan.name}
              </h3>
              <p className="font-thin font-mono">
                Valid For: {plan.validityDays} days
              </p>
              <p className="font-thin font-mono">
                You can create up to{" "}
                <span className="font-bold">{plan.customersNumber}</span>{" "}
                customers accounts
              </p>
              <div
                className="whitespace-nowrap font-medium text-gray-900 mt-6 mb-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span className="text-4xl font-bold font-mono">
                  ${plan.price}
                </span>
                <span className="ml-3 font-thin">
                  per
                  <br /> months
                </span>
              </div>
              <Button className="w-full">
                <Link to={`/subscribe/${plan._id}`}>Checkout</Link>
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
