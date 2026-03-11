import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus, Car, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '', phone: '', role: 'RIDER' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(userData);
            navigate('/login');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100"
            >
                <div className="flex justify-center mb-8">
                    <div className="bg-accent p-4 rounded-full shadow-lg">
                        <UserPlus size={40} className="text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center mb-6 text-primary">Join the Community</h2>

                {/* Role Switcher */}
                <div className="flex gap-4 mb-8">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${userData.role === 'RIDER' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setUserData({ ...userData, role: 'RIDER' })}
                    >
                        <User size={20} /> Rider
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${userData.role === 'DRIVER' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        onClick={() => setUserData({ ...userData, role: 'DRIVER' })}
                    >
                        <Car size={20} /> Driver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                            placeholder="John Doe"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                            placeholder="+1 234 567 890"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button className="col-span-2 bg-accent hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl transform active:scale-95 transition-all text-lg mt-4">
                        Create Account
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
