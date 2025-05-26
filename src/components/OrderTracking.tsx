import React, { useState } from 'react';

// Define interfaces for data structures (can be imported)
interface Order {
    id: number; // This will serve as the Order ID
    customerName: string;
    customerAddress: string;
    items: any[]; // Simplified for tracking display
    total: number;
    status: 'Pending' | 'Completed';
}

// Define the props this component expects
interface OrderTrackingProps {
    orders: Order[]; // The list of all orders (to find the one being tracked)
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orders }) => {
    // State for the order ID the customer wants to track
    const [trackingOrderId, setTrackingOrderId] = useState('');
    // State to hold the found order details for display
    const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
    // State for tracking error messages
    const [trackingError, setTrackingError] = useState<string | null>(null);

    // Handle input change for the tracking ID
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTrackingOrderId(event.target.value);
        // Clear previous tracking results when input changes
        setTrackedOrder(null);
        setTrackingError(null);
    };

    // Handle tracking button click
    const handleTrackOrder = () => {
        const idToTrack = parseInt(trackingOrderId, 10); // Convert input to number

        // Find the order in the orders list
        const foundOrder = orders.find(order => order.id === idToTrack);

        if (foundOrder) {
            setTrackedOrder(foundOrder);
            setTrackingError(null);
        } else {
            setTrackedOrder(null);
            setTrackingError(`Order with ID ${trackingOrderId} not found.`);
        }
    };

    return (
        <section id="order-tracking" className="mb-12 bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-center">Track Your Order</h2>
            <div className="flex justify-center items-center space-x-4 mb-4">
                <label htmlFor="tracking-id" className="text-lg font-medium text-gray-700">Enter Order ID:</label>
                <input
                    type="number" // Use number type for easier input on mobile
                    id="tracking-id"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={trackingOrderId}
                    onChange={handleInputChange}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={handleTrackOrder}
                >
                    Track Order
                </button>
            </div>

            {/* Display tracking results */}
            {trackedOrder && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-2">Order Details (ID: {trackedOrder.id})</h3>
                    <p className="text-green-700 font-semibold">Payment Status: Payment Successful</p> {/* Always show successful payment */}
                    <p className="mt-2">
                        <strong>Order Status:</strong>{' '}
                        <span className={trackedOrder.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                            {trackedOrder.status === 'Completed' ? 'Seller has sent out the order' : 'Seller is preparing order'}
                        </span>
                    </p>
                    {/* You could add more order details here if needed */}
                </div>
            )}

            {/* Display tracking error */}
            {trackingError && (
                <div className="mt-4 text-center text-red-600 font-semibold">
                    {trackingError}
                </div>
            )}
        </section>
    );
};

export default OrderTracking;
