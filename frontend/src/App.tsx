import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [queueDepth, setQueueDepth] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string>('3')

  const fetchQueueDepth = async () => {
    try {
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

  const updateQueueDepth = async () => {
    try {
      const depth = parseInt(inputValue)
      if (isNaN(depth) || depth < 0) {
        setError('Please enter a valid number')
        return
      }

      const response = await fetch('http://localhost:8080/queueDepth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queueDepth: depth }),
      })

      if (!response.ok) {
        throw new Error('Failed to update queue depth')
      }

      await fetchQueueDepth()
      setError(null)
    } catch (err) {
      setError('Failed to update queue depth')
      console.error(err)
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
        <div className="input-container">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter queue depth"
            className="depth-input"
          />
          <button onClick={updateQueueDepth} className="update-button">
            Set Queue Depth
          </button>
        </div>
        <p className="description">
          Real-time queue depth from KEDA Clone Operator
        </p>
      </div>
    </div>
  )
}

export default App
