import { useState } from "react"

function App() {
  const [nodes, setNodes] = useState("")
  const [edges, setEdges] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const parsedNodes = nodes
      .split(",")
      .map((node) => node.trim())
      .filter((node) => node !== "")

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
      setResult({
        status: "error",
        message: "Failed to connect to the server.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>depgraph</h1>
      <p>Enter your tasks and dependencies to find a valid order.</p>

      <label>Tasks (comma separated)</label>
      <input
        type="text"
        value={nodes}
        onChange={(e) => setNodes(e.target.value)}
        placeholder="e.g. A, B, C"
      />

<label>{"Dependencies (one per line, format: A->B)"}</label>     <textarea
        value={edges}
        onChange={(e) => setEdges(e.target.value)}
        placeholder={"A->B\nB->C"}
        rows={5}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Resolving..." : "Resolve Order"}
      </button>

      {result && (
        <div>
          {result.status === "success" ? (
            <div>
              <p>Valid order found:</p>
              <ol>
                {result.order.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          ) : (
            <div>
              <p>Error: {result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App