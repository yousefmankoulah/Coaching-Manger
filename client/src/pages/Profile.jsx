import { Card, Button, Timeline } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiCalendar } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [todo, setTodo] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/coachProfile/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/getACustomer/${currentUser.userId}/${currentUser._id}`;

          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
    fetchCustomers();

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

    if (currentUser?.role !== "coach") {
      fetchCustomerInfo();
      fetchTodoList();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-20">
      <h1 className="text-3xl font-bold text-center mb-10">
        Welcome to Your Profile
      </h1>
      {currentUser?.role !== "coach" ? (
        <>
          <div className="mt-40 w-full">
            <Card
              className="mx-auto"
              imgSrc={currentUser.profilePicture}
              horizontal
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {customers.customerName}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <ul>
                  <li>Your Email Address: {customers.customerEmail}</li>
                  <li>Your Phone number: {customers.customerPhone}</li>
                  <li>
                    Your current Weight: {customerInfo.customerCurrentWeight}
                  </li>
                  <li>
                    Your Target Weight: {customerInfo.customerTargetWeight}
                  </li>
                  <li>
                    Your current Height: {customerInfo.customerCurrentHeight}
                  </li>
                  <li>Your Age: {customerInfo.customerCurrentAge}</li>
                </ul>
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button>
                  <Link
                    to={`/update-customer/${currentUser.userId}/${currentUser._id}`}
                  >
                    <span>Update Your Profile</span>
                  </Link>
                </Button>
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
            </Card>
          </div>

          <div className="flex flex-col items-center justify-center mb-10 mt-10">
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
        </>
      ) : (
        <div className="mt-40 w-full">
          <Card
            className="mx-auto"
            imgSrc={currentUser.profilePicture}
            horizontal
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {customers.fullName}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              <ul>
                <li>Your Email Address: {customers.email}</li>
                <li>Your Plan Id: {customers.plan}</li>
                <li>Max customer number: {customerInfo.validCustomers}</li>
              </ul>
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button>
                <Link to={`/update-coach/${currentUser._id}`}>
                  <span>Update Your Profile</span>
                </Link>
              </Button>
              <Button>
                <Link to="https://billing.stripe.com/p/login/7sI7vocCEgUldEI6oo">
                  <span>Subscription info</span>
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
