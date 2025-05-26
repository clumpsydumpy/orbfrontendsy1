import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react'; // Import types separately

// Define the props this component expects
interface OrderFormProps {
    cartTotal: number; // Total from the cart (for display, not used in logic here)
    onOrderSubmit: (orderData: {
        customerName: string;
        customerAddress: string;
        paymentMethod: string;
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    }) => void; // Function to call when the form is submitted
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderSubmit }) => {
    // State for form inputs (managed locally within this component)
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Handle payment method change
    const handlePaymentMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(event.target.value);
        // Reset card fields when switching away from card
        if (event.target.value !== 'card') {
            setCardNumber('');
            setExpiryDate('');
            setCvv('');
        }
    };

    // Handle form submission
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault(); // Prevent default form submission

        // Basic validation (more robust validation can be added)
        if (paymentMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv) {
                 alert('Please fill in all required card details.'); // Use alert for simplicity in this component
                 return;
            }
        }

        // Call the prop function to submit the order data
        onOrderSubmit({
            customerName,
            customerAddress,
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
        });

        // Clear form fields after submission (App component will clear cart)
        setCustomerName('');
        setCustomerAddress('');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setPaymentMethod('card'); // Reset payment method to default
    };


    return (
        <form id="order-form" className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="customer-name" className="block text-lg font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="customer-name"
                    required
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="customer-address" className="block text-lg font-medium text-gray-700">Address:</label>
                <textarea
                    id="customer-address"
                    rows={3}
                    required
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                ></textarea>
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Payment Method:</label>
                <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="payment-card"
                        name="payment-method"
                        value="card"
                        className="focus:ring-green-500 h-5 w-5 text-green-600 border-gray-300"
                        checked={paymentMethod === 'card'}
                        onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="payment-card" className="text-lg text-gray-700">Card</label>

                    <input
                        type="radio"
                        id="payment-paynow"
                        name="payment-method"
                        value="paynow"
                        className="focus:ring-green-500 h-5 w-5 text-green-600 border-gray-300"
                        checked={paymentMethod === 'paynow'}
                        onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="payment-paynow" className="text-lg text-gray-700">Pay Now (QR Code)</label>
                </div>
            </div>

            {/* Card Fields (conditionally rendered) */}
            {paymentMethod === 'card' && (
                <div id="card-fields" className="space-y-4">
                    <div>
                        <label htmlFor="card-number" className="block text-lg font-medium text-gray-700">Card Number (16 digits):</label>
                        <input
                            type="text"
                            id="card-number"
                            pattern="\d{16}"
                            title="Please enter a 16-digit card number"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required={paymentMethod === 'card'} // Make required based on state
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiry-date" className="block text-lg font-medium text-gray-700">Expiry Date (MM/YY):</label>
                            <input
                                type="text"
                                id="expiry-date"
                                pattern="(0[1-9]|1[0-2])\/\d{2}"
                                title="Please enter expiry date in MM/YY format"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required={paymentMethod === 'card'} // Make required based on state
                            />
                        </div>
                        <div>
                            <label htmlFor="cvv" className="block text-lg font-medium text-gray-700">CVV:</label>
                            <input
                                type="text"
                                id="cvv"
                                pattern="\d{3,4}"
                                title="Please enter 3 or 4 digit CVV"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                required={paymentMethod === 'card'} // Make required based on state
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Pay Now QR (conditionally rendered) */}
            {paymentMethod === 'paynow' && (
                <div id="paynow-qr" className="text-center">
                    <h3 className="text-2xl font-medium mb-4">Scan to Pay</h3>
                    <img src="https://placehold.co/200x200/e5e7eb/1f2937?text=QR+Code+Placeholder" alt="Pay Now QR Code Placeholder" className="mx-auto rounded-md" />
                    <p className="mt-4 text-gray-600">Scan this code to complete your payment.</p>
                    <p className="text-sm text-red-500 mt-2">Note: This is a placeholder QR code for demonstration only.</p>
                </div>
            )}


            <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition duration-200">Place Order</button>
        </form>
    );
};

export default OrderForm;
