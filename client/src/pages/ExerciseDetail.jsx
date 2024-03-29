import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { Button, Card, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ExerciseDetail() {
  const [formData, setFormData] = useState({});
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
        const url = `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getAnExercies/${currentUser._id}/${id}`;

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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/deleteExercies/${currentUser._id}/${id}`,
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
      } else {
        navigate(`/dashboard/${currentUser._id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isImage = () => {
    const imageToCheck = ["png", "gif", "jpeg", "jpg"];
    let str = formData.exerciseVideo;

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
    let str = formData.exerciseVideo;

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

  useEffect(() => {
    if (formData.exerciseVideo) {
      isImage();
      isVideo();
    }
  }, [formData.exerciseVideo]);



  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-4xl text-center mt-10 mb-10">The Exercise Detail</h1>
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center pb-10">
            {formData && (
              <>
                {image && (
                  <img
                    className="w-24 h-24 mb-3 shadow-lg mt-3"
                    src={formData.exerciseVideo}
                    alt="Exercise"
                  />
                )}
                {video && (
                  <video
                    className="w-24 h-24 mb-3 shadow-lg mt-3"
                    src={formData.exerciseVideo}
                    alt="Exercise video"
                    controls
                  />
                )}

                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {formData.exerciseName}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.exerciseDescription}
                </span>

                {currentUser?.role === "coach" && (
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
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Delete
                    </a>
                    <a
                      href="#"
                      className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Message
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
