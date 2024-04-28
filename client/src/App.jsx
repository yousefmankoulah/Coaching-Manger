import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { AddCustomers } from "./pages/AddCustomers.jsx";
import { UpdateCustomerLoginInfo } from "./pages/UpdateCustomerLoginInfo.jsx";
import { CustomerDetailCoachSide } from "./pages/CustomerDetailCoachSide.jsx";
import { UpdateCoachProfile } from "./pages/UpdateCoachProfile.jsx";
import ExerciseDetail from "./pages/Exercises/ExerciseDetail.jsx";
import CreateExercise from "./pages/Exercises/CreateExercise.jsx";
import ExerciseUpdate from "./pages/Exercises/ExerciseUpdate.jsx";
import CreateDiet from "./pages/DietPlan/CreateDiet.jsx";
import EditDiet from "./pages/DietPlan/EditDiet.jsx";
import DietDetail from "./pages/DietPlan/DietDetail.jsx";
import AssignExercise from "./pages/Exercises/AssignExercise.jsx";
import ViewAssignExercise from "./pages/Exercises/ViewAssignExercise.jsx";
import UpdateAssignEx from "./pages/Exercises/UpdateAssignEx.jsx";
import AddExResult from "./pages/Exercises/AddExResult.jsx";
import UpdateEXResult from "./pages/Exercises/UpdateEXResult.jsx";
import AddCustomerInformation from "./pages/AddCustomerInformation.jsx";
import UpdateCustomerInformation from "./pages/UpdateCustomerInformation.jsx";
import Plans from "./pages/Plans.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import SuccessComponent from "./pages/SuccessComponent.jsx";
import SubscribeComponent from "./pages/SubscribeComponent.jsx";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/add-customer/:id" element={<AddCustomers />} />
          <Route path="/update-coach/:id" element={<UpdateCoachProfile />} />
          <Route
            path="/ExerciseUpdate/:userId/:id"
            element={<ExerciseUpdate />}
          />
          <Route path="/CreateExercise/:id" element={<CreateExercise />} />

          <Route path="/CreateDiet/:userId" element={<CreateDiet />} />
          <Route path="/EditDiet/:userId/:id" element={<EditDiet />} />
          <Route path="/AssignExercise/:userId" element={<AssignExercise />} />
          <Route
            path="/ViewAssignExercise/:userId/:id"
            element={<ViewAssignExercise />}
          />
          <Route
            path="/UpdateAssignEx/:userId/:id"
            element={<UpdateAssignEx />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route
            path="/update-customer/:userId/:id"
            element={<UpdateCustomerLoginInfo />}
          />
          <Route
            path="/detail-customer-login-info/:userId/:id"
            element={<CustomerDetailCoachSide />}
          />
          <Route
            path="/ExerciseDetail/:userId/:id"
            element={<ExerciseDetail />}
          />
          <Route path="/DietDetail/:userId/:id" element={<DietDetail />} />
          <Route
            path="/ViewAssignExerciseCustomer/:customerId/:id"
            element={<ViewAssignExercise />}
          />

          <Route
            path="/AddExResult/:userId/:id/:setExerciesToCustomerId"
            element={<AddExResult />}
          />
          <Route
            path="/UpdateExResult/:customerId/:id"
            element={<UpdateEXResult />}
          />

          <Route
            path="/AddCustomerInformation/:userId/:id"
            element={<AddCustomerInformation />}
          />

          <Route
            path="/UpdateCustomerInformation/:customerId/:id"
            element={<UpdateCustomerInformation />}
          />
          <Route path="/subscribe/:planId" element={<SubscribeComponent />} />

          
          <Route path="/success" element={<SuccessComponent />} />
        </Route>
       
      </Routes>
    
     
    </Elements>
      <Footer />
      
    </BrowserRouter>
  );
}
