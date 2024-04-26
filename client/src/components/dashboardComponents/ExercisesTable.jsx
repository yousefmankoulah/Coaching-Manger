import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function ExercisesTable() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [exercise, setExercise] = useState([]);
  const [adminExercise, setAdminExercise] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  //search

  const [filteredEx, setFilteredEx] = useState([]);
  const [searchQueryEX, setSearchQueryEX] = useState("");

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [searchQueryC, setSearchQueryC] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getExercies/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesForCustomer/${currentUser._id}`;
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setExercise(data);
          } else {
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCustomers();
  }, [currentUser._id]);

  useEffect(() => {
    const fetchAdminEx = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach" &&
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getAdminExercies/${currentUser._id}`;

          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setAdminExercise(data);
          } else {
            console.error("Error fetching customers:", data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAdminEx();
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/deleteExercies/${currentUser._id}/${postIdToDelete}`,
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
        setExercise((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.role === "coach") {
      setFilteredCustomers(
        exercise.filter(
          (customer) =>
            customer.exerciseName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            customer.exerciseDescription
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }

    if (currentUser.role === "customer") {
      setFilteredCustomer(
        exercise.filter(
          (customer) =>
            customer.exerciseId.exerciseName
              ?.toLowerCase()
              .includes(searchQueryC.toLowerCase()) ||
            customer.date?.includes(searchQueryC)
        )
      );
    }
  }, [exercise, searchQuery, searchQueryC]);

  useEffect(() => {
    setFilteredEx(
      adminExercise.filter(
        (customer) =>
          customer.exerciseName
            ?.toLowerCase()
            .includes(searchQueryEX.toLowerCase()) ||
          customer.exerciseDescription
            ?.toLowerCase()
            .includes(searchQueryEX.toLowerCase())
      )
    );
  }, [adminExercise, searchQueryEX]);

  return (
    <div className="container mr-auto ml-auto table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.role === "coach" ? (
        <>
          <div className="mb-2 mt-4 text-black">
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-1/4 rounded-xl"
            />
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Name
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Description
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Updates
              </Table.HeadCell>
            </Table.Head>
            {exercise && exercise.length > 0 ? ( // Check if customers array exists and is not empty
              filteredCustomers.map((customer) => (
                <Table.Body className="divide-y" key={customer._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white light:bg-slate-50">
                      {customer.exerciseName}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50 overflow-hidden">
                      {customer.exerciseDescription}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      <Link
                        to={`/ExerciseDetail/${currentUser._id}/${customer._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                          Details
                        </span>
                      </Link>
                      <Link
                        to={`/ExerciseUpdate/${currentUser._id}/${customer._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                          Edit
                        </span>
                      </Link>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(customer._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            ) : (
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center">
                    No Exercises to display
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>

          <h3 className="mt-10 mb-10 text-center font-bold text-2xl">
            All Admin Exercies
          </h3>
          <div className="mb-2 mt-4 text-black">
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, or Email"
              value={searchQueryEX}
              onChange={(e) => setSearchQueryEX(e.target.value)}
              className="input input-bordered w-1/4 rounded-xl"
            />
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Name
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Description
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Updates
              </Table.HeadCell>
            </Table.Head>
            {adminExercise && adminExercise.length > 0 ? ( // Check if customers array exists and is not empty
              filteredEx.map((customer) => (
                <Table.Body className="divide-y" key={customer._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white light:bg-slate-50">
                      {customer.exerciseName}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      {customer.exerciseDescription}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      <Link
                        to={`/ExerciseDetail/${currentUser._id}/${customer._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                          Details
                        </span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            ) : (
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center">
                    No Exercises to display
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
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
                  Are you sure you want to delete this Exercises?
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
        </>
      ) : (
        <>
          <div className="mb-2 mt-4 text-black">
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, or Email"
              value={searchQueryC}
              onChange={(e) => setSearchQueryC(e.target.value)}
              className="input input-bordered w-1/4 rounded-xl"
            />
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Date
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Exercises Name
              </Table.HeadCell>
              <Table.HeadCell className="bg-slate-700 text-white">
                Updates
              </Table.HeadCell>
            </Table.Head>
            {exercise && exercise.length > 0 ? ( // Check if customers array exists and is not empty
              filteredCustomer.map((customer) => (
                <Table.Body className="divide-y" key={customer._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {customer.date}
                    </Table.Cell>
                    <Table.Cell>{customer.exerciseId.exerciseName}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/ViewAssignExerciseCustomer/${currentUser._id}/${customer._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                          Details
                        </span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            ) : (
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center">
                    No Exercises to display
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
        </>
      )}
    </div>
  );
}
