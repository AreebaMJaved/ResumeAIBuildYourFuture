import { createBrowserRouter } from "react-router-dom";
import  Home  from "./features/auth/pages/Home";
import  Login  from "./features/auth/pages/Login";
import  Signup  from "./features/auth/pages/Signup";
import  Dashboard  from "./features/interview/pages/Home";
import Interview from './features/interview/pages/Interview';
import SampleReport from "./features/interview/pages/SampleReport";

export const appsRoutes = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/login", element: <Login />},
    {path: "/signup", element: <Signup />},
    {path:"/home", element: <Dashboard />} ,
    { path: '/interview/:interviewId', element: <Interview />
     },
     { path: '/sample-report', element: <SampleReport />
     }
])