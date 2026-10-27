.PHONY: help build run run-cli start-cpp start-server start-frontend clean

help:
	@echo "MetroX Full-Stack Control Commands:"
	@echo "  make build           - Build C++ CLI and REST Server binaries"
	@echo "  make run-cli         - Run the interactive C++ terminal application"
	@echo "  make start-cpp       - Launch C++ REST Engine on http://localhost:8080"
	@echo "  make start-server    - Launch Express Gateway on http://localhost:3000"
	@echo "  make start-frontend  - Launch React Vite UI on http://localhost:5173"
	@echo "  make clean           - Clean C++ build artifacts"

build:
	$(MAKE) -C "MetroX Project/metrox" all

run-cli:
	$(MAKE) -C "MetroX Project/metrox" run

run: run-cli

start-cpp:
	$(MAKE) -C "MetroX Project/metrox" run-server

start-server:
	cd server && npm start

start-frontend:
	cd frontend && npm run dev

clean:
	$(MAKE) -C "MetroX Project/metrox" clean
