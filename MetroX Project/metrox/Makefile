CXX ?= clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic -Iinclude -O2
SRCDIR = src
INCDIR = include
BINDIR = bin

TARGET = $(BINDIR)/metrox
SERVER_TARGET = $(BINDIR)/metrox_server

SHARED_SRCS = $(SRCDIR)/Station.cpp \
              $(SRCDIR)/Train.cpp \
              $(SRCDIR)/Route.cpp \
              $(SRCDIR)/Passenger.cpp \
              $(SRCDIR)/StudentPassenger.cpp \
              $(SRCDIR)/SeniorPassenger.cpp \
              $(SRCDIR)/Ticket.cpp \
              $(SRCDIR)/UPIPayment.cpp \
              $(SRCDIR)/CardPayment.cpp \
              $(SRCDIR)/CashPayment.cpp \
              $(SRCDIR)/RouteFinder.cpp \
              $(SRCDIR)/FileManager.cpp \
              $(SRCDIR)/MetroSystem.cpp

.PHONY: all run clean server run-server

all: $(TARGET) $(SERVER_TARGET)

$(TARGET): main.cpp $(SHARED_SRCS) | $(BINDIR)
	$(CXX) $(CXXFLAGS) -pthread -o $@ $^

$(SERVER_TARGET): server_main.cpp $(SHARED_SRCS) | $(BINDIR)
	$(CXX) $(CXXFLAGS) -pthread -o $@ $^

server: $(SERVER_TARGET)

$(BINDIR):
	mkdir -p $(BINDIR)

run: $(TARGET)
	./$(TARGET)

run-server: $(SERVER_TARGET)
	./$(SERVER_TARGET)

clean:
	rm -rf $(BINDIR) obj

