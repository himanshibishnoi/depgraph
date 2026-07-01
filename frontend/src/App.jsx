// App.jsx
// Main React component for depgraph
// Three columns: Input (left), Resolved Order (middle), Dependency Chain (right)

import { useState } from "react"
import "./index.css"
import successIcon from './assets/success-icon.png'
import successIconDark from './assets/success-icon-dark.png'

// ── Preset example data ──────────────────────────────────
const EXAMPLES = {
  "Morning Routine": {
    desc: "A simple daily routine with linear steps",
    nodes: "Wake up\nBrush teeth\nExercise\nShower\nBreakfast\nStart work",
    edges: "Wake up->Brush teeth\nBrush teeth->Exercise\nExercise->Shower\nShower->Breakfast\nBreakfast->Start work"
  },
  "Build a Website": {
    desc: "Design, build and deploy — parallel paths converging",
    nodes: "Plan features\nDesign mockups\nSetup backend\nWrite frontend\nConnect API\nTest app\nDeploy",
    edges: "Plan features->Design mockups\nPlan features->Setup backend\nDesign mockups->Write frontend\nSetup backend->Connect API\nWrite frontend->Connect API\nConnect API->Test app\nTest app->Deploy"
  },
  "DSA Roadmap": {
    desc: "Learn data structures in the right order",
    nodes: "Arrays\nLinked Lists\nStacks\nQueues\nHashing\nTrees\nHeaps\nGraphs\nDynamic Programming",
    edges: "Arrays->Linked Lists\nArrays->Hashing\nLinked Lists->Stacks\nLinked Lists->Queues\nStacks->Trees\nQueues->Trees\nTrees->Heaps\nTrees->Graphs\nHeaps->Dynamic Programming\nGraphs->Dynamic Programming"
  },
  "Home Spa Day": {
    desc: "A relaxing self-care routine done in the right order",
    nodes: "Gather supplies\nClean bathroom\nDraw bath\nFace mask\nSoak in bath\nRinse off\nMoisturise\nRelax with tea",
    edges: "Gather supplies->Clean bathroom\nGather supplies->Face mask\nClean bathroom->Draw bath\nDraw bath->Soak in bath\nFace mask->Soak in bath\nSoak in bath->Rinse off\nRinse off->Moisturise\nMoisturise->Relax with tea"
  },
  "Cook 3-Course Meal": {
    desc: "Starter, main, and dessert — timed to finish together",
    nodes: "Shop for ingredients\nPrepare starter\nPrepare dessert\nChop vegetables\nCook main course\nPlate starter\nServe starter\nFinish main\nPlate dessert\nServe all",
    edges: "Shop for ingredients->Prepare starter\nShop for ingredients->Prepare dessert\nShop for ingredients->Chop vegetables\nPrepare starter->Plate starter\nPlate starter->Serve starter\nServe starter->Finish main\nChop vegetables->Cook main course\nCook main course->Finish main\nPrepare dessert->Serve all\nFinish main->Serve all"
  }
}

// ── Friendly error messages ───────────────────────────────
function getFriendlyError(message) {
  if (message.includes("Cycle detected")) {
    const nodesMatch = message.match(/Nodes involved: (.+)/)
    const nodes = nodesMatch ? nodesMatch[1] : null
    return nodes
      ? `These tasks form a loop — ${nodes}. They can't all come before each other! Remove one of these connections to fix it.`
      : "These tasks depend on each other in a circle, so there's no valid order. Check your dependencies for loops."
  }
  if (message.includes("does not exist")) {
    const nodeMatch = message.match(/'([^']+)'/)
    const node = nodeMatch ? nodeMatch[1] : "a task"
    return `"${node}" appears in your dependencies but wasn't found in your task list. Check that the spelling matches exactly.`
  }
  if (message.includes("already exists")) {
    return "You've added the same task or connection twice. Each task and dependency should appear only once."
  }
  if (message.includes("Self-loops")) {
    return "A task can't depend on itself! Remove that connection."
  }
  if (message.includes("Please add at least one task")) {
    return "Add your tasks first in the top box, then add the connections between them below."
  }
  if (message.includes("Failed to connect")) {
    return "Couldn't reach the server. Make sure the backend is running and try again."
  }
  return message
}

