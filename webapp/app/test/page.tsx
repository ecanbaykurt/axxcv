export default function TestPage() {
  return (
    <div style={{ padding: "50px", textAlign: "center", backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh" }}>
      <h1>� HealthBridge is Working!</h1>
      <p>If you can see this, your deployment is successful!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Project: healthlink</p>
    </div>
  );
}
