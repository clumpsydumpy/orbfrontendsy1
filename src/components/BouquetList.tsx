import React from 'react';

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

// Define the props this component expects
interface BouquetListProps {
    bouquets: Bouquet[]; // Array of bouquets to display
    onAddToCart: (bouquet: Bouquet) => void; // Function to call when "Add to Cart" is clicked
}

const BouquetList: React.FC<BouquetListProps> = ({ bouquets, onAddToCart }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="bouquet-list">
            {/* Map over the bouquets array and render each bouquet */}
            {bouquets.map(bouquet => (
                <div key={bouquet.id} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <img src={bouquet.image} alt={bouquet.name} className="bouquet-image mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{bouquet.name}</h3>
                    <p className="text-lg text-gray-700 mb-4">${bouquet.price.toFixed(2)}</p>
                    <button
                        className="add-to-cart-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={() => onAddToCart(bouquet)} // Call the prop function on click
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BouquetList;
