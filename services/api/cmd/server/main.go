package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	port := resolvePort()

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", healthHandler)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("server starting on :%s", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func resolvePort() string {
	if p := os.Getenv("PORT"); p != "" {
		return p
	}
	return "8080"
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}
