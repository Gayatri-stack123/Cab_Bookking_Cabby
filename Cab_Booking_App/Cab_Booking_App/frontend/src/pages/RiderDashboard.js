import React, { useState, useEffect } from 'react';
import { rideService } from '../services/api';
import { motion } from 'framer-motion';
import { Car, Clock, MapPin, CheckCircle, Star, Loader, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RiderDashboard = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await rideService.getRiderHistory();
                setHistory(response.data);
            } catch (err) {
                setError('Failed to fetch ride history.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-extrabold text-primary mb-2">My Rides</h1>
                <p className="text-gray-500 text-lg">Track your activity and manage your trip history.</p>
            </motion.div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0.1 }}
                            animate={{ scale: 1, opacity: 0.1 }}
                            className="absolute -right-10 -bottom-10"
                        >
                            <Car size={200} />
                        </motion.div>
                        <h2 className="text-xl font-bold mb-6 relative z-10">Total Trips</h2>
                        <p className="text-7xl font-black mb-2 relative z-10">{history.length}</p>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs relative z-10">All time</p>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                        <Clock className="text-accent" /> Ride History
                    </h2>
                    
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] p-20 text-center">
                                <p className="text-gray-400 text-lg font-medium">No rides booked yet. Start your journey today!</p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="mt-6 text-accent font-bold hover:underline flex items-center gap-2 mx-auto"
                                >
                                    Book your first ride <ArrowRight size={18} />
                                </button>
                            </div>
                        ) : (
                            history.map((ride) => (
                                <motion.div
                                    key={ride.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
                                >
                                    <div className="bg-gray-50 p-4 rounded-2xl text-primary font-black text-xl">
                                        #{ride.id}
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={14} className="text-accent" />
                                            <p className="text-sm font-bold text-gray-700">{ride.pickupLocation} <span className="text-gray-300 mx-2">→</span> {ride.dropLocation}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                                            <span className={`px-3 py-1 rounded-full ${
                                                ride.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {ride.status}
                                            </span>
                                            <span className="text-gray-400">₹{ride.fare.toFixed(2)} • {ride.distance}km</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {ride.status === 'COMPLETED' ? (
                                            <button 
                                                onClick={() => navigate(`/rate/${ride.id}`)}
                                                className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 p-3 rounded-xl transition-colors"
                                            >
                                                <Star size={20} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => navigate(`/payment/${ride.id}`)}
                                                className="bg-accent text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
