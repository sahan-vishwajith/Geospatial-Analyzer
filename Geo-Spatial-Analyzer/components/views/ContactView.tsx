import React, { useState } from 'react';
import { EnvelopeIcon, UserIcon } from '../icons/Icons';

const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate backend call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <div 
        className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 mt-8"
      >
        {submitted ? (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-cyan-400">Thank You!</h2>
                <p className="mt-2 text-gray-300">Your message has been sent. We'll get back to you shortly.</p>
                 <button
                    onClick={resetForm}
                    className="mt-6 py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition duration-300"
                 >
                    Send Another Message
                </button>
            </div>
        ) : (
            <>
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <EnvelopeIcon className="w-12 h-12 text-cyan-400"/>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Contact Us</h1>
                    <p className="mt-2 text-gray-400">Have questions? We'd love to hear from you.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Your Name"
                        disabled={isLoading}
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        className="w-full pl-10 pr-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Your Email"
                        disabled={isLoading}
                        />
                    </div>
                    <div>
                        <textarea
                            id="contact-message"
                            name="message"
                            rows={4}
                            required
                            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Your Message"
                            disabled={isLoading}
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    
                    <div>
                        <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                        {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default ContactView;