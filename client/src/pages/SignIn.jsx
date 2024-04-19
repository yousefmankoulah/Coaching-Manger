import { Alert, Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [isCoach, setIsCoach] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCustomer, setShowPasswordCustomer] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPasswordCustomer = () => {
    setShowPasswordCustomer(!showPasswordCustomer);
  };

  const coachlogin = () => {
    setIsCoach(true);
  };
  const traineeLogin = () => {
    setIsCoach(false);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(
        "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/signin",
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

        navigate(`/dashboard/${data.rest._id}`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(
        "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/customerSignin",
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

        navigate(`/dashboard/${data.rest._id}`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
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

        <div className="flex-1 ">
          <div className="inline-flex rounded-md shadow-sm ml-6">
            <a
              href="#"
              onClick={coachlogin}
              aria-current="page"
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Log in as a Coach
            </a>

            <a
              href="#"
              onClick={traineeLogin}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Log in as a Trainee
            </a>
          </div>

          {isCoach === true ? (
            <>
              <form
                className="flex flex-col gap-4 mt-10"
                onSubmit={handleSubmit}
              >
                <div>
                  <Label value="Your email" />
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label value="Your password" />
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    id="password"
                    onChange={handleChange}
                  />
                  <input
                    type="checkbox"
                    onChange={handleShowPassword}
                    id="showPassword"
                    checked={showPassword}
                  />
                  <Label value=" Show the password" />
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
                    "Sign In"
                  )}
                </Button>
                <OAuth />
              </form>
              <div className="flex gap-2 text-sm mt-5">
                <span>Dont Have an account?</span>
                <Link to="/sign-up" className="text-blue-500">
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              <form
                className="flex flex-col gap-4 mt-10"
                onSubmit={handleCustomerSubmit}
              >
                <div>
                  <Label value="Your email" />
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label value="Your password" />
                  <TextInput
                    type={showPasswordCustomer ? "text" : "password"}
                    placeholder="**********"
                    id="password"
                    onChange={handleChange}
                  />
                  <input
                    type="checkbox"
                    onChange={handleShowPasswordCustomer}
                    id="showPasswordCustomer"
                    checked={showPasswordCustomer}
                  />
                  <Label value=" Show the password" />
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
                    "Sign In"
                  )}
                </Button>
              </form>
            </>
          )}

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
