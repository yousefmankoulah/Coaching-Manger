import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Label, TextInput, Button } from "flowbite-react";
import {
  signInStart,
  createCustomerSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export function AddCustomers() {
  const [formData, setFormData] = useState({});
  const {
    error: errorMessage,
    currentUser,
    token,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPassword
    ) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/addCustomer/${currentUser._id}`,
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
        dispatch(createCustomerSuccess(data));
        navigate(`/dashboard/${currentUser._id}`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch signInFailure on error
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10">
        Create New Customer Profile
      </h1>
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
              <Label value="Customer Name" />
              <TextInput
                id="customerName"
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Email" />
              <TextInput
                id="customerEmail"
                type="email"
                placeholder="Customer Email"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Temporary Password" />
              <TextInput
                id="customerPassword"
                type="password"
                placeholder="Customer Temporary Password"
                value={formData.customerPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Phone number" />
              <TextInput
                id="customerPhone"
                type="text"
                placeholder="Customer Phone Number"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Create Customer Account
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
