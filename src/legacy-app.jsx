'use client';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './views/user/Home';
import Animals from './views/user/Animals';
import Plants from './views/user/Plants';
import { AnimalDetail, PlantDetail } from './views/user/CollectionDetail';
import Events from './views/user/Events';
import Reservations from './views/user/Reservations';
import AboutUs from './views/user/AboutUs';
import ArchivedReservations from './views/user/ArchivedReservations';
import UserProfile from './views/user/UserProfile';
import Settings from './views/user/Settings';
import Help from './views/user/Help';
import UserMessages from './views/user/UserMessages';
import CommunityPage from './views/user/CommunityPage';
import PublicUserProfile from './views/user/PublicUserProfile';
import Donation from './views/user/Donation';
import MyEvents from './views/user/MyEvents';
import LoginPage from './views/auth/LoginPage';
import RegisterPage from './views/auth/RegisterPage';
import GoogleAuthSuccess from './views/auth/GoogleAuthSuccess';
import AccessDenied from './views/auth/AccessDenied';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminEvents from './views/admin/AdminEvents';
import AnimalAnalytics from './views/admin/AnimalAnalytics';
import Analytics from './views/admin/Analytics';
import Reports from './views/admin/Reports';
import AdminUsers from './views/admin/AdminUsers';
import AdminAnimals from './views/admin/AdminAnimals';
import AdminPlants from './views/admin/AdminPlants';
import AdminReservations from './views/admin/AdminReservations';
import AdminTransactions from './views/admin/AdminTransactions';
import AdminProfile from './views/admin/AdminProfile';
import AdminHelpCenter from './views/admin/AdminHelpCenter';
import AdminTickets from './views/admin/AdminTickets';
import AdminMessages from './views/admin/AdminMessages';
import AdminStaffMonitoring from './views/admin/AdminStaffMonitoring';
import AdminCommunityModeration from './views/admin/AdminCommunityModeration';
import AdminSettings from './views/admin/AdminSettings';
import StaffDashboard from './views/staff/StaffDashboard';
import QRScanner from './views/staff/QRScanner';
import StaffEvents from './views/staff/StaffEvents';
import StaffTickets from './views/staff/StaffTickets';
import StaffReservations from './views/staff/StaffReservations';
import StaffAnimals from './views/staff/StaffAnimals';
import StaffPlants from './views/staff/StaffPlants';
import StaffHelpCenter from './views/staff/StaffHelpCenter';
import StaffMessages from './views/staff/StaffMessages';
import StaffCommunityModeration from './views/staff/StaffCommunityModeration';
import AdminLayout from './components/layout/AdminLayout';
import StaffLayout from './components/layout/StaffLayout';
import AnimalClassifier from './components/features/ai-scanner/AnimalClassifier';
import MapPage from './views/user/Map';
import './App.css';
import AIAssist from './views/AIAssist';
import { trackVisit } from './services/visitor-tracking';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ message: 'Please login to access this feature' }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

const VisitTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff') || location.pathname.startsWith('/auth/')) return;
        trackVisit(location.pathname);
    }, [location.pathname]);

    return null;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes - accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/animals/:id" element={<AnimalDetail />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/animaldex" element={<AnimalClassifier />} />
            <Route path="/map" element={<MapPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Protected User Routes - requires login */}
            <Route path="/classifier" element={
                <ProtectedRoute allowedRoles={['user', 'staff']}>
                    <AnimalClassifier />
                </ProtectedRoute>
            } />
            <Route path="/reservations" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <Reservations />
                </ProtectedRoute>
            } />
            <Route path="/archived-reservations" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <ArchivedReservations />
                </ProtectedRoute>
            } />
            <Route path="/my-events" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <MyEvents />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['user', 'staff']}>
                    <UserProfile />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['user', 'staff']}>
                    <Settings />
                </ProtectedRoute>
            } />
            <Route path="/my-messages" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <UserMessages />
                </ProtectedRoute>
            } />
            <Route path="/donation" element={
                <ProtectedRoute allowedRoles={['user', 'staff', 'admin']}>
                    <Donation />
                </ProtectedRoute>
            } />
            <Route path="/help" element={<Help />} />
            <Route path="/community" element={
                <ProtectedRoute allowedRoles={['user', 'staff', 'admin']}>
                    <CommunityPage />
                </ProtectedRoute>
            } />
            <Route path="/community/users/:userId" element={
                <ProtectedRoute allowedRoles={['user', 'staff', 'admin']}>
                    <PublicUserProfile />
                </ProtectedRoute>
            } />
            <Route path="/mini-zoo-game" element={<Navigate to="/" replace />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminDashboard />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/ai-assist" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AIAssist role="admin" />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminEvents />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Analytics />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/animal-analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AnimalAnalytics />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Reports />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/staff-monitoring" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminStaffMonitoring />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminUsers />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/animals" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminAnimals />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/plants" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminPlants />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/reservations" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminReservations />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminTransactions /></AdminLayout></ProtectedRoute>} />

            <Route path="/admin/profile" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminProfile />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminTickets />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/help" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminHelpCenter />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminMessages />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/community-moderation" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminCommunityModeration />
                    </AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <AdminSettings />
                    </AdminLayout>
                </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff/dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffDashboard />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/ai-assist" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <AIAssist role="staff" />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/qr-scanner" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <QRScanner />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/events" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffEvents />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/tickets" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffTickets />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/animals" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffAnimals />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/plants" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffPlants />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/reservations" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffReservations />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/help" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffHelpCenter />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/messages" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffMessages />
                    </StaffLayout>
                </ProtectedRoute>
            } />
            <Route path="/staff/community-moderation" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <StaffLayout>
                        <StaffCommunityModeration />
                    </StaffLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <VisitTracker />
                <AppRoutes />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
