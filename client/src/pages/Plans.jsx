import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "flowbite-react";
import { HiOutlineCheck } from "react-icons/hi";
import { useSelector } from "react-redux";




export default function Plans() {
  const [formData, setFormData] = useState({});
  const [month, setMonth] = useState(true);

  const { error: errorMessage, currentUser } = useSelector(
    (state) => state.user
  );


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const url =
          month === true
            ? "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/plans"
            : "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/plans/plansYearly";
        const response = await fetch(url);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlans();
  }, [month]);

  const handleMonthClick = () => {
    setMonth(true); // Set month to true when Profile button is clicked
  };

  const handleYearClick = () => {
    setMonth(false); // Set month to false when Messages button is clicked
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-5xl font-extrabold mt-10 mb-10 text-center">Plans</h1>

      {currentUser ? (
        // <stripe-pricing-table
        //   pricing-table-id="prctbl_1PAM6JJbnMJW8yX92d6P5GDZ"
        //   publishable-key="pk_test_51P7igQJbnMJW8yX9hu4HWUyHH2kKWbVgpQ7mquxHGL2DSi4opZP7quqtKeRQocgjBu4etTTCohx5XD4ruXBUwFlL00FY1ryB00"
        //   customer-email={currentUser.email}
        // ></stripe-pricing-table>
        <div className="w-85 p-10 rounded-3xl">
          <stripe-pricing-table
            pricing-table-id="prctbl_1P8pUfJbnMJW8yX9U4eimD0J"
            publishable-key="pk_live_51P7igQJbnMJW8yX9puQNf6PUpHs1OmHTu9QC0RO7nw8tNtjGHp7ILltrUXeJkLiP6zPpHTqh0mKXdr3KbmiNfSSE00xWKBzKZH"
            customer-email={currentUser.email}
          ></stripe-pricing-table>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center h-full">
            <div
              className="inline-flex rounded-md shadow-sm mt-10"
              role="group"
            >
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg 
      ${
        month
          ? "hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          : "dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      }`}
                onClick={handleMonthClick} // Call handleMonthClick when Monthly button is clicked
              >
                Monthly
              </button>

              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg 
      ${
        !month
          ? "hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          : "dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      }`}
                onClick={handleYearClick} // Call handleYearClick when Yearly button is clicked
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mb-10 mt-10 max-w-6xl mr-auto ml-auto">
            {formData &&
              formData.length > 0 &&
              formData.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white shadow-md rounded-lg p-6 xl:w-96 lg:w-90 md-80" // Increased padding and width
                >
                  <h3 className="text-2xl font-bold text-left mb-7 mt-5">
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
                  <br />
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>Create any Exercise needed</span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>Create any Diet Plan</span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>
                      Create up to {plan.customersNumber} Customers account
                    </span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>Full control and management tools</span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>Update and Delete your Information</span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineCheck className="text-green-500 mr-2" />
                    <span>Cancel subscription anytime</span>
                  </div>
                  <div
                    className="whitespace-nowrap font-medium text-gray-900 mt-6 mb-4"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span className="text-4xl font-bold font-mono">
                      ${plan.price}
                    </span>
                    {month === true ? (
                      <span className="ml-3 font-thin">
                        per
                        <br /> Months
                      </span>
                    ) : (
                      <span className="ml-3 font-thin">
                        per
                        <br /> Year
                      </span>
                    )}
                  </div>

                  <div key={plan._id}>
                    <Button className="w-full" type="submit">
                      <Link to="/sign-up" className="text-white">
                        Subscribe Now
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </>
      )}
    </div>
  );
}
