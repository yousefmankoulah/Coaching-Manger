import { Card } from "flowbite-react";
import { useState } from "react";
import CustomersTable from "../components/dashboardComponents/CustomersTable";
import ExercisesTable from "../components/dashboardComponents/ExercisesTable";
import DietPlansTable from "../components/dashboardComponents/DietPlansTable";

export function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  return (
    <div className="min-h-screen mt-20">
      <h1 className="text-3xl font-bold text-center mb-20">
        Welcome to Dashboard
      </h1>

      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <Card className="max-w-sm" onClick={() => handleCardClick("customers")}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Number of Customers
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            You got 10 customers created
          </p>
        </Card>

        <Card className="max-w-sm" onClick={() => handleCardClick("exercises")}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Number of Exercises
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            You got 10 Exercises created
          </p>
        </Card>

        <Card className="max-w-sm" onClick={() => handleCardClick("diet")}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Number of Diet Plans
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            You got 10 Diet Plans created
          </p>
        </Card>
      </div>
      {selectedCard === null && <CustomersTable />}
      {selectedCard === "customers" && <CustomersTable />}
      {selectedCard === "exercises" && <ExercisesTable />}
      {selectedCard === "diet" && <DietPlansTable />}
    </div>
  );
}
