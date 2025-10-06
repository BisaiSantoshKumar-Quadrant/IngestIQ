цыimport React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const carouselItems = [
        {
            id: 1,
            image: "/images/user1.jpg",
            title: "Comprehensive Assessment Platform",
            description: "Take tests, track progress, and improve your skills with our interactive platform"
        },
        {
            id: 2,
            image: "/images/charts-boy.jpg",
            title: "Powerful Admin Tools",
            description: "Easily manage assessments and track user performance with detailed analytics"
        },
        {
            id: 3,
            image: "/images/exampic.jpg",
            title: "Complete User Management",
            description: "Promote users, analyze metrics, and monitor assessment results across your organization"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleGetStarted = async () => {
        try {
            const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/IsManagerPresent");
            
            if (response.data === true) {
                navigate("/register");
            } else {
                navigate("/manager-register");
            }
        } catch (error) {
            toast.error("Failed to check manager status", {
                position: "top-right",
                autoClose: 4000,
            });
            console.error("Error checking manager status:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Toast Container */}
            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Header */}
            <header className="bg-white shadow-md fixed w-full z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="logo.png" alt="Logo" className="h-8 w-auto" />
                        <h1 className="text-xl font-bold text-gray-800 ml-2">Assessment</h1>
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="#home" className="text-gray-700 hover:text-violet-600 transition duration-300">Home</a>
                        <a href="#features" className="text-gray-700 hover:text-violet-600 transition duration-300">About</a>
                        <a href="#videos" className="text-gray-700 hover:text-violet-600 transition duration-300">Videos</a>
                        <a href="#contact" className="text-gray-700 hover:text-violet-600 transition duration-300">Contact</a>
                    </nav>
                    {/* Hamburger Button */}
                    <button
                        className="md:hidden focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    {/* Login Button (Desktop) */}
                    <a href="/login" className="hidden md:block bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition duration-300">
                        Login
                    </a>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white shadow-md">
                        <nav className="flex flex-col items-center space-y-4 py-4">
                            <a href="#home" className="text-gray-700 hover:text-violet-600 transition duration-300" onClick={toggleMobileMenu}>Home</a>
                            <a href="#features" className="text-gray-700 hover:text-violet-600 transition duration-300" onClick={toggleMobileMenu}>About</a>
                            <a href="#videos" className="text-gray-700 hover:text-violet-600 transition duration-300" onClick={toggleMobileMenu}>Videos</a>
                            <a href="#contact" className="text-gray-700 hover:text-violet-600 transition duration-300" onClick={toggleMobileMenu}>Contact</a>
                            <a href="/login" className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition duration-300" onClick={toggleMobileMenu}>
                                Login
                            </a>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-16">
                {/* Hero Carousel */}
                <section id="home" className="relative h-96 md:h-screen max-h-screen">
                    <div className="relative h-full overflow-hidden">
                        {carouselItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white px-4">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">{item.title}</h2>
                                        <p className="text-lg md:text-xl mb-8 text-white">{item.description}</p>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleGetStarted();
                                            }}
                                            className="bg-purple-400 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition duration-300 inline-block"
                                        >
                                            Get Started
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                    <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                        {carouselItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-violet-100 p-4 rounded-full inline-block mb-4">
                                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">User Assessment Management</h3>
                                <p className="text-gray-600">
                                    Take assessments at your convenience, track your progress, and review your completed test scores. Our user-friendly interface makes exam preparation simple and effective.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-violet-100 p-4 rounded-full inline-block mb-4">
                                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Admin Content & Results Management</h3>
                                <p className="text-gray-600">
                                    Easily upload and manage assessment questions. View comprehensive user performance data filtered by user information or assessment name with our powerful admin tools.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-violet-100 p-4 rounded-full inline-block mb-4">
                                    <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Manager User Administration</h3>
                                <p className="text-gray-600">
                                    Comprehensive user management system allows managers to promote users, analyze performance metrics, and monitor assessment results across the entire organization.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Videos Section */}
                <section id="videos" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Watch Our Videos</h2>
                        <div className="grid grid-cols-1 gap-8">
                            {[1].map((video) => (
                                <div key={video} className="rounded-lg overflow-hidden shadow-lg">
                                    <div className="relative pb-9/16 h-0">
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover"
                                            poster="/video-thumbnail2.png"
                                            controls
                                        >
                                            <source src="QAssessment_tutorial.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 relative">
                            Get In Touch
                            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-violet-600 rounded"></span>
                        </h2>
                        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center group">
                                    <div className="bg-violet-100 p-4 rounded-full inline-block mb-4 group-hover:bg-violet-200 transition-colors duration-300">
                                        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Phone</h3>
                                    <p className="text-gray-600 hover:text-violet-600 transition-colors duration-300">+91 8639990377</p>
                                </div>
                                <div className="text-center group">
                                    <div className="bg-violet-100 p-4 rounded-full inline-block mb-4 group-hover:bg-violet-200 transition-colors duration-300">
                                        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Email</h3>
                                    <p className="text-gray-600 hover:text-violet-600 transition-colors duration-300">admin@qassessment.com</p>
                                </div>
                                <div className="text-center group">
                                    <div className="bg-violet-100 p-4 rounded-full inline-block mb-4 group-hover:bg-violet-200 transition-colors duration-300">
                                        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Address</h3>
                                    <p className="text-gray-600 hover:text-violet-600 transition-colors duration-300">IT SEZ Madikonda, Warangal, Telangana, India</p>
                                </div>
                            </div>
                            <div className="mt-10 text-center">
                                <a
                                    href="mailto:admin@qassessment.com"
                                    className="inline-block w-full max-w-xs bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Send Us an Email
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Brand Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center mb-6">
                                <img src="logo.png" alt="Logo" className="h-12 w-auto mr-3 transform hover:scale-105 transition duration-300" />
                                <h3 className="text-3xl font-bold text-violet-300">Assessment</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed text-center md:text-left max-w-xs">
                                Empowering learning and growth through innovative assessment solutions.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-2xl font-semibold text-violet-300 mb-6 relative">
                                Quick Links
                                <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-12 h-1 bg-violet-600 rounded"></span>
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#home" className="text-gray-300 hover:text-violet-400 transition duration-300 flex items-center group">
                                        <svg className="w-5 h-5 mr-2 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                        </svg>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="text-gray-300 hover:text-violet-400 transition duration-300 flex items-center group">
                                        <svg className="w-5 h-5 mr-2 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#videos" className="text-gray-300 hover:text-violet-400 transition duration-300 flex items-center group">
                                        <svg className="w-5 h-5 mr-2 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Videos
                                    </a>
                                </li>
                                <li>
                                    <a href="#contact" className="text-gray-300 hover:text-violet-400 transition duration-300 flex items-center group">
                                        <svg className="w-5 h-5 mr-2 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-2xl font-semibold text-violet-300 mb-6 relative">
                                Follow Us
                                <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-12 h-1 bg-violet-600 rounded"></span>
                            </h3>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-300 hover:text-violet-400 transition duration-300 transform hover:scale-110">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-violet-400 transition duration-300 transform hover:scale-110">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-violet-400 transition duration-300 transform hover:scale-110">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-violet-400 transition duration-300 transform hover:scale-110">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                        <p>┬й {new Date().getFullYear()} QAssessment. All rights reserved.</p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <a href="#" className="hover:text-violet-400 transition duration-300">Privacy Policy</a>
                            <a href="#" className="hover:text-violet-400 transition duration-300">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const styles = `
.pb-9\\/16 {
  padding-bottom: 56.25%;
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default LandingPage;цы"(df827892e37d4c420fb7f81b9f959ede8bab66d92Юfile:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/pages/LandingPage.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final