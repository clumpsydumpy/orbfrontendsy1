import React, { useState, useEffect } from 'react';
import './App.css'; // Import main CSS file

// Import app components from the components folder
import BouquetList from './components/BouquetList';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MessageBox from './components/MessageBox';
import OrderTracking from './components/OrderTracking'; 

// Import image assets
import roseImage from './assets/rose.png';
import sunflowerImage from './assets/sunflower.png'; 


// Define interfaces for data structures (consider moving these to a separate types file like src/types.ts)
interface Ingredient {
    [key: string]: number;
}

interface Bouquet {
    id: string;
    name: string;
    price: number;
    image: string;
    recipe: Ingredient;
}

interface Stock {
    [key: string]: number;
}

interface CartItem extends Bouquet {
    // Cart items are just bouquets for simplicity in this simulation
}

interface Order {
    id: number; // This will serve as the Order ID
    customerName: string;
    customerAddress: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Completed';
}

// --- Simulated Backend Data (temporarily in App) ---

// Initial Stock Levels
const initialStock: Stock = {
    'wrapping paper': 100,
    'ribbon': 100,
    'sunflower': 50,
    'rose': 60,
    'decorative flower': 200
};

// Bouquet Recipes and Prices
const bouquets: Bouquet[] = [
    {
        id: 'sunflower-bouquet',
        name: 'Sunflower Bouquet',
        price: 16.99,
        image: sunflowerImage, // Use the imported local image path
        recipe: {
            'wrapping paper': 1,
            'ribbon': 1,
            'sunflower': 2,
            'decorative flower': 6
        }
    },
    {
        id: 'rose-bouquet',
        name: 'Rose Bouquet',
        price: 18.99,
        image: roseImage, // Use the imported local image path
        recipe: {
            'wrapping paper': 1,
            'ribbon': 1,
            'rose': 2,
            'decorative flower': 6
        }
    }
    // Add more bouquets here
];

// Reserve amount of bouquets to be able to make before low stock notification
const reserveBouquets = 5; // Example: Notify if stock can make less than 5 of *any* bouquet

// Admin Credentials (Simulated)
const adminUser = 'orbital';
const adminPass = '2025';

