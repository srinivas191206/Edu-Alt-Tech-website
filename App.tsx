import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import AIAssistant from './components/AIAssistant';

const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const CourseClassroom = lazy(() => import('./pages/CourseClassroom'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Verification = lazy(() => import('./pages/Verification'));
const Services = lazy(() => import('./pages/Services'));
const Resources = lazy(() => import('./pages/Resources'));
const Practice = lazy(() => import('./pages/Practice'));

// Scroll to top on route change
const ScrollToTop = () => {
 const { pathname, hash } = useLocation();

 useEffect(() => {
 if (hash) {
 const element = document.getElementById(hash.slice(1));
 if (element) {
 element.scrollIntoView({ behavior: 'smooth' });
 }
 } else {
 window.scrollTo(0, 0);
 }
 }, [pathname, hash]);

 return null;
};

const AppContent: React.FC = () => {
 const location = useLocation();
 const isAdminPath = location.pathname.startsWith('/admin');
  const isClassroomPath = location.pathname.startsWith('/classroom');
  const isHideLayout = isAdminPath || isClassroomPath;

 return (
 <div className="flex flex-col min-h-screen">
 <Toaster position="top-right" toastOptions={{ className: ' ' }} />
 {!isHideLayout && <Navbar />}
  <div className="flex-grow w-full max-w-full overflow-hidden">
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="wheel-and-hamster" role="img" aria-label="Loading...">
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>
  }>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/resources" element={<Resources />} />
  <Route path="/courses" element={<Courses />} />
  <Route path="/courses/:courseId" element={<CourseDetails />} />
  <Route path="/classroom/:courseId" element={<CourseClassroom />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/verify" element={<Verification />} />
  <Route path="/practice" element={<Practice />} />
  </Routes>
  </Suspense>
  </div>
  {!isHideLayout && <Footer />}
  {!isHideLayout && <AIAssistant />}
 </div>
 );
};

const App: React.FC = () => {
  return (
   <HelmetProvider>
   <Router>
    <ScrollToTop />
    <AppContent />
   </Router>
   </HelmetProvider>
  );
};

export default App;
