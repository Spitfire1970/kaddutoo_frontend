import { useState, lazy, Suspense } from 'react';
import Header from './components/Header';
import Titlecard from './components/Titlecard';
import ColoredLink from './components/ColoredLink';
import Project from './components/Project';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Goodstuff from './pages/Goodstuff';
import Favourites from './pages/Favourites';
import Login from './pages/Login';
import Donation from './pages/Donation';
import Logs from './pages/Logs';
import Todos from './pages/Todos';
import Projects from './pages/Projects';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const Gallery = lazy(() => import('./pages/Gallery'));

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [hash, setHash] = useState(null);
  const location = useLocation();
  const all_pages = ['gallery', 'blogs', 'favourites', 'projects', 'quotes', 'logs'];
  const admin_pages = ['to do'];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-serif">
      <Header />
      <Titlecard />
      <nav className="flex flex-wrap justify-center items-center mb-4 px-2 -my-1">
        {all_pages.map((page, index) => (
          <div key={page} className="flex items-center my-1">
            <ColoredLink
              to={`/${page.split(" ").join("")}`}
              className="text-lg md:text-[2.4vw] lg:text-[1.6vw] px-2.5 hover:py-0.5 hover:px-2 hover:border-2 hover:border-white transition-all duration-200 lg:py-1"
            >
              {page}
            </ColoredLink>
            {((admin_pages.length === 0 || user !== "admin") && index + 1 === all_pages.length) ?
              null :
              <span className="mx-1.5 font-bold text-lg">|</span>
            }
          </div>
        ))}
        {user === 'admin' && admin_pages.map((page, index) => (
          <div key={page} className="flex items-center my-1">
            <ColoredLink
              to={`/${page.split(" ").join("")}`}
              className="text-lg md:text-[1.6vw] px-2.5 hover:py-0.5 hover:px-2 hover:border-2 hover:border-white transition-all duration-200 lg:py-1"
            >
              {page}
            </ColoredLink>
            {index + 1 === admin_pages.length ?
              null :
              <span className="mx-1.5 font-bold text-lg">|</span>
            }
          </div>
        ))}
      </nav>
      <main className="flex-1 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Home />
            </Suspense>
          } />
          <Route path="/login" element={<Login setUser={setUser} setHash={setHash} />} />
          <Route path="/gallery" element={
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <Gallery />
            </Suspense>
          } />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/quotes" element={<Goodstuff />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/todo" element={<Todos />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:title" element={<Project url={location.pathname.split('/')[2]} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;