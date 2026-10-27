# MetroX — Test Cases & Verification Suite

This document outlines standard test scenarios for verifying the **MetroX — Smart Metro Management System**.

---

## Test Suite Overview

| Test ID | Module / Feature | Description | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | Stations Management | Add a new station and display list | Station is registered with auto-increment ID and displayed in network view |
| **TC-02** | Track Connectivity | Connect two existing stations with distance (km) | Bidirectional edge created in adjacency list; visible in both stations' connections |
| **TC-03** | Train Fleet & Capacity | Add train with capacity and initial status | Train appears in fleet with 0 onboard passengers and 100% available seats |
| **TC-04** | Normal Passenger | Register regular passenger | Passenger stored with 0% discount eligibility |
| **TC-05** | Student Passenger | Register student passenger with college & ID | Polymorphic subtype stored; 20% discount applied during fare calculation |
| **TC-06** | Senior Citizen | Register senior passenger with age >= 60 | Polymorphic subtype stored; 30% discount applied during fare calculation |
| **TC-07** | BFS Route Finding | Query path between Central Terminal & Airport Express | Finds path with minimum station hops; displays itinerary and hop count |
| **TC-08** | Dijkstra Route Finding | Query shortest distance between two stations | Finds route with minimal physical distance (km) using min-priority queue |
| **TC-09** | Ticket Booking (UPI) | Book journey for student passenger using UPI simulation | Fare discounted by 20%; seat booked on train; boarding pass printed |
| **TC-10** | Ticket Booking (Card) | Book journey using simulated Card payment | Validates 16 digits and CVV; completes simulation and issues ticket |
| **TC-11** | Ticket Booking (Cash) | Book journey paying cash with change calculation | Correct change returned = Cash Tendered - Ticket Fare; boarding pass printed |
| **TC-12** | Payment Failure Handling | Attempt payment with invalid UPI ID / insufficient cash | Transaction fails; ticket is NOT issued; train seat is NOT reserved |
| **TC-13** | Ticket Cancellation | Cancel active confirmed ticket | Status marked CANCELLED; refund noted; train passenger count decremented |
| **TC-14** | Capacity Guardrail | Attempt to book ticket when train capacity is full | System prevents booking and informs train capacity reached |
| **TC-15** | Data Persistence (Save) | Save system state to `data/` files | `stations.txt`, `trains.txt`, `passengers.txt`, `tickets.txt` written |
| **TC-16** | Data Persistence (Load) | Reload system state from `data/` files | All stations, trains, polymorphic passengers, and tickets restored accurately |
| **TC-17** | Input Robustness | Enter alphabetical characters when number is expected | Input buffer cleared; user prompted again without program crash |

---

## Detailed Step-by-Step Test Scenarios

### TC-08: Shortest Path Routing via Dijkstra's Algorithm
1. From Main Menu, select `[11] Find shortest-distance route (Dijkstra's Algorithm)`.
2. Enter Origin Station ID: `1` (Central Terminal).
3. Enter Destination Station ID: `4` (Airport Express).
4. **Verification**:
   - Route found: Station 1 -> Station 2 -> Station 4.
   - Segment distances: (1 -> 2: 4.2 km), (2 -> 4: 9.1 km).
   - Total Distance: `13.30 km`.

### TC-05 & TC-09: Polymorphic Fare Discount & UPI Payment
1. Register Student Passenger:
   - Name: `Rohan Sharma`
   - Email: `rohan@college.edu`
   - College: `IIT Delhi`
   - Student Card ID: `IITD-2024-91`
2. Select `[12] Book a ticket`.
3. Choose Passenger ID corresponding to Rohan.
4. Select Origin `1` and Destination `4`.
5. Select Train `101`.
6. **Verification of Fare Calculation**:
   - Distance: 13.30 km.
   - Base Fare = `10.00 + (3.50 * 13.30) = ₹56.55`.
   - Concession: Student discount (20%) = `-₹11.31`.
   - Net Payable: `₹45.24`.
7. Select Payment Method `[1] UPI`.
8. Enter VPA: `rohan@okhdfcbank`.
9. **Verification of Payment & Ticket**:
   - UPI simulation confirms approval.
   - Boarding pass printed with Ticket ID `#1002`.
   - Train `101` passenger count increases by 1.

### TC-11: Cash Payment Simulation & Change Calculation
1. From Main Menu, select `[15] Simulate payment using UPI, card, or cash`.
2. Enter amount: `75.00`.
3. Choose option `[3] Cash Payment`.
4. Enter Cash Tendered: `100.00`.
5. **Verification**:
   - Amount Billed: ₹75.00
   - Cash Received: ₹100.00
   - Change Returned: ₹25.00
   - Status: Approved simulation.

### TC-13: Ticket Cancellation & Capacity Release
1. Select `[13] Cancel a ticket`.
2. Enter Ticket ID: `1001` (or newly booked ticket).
3. **Verification**:
   - Status updated to `CANCELLED`.
   - Refund processed.
   - Train capacity released (onboard passenger count decremented).

### TC-15 & TC-16: File Persistence Verification
1. Select `[17] Save system data to files`.
2. Inspect `data/` folder files (`stations.txt`, `trains.txt`, `passengers.txt`, `tickets.txt`).
3. Select `[18] Load saved system data`.
4. Select `[9] Display all passengers` and `[14] Display all tickets` to verify that restored objects maintain full polymorphic integrity and correct IDs.
