package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type QueueDepthResponse struct {
	QueueDepth int `json:"queueDepth"`
}

type QueueDepthConfig struct {
	QueueDepth int `json:"queueDepth"`
	mu         sync.RWMutex
}

func (q *QueueDepthConfig) SetQueueDepth(depth int) {
	q.mu.Lock()
	q.QueueDepth = depth
	q.mu.Unlock()
}

func (q *QueueDepthConfig) GetQueueDepth() int {
	q.mu.RLock()
	defer q.mu.RUnlock()
	return q.QueueDepth
}

var (
	queueDepthConfig *QueueDepthConfig = &QueueDepthConfig{
		QueueDepth: 3,
		mu:         sync.RWMutex{},
	}
)

func main() {
	server := gin.Default()
	server.Use(cors.Default())

	server.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "OK",
		})
	})

	server.GET("/queueDepth", func(ctx *gin.Context) {
		depth := queueDepthConfig.GetQueueDepth()

		ctx.JSON(http.StatusOK, gin.H{
			"QueueDepth": depth,
			"message":    "pong8",
		})

		log.Printf("Served /queueDepth: %d", depth)
	})

	server.POST("/queueDepth", func(ctx *gin.Context) {
		var req struct {
			QueueDepth int `json:"queueDepth" binding:"required"`
		}

		if err := ctx.ShouldBindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		queueDepthConfig.SetQueueDepth(req.QueueDepth)

		log.Printf("Set queue depth to: %d", req.QueueDepth)

		ctx.JSON(http.StatusOK, gin.H{
			"QueueDepth": req.QueueDepth,
			"message":    "Queue depth updated",
		})
	})

	if err := server.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
