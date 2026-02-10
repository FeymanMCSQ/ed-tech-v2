import Link from "next/link";

export default function HomePage() {
    return (
        <div className="card" style={{ textAlign: "center" }}>
            <h1>Archetype Learning engine</h1>
            <p>Welcome to the next generation of skill calibration.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
                <Link href="/login" style={{ padding: "0.75rem 1.5rem", background: "#0070f3", color: "white", borderRadius: "6px", textDecoration: "none" }}>Log In</Link>
                <Link href="/register" style={{ padding: "0.75rem 1.5rem", border: "1px solid #0070f3", color: "#0070f3", borderRadius: "6px", textDecoration: "none" }}>Sign Up</Link>
            </div>
        </div>
    );
}
