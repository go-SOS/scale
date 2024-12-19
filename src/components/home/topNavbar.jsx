// src/components/home/TopNavbar.jsx

const topNavbar = () => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#333', color: '#fff' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>MyApp</div>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0 }}>
                <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/about-us" style={{ color: '#fff', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="/contact-us" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a></li>
            </ul>
        </nav>
    );
};

export default topNavbar;
