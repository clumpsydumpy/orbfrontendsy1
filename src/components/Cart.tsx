import React from 'react';

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

interface CartItem extends Bouquet {} // Cart items are just bouquets

// Define the props this component expects
interface CartProps {
    cart: CartItem[]; // Array of items in the cart
    cartTotal: number; // The total price of items in the cart
    onRemoveItem: (bouquetId: string) => void; // Function to call when "Remove One" is clicked
}

const Cart: React.FC<CartProps> = ({ cart, cartTotal, onRemoveItem }) => {
    // Calculate item quantities in cart for display within this component
    const cartItemQuantities = cart.reduce((quantities, item) => {
        quantities[item.id] = (quantities[item.id] || 0) + 1;
        return quantities;
    }, {} as { [key: string]: number });

    return (
        <div id="cart" className="mb-6">
            <h3 className="text-2xl font-medium mb-4">Your Cart</h3>
            <ul id="cart-items" className="list-disc list-inside mb-4">
                {/* Conditionally render empty message or cart items */}
                {cart.length === 0 ? (
                    <li id="cart-empty-message" className="text-gray-500">Your cart is empty. Add some bouquets!</li>
                ) : (
                    // Map over the unique item IDs in the cartItemQuantities
                    Object.entries(cartItemQuantities).map(([bouquetId, quantity]) => {
                        const bouquet = cart.find(item => item.id === bouquetId); // Find the bouquet details
                        if (!bouquet) return null; // Should not happen if logic is correct
                        return (
                            <li key={bouquetId} className="flex justify-between items-center mb-2">
                                <span>{bouquet.name} (x{quantity}) - ${(bouquet.price * quantity).toFixed(2)}</span>
                                <button
                                    className="remove-item-btn"
                                    onClick={() => onRemoveItem(bouquetId)} // Call the prop function on click
                                >
                                    Remove One
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
            <p className="text-xl font-semibold">Total: $<span id="cart-total">{cartTotal.toFixed(2)}</span></p>
        </div>
    );
};

export default Cart;
