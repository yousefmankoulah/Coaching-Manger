import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { Alert, Label, TextInput, Button } from "flowbite-react";

export function UpdateCustomerLoginInfo() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const {
    currentUser,
    token,
  } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/getACustomer/${currentUser._id}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/updateCustomer/${currentUser._id}/${formData._id}`,
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

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);

        navigate(`/dashboard/${currentUser._id}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
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
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                value={formData.customerName}
              />
            </div>

            <div>
              <Label value="Customer Email" />
              <TextInput
                id="customerEmail"
                type="email"
                placeholder="Customer Email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </div>

            <div>
              <Label value="Customer Temporary Password" />
              <TextInput
                id="customerPassword"
                type="password"
                placeholder="Customer Temporary Password"
                onChange={(e) =>
                  setFormData({ ...formData, customerPassword: e.target.value })
                }
              />
            </div>

            <div>
              <Label value="Customer Phone number" />
              <TextInput
                id="customerPhone"
                type="text"
                placeholder="Customer Phone Number"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Update The Account
            </Button>
          </form>

          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
