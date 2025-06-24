import UserLayout from '@/components/layout/UserLayout';
import Home from './Home';
import Profile from './Profile';
// import Settings from './Settings';

const userRoutes: any = {
  path: '/user',
  element: <UserLayout />,
  children: [
    { path: 'home', element: <Home /> },
    { path: 'profile', element: <Profile /> },
    // { path: 'settings', element: <Settings /> },
    { index: true, element: <Home /> },
  ],
};

export default userRoutes;
