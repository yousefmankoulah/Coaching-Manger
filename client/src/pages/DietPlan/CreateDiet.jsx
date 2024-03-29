import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Label,
  TextInput,
  Button,
  Spinner,
  Textarea,
  Select,
} from "flowbite-react";
import {
  signInStart,
  createCustomerSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

export default function CreateDiet() {
  const [formData, setFormData] = useState({});
  const [customer, setCustomer] = useState({});
  const {
    loading,
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
            setCustomer(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.foodDescription || !formData.meal) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/createDiet/${currentUser._id}/${formData.customerId}`,
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
      <h1 className="text-4xl text-center mt-10 mb-10">Create An Exercise</h1>
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
                {customer && customer.length > 0 ? (
                  <>
                    <option value="" disabled selected>
                      Choose the Customer Name
                    </option>
                    {customer.map((customers) => (
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
              <Label value="Meal Name" />
              <TextInput
                id="meal"
                type="text"
                placeholder="Meal Name"
                value={formData.meal}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Food Description" />
              <Textarea
                id="foodDescription"
                type="text"
                placeholder="Food Description"
                value={formData.foodDescription}
                onChange={handleChange}
                className="h-48"
              />
            </div>

            <div>
              <Label value="calories Number" />
              <TextInput
                id="calorie"
                type="text"
                placeholder="calories Number"
                value={formData.calorie}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Date for the Plan" />
              <TextInput
                id="date"
                type="date"
                placeholder="Date for the Plan"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Time for the Plan" />
              <TextInput
                id="time"
                type="time"
                placeholder="Time for the Plan"
                value={formData.time}
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Create an Diet Plan
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
