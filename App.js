import React, { useEffect, useState } from 'react';
import './styles.css';
import ProductManagement from './ProductManagement';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import Login from './Login';
import Logout from './Logout'; // Import the Logout component

function App() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load login status and products from localStorage when the app mounts
    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
        const loginStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loginStatus === 'true');
    }, []);

    // Update localStorage whenever products state changes
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }, [products]);

    // Function to handle section visibility
    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    // Add a new product
    const addProduct = (newProduct) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts, newProduct];
            localStorage.setItem('products', JSON.stringify(updatedProducts)); // Update localStorage
            return updatedProducts;
        });
    };

    // Update an existing product
    const updateProduct = (index, updatedProduct) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? updatedProduct : product
        );
        setProducts(updatedProducts);
    };

    // Delete a product
    const deleteProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    // Handle successful login
    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <div>
            <header>
                <h1> Welcome To Wings Cafe Inventory System</h1>
            </header>

            {!isLoggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <nav>
                        <button
                            className={activeSection === 'dashboard' ? 'active' : ''}
                            onClick={() => showSection('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={activeSection === 'productManagement' ? 'active' : ''}
                            onClick={() => showSection('productManagement')}
                        >
                            Product Management
                        </button>
                        <button
                            className={activeSection === 'usersManagement' ? 'active' : ''}
                            onClick={() => showSection('usersManagement')}
                        >
                            Users Management
                        </button>
                        {/* Use the Logout component here */}
                        <Logout onLogout={handleLogout} />
                    </nav>
                    <main>
                        {activeSection === 'dashboard' && <Dashboard products={products} />}
                        {activeSection === 'productManagement' && (
                            <ProductManagement
                                products={products}
                                addProduct={addProduct}
                                updateProduct={updateProduct}
                                deleteProduct={deleteProduct}
                            />
                        )}
                        {activeSection === 'usersManagement' && <UsersManagement />}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
