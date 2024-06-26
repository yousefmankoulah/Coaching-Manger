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

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";

export default function ExerciseUpdate() {
  const [formData, setFormData] = useState({});
  const {
    loading,
    error: errorMessage,
    currentUser,
    token,
  } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, exerciseVideo: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

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
          setFormData({
            exerciseName: data.exerciseName,
            exerciseDescription: data.exerciseDescription,
          });
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
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/updateExercies/${currentUser._id}/${id}`,
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
      <h1 className="text-4xl text-center mt-10 mb-10">Update The Exercise</h1>
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
              <Label value="Exercise Name" />
              <TextInput
                id="exerciseName"
                type="text"
                placeholder="Exercise Name"
                value={formData.exerciseName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Exercise Description" />
              <Textarea
                id="exerciseDescription"
                type="text"
                placeholder="Exercise Description"
                value={formData.exerciseDescription}
                onChange={handleChange}
                className="h-48"
              />
            </div>

            <div>
              <Label value="Exercise Video or Image" />
              <input
                type="file"
                accept="image/*, video/*"
                onChange={handleImageChange}
                ref={filePickerRef}
              />

              {imageFileUploadError && (
                <Alert color="failure">{imageFileUploadError}</Alert>
              )}
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">
              Update an Exercise
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
