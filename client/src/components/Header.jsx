import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { HiOutlineBellAlert } from "react-icons/hi2";
import Notification from "./Notification";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const [showModal, setShowModal] = useState(false);
  const notificationRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [notification, setNotification] = useState([]);
  const userId = currentUser && currentUser?._id;

  const handleSignout = async () => {
    try {
      const res = await fetch(
        "https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/auth/signout",
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Function to handle click outside notification area
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowModal(false); // Hide the notification modal only if clicked outside
      }
    };
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            // Filter notifications to show only unread notifications
            const unreadNotifications = data.filter(
              (notification) => !notification.status
            );
            setNotification(unreadNotifications);
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
    <>
      <Navbar className="border-b-2 bg-slate-800 text-white">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Online
          </span>
          Coaching
        </Link>

        <div className="flex gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => dispatch(toggleTheme())}
          >
            <span className="text-xl">
              {theme === "light" ? <FaSun /> : <FaMoon />}
            </span>
          </Button>
          {currentUser && (
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            <span className="text-xl">
              <HiOutlineBellAlert />
            </span>
            {notification.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-sm">
                {notification.length}
              </div>
            )}
          </Button>
          )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              {currentUser?.role === "coach" ? (
                <>
                  <Dropdown.Header>
                    <span className="block text-sm">
                      @{currentUser.fullName}
                    </span>
                    <span className="block text-sm font-medium truncate">
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Link to={`/profile/${currentUser._id}`}>
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Link to={`/update-coach/${currentUser._id}`}>
                    <Dropdown.Item>Update Your Profile</Dropdown.Item>
                  </Link>
                </>
              ) : (
                <>
                  <Dropdown.Header>
                    <span className="block text-sm">
                      @{currentUser.customerName}
                    </span>
                    <span className="block text-sm font-medium truncate">
                      {currentUser.customerEmail}
                    </span>
                  </Dropdown.Header>
                  <Link to={`/profile/${currentUser._id}`}>
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Link
                    to={`/update-customer/${currentUser.userId}/${currentUser._id}`}
                  >
                    <Dropdown.Item>Update Your Profile</Dropdown.Item>
                  </Link>
                </>
              )}

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Try For Free
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"}>
            <Link className="text-white" to="/">
              Home
            </Link>
          </Navbar.Link>

          {currentUser?.role === "coach" && (
            <Navbar.Link active={path === "/plans"}>
              <Link className="text-white" to="/plans">
                Plans
              </Link>
            </Navbar.Link>
          )}
          {currentUser ? (
            <Navbar.Link active={path === `/dashboard/${userId}`}>
              <Link className="text-white" to={`/dashboard/${userId}`}>
                Dashboard
              </Link>
            </Navbar.Link>
          ) : (
            <>
              <Navbar.Link active={path === "/plans"}>
                <Link className="text-white" to="/plans">
                  Plans
                </Link>
              </Navbar.Link>

              <Navbar.Link active={path === "/aboutus"}>
                <Link className="text-white" to="/aboutus">
                  About Us
                </Link>
              </Navbar.Link>
            </>
          )}

          <Navbar.Link active={path === "/contactus"} as={"div"}>
            <Link className="text-white" to="/contactus">
              Contact Us
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      {showModal && (
        <div className="notification-modal" ref={notificationRef}>
          <Notification />
        </div>
      )}
    </>
  );
}
