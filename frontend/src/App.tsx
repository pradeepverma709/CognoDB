import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Movies } from './pages/Movies';
import { MovieDetail } from './pages/MovieDetail';
import { ActorDetail } from './pages/ActorDetail';
import { DirectorDetail } from './pages/DirectorDetail';
import { GenreExplorer } from './pages/GenreExplorer';
import { Recommendations } from './pages/Recommendations';
import { SimilarUsers } from './pages/SimilarUsers';
import { Analytics } from './pages/Analytics';
import { SearchPage } from './pages/SearchPage';
import { Actors } from './pages/Actors';
import { Directors } from './pages/Directors';
import { User } from './types';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>({
    id: 'u1',
    name: 'Alex Mercer',
    email: 'alex@example.com'
  });

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans">
        <Navbar selectedUser={selectedUser} onSelectUser={setSelectedUser} />

        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <Sidebar />

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard selectedUser={selectedUser} />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/actors/:id" element={<ActorDetail />} />
              <Route path="/directors" element={<Directors />} />
              <Route path="/directors/:id" element={<DirectorDetail />} />
              <Route path="/genres" element={<GenreExplorer />} />
              <Route path="/recommendations" element={<Recommendations selectedUser={selectedUser} />} />
              <Route path="/similar-users" element={<SimilarUsers selectedUser={selectedUser} />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
