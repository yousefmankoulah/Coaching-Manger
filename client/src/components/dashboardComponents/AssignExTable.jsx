import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function AssignExTable() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  //search
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const url =
            currentUser.role === "coach"
              ? `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesCoachSide/${currentUser._id}`
              : `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/getSetExerciesCoachSideForACustomer/${currentUser.userId}/${currentUser._id}`;
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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/exercise/deleteSetExercies/${currentUser._id}/${postIdToDelete}`,
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
        setCustomers((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setFilteredCustomers(customers.filter(customer =>
      customer.customerId.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.exerciseId.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.date.includes(searchQuery)
    ));
  }, [customers, searchQuery]);

  return (
    <div className="container mr-auto ml-auto table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
    <div className="mb-2 mt-4 text-black">
        <input
          type="text"
          placeholder="Search by Name, Exercise, or Date"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input input-bordered w-1/4 rounded-xl"
        />
      </div>
      
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Customer Name
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Exercise Name
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Date
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Updates
          </Table.HeadCell>
        </Table.Head>
        {customers && customers.length > 0 ? ( // Check if customers array exists and is not empty
          filteredCustomers.map((customer) => (
            <Table.Body className="divide-y bg-slate-200" key={customer._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                {customer && customer.customerId && (
                  <>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white light:bg-slate-50">
                      {customer.customerId.customerName}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      {customer.exerciseId.exerciseName}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      {customer.date}
                    </Table.Cell>
                    <Table.Cell className="light:bg-slate-50">
                      <Link
                        to={`/ViewAssignExercise/${currentUser._id}/${customer._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                          Details
                        </span>
                      </Link>
                      <Link
                        to={`/UpdateAssignEx/${currentUser._id}/${customer._id}`}
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
                  </>
                )}
              </Table.Row>
            </Table.Body>
          ))
        ) : (
          <Table.Body className="divide-y">
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center">
                No customers to display
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
