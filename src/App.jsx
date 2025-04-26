import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './redux/store';
import Layout from './pages/Layout';
import UserLayout from './pages/userPage/userLayout';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import OtpRequest from './pages/Otprequest';
import Course from './pages/Course';
import Schedule from './pages/Schedule';
import AccessLogs from './pages/Accesslogs';
import Login from './pages/Login';
import Register from './pages/Register';
import Teacher from './pages/Teacher';
import UserDashboard from './pages/userPage/userDashboard';
import UserProfile from './pages/userPage/userProfile';
import UserSchedule from './pages/userPage/userSchedule';
import UserRoom from './pages/userPage/userRoom';
import UserOtprequest from './pages/userPage/userOtprequest';
import UserRoomrequest from './pages/userPage/userRoomrequest';
import Roomrequest from './pages/Roomrequest';
import Displayroom from './pages/DisplayRoom'
import LogsHistory from './pages/LogsHistory';
import Archive from './pages/Archive';
import Roomletter from './pages/Print_roomData';
import CalendarSched from './pages/Calendar_sched';
import RoomScheds from './pages/Rooms_Sched';
import UserCalendar from './pages/userPage/userCalendar';
import AssignSched from './pages/AssignSched';
import ResetPassword from './pages/ResetPassword';
function App() {
  const router = createBrowserRouter([
    {
      path: '/admin',
      element: <Layout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'room',
          element: <Room />,
        },
        {
          path: 'access_code',
          element: <OtpRequest/>,
        },
        {
          path: 'course',
          element: <Course />,
        },
        {
          path: 'schedule',
          element: <Schedule />,
        },
        {
          path: 'teachers',
          element: <Teacher />,
        },
        {
          path: 'logs',
          element: <AccessLogs />,
        },
        {
          path: 'room_request',
          element: <Roomrequest />,
        },
        {
          path: 'archive',
          element: <Archive/>,
        },
        {
          path: 'room_letter',
          element: <Roomletter />,
        },
        {
          path: 'display_room',
          element: <Displayroom />,
        },
        {
          path: 'calendar_sched',
          element: <CalendarSched/>,
        },
        {
          path : 'room_scheds',
          element : <RoomScheds/>,
        },
        {
          path : 'assign_sched',
          element : <AssignSched/>,
        },
        {
          path: 'logs_history',
          element: <LogsHistory />,
        },
      ],
    },
    {
      path: 'user',
      element: <UserLayout />, 
      children: [
        {
          path: 'dashboard',
          element: <UserDashboard/>, 
        },
        {
          path: 'room',
          element: <UserRoom />, 
        },
        {
          path: 'schedule',
          element: <UserSchedule/>, 
        },
        {
          path: 'profile',
          element: <UserProfile/>, 
        },
        {
          path: 'access_code',
          element: <UserOtprequest/>,
        },
        {
          path: 'user_calendar',
          element: <UserCalendar/>,
        },
        {
          path: 'room_request',
          element: <UserRoomrequest/>,
        },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/reset_password',
      element: <ResetPassword />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
}

export default App;