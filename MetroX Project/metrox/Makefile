CXX ?= clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic -Iinclude -O2
SRCDIR = src
INCDIR = include
OBJDIR = obj
BINDIR = bin

TARGET = $(BINDIR)/metrox
SERVER_TARGET = $(BINDIR)/metrox_server

SRCS = main.cpp \
       $(SRCDIR)/Station.cpp \
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

SHARED_OBJS = $(OBJDIR)/Station.o \
              $(OBJDIR)/Train.o \
              $(OBJDIR)/Route.o \
              $(OBJDIR)/Passenger.o \
              $(OBJDIR)/StudentPassenger.o \
              $(OBJDIR)/SeniorPassenger.o \
              $(OBJDIR)/Ticket.o \
              $(OBJDIR)/UPIPayment.o \
              $(OBJDIR)/CardPayment.o \
              $(OBJDIR)/CashPayment.o \
              $(OBJDIR)/RouteFinder.o \
              $(OBJDIR)/FileManager.o \
              $(OBJDIR)/MetroSystem.o

.PHONY: all run clean server run-server

all: $(TARGET) $(SERVER_TARGET)

$(TARGET): $(OBJDIR)/main.o $(SHARED_OBJS) | $(BINDIR)
	$(CXX) $(CXXFLAGS) -pthread -o $@ $^

$(SERVER_TARGET): $(OBJDIR)/server_main.o $(SHARED_OBJS) | $(BINDIR)
	$(CXX) $(CXXFLAGS) -pthread -o $@ $^

server: $(SERVER_TARGET)

$(OBJDIR)/%.o: %.cpp | $(OBJDIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp | $(OBJDIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJDIR):
	mkdir -p $(OBJDIR)

$(BINDIR):
	mkdir -p $(BINDIR)

run: $(TARGET)
	./$(TARGET)

run-server: $(SERVER_TARGET)
	./$(SERVER_TARGET)

clean:
	rm -rf $(OBJDIR) $(BINDIR)

