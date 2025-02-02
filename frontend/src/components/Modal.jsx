import React from 'react';
import { CircleX } from 'lucide-react';

function Modal({ onClose, children }) {
    return (
        <div className="fixed inset-0 bg-blue bg-opacity-100 backdrop-blur-sm flex justify-center items-center">
            <div className="mt-10 flex flex-col gap-5 text-white">
                <button onClick={onClose} className="place-self-end">
                    <CircleX size={30} />
                </button>
                <div className="bg-blue-500 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4">
                    {children} 
                </div>
            </div>
        </div>
    );
}

export default Modal;
