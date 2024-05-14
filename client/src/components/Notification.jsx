import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Notification() {
  const [notification, setNotification] = useState([]);
  const { currentUser, token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/notifyCoach/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/notifyCustomer/${currentUser.userId}/${currentUser._id}`;
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setNotification(data);
          } else {
            // Handle unauthorized access or other errors
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  return (
    <div className="fixed right-4 lg:w-1/4 sm:w-3/4 xs:w-4/5 bg-white text-black p-4">
      {notification && notification.length ? (
        <ul className="space-y-4">
          {notification.map((notify) => (
            <li key={notify.id} className="flex items-center">
              {notify.classification === "coach" ? (
                <Link
                  to={`/ViewAssignExercise/${currentUser._id}/${notify.postId}`}
                  className="flex items-center w-full"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      !notify.status ? "bg-green-500" : "bg-gray-500"
                    } mr-2`}
                  ></div>
                  <div className="flex flex-col">
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.message}
                    </span>
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.date}
                    </span>
                    <hr />
                  </div>
                </Link>
              ) : notify.classification === "diet" ? (
                <Link
                  to={`/DietDetail/${currentUser.userId}/${notify.postId}`}
                  className="flex items-center w-full"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      !notify.status ? "bg-green-500" : "bg-gray-500"
                    } mr-2`}
                  ></div>
                  <div className="flex flex-col">
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.message}
                    </span>
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.date}
                    </span>
                    <hr />
                  </div>
                </Link>
              ) : notify.classification === "assign" ? (
                <Link
                  to={`/ViewAssignExercise/${currentUser.userId}/${notify.postId}`}
                  className="flex items-center w-full"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      !notify.status ? "bg-green-500" : "bg-gray-500"
                    } mr-2`}
                  ></div>
                  <div className="flex flex-col">
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.message}
                    </span>
                    <span className={!notify.status ? "font-bold" : ""}>
                      {notify.date}
                    </span>
                    <hr />
                  </div>
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <span>No Notifications Sent to You</span>
      )}
    </div>
  );
}
