export default function HomePage() {
  return (
    <div style={{ 
      padding: "50px", 
      textAlign: "center", 
      backgroundColor: "#1a1a1a", 
      color: "white", 
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>Ìºç HealthBridge - Global Health Journal</h1>
      <p>AI-Powered Health Analysis ‚Ä¢ Multi-Language Support</p>
      <div style={{ 
        backgroundColor: "#2a2a2a", 
        padding: "30px", 
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h2>‚úÖ Deployment Successful!</h2>
        <p>Your HealthBridge app is now live!</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
