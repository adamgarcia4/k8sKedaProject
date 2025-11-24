FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /metrics-server

FROM scratch

WORKDIR /

COPY --from=builder /metrics-server /metrics-server

EXPOSE 8080

ENTRYPOINT ["/metrics-server"]