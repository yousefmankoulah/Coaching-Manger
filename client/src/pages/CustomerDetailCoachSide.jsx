import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { Button, Card, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function CustomerDetailCoachSide() {
  const [formData, setFormData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [dietData, setDietData] = useState({});
  const [exData, setExData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    try {
      const fetchCustomerInfo = async () => {
        try {
          if (currentUser && currentUser._id) {
            const res = await fetch(
              `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/customerInfo/getCustomerInfoCoachSide/${currentUser._id}/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await res.json();
            if (res.ok) {
              setCustomerData(data);
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

  useEffect(() => {
    try {
      const fetchExInfo = async () => {
        try {
          if (currentUser && currentUser._id) {
            const res = await fetch(
              `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesCoachSideForACustomer/${currentUser._id}/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await res.json();
            if (res.ok) {
              setExData(data);
            } else {
              // Handle unauthorized access or other errors
              console.error("Error fetching customers:", data.message);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchExInfo();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser._id]);

  useEffect(() => {
    try {
      const fetchDietInfo = async () => {
        try {
          if (currentUser && currentUser._id) {
            const res = await fetch(
              `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/diet/getDiet/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await res.json();
            if (res.ok) {
              setDietData(data);
            } else {
              // Handle unauthorized access or other errors
              console.error("Error fetching customers:", data.message);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchDietInfo();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/deleteCustomer/${currentUser._id}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } 
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10 font-bold">
        Customer Profile Information
      </h1>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center pb-10">
              {formData && (
                <>
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg mt-3"
                    src={formData.profilePicture}
                    alt="Bonnie image"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {formData.customerName}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.customerEmail}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.customerPhone}
                  </span>
                  <div className="flex mt-4 md:mt-6">
                    <a
                      href={`/update-customer/${currentUser._id}/${formData._id}`}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Edit
                    </a>
                    <a
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-red-700 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700"
                    >
                      Delete
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Card className="max-w-sm">
            <h2 className="text-2xl text-center mt-5 mb-5">
              Personal Information
            </h2>
            {customerData && (
              <>
                {customerData.customerCurrentWeight && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Current Weight: {customerData.customerCurrentWeight}
                  </p>
                )}
                {customerData.customerTargetWeight && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Target Weight: {customerData.customerTargetWeight}
                  </p>
                )}
                {customerData.customerCurrentHeight && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Current Height: {customerData.customerCurrentHeight}
                  </p>
                )}
                {customerData.customerCurrentAge && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Current Age: {customerData.customerCurrentAge}
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
      <hr className="mt-5 mb-5" />

      <h3 className="text-3xl font-bold text-center mt-10 mb-10">
        Assigned Exercise
      </h3>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5 mt-10 mb-10">
        {exData && exData.length > 0 ? (
          exData.map((dietData) => (
            <>
              <Card className="flex-1">
                <h2 className="text-2xl text-center mt-10 mb-10">
                  {dietData.exerciseId.exerciseName}
                </h2>
                {dietData.exerciseId.exerciseDescription && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Current Weight: {dietData.exerciseId.exerciseDescription}
                  </p>
                )}
                {dietData.date && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Date: {dietData.date}
                  </p>
                )}
                {dietData.setNumbers && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Set Numbers: {dietData.setNumbers}
                  </p>
                )}
              </Card>
            </>
          ))
        ) : (
          <p className="text-lg text-center font-bold">No Exercise Assigned</p>
        )}
      </div>

      <hr className="mt-5 mb-5" />

      <h3 className="text-3xl font-bold text-center mt-10 mb-10">
        Assigned Diet
      </h3>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5 mt-10 mb-10">
        {dietData && dietData.length > 0 ? (
          dietData.map((dietData) => (
            <>
              <Card className="flex-1">
                <h2 className="text-2xl text-center mt-10 mb-10">
                  {dietData.meal}
                </h2>
                {dietData.foodDescription && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Meal Description: {dietData.foodDescription}
                  </p>
                )}
                {dietData.date && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Date: {dietData.date}
                  </p>
                )}
                {dietData.calorie && (
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Calories: {dietData.calorie}
                  </p>
                )}
              </Card>
            </>
          ))
        ) : (
          <span className="text-lg text-center font-bold">
            No Diet Assigned
          </span>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Customer?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
