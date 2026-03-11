import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(credentials);
            login({ email: credentials.email, role: response.data.role, name: response.data.name }, response.data.token);
            navigate('/');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
            >
                <div className="flex justify-center mb-8">
                    <div className="bg-accent p-4 rounded-full shadow-lg">
                        <LogIn size={40} className="text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center mb-8 text-primary">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button className="w-full bg-primary hover:bg-gray-900 text-white font-bold py-4 rounded-xl shadow-xl transform active:scale-95 transition-all text-lg">
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
