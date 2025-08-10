import React, { useState } from "react";

const ViteLayeringDemo = () => {
  const [scenario, setScenario] = useState("basic");
  const [boardZIndex, setBoardZIndex] = useState(10);
  const [hasTransform, setHasTransform] = useState(true);
  const [headerZIndex, setHeaderZIndex] = useState(1);

  const containerStyle = {
    position: "relative",
    height: "320px",
    border: "2px solid #ccc",
    backgroundColor: "#f5f5f5",
    padding: "16px",
  };

  const BasicZIndexDemo = () => (
    <div>
      {/* Interactive Controls */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}>
        <h4
          style={{ fontSize: "16px", marginBottom: "15px", color: "#495057" }}>
          🧪 Test Your Actual Case - Adjust Settings:
        </h4>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Header Z-Index:
            <input
              type="number"
              value={headerZIndex}
              onChange={(e) => setHeaderZIndex(Number(e.target.value))}
              style={{ width: "60px", padding: "4px" }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Board Z-Index:
            <input
              type="number"
              value={boardZIndex}
              onChange={(e) => setBoardZIndex(Number(e.target.value))}
              style={{ width: "60px", padding: "4px" }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={hasTransform}
              onChange={(e) => setHasTransform(e.target.checked)}
            />
            Board has transform (creates stacking context)
          </label>
        </div>
      </div>

      <div style={containerStyle}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}>
          Your Actual Case Test
        </h3>

        {/* Header with background image (like your Header component) */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "200px",
            backgroundImage: 'url("/src/assets/images/background_light.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#4a90e2", // fallback color if image doesn't load
            zIndex: headerZIndex,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}>
            <h2>Header with Background</h2>
            <p>Z-Index: {headerZIndex}</p>
          </div>
        </div>

        {/* Board component (like your Board/Introduction) */}
        <div
          style={{
            position: "absolute",
            top: "120px", // Overlapping with header
            left: "20px",
            right: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            zIndex: boardZIndex,
            transform: hasTransform ? "translateY(0px)" : "none",
          }}>
          <h4 style={{ marginBottom: "10px", color: "#333" }}>
            Board Component Content
          </h4>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            This represents your Board/Introduction component.
          </p>
          <div
            style={{
              padding: "10px",
              backgroundColor:
                boardZIndex > headerZIndex ? "#d4edda" : "#f8d7da",
              borderRadius: "4px",
              fontSize: "14px",
              border:
                boardZIndex > headerZIndex
                  ? "1px solid #c3e6cb"
                  : "1px solid #f5c6cb",
            }}>
            <strong>Board Z-Index:</strong> {boardZIndex}
            <br />
            <strong>Header Z-Index:</strong> {headerZIndex}
            <br />
            <strong>Has Transform:</strong>{" "}
            {hasTransform ? "Yes (creates stacking context!)" : "No"}
            <br />
            <strong>Result:</strong>{" "}
            {boardZIndex > headerZIndex && !hasTransform
              ? "✅ Should be visible"
              : boardZIndex > headerZIndex && hasTransform
              ? "⚠️ Might be hidden (stacking context)"
              : "❌ Hidden behind header"}
          </div>

          <div style={{ marginTop: "15px", fontSize: "14px" }}>
            <strong>Quick Fixes to Try:</strong>
            <ol style={{ marginTop: "5px", paddingLeft: "20px" }}>
              <li>Set Board z-index much higher (try 1000)</li>
              <li>Remove transform from Board component</li>
              <li>Put z-index on parent without transform</li>
            </ol>
          </div>
        </div>

        {/* Test different scenarios button */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "20px",
            right: "20px",
            textAlign: "center",
          }}>
          <small style={{ color: "#666" }}>
            ↑ Experiment with the controls above to see how z-index and
            transform affect layering
          </small>
        </div>
      </div>
    </div>
  );

  const StackingContextDemo = () => (
    <div style={containerStyle}>
      <h3
        style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
        Stacking Context Issues
      </h3>

      {/* Parent with transform creates new stacking context */}
      <div
        style={{
          position: "absolute",
          top: "64px",
          left: "32px",
          width: "256px",
          height: "160px",
          backgroundColor: "#c084fc",
          padding: "8px",
          transform: "scale(1)", // Creates stacking context!
          zIndex: 1,
        }}>
        <div
          style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
          Parent (transform + z-index: 1)
        </div>
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "16px",
            width: "128px",
            height: "96px",
            backgroundColor: "#f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            zIndex: 9999, // High z-index won't help!
          }}>
          Child (z-index: 9999)
        </div>
      </div>

      {/* This will appear above despite lower z-index */}
      <div
        style={{
          position: "absolute",
          top: "96px",
          left: "160px",
          width: "128px",
          height: "96px",
          backgroundColor: "#ec4899",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "14px",
          zIndex: 2,
        }}>
        Sibling (z-index: 2)
      </div>
    </div>
  );

  const HeaderContentDemo = () => (
    <div style={{ ...containerStyle, overflow: "hidden" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
          padding: "16px",
        }}>
        Header vs Content Layering
      </h3>

      {/* Header background */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "128px",
          background: "linear-gradient(to bottom, #2563eb, #1e40af)",
          zIndex: 1,
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}>
          Header Background
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          height: "32px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          zIndex: 10,
        }}>
        Navigation Bar
      </div>

      {/* Content that should appear above header */}
      <div
        style={{
          position: "absolute",
          top: "96px",
          left: "32px",
          right: "32px",
          bottom: "32px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          zIndex: 100,
        }}>
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Content Board
        </h4>
        <p style={{ color: "#666", marginBottom: "16px" }}>
          This content should appear above the header background.
        </p>
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fef3c7",
            borderRadius: "4px",
          }}>
          <strong>Your Issue:</strong> If this content appears behind the
          header, it's likely a z-index or stacking context problem.
        </div>
      </div>
    </div>
  );

  const SolutionDemo = () => (
    <div style={containerStyle}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
          padding: "16px",
        }}>
        Solution: Proper Z-Index Management
      </h3>

      {/* Header container with controlled z-index */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          zIndex: 10,
        }}>
        <div
          style={{
            height: "96px",
            background: "linear-gradient(to right, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}>
          Header (z-index: 10)
        </div>
      </div>

      {/* Content container with higher z-index */}
      <div
        style={{
          position: "absolute",
          top: "64px",
          left: "16px",
          right: "16px",
          bottom: "16px",
          zIndex: 100,
        }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            padding: "24px",
            height: "100%",
          }}>
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#16a34a",
              marginBottom: "12px",
            }}>
            ✅ Fixed Content
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "4px",
              }}>
              <strong>Solution 1:</strong> Set content z-index higher than
              header
            </div>
            <div
              style={{
                padding: "12px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "4px",
              }}>
              <strong>Solution 2:</strong> Avoid creating unnecessary stacking
              contexts
            </div>
            <div
              style={{
                padding: "12px",
                backgroundColor: "#faf5ff",
                border: "1px solid #e9d5ff",
                borderRadius: "4px",
              }}>
              <strong>Solution 3:</strong> Use consistent z-index scale (1, 10,
              100, 1000)
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const buttonStyle = (isActive) => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    backgroundColor: isActive ? "#2563eb" : "#e5e7eb",
    color: isActive ? "white" : "#374151",
    transition: "all 0.2s",
  });

  return (
    <div
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "32px",
          color: "#1f2937",
        }}>
        Vite Element Layering Demo
      </h1>

      {/* Scenario Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
        }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            backgroundColor: "#e5e7eb",
            padding: "4px",
            borderRadius: "8px",
          }}>
          {[
            { key: "basic", label: "Basic Z-Index" },
            { key: "stacking", label: "Stacking Context" },
            { key: "header", label: "Header Issue" },
            { key: "solution", label: "Solution" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              style={buttonStyle(scenario === key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Container */}
      <div style={{ marginBottom: "32px" }}>
        {scenario === "basic" && <BasicZIndexDemo />}
        {scenario === "stacking" && <StackingContextDemo />}
        {scenario === "header" && <HeaderContentDemo />}
        {scenario === "solution" && <SolutionDemo />}
      </div>

      {/* Code Examples */}
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          padding: "24px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#fbbf24",
          }}>
          Code Example for Your Issue:
        </h3>
        <pre
          style={{
            overflow: "auto",
            fontSize: "14px",
            lineHeight: "1.5",
            margin: "0",
            fontFamily: "monospace",
          }}>
          {`// In your Board component:
<div 
  className="container"
  style={{
    position: "relative",
    zIndex: 1000, // Higher than header
    transform: "translateY(-\${distance}px)"
  }}
>
  {/* Your content */}
</div>

// In your App.jsx:
<div style={{ position: "relative", zIndex: 1 }}>
  <Header /> {/* Lower z-index */}
</div>
<div style={{ position: "relative", zIndex: 100 }}>
  <Introduction /> {/* Higher z-index */}
</div>`}
        </pre>
      </div>

      {/* Tips */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
        }}>
        <h4
          style={{ fontWeight: "bold", color: "#1e40af", marginBottom: "8px" }}>
          💡 Pro Tips for Vite:
        </h4>
        <ul style={{ color: "#1d4ed8", paddingLeft: "20px" }}>
          <li>Vite processes CSS differently than CRA - check import order</li>
          <li>Use a consistent z-index scale: 1, 10, 100, 1000</li>
          <li>Avoid transforms on parent elements when possible</li>
          <li>Use browser dev tools to inspect computed z-index values</li>
          <li>
            Test with{" "}
            <code>
              position: relative !important; z-index: 9999 !important;
            </code>{" "}
            to debug
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ViteLayeringDemo;
