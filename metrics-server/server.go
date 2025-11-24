package main

import (
	"log"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QueueDepthResponse struct {
	QueueDepth int `json:"queueDepth"`
	hello      string
}

func main() {
	server := gin.Default()

	server.GET("/queueDepth", func(ctx *gin.Context) {
		depth := rand.Intn(101)
		ctx.JSON(http.StatusOK, gin.H{
			"QueueDepth": depth,
			"message":    "pong2",
		})

		log.Printf("Served /queueDepth: %d", depth)

	})

	if err := server.Run(); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
