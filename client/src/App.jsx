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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/add-customer" element={<AddCustomers />} />
        </Route>
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/update-customer/:userId/:id" element={<UpdateCustomerLoginInfo />} />
        <Route path="/detail-customer-login-info/:userId/:id" element={<CustomerDetailCoachSide />} />
        </Route>
       
        {/* <Route path='/about' element={<About />} />
        
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/add-customer" element={<AddCustomers />} />
        <Route path="/dashboard" element={<Dashboard />} />


       
        
      //   <Route path='/search' element={<Search />} />
      //   <Route element={<PrivateRoute />}>
      //     <Route path='/dashboard' element={<Dashboard />} />
      //   </Route>
      //   <Route element={<OnlyAdminPrivateRoute />}>
      //     <Route path='/create-post' element={<CreatePost />} />
      //     <Route path='/update-post/:postId' element={<UpdatePost />} />
      //   </Route>

      //   <Route path='/projects' element={<Projects />} />
      //   <Route path='/post/:postSlug' element={<PostPage />} />  */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
