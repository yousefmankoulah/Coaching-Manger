import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Label,
  TextInput,
  Button,
  Spinner,
  Textarea,
} from "flowbite-react";
import {
  signInStart,
  createCustomerSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

export default function EditDiet() {
  const [formData, setFormData] = useState({});
  const {
    loading,
    error: errorMessage,
    currentUser,
    token,
  } = useSelector((state) => state.user);
  const [publishError, setPublishError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const url = `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/getADiet/${currentUser._id}/${id}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
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
  }, [currentUser, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      dispatch(signInStart());

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/updateDiet/${currentUser._id}/${id}`,
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
  console.log(formData.date);

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10">Update The Diet Plan</h1>
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
            {/* <div>Customer Name: {formData.customerId.customerName}</div> */}
            <div>
              <Label value="Meal Name" />
              <TextInput
                id="exerciseName"
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
              Update The Diet Plan
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
