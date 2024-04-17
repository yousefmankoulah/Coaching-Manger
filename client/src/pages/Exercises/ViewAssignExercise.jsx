import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ViewAssignExercise() {
  const [formData, setFormData] = useState({});
  const [resultData, setResultData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(false);
  const [video, setVideo] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const url =
          currentUser.role === "coach"
            ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getASetForCoach/${currentUser._id}/${id}`
            : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getASetForCustomer/${currentUser._id}/${id}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

      const fetchResult = async () => {
        const url =
          currentUser.role === "coach"
            ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/addCustomerExerciesInfo/getCustomerExerciesBySetExerciesId/${formData.customerId}/${id}`
            : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/addCustomerExerciesInfo/getCustomerExerciesBySetExerciesId/${currentUser._id}/${id}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);

          setResultData(data);
        }
      };

      fetchPost();
      fetchResult();
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser, id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const url =
        currentUser.role === "coach"
          ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/deleteSetExercies/${currentUser._id}/${id}`
          : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/addCustomerExerciesInfo/deleteCustomerExercies/${currentUser._id}/${id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate(`/dashboard/${currentUser._id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (formData && formData.exerciseId) {
      const isImage = () => {
        const imageToCheck = ["png", "gif", "jpeg", "jpg"];

        let str = formData.exerciseId.exerciseVideo;

        if (typeof str === "string" && str.length > 0) {
          // Check if any word in wordsToCheck is present in the string
          const foundWord = imageToCheck.find((word) => str.includes(word));

          if (foundWord) {
            setImage(true);
          } else {
            setImage(false);
          }
        }
      };

      const isVideo = () => {
        const videoToCheck = ["mp4", "mov", "webm", "avi"];

        let str = formData.exerciseId.exerciseVideo;

        if (typeof str === "string" && str.length > 0) {
          // Check if any word in wordsToCheck is present in the string
          const foundWord = videoToCheck.find((word) => str.includes(word));

          if (foundWord) {
            setVideo(true);
          } else {
            setVideo(false);
          }
        }
      };
      isImage();
      isVideo();
    }
  }, [formData]);

  console.log(resultData);

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10">The Exercise Detail</h1>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5 rounded-lg">
        <div className="w-full max-w max-h bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center pb-10">
            {formData && formData.exerciseId && (
              <>
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-10">
                  {formData.exerciseId.exerciseName}
                </h5>
                {image && (
                  <img
                    className="w-95 h-95 mb-3 shadow-lg mt-3"
                    src={formData.exerciseId.exerciseVideo}
                    alt="Exercise"
                  />
                )}
                {video && (
                  <video
                    className="w-95 h-95 mb-3 shadow-lg mt-3"
                    src={formData.exerciseId.exerciseVideo}
                    alt="Exercise video"
                    controls
                  />
                )}
                {formData.customerId.customerName && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    customer Name: {formData.customerId.customerName}
                  </span>
                )}
                {formData.exerciseId.exerciseDescription && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Description:{" "}
                    {formData.exerciseId.exerciseDescription}
                  </span>
                )}

                {formData.date && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Description: {formData.date}
                  </span>
                )}

                {formData.time && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Description: {formData.time}
                  </span>
                )}

                {formData.setNumbers && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Description: {formData.setNumbers}
                  </span>
                )}

                {currentUser?.role === "coach" ? (
                  <div className="flex mt-4 md:mt-6">
                    <a
                      href={`/ExerciseUpdate/${currentUser._id}/${formData._id}`}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Edit
                    </a>
                    <a
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700"
                    >
                      Delete
                    </a>
                  </div>
                ) : (
                  <div className="flex mt-4 md:mt-6">
                    <a
                      href={`/AddExResult/${currentUser.userId}/${currentUser._id}/${formData._id}`}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-green-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Add Your Training result Info
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl text-center mt-12 mb-10">Exercise Results</h2>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5 rounded-lg">
        <div className="w-full max-w max-h bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center pb-10">
            {formData && (
              <>
                {resultData.date && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Date: {resultData.date}
                  </span>
                )}

                {resultData.time && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Time: {resultData.time}
                  </span>
                )}

                {resultData.maxCarringWeight && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Max. Carrying Weight: {resultData.maxCarringWeight}
                  </span>
                )}

                {resultData.minCarringWeight && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Min. Carrying Weight: {resultData.minCarringWeight}
                  </span>
                )}

                {resultData.timeSpend && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 mr-10 ml-10 mt-10 mb- 10">
                    Exercise Time Spend: {resultData.timeSpend}
                  </span>
                )}

                {currentUser?.role === "customer" && (
                  <div className="flex mt-4 md:mt-6">
                    <a
                      href={`/ExerciseUpdate/${currentUser._id}/${formData._id}`}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Edit
                    </a>
                    <a
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700"
                    >
                      Delete
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
              Are you sure you want to delete this post?
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