// ── Extract cycle nodes for visual display ────────────────
function extractCycleNodes(message) {
  if (!message.includes("Cycle detected")) return null
  const match = message.match(/Nodes involved: (.+)/)
  if (!match) return null
  return match[1].split(" → ").map(n => n.trim())
}

// ── Main component ────────────────────────────────────────
function App() {
  // State
  const [nodes, setNodes] = useState("")
  const [edges, setEdges] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExamples, setShowExamples] = useState(false)

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark")
  }

  // ── Core logic ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (nodes.trim() === "") {
      setResult({
        status: "error",
        message: "Please add at least one task before resolving."
      })
      return
    }

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/resolve`, {
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

  // ── Utility handlers ─────────────────────────────────────
  const handleClear = () => {
    setNodes("")
    setEdges("")
    setResult(null)
    setCopied(false)
  }

  const loadExample = (name) => {
    setNodes(EXAMPLES[name].nodes)
    setEdges(EXAMPLES[name].edges)
    setResult(null)
    setCopied(false)
    setShowExamples(false)
  }

  const copyOrder = () => {
    if (result?.order) {
      navigator.clipboard.writeText(result.order.join("\n"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const cycleNodes = result?.status === "error" ? extractCycleNodes(result.message) : null
  const friendlyError = result?.status === "error" ? getFriendlyError(result.message) : null

  // ── Render ───────────────────────────────────────────────
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

          {/* Examples dropdown */}
          <div className="examples-dropdown-wrapper">
            <button
              className="btn-examples"
              onClick={() => setShowExamples(!showExamples)}
            >
              ✦ Examples
            </button>
            {showExamples && (
              <div className="examples-dropdown">
                {Object.entries(EXAMPLES).map(([name, data]) => (
                  <div
                    key={name}
                    className="dropdown-item"
                    onClick={() => loadExample(name)}
                  >
                    <div className="dropdown-item-title">{name}</div>
                    <div className="dropdown-item-desc">{data.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <span>{"Tip: Task names in dependencies must match exactly."}</span>
          </div>

          <div className="examples-row">
            <span className="examples-label">Quick load</span>
            {Object.keys(EXAMPLES).map((name) => (
              <button
                key={name}
                className="btn-preset"
                onClick={() => loadExample(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <button
            className="btn-resolve"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Resolving..." : "✦ Resolve Dependencies"}
          </button>
        </div>

        {/* ── Column 2: Result ── */}
        <div className="card">
          <h2 className="col-title">Resolved order</h2>

          {!result && !loading && (
            <div className="empty-illustration">
              <img
                src={successIcon}
                className="empty-icon-large empty-icon-light"
                alt=""
              />
              <img
                src={successIconDark}
                className="empty-icon-large empty-icon-dark"
                alt=""
              />
              <p className="empty-state">Your resolved order will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="skeleton-list">
              {[70, 50, 85, 60, 75].map((width, i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-circle" />
                  <div className="skeleton-line" style={{ width: `${width}%` }} />
                </div>
              ))}
            </div>
          )}

          {result && result.status === "success" && (
            <>
              <div className="status-badge success">
                <span>✓</span> Dependencies resolved — here's your order!
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
                {copied ? "✓ Copied!" : "📋 Copy Order"}
              </button>
            </>
          )}

          {result && result.status === "error" && (
            <div className="status-badge error">
              <span>⚠</span>
              <span>{friendlyError}</span>
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
              <p className="empty-state">Resolve your tasks to see the chain.</p>
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

          {result && result.status === "error" && cycleNodes && (
            <div className="cycle-notice">
              <div className="cycle-nodes">
                {cycleNodes.map((node, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="cycle-node">{node}</span>
                    {i < cycleNodes.length - 1 && (
                      <span className="cycle-arrow">{"→"}</span>
                    )}
                  </span>
                ))}
                <span className="cycle-arrow">{"→"} 🔁</span>
              </div>
              <p>This is the loop causing the problem.</p>
            </div>
          )}

          {result && result.status === "error" && !cycleNodes && (
            <div className="chain-empty">
              <p className="empty-state">Fix the error on the left to see the dependency chain.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App