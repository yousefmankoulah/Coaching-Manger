import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Label, TextInput, Button } from "flowbite-react";
import { signInStart, signInFailure } from "../../redux/user/userSlice";

export default function UpdateEXResult() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { id } = useParams();

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
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/getACustomerExerices/${currentUser._id}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);

          setFormData(data);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/updateCustomerExerciesInfo/${currentUser._id}/${id}`,
        {
          method: "PUT",
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
      <h1 className="text-4xl text-center mt-10 mb-10">
        Update The Exercise Results
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
              <Label value="max Carrying Weight in LBS" />
              <TextInput
                id="maxCarringWeight"
                type="text"
                value={formData.maxCarringWeight}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="min Carrying Weight in LBS" />
              <TextInput
                id="minCarringWeight"
                type="text"
                value={formData.minCarringWeight}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Time Spend in minutes" />
              <TextInput
                id="timeSpend"
                type="text"
                value={formData.timeSpend}
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Your Exercise result Info
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
