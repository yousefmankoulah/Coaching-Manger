import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function CustomersTable() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/getAllCustomer/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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
        `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/deleteCustomer/${currentUser._id}/${postIdToDelete}`,
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

  return (
    <div className="container mr-auto ml-auto table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Customer Name
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Customer Email
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Customer Phone Number
          </Table.HeadCell>
          <Table.HeadCell className="light:bg-slate-700 light:text-white">
            Updates
          </Table.HeadCell>
        </Table.Head>
        {customers && customers.length > 0 ? ( // Check if customers array exists and is not empty
          customers.map((customer) => (
            <Table.Body className="divide-y" key={customer._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white light:bg-slate-50">
                  {customer.customerName}
                </Table.Cell>
                <Table.Cell className="light:bg-slate-50">
                  {customer.customerEmail}
                </Table.Cell>
                <Table.Cell className="light:bg-slate-50">
                  {customer.customerPhone}
                </Table.Cell>
                <Table.Cell className="light:bg-slate-50">
                  <Link
                    to={`/detail-customer-login-info/${currentUser._id}/${customer._id}`}
                    className="text-teal-500 hover:underline"
                  >
                    <span className="whitespace-nowrap font-medium text-gray-900 dark:text-white mr-2">
                      Details
                    </span>
                  </Link>
                  <Link
                    to={`/update-customer/${currentUser._id}/${customer._id}`}
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
