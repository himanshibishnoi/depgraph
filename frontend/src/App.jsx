import { useState } from "react"
import "./index.css"

// ── Example presets ──────────────────────────────────────
const EXAMPLES = {
  "Morning Routine": {
    nodes: "Wake up\nExercise\nShower\nBreakfast\nStart work",
    edges: "Wake up->Exercise\nExercise->Shower\nShower->Breakfast\nBreakfast->Start work"
  },
  "Bake Cookies": {
    nodes: "Buy ingredients\nPreheat oven\nMix dough\nShape cookies\nBake\nCool down",
    edges: "Buy ingredients->Mix dough\nPreheat oven->Bake\nMix dough->Shape cookies\nShape cookies->Bake\nBake->Cool down"
  },
  "DSA Learning": {
    nodes: "Arrays\nLinked Lists\nStacks\nQueues\nTrees\nGraphs",
    edges: "Arrays->Linked Lists\nLinked Lists->Stacks\nLinked Lists->Queues\nStacks->Trees\nQueues->Trees\nTrees->Graphs"
  }
}

function App() {
  const [nodes, setNodes] = useState("")
  const [edges, setEdges] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark")
  }

  const handleSubmit = async () => {
    const parsedNodes = nodes
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "")

    const parsedEdges = edges
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("->"))
      .map((line) => {
        const [from, to] = line.split("->").map((item) => item.trim())
        return [from, to]
      })
      .filter(([from, to]) => from && to)

    setLoading(true)
    try {
      const response = await fetch("http://localhost:5001/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: parsedNodes, edges: parsedEdges }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ status: "error", message: "Failed to connect to the server." })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setNodes("")
    setEdges("")
    setResult(null)
  }

  const loadExample = (name) => {
    setNodes(EXAMPLES[name].nodes)
    setEdges(EXAMPLES[name].edges)
    setResult(null)
  }

  const copyOrder = () => {
    if (result?.order) {
      navigator.clipboard.writeText(result.order.join("\n"))
    }
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">depgraph</span>
          <span className="logo-sparkle">✦</span>
        </div>
        <p className="tagline">Plan your tasks. Respect the dependencies.</p>
        <div className="header-actions">
          <button className="btn-examples" onClick={() => {}}>
            ✦ Examples
          </button>
          <button className="btn-clear" onClick={handleClear}>
            Clear All
          </button>
          <button className="btn-theme" onClick={toggleDark}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── Three columns ── */}
      <div className="columns">

        {/* ── Column 1: Input ── */}
        <div className="card">
          <div className="step-header">
            <span className="step-number">1</span>
            <h2>Add your tasks</h2>
          </div>
          <p className="step-hint">Add one task per line.</p>
          <textarea
            className="input-area"
            value={nodes}
            onChange={(e) => setNodes(e.target.value)}
            placeholder={"Arrays\nLinked Lists\nTrees"}
            rows={6}
          />

          <div className="divider">
            <span className="divider-icon">✦</span>
          </div>

          <div className="step-header">
            <span className="step-number">2</span>
            <h2>Add dependencies</h2>
          </div>
          <p className="step-hint">{"One dependency per line: A -> B"}</p>
          <textarea
            className="input-area"
            value={edges}
            onChange={(e) => setEdges(e.target.value)}
            placeholder={"Arrays->Linked Lists\nLinked Lists->Trees"}
            rows={5}
          />

          <div className="tip-box">
            <span>💡</span>
            <span>{"Tip: You can use task names from the list above."}</span>
          </div>

          <div className="examples-row">
            <span className="examples-label">Examples</span>
            {Object.keys(EXAMPLES).map((name) => (
              <button key={name} className="btn-preset" onClick={() => loadExample(name)}>
                {name}
              </button>
            ))}
          </div>

          <button className="btn-resolve" onClick={handleSubmit} disabled={loading}>
            {loading ? "Resolving..." : "✦ Resolve Dependencies"}
          </button>
        </div>

        {/* ── Column 2: Result ── */}
        <div className="card">
          <h2 className="col-title">Resolved order</h2>
          {!result && (
            <p className="empty-state">Your resolved order will appear here.</p>
          )}
          {result && result.status === "success" && (
            <>
              <div className="status-badge success">
                <span>✓</span> Dependencies resolved
              </div>
              <ol className="order-list">
                {result.order.map((item, i) => (
                  <li key={i} className="order-item">
                    <span className="order-num">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <button className="btn-copy" onClick={copyOrder}>
                📋 Copy Order
              </button>
            </>
          )}
          {result && result.status === "error" && (
            <div className="status-badge error">
              <span>⚠</span> {result.message}
            </div>
          )}
        </div>

        {/* ── Column 3: Dependency chain ── */}
        <div className="card">
          <h2 className="col-title">Dependency chain</h2>
          <p className="step-hint">Each task depends on the ones before it.</p>
          {!result && (
            <div className="chain-empty">
              <div className="chain-placeholder">
                <span className="chain-circle" />
                <span className="chain-arrow">{"→"}</span>
                <span className="chain-circle" />
                <span className="chain-arrow">{"→"}</span>
                <span className="chain-circle" />
              </div>
              <p>Resolve your tasks to visualize dependencies.</p>
            </div>
          )}
          {result && result.status === "success" && (
            <ul className="chain-list">
              {edges
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.includes("->"))
                .map((line, i) => {
                  const [from, to] = line.split("->").map((s) => s.trim())
                  return (
                    <li key={i} className="chain-item">
                      <span className="chain-num">{i + 1}</span>
                      <span>{from}</span>
                      <span className="chain-arrow">{"→"}</span>
                      <span className="chain-num">{i + 2}</span>
                      <span>{to}</span>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}

export default App