// --- Main App Component ---
const App: React.FC = () => {
    const currentYear = new Date().getFullYear();
    // --- State Management (remains in App as it's shared across components) ---
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stock, setStock] = useState<Stock>(initialStock);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
    // State to hold the ID of the last placed order for customer confirmation
    const [lastPlacedOrderId, setLastPlacedOrderId] = useState<number | null>(null);


    // --- Effects ---

    // Effect to hide message after a duration (remains in App as it uses message state)
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                // Also clear the last placed order ID when the message box hides
                setLastPlacedOrderId(null);
            }, 5000); // Keep message visible a bit longer to show order ID
            return () => clearTimeout(timer); // Clean up the timer
        }
    }, [message]);

    // Effect to check low stock whenever stock or orders change (for admin view)
    useEffect(() => {
        if (isAdminLoggedIn) {
            console.log("Admin: Stock or Orders changed, simulating low stock check.");
        }
    }, [stock, orders, isAdminLoggedIn]);


    // --- Functions (remain in App as they modify shared state) ---

    // Function to show temporary messages
    const showMessage = (msg: string) => {
        setMessage(msg);
    };

    // Function to handle adding a bouquet to the cart
    const handleAddToCart = (bouquet: Bouquet) => {
        setCart([...cart, bouquet]);
        showMessage(`${bouquet.name} added to cart!`);
    };

    // Function to handle removing an item from the cart
    const handleRemoveFromCart = (bouquetId: string) => {
        const indexToRemove = cart.findIndex(item => item.id === bouquetId);
        if (indexToRemove > -1) {
            const newCart = [...cart];
            newCart.splice(indexToRemove, 1);
            setCart(newCart);
            const removedBouquet = bouquets.find(b => b.id === bouquetId);
            showMessage(`One ${removedBouquet ? removedBouquet.name : 'item'} removed from cart.`);
        }
    };

    // Calculate cart total (derived from state)
    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

     // Function to simulate reducing stock after an order
    const reduceStock = (orderedItems: CartItem[]) => {
        const orderQuantities = orderedItems.reduce((quantities, item) => {
            quantities[item.id] = (quantities[item.id] || 0) + 1;
            return quantities;
        }, {} as { [key: string]: number });

        setStock(prevStock => {
            const newStock = { ...prevStock };
            for (const itemId in orderQuantities) {
                 const bouquet = bouquets.find(b => b.id === itemId);
                 if (bouquet) {
                     const quantityOrdered = orderQuantities[itemId];
                     for (const ingredient in bouquet.recipe) {
                         if (newStock[ingredient] !== undefined) {
                             newStock[ingredient] -= bouquet.recipe[ingredient] * quantityOrdered;
                             if (newStock[ingredient] < 0) newStock[ingredient] = 0; // Prevent negative stock
                         }
                     }
                 }
            }
            return newStock;
        });
    };


    // Function to handle order form submission
    const handleOrderSubmit = (orderData: {
        customerName: string;
        customerAddress: string;
        paymentMethod: string;
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    }) => {
        if (cart.length === 0) {
            showMessage('Your cart is empty. Please add items before placing an order.');
            return;
        }

        // Simulate stock reduction based on the current cart
        reduceStock(cart);

        // Generate a unique order ID (using Date.now() for simplicity)
        const newOrderId = Date.now();

        // Create an order object
        const newOrder: Order = {
            id: newOrderId, // Assign the generated ID
            customerName: orderData.customerName,
            customerAddress: orderData.customerAddress,
            items: JSON.parse(JSON.stringify(cart)), // Deep copy of cart items
            total: cartTotal,
            status: 'Pending' // Initial status
        };

        setOrders([...orders, newOrder]); // Add the new order to the orders array
        setLastPlacedOrderId(newOrderId); // Store the ID of the placed order

        // Simulate order processing log
        console.log('--- Order Placed ---');
        console.log('Order ID:', newOrder.id);
        console.log('Customer:', newOrder.customerName);
        console.log('Address:', newOrder.customerAddress);
        console.log('Items:', newOrder.items.map(item => item.name));
        console.log('Total:', newOrder.total.toFixed(2));
        console.log('Payment Method:', orderData.paymentMethod);
        console.log('----------------------');


        // Clear cart after successful order
        setCart([]);
        // Form clearing logic is now handled within the OrderForm component

        // Show confirmation message with the order ID
        showMessage(`Order placed successfully! Your Order ID is: ${newOrderId} (Simulated)`);
    };


    // Function to handle admin login attempt
    const handleLogin = (credentials: { username: string; password: string }) => {
        if (credentials.username === adminUser && credentials.password === adminPass) {
            setIsAdminLoggedIn(true);
            setAdminLoginError(null);
            showMessage('Admin login successful!');
        } else {
            setAdminLoginError('Invalid username or password.');
            showMessage('Admin login failed.');
        }
    };

    // Function to handle admin logout
    const handleLogout = () => {
        setIsAdminLoggedIn(false);
        setAdminLoginError(null);
        showMessage('Admin logged out.');
    };

    // Function to handle stock updates from admin input
    const handleUpdateStock = (ingredient: string, newAmount: number) => {
        if (stock[ingredient] !== undefined && newAmount >= 0) {
            setStock(prevStock => ({
                ...prevStock,
                [ingredient]: newAmount
            }));
            showMessage(`${ingredient} stock updated to ${newAmount}.`);
        } else if (newAmount < 0) {
             showMessage("Stock amount cannot be negative.");
        } else {
             console.error("Invalid ingredient or amount for stock update.");
             showMessage("Error updating stock.");
        }
    };

    // Function to handle marking an order as completed
    const handleMarkCompleted = (orderId: number) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: 'Completed' } : order
        ));
        showMessage(`Order #${orderId} marked as completed.`);
    };

    // --- Render Logic ---
    return (
        <div className="bg-gray-100 text-gray-800">
            {/* Render the MessageBox component */}
            <MessageBox message={message} />

            <header className="bg-green-600 text-white p-6 text-center rounded-b-lg shadow-md">
                <h1 className="text-4xl font-bold">DNAFloraison</h1>
                <p className="text-lg mt-2">Beautiful Bouquets for Every Occasion</p>
            </header>

            <main className="container mx-auto p-6">

                {/* Render the BouquetList component and pass props */}
                <section id="bouquets" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-center">Our Bouquets</h2>
                    <BouquetList bouquets={bouquets} onAddToCart={handleAddToCart} />
                </section>

                {/* Render the Order Section */}
                <section id="order" className="mb-12 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-semibold mb-6 text-center">Place Your Order</h2>
                    {/* Render the Cart component and pass the CORRECT props */}
                    <Cart cart={cart} cartTotal={cartTotal} onRemoveItem={handleRemoveFromCart} />
                    {/* Render the OrderForm component and pass props */}
                    <OrderForm cartTotal={cartTotal} onOrderSubmit={handleOrderSubmit} />

                    {/* Display last placed order ID for customer tracking (optional, can be placed elsewhere) */}
                    {lastPlacedOrderId && (
                        <div className="mt-4 text-center text-lg font-semibold text-green-700">
                            Your Order ID for tracking is: {lastPlacedOrderId}
                        </div>
                    )}
                </section>

                {/* Render the Order Tracking Section */}
                <OrderTracking orders={orders} /> {/* Pass the orders list to the tracking component */}


                {/* Conditionally render AdminLogin or AdminDashboard based on isAdminLoggedIn state */}
                {isAdminLoggedIn ? (
                    // Render AdminDashboard and pass necessary props
                    <AdminDashboard
                        stock={stock}
                        bouquets={bouquets} // Pass bouquets for recipes
                        orders={orders}
                        reserveBouquets={reserveBouquets}
                        onUpdateStock={handleUpdateStock}
                        onMarkCompleted={handleMarkCompleted}
                        onLogout={handleLogout}
                    />
                ) : (
                    // Render AdminLogin and pass necessary props
                    <AdminLogin onLogin={handleLogin} loginError={adminLoginError} />
                )}
            </main>

            <footer className="bg-gray-800 text-white p-6 text-center mt-12 rounded-t-lg">
                <p>&copy; {currentYear} DNAFloraison. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
