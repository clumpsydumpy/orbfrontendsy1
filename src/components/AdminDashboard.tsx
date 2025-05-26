import React, { type JSX } from 'react';

// Define interfaces for data structures (can be imported)
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

interface CartItem extends Bouquet {}

interface Order {
    id: number; // This will serve as the Order ID
    customerName: string;
    customerAddress: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Completed';
}

// Define the props this component expects
interface AdminDashboardProps {
    stock: Stock; // Current stock levels
    bouquets: Bouquet[]; // Bouquet data (needed for recipes)
    orders: Order[]; // List of orders
    reserveBouquets: number; // Reserve amount for low stock check
    onUpdateStock: (ingredient: string, newAmount: number) => void; // Function to update stock
    onMarkCompleted: (orderId: number) => void; // Function to mark order as completed
    onLogout: () => void; // Function to handle logout
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    stock,
    bouquets,
    orders,
    reserveBouquets,
    onUpdateStock,
    onMarkCompleted,
    onLogout
}) => {

    // Function to check and display low stock notifications
    const renderLowStockNotifications = () => {
        let lowStockNotifications: JSX.Element[] = [];

        bouquets.forEach(bouquet => {
            let canMakeReserve = true;
            for (const ingredient in bouquet.recipe) {
                const required = bouquet.recipe[ingredient] * reserveBouquets;
                if (stock[ingredient] === undefined || stock[ingredient] < required) {
                    canMakeReserve = false;
                    break;
                }
            }

            if (!canMakeReserve) {
                lowStockNotifications.push(
                    <span key={bouquet.id} className="text-red-600">Low stock alert: Cannot make {reserveBouquets} "{bouquet.name}" bouquets.</span>
                );
            }
        });

        if (lowStockNotifications.length === 0) {
             return <p>All stock levels are sufficient to meet the reserve.</p>;
        }

        return <>{lowStockNotifications.map((notification, index) => <div key={index}>{notification}</div>)}</>;
    };

     // Function to render bouquet recipes
     const renderBouquetRecipes = () => {
         return (
             <>
                 <br/>
                 Bouquet Recipes:<br/>
                 {bouquets.map(bouquet => (
                     <div key={`${bouquet.id}-recipe`}>
                         <strong>{bouquet.name}:</strong> {Object.entries(bouquet.recipe).map(([ingredient, quantity]) => `${quantity} ${ingredient}`).join(', ')}
                     </div>
                 ))}
             </>
         );
     };


    return (
        <section id="admin-section" className="mb-12 bg-yellow-100 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard (Simulated)</h2>

            {/* Stock Status & Recipes */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-center">Stock Status & Recipes</h3>
                <div id="stock-status" className="text-center text-xl font-medium mb-4">
                    Current Stock Levels:<br/>
                    {/* Display current stock with input fields for editing */}
                    {Object.entries(stock).map(([ingredient, amount]) => (
                        <div key={ingredient} className="flex items-center justify-center mb-2">
                            <span className="font-semibold mr-2">{ingredient}:</span>
                            <input
                                type="number"
                                className="stock-input"
                                value={amount}
                                min="0"
                                // Update stock directly on change for simplicity in this simulation
                                onChange={(e) => onUpdateStock(ingredient, parseInt(e.target.value, 10))}
                            />
                            {/* Note: In a real app, you might have a separate update button */}
                        </div>
                    ))}
                    <br/>
                    {renderLowStockNotifications()}
                    {renderBouquetRecipes()}
                </div>
            </div>

            {/* Orders to Prepare */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-center">Orders to Prepare</h3>
                <div id="orders-to-prepare-list">
                    {/* Conditionally render no orders message or the list of orders */}
                    {orders.length === 0 ? (
                        <p id="no-orders-message" className="text-gray-500 text-center">No orders currently.</p>
                    ) : (
                        // Map over the orders array to display each order
                        orders.map(order => (
                            <div key={order.id} className={`bg-white p-4 rounded-lg shadow-md mb-4 ${order.status === 'Completed' ? 'order-completed' : ''}`}>
                                <h4 className="text-xl font-semibold mb-2">Order #{order.id}</h4> {/* Display Order ID */}
                                <p><strong>Customer:</strong> {order.customerName}</p>
                                <p><strong>Address:</strong> {order.customerAddress}</p>
                                <p><strong>Items:</strong></p>
                                <ul>
                                    {/* Display items within the order */}
                                    {Object.entries(order.items.reduce((quantities, item) => {
                                        quantities[item.id] = (quantities[item.id] || 0) + 1;
                                        return quantities;
                                    }, {} as { [key: string]: number })).map(([itemId, quantity]) => {
                                        const bouquet = bouquets.find(b => b.id === itemId);
                                        return bouquet ? <li key={itemId}>{bouquet.name} (x{quantity})</li> : null;
                                    })}
                                </ul>
                                <p className="mt-2"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                                <p><strong>Status:</strong> <span className="order-status">{order.status}</span></p>
                                {/* Conditionally render "Mark as Completed" button */}
                                {order.status === 'Pending' && (
                                    <button
                                        className="mark-completed-btn mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200"
                                        onClick={() => onMarkCompleted(order.id)} // Call the prop function on click
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Logout Button */}
            <button
                id="admin-logout-btn"
                className="w-full bg-red-500 text-white p-3 rounded-md font-semibold hover:bg-red-600 transition duration-200"
                onClick={onLogout} // Call the prop function on click
            >
                Logout
            </button>
        </section>
    );
};

export default AdminDashboard;
