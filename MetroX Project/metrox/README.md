# MetroX — Smart Metro Management System

A modular, menu-driven **C++17 Object-Oriented Transit Management Application** engineered for college-level OOP demonstrations.

---

## 🚇 Project Overview

**MetroX** simulates a metropolitan subway network. It enables transit operators to administer stations, configure bidirectional track connections with weighted distances, manage train fleet capacity, register diverse passenger categories with automated concession rules, compute shortest rail paths using graph algorithms (Dijkstra & BFS), book tickets with simulated payment gateways, process cancellations with real-time seat release, and persist system state across sessions.

---

## 🏛️ OOP Principles Demonstrated

1. **Encapsulation**:
   - Internal state variables in `Station`, `Train`, `Route`, `Ticket`, and `Passenger` are private/protected and only accessible via validated getters and setters.
   - Train capacity invariants are strictly enforced to prevent negative occupancy or overselling beyond rated limits.

2. **Inheritance**:
   - `StudentPassenger` and `SeniorPassenger` inherit from base class `Passenger`.
   - `UPIPayment`, `CardPayment`, and `CashPayment` derive from abstract interface `Payment`.

3. **Abstraction & Interfaces**:
   - `Payment` defines a pure virtual interface `virtual bool pay(double amount) = 0;` and a virtual destructor. Consumers interact with payment providers polymorphically without knowing underlying implementation details.

4. **Runtime Polymorphism**:
   - Storing passengers via `std::unique_ptr<Passenger>`.
   - Dynamic dispatch for `getDiscount()` (`0%` Regular, `20%` Student, `30%` Senior) during ticket fare computation.
   - Dynamic dispatch for simulated payments via `Payment::pay()`.

5. **STL Containers & Modern C++**:
   - `std::vector` for station track connections, paths, and tokenization.
   - `std::map` for efficient $O(\log N)$ ID-based key-value lookups.
   - `std::priority_queue` for Dijkstra's min-heap implementation.
   - `std::queue` for Breadth-First Search (BFS) graph traversal.
   - `std::unique_ptr` for safe automatic memory management without memory leaks.

6. **Graph Algorithms**:
   - **BFS (Breadth-First Search)**: Finds the route with the minimum number of station hops.
   - **Dijkstra's Algorithm**: Finds the optimal path with minimal physical distance (km) on a weighted directed/undirected graph.

7. **File Handling & Data Persistence**:
   - `FileManager` serializes and deserializes network topology, fleet status, polymorphic passenger records, and tickets using `std::ifstream` and `std::ofstream`.

---

## 📂 Project Directory Structure

```text
metrox/
├── include/
│   ├── Station.h           # Metro station entity with adjacency list
│   ├── Train.h             # Fleet train entity with capacity guardrails
│   ├── Route.h             # Journey route representation
│   ├── Passenger.h         # Base passenger with virtual getDiscount()
│   ├── StudentPassenger.h  # Student passenger with 20% discount
│   ├── SeniorPassenger.h   # Senior passenger with 30% discount
│   ├── Ticket.h            # Issued transit ticket and boarding pass
│   ├── Payment.h           # Abstract base class for payment simulation
│   ├── UPIPayment.h        # UPI payment simulation implementation
│   ├── CardPayment.h       # Credit/Debit card simulation with validation
│   ├── CashPayment.h       # Cash payment simulation with change calculation
│   ├── MetroSystem.h       # Central controller coordinating operations
│   ├── RouteFinder.h       # BFS and Dijkstra shortest path algorithms
│   └── FileManager.h       # Text file persistence manager
├── src/
│   ├── Station.cpp
│   ├── Train.cpp
│   ├── Route.cpp
│   ├── Passenger.cpp
│   ├── StudentPassenger.cpp
│   ├── SeniorPassenger.cpp
│   ├── Ticket.cpp
│   ├── UPIPayment.cpp
│   ├── CardPayment.cpp
│   ├── CashPayment.cpp
│   ├── MetroSystem.cpp
│   ├── RouteFinder.cpp
│   └── FileManager.cpp
├── data/
│   ├── stations.txt        # Station coordinates and track links
│   ├── trains.txt          # Fleet metadata and passenger count
│   ├── passengers.txt      # Polymorphic passenger records
│   └── tickets.txt         # Booked and cancelled ticket history
├── tests/
│   └── test_cases.md       # Comprehensive test scenarios and walkthroughs
├── main.cpp                # Application entry point with 19-option menu loop
├── Makefile                # Build automation (all, run, clean)
├── .gitignore              # Build artifacts exclusion
└── README.md               # Documentation and execution guide
```

---

## 🛠️ Build & Run Instructions

### Prerequisites
- macOS or Linux with a C++17 compatible compiler (`clang++` or `g++`).
- GNU `make`.

