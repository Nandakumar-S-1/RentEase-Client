import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
                type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
            }`}>
                {type === 'success' ? (
                    <CheckCircle className="text-green-500" size={20} />
                ) : (
                    <XCircle className="text-red-500" size={20} />
                )}
                
                <p className="text-sm font-medium">{message}</p>
                
                <button 
                    onClick={onClose}
                    className="ml-4 p-1 rounded-lg hover:bg-black/5 transition-colors"
                >
                    <X size={16} className="opacity-50" />
                </button>
            </div>
        </div>
    );
};
