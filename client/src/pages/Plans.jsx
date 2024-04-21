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
      <div className="grid grid-flow-col lg:grid-rows-2 md:grid-rows-2 sm:grid-rows-3 xs:grid-rows-6 gap-2 justify-center mt-10">
        {formData &&
          formData.length > 0 &&
          formData.map((plan) => (
            <div
              key={plan._id}
              className="bg-white shadow-md rounded-lg p-4 w-full"
            >
              <h3 className="text-xl font-bold text-center">{plan.name}</h3>
              <p>The Plan Price: ${plan.price}</p>
              <p>Valid For: {plan.validityDays}</p>
              <p>Number of Customers: {plan.customersNumber}</p>
              <Link to={`/plans/${plan._id}`}>
                <Button>View Details</Button>
              </Link>
            </div>
          ))}
      </div>
      
    </div>
  );
}
