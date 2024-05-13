import { Card, Button, Modal, Timeline } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomersTable from "../components/dashboardComponents/CustomersTable";
import ExercisesTable from "../components/dashboardComponents/ExercisesTable";
import DietPlansTable from "../components/dashboardComponents/DietPlansTable";
import AssignExTable from "../components/dashboardComponents/AssignExTable";
import { HiOutlineExclamationCircle, HiCalendar } from "react-icons/hi";

export function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [diet, setDiet] = useState([]);
  const [assignEX, setAssignEX] = useState([]);
  const [todo, setTodo] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

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

    const fetchTodoList = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/todoList/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok) {
            setTodo(data);
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
      fetchTodoList();
    }
  }, [currentUser]);

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  return (
    <div className="min-h-screen mt-20">
      {currentUser?.role === "coach" ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-20">
            Welcome to the Dashboard
          </h1>
          {currentUser.isActive ? (
            <>
              <div className="grid grid-flow-col grid-rows-2 sm:grid-rows-2 md:grid-rows-2 lg:grid-rows-1 xl:grid-rows-1 h-90 gap-2 justify-center">
                <Card className="" onClick={() => handleCardClick("customers")}>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
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
                  {customers.length > currentUser.validCustomers ? (
                    <>
                      <Button onClick={handleModalOpen}>Add a Client</Button>
                      <Modal
                        show={openModal}
                        onClose={() => setOpenModal(false)}
                        popup
                        size="md"
                      >
                        <Modal.Header />
                        <Modal.Body>
                          <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                              You have reached the maximum number of customers
                            </h3>
                            <div className="flex justify-center gap-4">
                              <Button color="success">
                                <Link to={`/plans`}>
                                  <span>Upgrade your Plan</span>
                                </Link>
                              </Button>
                              <Button
                                color="failure"
                                onClick={() => setOpenModal(false)}
                              >
                                Delete some customers
                              </Button>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </>
                  ) : (
                    <Button>
                      <Link to={`/add-customer/${currentUser._id}`}>
                        <span>Add a Client</span>
                      </Link>
                    </Button>
                  )}
                </Card>

                <Card className="" onClick={() => handleCardClick("assignEx")}>
                  <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
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

                <Card className="" onClick={() => handleCardClick("exercises")}>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
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

                <Card className="" onClick={() => handleCardClick("diet")}>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Number of Diet Plans
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    You got{" "}
                    {diet && diet.length > 0 ? (
                      <>
                        <span className="font-bold">{diet.length}</span> Diet
                        Plan created
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
            <Modal show={true} popup size="md" className="w-3xl">
              <Modal.Body>
                <div className="text-center mt-6">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Your account is not active due to not paying the monthly
                    updates.
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="success">
                      <Link to={`/plans`}>
                        <span>Upgrade your Plan</span>
                      </Link>
                    </Button>
                    <Button color="info">
                      <Link to={`/contactus`}>
                        <span>Contact Us if you have any Problem</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="mb-10 mt-10 font-bold text-3xl">
              Your Timeline for today
            </h2>

            {Array.isArray(todo) && todo.length !== 0 ? (
              <div className="w-full max-w-xl mt-10 mb-10">
                {todo.map((todoItem, index) => (
                  <Timeline
                    key={index}
                    mode="alternate"
                    className="custom-timeline border-white mb-4"
                  >
                    <Timeline.Item>
                      <Timeline.Point icon={HiCalendar} />
                      <Timeline.Content>
                        <Timeline.Time>
                          {todoItem.date}, {todoItem.time}
                        </Timeline.Time>

                        {todoItem.meal && (
                          <Timeline.Title className="mb-1">
                            {todoItem.meal}
                          </Timeline.Title>
                        )}

                        {todoItem.exerciseId &&
                          todoItem.exerciseId.exerciseName && (
                            <Timeline.Title className="mb-1">
                              {todoItem.exerciseId.exerciseName}
                            </Timeline.Title>
                          )}

                        {todoItem.foodDescription && (
                          <Timeline.Body className="mb-2">
                            {todoItem.foodDescription}
                          </Timeline.Body>
                        )}

                        {todoItem.exerciseId &&
                          todoItem.exerciseId.exerciseDescription && (
                            <Timeline.Body className="mb-2">
                              {todoItem.exerciseId.exerciseDescription}
                            </Timeline.Body>
                          )}
                      </Timeline.Content>
                    </Timeline.Item>
                  </Timeline>
                ))}
              </div>
            ) : (
              <span>No Diet Plan today</span>
            )}
          </div>

          <div className="grid grid-flow-col grid-rows-1 h-90 gap-2 justify-center mt-10">
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
