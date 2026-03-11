import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ratingService } from '../services/api';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, CheckCircle, Loader } from 'lucide-react';

const Rating = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            await ratingService.submitRating({
                rideId: Number(rideId),
                rating,
                comment
            });
            setIsSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError('Failed to submit rating. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-yellow-100 text-yellow-600 p-8 rounded-full mb-6"
                >
                    <CheckCircle size={64} />
                </motion.div>
                <h1 className="text-4xl font-black text-primary mb-4">Awesome!</h1>
                <p className="text-gray-500 max-w-md mb-10">Your feedback helps us make Cabby better for everyone. Redirecting you home...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 lg:p-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-gray-100"
            >
                <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Star size={40} fill="currentColor" />
                </div>
                
                <h1 className="text-4xl font-black text-primary mb-2">How was your ride?</h1>
                <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">Share your experience for Ride #{rideId}</p>

                <div className="flex justify-center gap-3 mb-12">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-2 transition-all transform hover:scale-125 ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                        >
                            <Star size={48} fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        </button>
                    ))}
                </div>

                <div className="relative mb-10">
                    <div className="absolute top-4 left-4 text-gray-300">
                        <MessageSquare size={18} />
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment (optional)..."
                        className="w-full bg-gray-50 border border-transparent focus:border-accent focus:bg-white rounded-2xl p-4 pl-12 text-gray-700 min-h-[120px] transition-all outline-none text-lg font-medium"
                    />
                </div>

                {error && (
                    <p className="text-red-500 bg-red-50 p-4 rounded-2xl mb-6 text-center text-sm font-bold">{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-gray-800 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-2xl shadow-gray-200 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                    {isSubmitting ? <Loader className="animate-spin" /> : <Send size={20} />}
                    {isSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
                
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-gray-400 font-bold hover:text-primary transition-colors"
                >
                    Skip for now
                </button>
            </motion.div>
        </div>
    );
};

export default Rating;
