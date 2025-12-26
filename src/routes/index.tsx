import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const VRTour = lazy(() => import('@/components/VRTour'));

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vr-tour" element={<VRTour />} />
            {/* ... other routes */}
        </Routes>
    );
}
