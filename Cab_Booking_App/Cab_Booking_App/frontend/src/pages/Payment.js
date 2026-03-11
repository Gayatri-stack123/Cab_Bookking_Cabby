import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, ShieldCheck, Loader, ArrowRight, Smartphone, IndianRupee } from 'lucide-react';

const Payment = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('STRIPE'); // STRIPE or PHONEPE

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');
        try {
            if (paymentMethod === 'STRIPE') {
                await paymentService.createIntent(rideId);
            } else {
                await paymentService.initiatePhonePe(rideId);
            }
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Confirm payment on backend
            await paymentService.confirmPayment(rideId, paymentMethod);
            
            setIsSuccess(true);
        } catch (err) {
            setError('Payment processing failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-100 text-green-600 p-8 rounded-full mb-6"
                >
                    <CheckCircle size={64} />
                </motion.div>
                <h1 className="text-4xl font-black text-primary mb-4">Payment Successful!</h1>
                <p className="text-gray-500 max-w-md mb-10">Your payment for Ride #{rideId} has been processed via {paymentMethod === 'STRIPE' ? 'Stripe' : 'PhonePe'}.</p>
                <button
                    onClick={() => navigate(`/rate/${rideId}`)}
                    className="bg-accent hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl flex items-center gap-2 transition-all transform active:scale-95"
                >
                    Rate Your Ride <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-20">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-primary p-12 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        {paymentMethod === 'STRIPE' ? <CreditCard size={120} /> : <Smartphone size={120} />}
                    </div>
                    <h1 className="text-4xl font-extrabold mb-2 relative z-10">Choose Payment</h1>
                    <p className="text-gray-400 relative z-10 font-bold uppercase tracking-widest text-sm">Ride Reference: #{rideId}</p>
                </div>
                
                <div className="p-12">
                    <div className="flex items-center gap-4 mb-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800">
                        <ShieldCheck className="text-blue-600" />
                        <p className="text-sm font-medium">Securely encrypted {paymentMethod === 'STRIPE' ? 'Stripe' : 'PhonePe'} transaction.</p>
                    </div>

                    {error && (
                        <p className="text-red-500 bg-red-50 p-4 rounded-xl mb-6 text-center font-bold">{error}</p>
                    )}

                    <div className="space-y-4 mb-12">
                        {/* Stripe Option */}
                        <div 
                            onClick={() => setPaymentMethod('STRIPE')}
                            className={`p-6 border-2 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${paymentMethod === 'STRIPE' ? 'border-accent bg-blue-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${paymentMethod === 'STRIPE' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-primary text-lg">Stripe (Card)</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Powered by Stripe</p>
                                </div>
                            </div>
                            {paymentMethod === 'STRIPE' && <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"><CheckCircle size={14} className="text-white" /></div>}
                        </div>

                        {/* PhonePe Option */}
                        <div 
                            onClick={() => setPaymentMethod('PHONEPE')}
                            className={`p-6 border-2 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${paymentMethod === 'PHONEPE' ? 'border-[#6739B7] bg-[#F7F2FF] shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${paymentMethod === 'PHONEPE' ? 'bg-[#6739B7] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <IndianRupee size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-primary text-lg">PhonePe (UPI)</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Fastest UPI Payments</p>
                                </div>
                            </div>
                            {paymentMethod === 'PHONEPE' && <div className="w-6 h-6 rounded-full bg-[#6739B7] flex items-center justify-center"><CheckCircle size={14} className="text-white" /></div>}
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full text-white font-black py-5 rounded-2xl text-xl shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                            paymentMethod === 'STRIPE' ? 'bg-accent hover:bg-blue-700 shadow-blue-100' : 'bg-[#6739B7] hover:bg-[#522d92] shadow-purple-100'
                        }`}
                    >
                        {isProcessing ? <Loader className="animate-spin" /> : <ShieldCheck size={24} />}
                        {isProcessing ? 'Processing Transaction...' : 'Pay Now'}
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-6 text-gray-400 font-bold hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
