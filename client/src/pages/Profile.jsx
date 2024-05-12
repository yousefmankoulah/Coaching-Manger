import { Card, Button, Modal, Timeline } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/coachProfile/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/getCustomerInfo/${currentUser._id}`;

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
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-20">
      <h1 className="text-3xl font-bold text-center mb-10">
        Welcome to Your Profile
      </h1>
      <div className="mt-40 w-full">
        <Card
          className="w-3/4 max-w-3xl mx-auto"
          imgSrc={currentUser.profilePicture}
          horizontal
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </Card>
      </div>
    </div>
  );
}
