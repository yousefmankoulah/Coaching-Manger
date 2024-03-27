import { Card, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomersTable from "../components/dashboardComponents/CustomersTable";
import ExercisesTable from "../components/dashboardComponents/ExercisesTable";
import DietPlansTable from "../components/dashboardComponents/DietPlansTable";

export function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [exercise, setExercise] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/getAllCustomer/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            setCustomers(data);
          } else {
            // Handle unauthorized access or other errors
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchExercise = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getExercies/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            setExercise(data);
          } else {
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.role === "coach") {
      fetchCustomers();
      fetchExercise();
    }
  }, [currentUser]);

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-3xl font-bold text-center mb-20">
        Welcome to the Dashboard
      </h1>
      {currentUser?.role === "coach" ? (
        <>
          <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            <Card
              className="max-w-sm"
              onClick={() => handleCardClick("customers")}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Customers
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got{" "}
                {customers && customers.length > 0 ? (
                  <>
                    <span className="font-bold">{customers.length}</span>{" "}
                    customers created
                  </>
                ) : (
                  <>0 customers created</>
                )}
              </p>
              <Button>
                <Link to="/add-customer">
                  <span>Add a Client</span>
                </Link>
              </Button>
            </Card>

            <Card
              className="max-w-sm"
              onClick={() => handleCardClick("exercises")}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Exercises
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got{" "}
                {exercise && exercise.length > 0 ? (
                  <>
                    <span className="font-bold">{exercise.length}</span>{" "}
                    Exercises created
                  </>
                ) : (
                  <>0 customers created</>
                )}
              </p>
              <Button>
                <Link to={`/CreateExercise/${currentUser._id}`}>
                  <span>Add an Exercise</span>
                </Link>
              </Button>
            </Card>

            <Card className="max-w-sm" onClick={() => handleCardClick("diet")}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Diet Plans
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got 10 Diet Plans created
              </p>
            </Card>
          </div>

          {selectedCard === null && <CustomersTable />}
          {selectedCard === "customers" && <CustomersTable />}
          {selectedCard === "exercises" && <ExercisesTable />}
          {selectedCard === "diet" && <DietPlansTable />}
        </>
      ) : (
        <div>Tmam</div>
      )}
    </div>
  );
}
