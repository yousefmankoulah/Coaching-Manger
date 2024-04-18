import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Label, TextInput, Button } from "flowbite-react";
import { signInStart, signInFailure } from "../redux/user/userSlice";

export default function UpdateCustomerInformation() {
  const [formData, setFormData] = useState({});

  const {
    error: errorMessage,
    currentUser,
    token,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    try {
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
              setFormData(data);
            } else {
              // Handle unauthorized access or other errors
              console.error("Error fetching customers:", data.message);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCustomerInfo();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/updateCutomerInfo/${currentUser._id}/${id}`,
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
        Update Your Information
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
              <Label value="Your Current Weight" />
              <TextInput
                id="customerCurrentWeight"
                type="text"
                value={formData.customerCurrentWeight}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Your Target Weight" />
              <TextInput
                id="customerTargetWeight"
                type="text"
                value={formData.customerTargetWeight}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Your Current Height" />
              <TextInput
                id="customerCurrentHeight"
                type="text"
                value={formData.customerCurrentHeight}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Age" />
              <TextInput
                id="customerCurrentAge"
                type="text"
                value={formData.customerCurrentAge}
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Update Your Info
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
