import React from 'react';

function Logout({ onLogout }) {
    return (
        <section id="logout">
            
            <button onClick={onLogout}>Logout</button>
        </section>
    );
}

export default Logout;

