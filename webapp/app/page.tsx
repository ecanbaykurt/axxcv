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
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        Ìºç HealthBridge - Global Health Journal
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        AI-Powered Health Analysis ‚Ä¢ Multi-Language Support ‚Ä¢ Global Accessibility
      </p>
      <div style={{ 
        backgroundColor: "#2a2a2a", 
        padding: "30px", 
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h2>‚úÖ Deployment Successful!</h2>
        <p>Your HealthBridge app is now live and working!</p>
        <p><strong>Features:</strong></p>
        <ul style={{ textAlign: "left", display: "inline-block" }}>
          <li>Ìºç 60+ Languages Supported</li>
          <li>Ìæ§ Voice Input (Speech-to-Text)</li>
          <li>Ì¥ñ AI Symptom Analysis</li>
          <li>Ì≥∏ Image Analysis</li>
          <li>Ì≥ä Pattern Recognition</li>
          <li>Ì≥± Mobile Responsive</li>
        </ul>
        <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#888" }}>
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}
