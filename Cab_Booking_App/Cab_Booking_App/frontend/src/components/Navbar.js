import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-primary text-secondary p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 tracking-tighter">
                <Car size={32} className="text-accent" />
                <span>CABBY</span>
            </Link>
            <div className="flex gap-6 items-center">
                {user ? (
                    <>
                        {user.role === 'RIDER' && (
                            <Link to="/" className="hover:text-accent transition-colors font-medium">Book Ride</Link>
                        )}
                        {user.role === 'RIDER' && (
                            <Link to="/rider-dashboard" className="hover:text-accent transition-colors font-medium">My Rides</Link>
                        )}
                        {user.role === 'DRIVER' && (
                            <Link to="/driver" className="hover:text-accent transition-colors font-medium">Dashboard</Link>
                        )}
                        <span className="flex items-center gap-2 text-white/80"><User size={18} /> {user.name}</span>
                        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-accent transition-colors font-medium">Login</Link>
                        <Link to="/register" className="bg-accent hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition-all shadow-lg">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
