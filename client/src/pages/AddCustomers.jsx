import { Alert, Label, TextInput, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export function AddCustomers() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const { currentUser } = useSelector((state) => state.user);

  const userId = currentUser && currentUser.userId;

  // Check if userId is valid
  if (!userId) {
    console.error("User ID is not available.");
    // Handle the error or return from the function
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(
        `https://symmetrical-winner-jqq4666544jhqqq-3000.app.github.dev/api/userCustomer/addCustomer/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
                id="name"
                type="text"
                placeholder="Customer Name"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Email" />
              <TextInput
                id="email"
                type="email"
                placeholder="Customer Email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Temporary Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Customer Temporary Password"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Customer Phone number" />
              <TextInput
                id="phoneNumber"
                type="text"
                placeholder="Customer Phone Number"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Create Customer Account"
              )}
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