### Quick Start Commands

From the `metrox/` directory:

```bash
# 1. Compile the application
make

# 2. Run the application
make run

# 3. Clean build artifacts
make clean
```

Or directly using `clang++` / `g++`:

```bash
clang++ -std=c++17 -Wall -Wextra -Iinclude main.cpp src/*.cpp -o bin/metrox
./bin/metrox
```

---

## 📋 Terminal Menu Options (1 - 19)

| Option | Operation | Description |
| :---: | :--- | :--- |
| `1` | **Add a station** | Creates a new station with unique auto-generated ID. |
| `2` | **Display all stations** | Displays all network stations, locations, and linked tracks. |
| `3` | **Connect two stations** | Adds a bidirectional weighted edge (distance in km) between two stations. |
| `4` | **Add a train** | Registers a new train with model name, passenger capacity, and status. |
| `5` | **Display trains and status** | Shows fleet details, capacity, onboard load, and occupancy rate. |
| `6` | **Register normal passenger** | Registers a standard passenger (0% fare discount). |
| `7` | **Register student passenger** | Registers student with college name and card ID (20% discount). |
| `8` | **Register senior passenger** | Registers senior citizen with age verification (30% discount). |
| `9` | **Display all passengers** | Lists all registered passengers polymorphically with category details. |
| `10` | **Find route (BFS)** | Finds path with minimum number of station hops. |
| `11` | **Find shortest route (Dijkstra)** | Computes path with minimum physical distance in km. |
| `12` | **Book a ticket** | Validates route, applies discount, simulates payment, and assigns seat. |
| `13` | **Cancel a ticket** | Cancels ticket, marks refund, and releases passenger seat on train. |
| `14` | **Display all tickets** | Shows all issued tickets and their booking / payment statuses. |
| `15` | **Simulate payment** | Standalone tool to test UPI, Card, or Cash change calculation. |
| `16` | **Display train capacity** | Visual ASCII load monitor showing fleet capacity bars. |
| `17` | **Save system data** | Persists all network, fleet, passenger, and ticket data to text files. |
| `18` | **Load saved system data** | Reloads stored data from files with safe ID counter synchronization. |
| `19` | **Exit** | Terminates the application cleanly. |

---

## 💳 Payment Simulation Notice

All payments (UPI, Card, Cash) are **pure simulations** designed strictly for demonstration. **No real banking APIs or financial transactions are ever conducted.**

---

## 💡 Example Interactive Session

### Dijkstra Route Query
```text
Select an option (1-19): 11
Enter Origin Station ID: 1
Enter Destination Station ID: 4

=======================================================
  ROUTE FOUND VIA: Dijkstra's Shortest Path Algorithm
=======================================================
Total Stations in Journey : 3 stops (2 hops)
Total Journey Distance     : 13.30 km
-------------------------------------------------------
Itinerary:
   1. [1] Central Terminal (Downtown Hub)
       │ (4.2 km)
       ▼
   2. [2] Tech Park (Cyber City)
       │ (9.1 km)
       ▼
   3. [4] Airport Express (North Terminal)  [DESTINATION ARRIVAL]
=======================================================
```

### Ticket Booking with Student Discount & UPI
```text
Select an option (1-19): 12
Enter Passenger ID: 2
Enter Origin Station ID: 1
Enter Destination Station ID: 4
Enter Train ID to assign: 101

---------------- FARE SUMMARY ----------------
 Passenger Category : Student
 Distance           : 13.30 km
 Base Fare          : ₹56.55
 Concession Rate    : 20% (-₹11.31)
 Net Payable Amount : ₹45.24
----------------------------------------------
Select Payment Method:
  1. UPI
Choose option (1-4): 1
Enter UPI Virtual Payment Address: student@okaxis

=========================================
        [SIMULATION] UPI PAYMENT         
=========================================
>> Initiating payment of ₹45.24
>> Resolving VPA: student@okaxis ... [OK]
>> Sending push authorization request...
[SUCCESS] ₹45.24 debited via UPI simulation (Ref: UPI847291)
=========================================

=======================================================
               METROX TRANSIT BOARDING PASS            
=======================================================
 Ticket Number   : #1002
 Booking Time    : 2026-10-20 20:15:00
 Passenger       : David Chen (ID: 2, Category: Student)
 Assigned Train  : Red Line Metro - 01 (ID: 101)
 Journey         : Central Terminal [#1]  --->  Airport Express [#4]
 Total Distance  : 13.30 km
-------------------------------------------------------
 Base Fare       : ₹56.55
 Concession      : 20% (-₹11.31)
 Total Fare Paid : ₹45.24
 Payment Method  : UPI (Simulated)
 Booking Status  : CONFIRMED
 Payment Status  : PAID
=======================================================
```
