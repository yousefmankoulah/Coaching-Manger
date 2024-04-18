import { Card, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomersTable from "../components/dashboardComponents/CustomersTable";
import ExercisesTable from "../components/dashboardComponents/ExercisesTable";
import DietPlansTable from "../components/dashboardComponents/DietPlansTable";
import AssignExTable from "../components/dashboardComponents/AssignExTable";

export function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [diet, setDiet] = useState([]);
  const [assignEX, setAssignEX] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});

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

    const fetchDiet = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/getAllDiet/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/getDiet/${currentUser._id}`;
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setDiet(data);
          } else {
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchAssignEx = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesCoachSide/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesForCustomer/${currentUser._id}`;

          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setAssignEX(data);
          } else {
            // Handle unauthorized access or other errors
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchCustomerInfo = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/getCustomerInfo/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            setCustomerInfo(data);
          } else {
            // Handle unauthorized access or other errors
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
      fetchDiet();
      fetchAssignEx();
    } else {
      fetchAssignEx();
      fetchDiet();
      fetchCustomerInfo();
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
          <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
                <Link to={`/add-customer/${currentUser._id}`}>
                  <span>Add a Client</span>
                </Link>
              </Button>
            </Card>

            <Card
              className="max-w-sm"
              onClick={() => handleCardClick("assignEx")}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Assigned Exercises
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got{" "}
                {assignEX && assignEX.length > 0 ? (
                  <>
                    <span className="font-bold">{assignEX.length}</span>{" "}
                    Assigned exercises created
                  </>
                ) : (
                  <>0 Assigned exercises created</>
                )}
              </p>
              <Button>
                <Link to={`/AssignExercise/${currentUser._id}`}>
                  <span>Assign an Exercise</span>
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
                  <>0 Exercises created</>
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
                You got{" "}
                {diet && diet.length > 0 ? (
                  <>
                    <span className="font-bold">{diet.length}</span> Diet Plan
                    created
                  </>
                ) : (
                  <>0 Diet Plan created</>
                )}
              </p>
              <Button>
                <Link to={`/createDiet/${currentUser._id}`}>
                  <span>Add an Diet Plan</span>
                </Link>
              </Button>
            </Card>
          </div>

          {selectedCard === null && <CustomersTable />}
          {selectedCard === "customers" && <CustomersTable />}
          {selectedCard === "assignEx" && <AssignExTable />}
          {selectedCard === "exercises" && <ExercisesTable />}
          {selectedCard === "diet" && <DietPlansTable />}
        </>
      ) : (
        <>
          <div>
            <h2>Your Profile Detail</h2>
            {customerInfo.customerCurrentWeight && (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Current Weight: {customerInfo.customerCurrentWeight}
              </p>
            )}
            {customerInfo.customerTargetWeight && (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Target Weight: {customerInfo.customerTargetWeight}
              </p>
            )}
            {customerInfo.customerCurrentHeight && (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Current Height: {customerInfo.customerCurrentHeight}
              </p>
            )}
            {customerInfo.customerCurrentAge && (
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Current Age: {customerInfo.customerCurrentAge}
              </p>
            )}

            {customerInfo ? (
              <Button>
                <Link
                  to={`/UpdateCustomerInformation/${currentUser._id}/${customerInfo._id}`}
                >
                  <span>Update Your Information</span>
                </Link>
              </Button>
            ) : (
              <Button>
                <Link
                  to={`/AddCustomerInformation/${currentUser.userId}/${currentUser._id}`}
                >
                  <span>Add Your Information</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            <Card
              className="max-w-sm"
              onClick={() => handleCardClick("exercises")}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Exercises
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got{" "}
                {assignEX && assignEX.length > 0 ? (
                  <>
                    <span className="font-bold">{assignEX.length}</span>{" "}
                    Exercises created
                  </>
                ) : (
                  <>0 Exercises created</>
                )}
              </p>
            </Card>

            <Card className="max-w-sm" onClick={() => handleCardClick("diet")}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Diet Plans
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                You got{" "}
                {diet && diet.length > 0 ? (
                  <>
                    <span className="font-bold">{diet.length}</span> Diet Plan
                    created
                  </>
                ) : (
                  <>0 Diet Plan created</>
                )}
              </p>
            </Card>
          </div>
          {selectedCard === null && <ExercisesTable />}
          {selectedCard === "exercises" && <ExercisesTable />}
          {selectedCard === "diet" && <DietPlansTable />}
        </>
      )}
    </div>
  );
}
