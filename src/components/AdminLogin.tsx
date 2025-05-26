import React, { useState } from 'react';
import type { FormEvent } from 'react'; // Import types separately

// Define the props this component expects
interface AdminLoginProps {
    onLogin: (credentials: { username: string; password: string }) => void; // Function to call on login attempt
    loginError: string | null; // Error message to display
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, loginError }) => {
    // State for login form inputs (managed locally)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        onLogin({ username, password }); // Call the prop function with credentials
    };

    return (
        <section id="admin-login" className="mb-12 bg-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
            <form id="login-form" className="space-y-4 max-w-sm mx-auto" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username:</label>
                    <input
                        type="text"
                        id="username"
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
               <button type="submit" className="w-full bg-gray-600 text-white p-3 rounded-md font-semibold hover:bg-gray-700 transition duration-200">Login</button>
            </form>
           {/* Display login error message if it exists */}
           {loginError && <p id="login-message" className="mt-4 text-center text-red-600">{loginError}</p>}
        </section>
    );
};

export default AdminLogin;
