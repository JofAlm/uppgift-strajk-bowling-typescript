import React, { useState, useEffect } from "react";
import Booking from "./components/Booking";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Visa laddningsskärmen i 2 sekunder
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <img src="logo.png" alt="Strajk Bowling Logo" style={styles.logo} />
        <h1 style={styles.title}>STRAJK</h1>
        <p style={styles.subtitle}>BOWLING</p>
      </div>
    );
  }

  return (
    <div>
      <Booking />
    </div>
  );
};

const styles = {
  loadingScreen: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fff6f1",
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "48px",
    color: "#FF4965",
    margin: "0",
  },
  subtitle: {
    fontSize: "24px",
    color: "#512da8",
    margin: "0",
  },
};

export default App;
