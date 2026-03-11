import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Car, Loader, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { rideService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import LocationInput from '../components/LocationInput';

const FARE_PER_KM = 20;

const geocode = async (address) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (!data.length) throw new Error(`Location not found: "${address}"`);
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
};

const getRoute = async (pickup, drop) => {
    const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.code !== 'Ok') throw new Error('Route not found between these locations');
    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceKm = parseFloat((data.routes[0].distance / 1000).toFixed(2));
    return { coords, distanceKm };
};

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'DRIVER') {
            navigate('/driver');
        }
    }, [user, navigate]);
    const [pickup, setPickup] = useState({ value: '', coords: null });
    const [drop, setDrop] = useState({ value: '', coords: null });
    const [route, setRoute] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [distance, setDistance] = useState(null);
    const [fare, setFare] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState('');
    const [rideBooked, setRideBooked] = useState(null);

    const handleFindRoute = async () => {
        if (!pickup.value.trim() || !drop.value.trim()) {
            setError('Please enter both pickup and drop locations.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRoute(null);
        setDistance(null);
        setFare(null);
        setRideBooked(null);
        setPickupCoords(null);
        setDropCoords(null);
        try {
            // Use pre-resolved coords from autocomplete, or geocode on the fly
            const pCoords = pickup.coords ?? (await geocode(pickup.value));
            const dCoords = drop.coords ?? (await geocode(drop.value));
            setPickupCoords(pCoords);
            setDropCoords(dCoords);
            const { coords, distanceKm } = await getRoute(pCoords, dCoords);
            setRoute(coords);
            setDistance(distanceKm);
            setFare((distanceKm * FARE_PER_KM).toFixed(2));
        } catch (err) {
            setError(err.message || 'Failed to find route. Please check the locations and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookRide = async () => {
        if (!user) {
            setError('Please login to book a ride.');
            return;
        }
        setIsBooking(true);
        setError('');
        try {
            const response = await rideService.bookRide({
                pickupLocation: pickup.value,
                dropLocation: drop.value,
                pickupLat: pickupCoords.lat,
                pickupLng: pickupCoords.lng,
                dropLat: dropCoords.lat,
                dropLng: dropCoords.lng,
            });
            setRideBooked(response.data);
        } catch (err) {
            setError('Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    if (user?.role === 'DRIVER') {
        return null; // Prevents flicker before redirect
    }

    return (
        <div className="relative min-h-[90vh]">
            {/* Hero Section — overflow-visible so the autocomplete dropdown is not clipped */}
            <div className="bg-primary text-white p-12 lg:p-20 flex flex-col items-center justify-center text-center relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                />
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl lg:text-7xl font-extrabold mb-6 z-10 tracking-tighter"
                >
                    Request a ride now
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl lg:text-2xl text-gray-300 max-w-2xl mb-12 z-10"
                >
                    Get where you need to go with Cabby. Reliable rides at the touch of a button.
                </motion.p>

                {/* Booking Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl text-left grid lg:grid-cols-11 gap-4 items-end border border-gray-100 relative z-20"
                >
                    <div className="lg:col-span-4">
                        <label className="text-gray-500 font-bold text-sm uppercase mb-2 block">
                            Pickup Location
                        </label>
                        <LocationInput
                            placeholder="Where from?"
                            value={pickup.value}
                            icon={MapPin}
                            iconClassName="text-accent"
                            onChange={(value, coords) => setPickup({ value, coords })}
                        />
                    </div>
                    <div className="lg:col-span-1 hidden lg:flex justify-center pb-4 text-gray-300">
                        <Navigation size={24} />
                    </div>
                    <div className="lg:col-span-4">
                        <label className="text-gray-500 font-bold text-sm uppercase mb-2 block">
                            Drop Location
                        </label>
                        <LocationInput
                            placeholder="Where to?"
                            value={drop.value}
                            icon={Navigation}
                            iconClassName="text-green-500"
                            onChange={(value, coords) => setDrop({ value, coords })}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <button
                            onClick={handleFindRoute}
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-lg flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader size={20} className="animate-spin" />}
                            {isLoading ? 'Finding...' : 'Go'}
                        </button>
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 bg-red-500 text-white px-6 py-3 rounded-xl z-20 max-w-4xl w-full text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </div>

            {/* Map & Ride Info Section */}
            <div className="px-8 lg:px-24 py-10 max-w-7xl mx-auto">
                {(pickupCoords || dropCoords) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-primary">Your Route</h2>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                            <MapView pickupCoords={pickupCoords} dropCoords={dropCoords} route={route} />
                        </div>

                        {distance && fare && !rideBooked && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div className="flex gap-10">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Distance</p>
                                        <p className="text-3xl font-extrabold text-primary">
                                            {distance} <span className="text-base font-normal text-gray-500">km</span>
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Estimated Fare</p>
                                        <p className="text-3xl font-extrabold text-accent">₹{fare}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBookRide}
                                    disabled={isBooking}
                                    className="bg-primary hover:bg-gray-800 disabled:bg-gray-500 text-white font-bold px-10 py-4 rounded-xl shadow-xl transition-all transform active:scale-95 text-lg flex items-center gap-2"
                                >
                                    {isBooking ? <Loader size={20} className="animate-spin" /> : <Car size={20} />}
                                    {isBooking ? 'Booking...' : 'Book Ride'}
                                </button>
                            </motion.div>
                        )}

                        {rideBooked && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 bg-green-50 border border-green-200 rounded-2xl shadow-lg p-8 text-center"
                            >
                                <div className="text-green-500 text-5xl mb-3">✓</div>
                                <h3 className="text-2xl font-bold text-green-700 mb-3">Ride Booked Successfully!</h3>
                                <div className="flex justify-center gap-8 text-gray-700">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Ride ID</p>
                                        <p className="text-xl font-bold">#{rideBooked.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Status</p>
                                        <p className="text-xl font-bold text-accent">{rideBooked.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Fare</p>
                                        <p className="text-xl font-bold">₹{rideBooked.fare?.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/payment/${rideBooked.id}`)}
                                    className="mt-8 bg-accent hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
                                >
                                    Proceed to Payment <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 p-12 lg:p-24 max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-50">
                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-inner">
                        <Car size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Fastest Pickup</h3>
                    <p className="text-gray-600 leading-relaxed">Our smart algorithm assigns the nearest driver to you in seconds.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-50">
                    <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-inner">
                        <Navigation size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Secure Payment</h3>
                    <p className="text-gray-600 leading-relaxed">Seamless cashless transactions with high-level encryption via Stripe.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-50">
                    <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-inner">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Live Tracking</h3>
                    <p className="text-gray-600 leading-relaxed">Track your driver in real-time and share your ride status with ease.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
