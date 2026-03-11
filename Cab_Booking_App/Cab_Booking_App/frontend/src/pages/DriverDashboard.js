import React, { useState, useEffect } from 'react';
import { rideService } from '../services/api';
import { motion } from 'framer-motion';
import { Navigation, Clock, User, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const DriverDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [reqRes, histRes] = await Promise.all([
                rideService.getRequestedRides(),
                rideService.getDriverHistory()
            ]);
            setRequests(reqRes.data);
            setHistory(histRes.data);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptRide = async (rideId) => {
        setActionLoading(rideId);
        setError('');
        try {
            await rideService.acceptRide(rideId);
            await fetchData(); // Refresh data
        } catch (err) {
            setError('Failed to accept ride. It might already be taken.');
        } finally {
            setActionLoading(null);
        }
    };

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
                className="mb-10 flex justify-between items-end"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-primary mb-2">Driver Dashboard</h1>
                    <p className="text-gray-500">Manage your ride requests and track your performance.</p>
                </div>
                <button 
                    onClick={fetchData}
                    disabled={isLoading}
                    className="bg-white border border-gray-200 px-6 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Loader size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </motion.div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Active Requests */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Clock className="text-accent" /> Available Requests
                        </h2>
                        <span className="bg-blue-100 text-accent text-sm font-bold px-3 py-1 rounded-full">
                            {requests.length} New
                        </span>
                    </div>

                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                                No new ride requests available right now.
                            </div>
                        ) : (
                            requests.map((ride) => (
                                <motion.div
                                    key={ride.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-primary font-bold mb-1">
                                                <User size={16} /> {ride.riderName}
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ride #{ride.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-accent">₹{ride.fare.toFixed(2)}</p>
                                            <p className="text-xs text-gray-400 font-bold">{ride.distance} km</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                                            <p className="text-gray-600 text-sm"><span className="font-bold text-gray-400 uppercase text-[10px] block">Pickup</span>{ride.pickupLocation}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                            <p className="text-gray-600 text-sm"><span className="font-bold text-gray-400 uppercase text-[10px] block">Drop</span>{ride.dropLocation}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAcceptRide(ride.id)}
                                        disabled={actionLoading === ride.id}
                                        className="w-full bg-primary hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {actionLoading === ride.id ? <Loader className="animate-spin" size={18} /> : <Navigation size={18} />}
                                        {actionLoading === ride.id ? 'Accepting...' : 'Accept Ride'}
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* History */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> Recent Trips
                    </h2>

                    <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">You haven't completed any rides yet.</p>
                        ) : (
                            history.map((ride) => (
                                <div key={ride.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary">{ride.dropLocation}</p>
                                            <p className="text-xs text-gray-400">{ride.status} • {ride.riderName}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-primary">₹{ride.fare.toFixed(2)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DriverDashboard;
