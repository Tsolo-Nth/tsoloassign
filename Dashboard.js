import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); 
            try {
                const response = await fetch('http://localhost:5300/products');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); 
                    setProducts(data);
                    setError(null); 
                } else {
                    setError('Failed to fetch products');
                }
            } catch (error) {
                setError('Error fetching products: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
        return () => {
            setProducts([]);
            setError(null);
            setIsLoading(false);
        };
    }, []);

    const chartData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Quantity',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                type: 'bar',
            },
            {
                label: 'Price',
                data: products.map(product => product.price),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                fill: false,
                type: 'line',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Product Stock Levels and Price',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Products',
                },
            },
        },
    };

    return (
        <section id="dashboard">
            <div id="stockOverview">
                {isLoading ? (
                    <div>Loading products...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : products.length > 0 ? (
                    <div className="canvas-container">
                        <Bar data={chartData} options={options} />
                    </div>
                ) : (
                    <div>No products available</div>
                )}
            </div>
        </section>
    );
}

export default Dashboard;