import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CustomersTable() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(
            `https://cautious-journey-5xx4666q445cvjp5-3000.app.github.dev/api/userCustomer/getAllCustomer/${currentUser._id}?token=${token}`
          );

          const data = await res.json();
          if (res.ok) {
            setCustomers(data.customers);
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
    <div className="container mr-auto ml-auto table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Customer Name</Table.HeadCell>
          <Table.HeadCell>Customer Email</Table.HeadCell>
          <Table.HeadCell>Customer Phone Number</Table.HeadCell>
          <Table.HeadCell>Updates</Table.HeadCell>
        </Table.Head>
        {customers && customers.length > 0 ? ( // Check if customers array exists and is not empty
          customers.map((customer) => (
            <Table.Body className="divide-y" key={customer._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {customer.customerName}
                </Table.Cell>
                <Table.Cell>{customer.customerEmail}</Table.Cell>
                <Table.Cell>{customer.customerPhone}</Table.Cell>
                <Table.Cell>
                  <Link to="/">Details</Link>
                  <Link to="/">Edit</Link>
                  <Link to="/">Delete</Link>
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
    </div>
  );
}
