import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Label, TextInput, Button } from "flowbite-react";
import { signInStart, signInFailure } from "../../redux/user/userSlice";

export default function AssignExercise() {
  const [formData, setFormData] = useState({});
  const [customers, setCustomers] = useState([]);
  const [exercise, setExercise] = useState([]);

  const {
    error: errorMessage,
    currentUser,
    token,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

    fetchCustomers();
  }, [currentUser]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getAllExercies/${currentUser._id}`,
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
    fetchCustomers();
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.exerciseId) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/coachSetExerciesToCustomer/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Dispatch signInFailure on failure
      }

      if (res.ok) {
        navigate(`/dashboard/${currentUser._id}`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch signInFailure on error
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10">Assign An Exercise</h1>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Online
            </span>
            Coaching
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Choose the Customer Name" />

              <select
                required
                id="customerId"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {customers && customers.length > 0 ? (
                  <>
                    <option value="" disabled selected>
                      Choose the Customer Name
                    </option>
                    {customers.map((customers) => (
                      <option key={customers._id} value={customers._id}>
                        {customers.customerName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" disabled selected>
                    There are no customers
                  </option>
                )}
              </select>
            </div>

            <div>
              <Label value="Choose the Exercise Name" />

              <select
                required
                id="exerciseId"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {exercise && exercise.length > 0 ? (
                  <>
                    <option value="" disabled selected>
                      Choose the Customer Name
                    </option>
                    {exercise.map((customers) => (
                      <option key={customers._id} value={customers._id}>
                        {customers.exerciseName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" disabled selected>
                    There are no exercises
                  </option>
                )}
              </select>
            </div>

            <div>
              <Label value="Exercise date" />
              <TextInput
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Exercise time" />
              <TextInput
                id="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Exercise set Numbers" />
              <TextInput
                id="setNumbers"
                type="text"
                value={formData.setNumbers}
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Assign an Exercise
            </Button>
          </form>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
