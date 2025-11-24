import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [queueDepth, setQueueDepth] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueueDepth = async () => {
    try {
      // Assuming backend is available at localhost:8080 via port-forward
      // In a real production env, this would be an env var or relative path
      const response = await fetch('http://localhost:8080/queueDepth')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setQueueDepth(data.QueueDepth)
      setError(null)
    } catch (err) {
      setError('Failed to fetch queue depth')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueueDepth()
    const interval = setInterval(fetchQueueDepth, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      <div className="card">
        <h1>Queue Depth Monitor</h1>
        <div className="metric-container">
          {loading && <div className="status">Loading...</div>}
          {error && <div className="status error">{error}</div>}
          {!loading && !error && (
            <div className="metric-value">
              {queueDepth}
            </div>
          )}
        </div>
        <p className="description">
          Real-time queue depth from KEDA Clone Operator
        </p>
      </div>
    </div>
  )
}

export default App
