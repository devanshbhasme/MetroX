#include "../include/MetroSystem.h"
#include "../include/RouteFinder.h"
#include "../include/FileManager.h"
#include "../include/UPIPayment.h"
#include "../include/CardPayment.h"
#include "../include/CashPayment.h"

#include <iostream>
#include <iomanip>
#include <limits>
#include <algorithm>
#include <cmath>

MetroSystem::MetroSystem()
    : nextStationId(1), nextTrainId(101), nextPassengerId(1), nextTicketId(1001),
      baseFare(10.0), ratePerKm(3.50), dataDirectory("data") {}

void MetroSystem::seedSampleData() {
    // Only seed if empty
    if (!stations.empty() || !trains.empty()) return;

    std::cout << "[SYSTEM] Initializing sample metro network topology...\n";

    // 1. Stations
    stations[1] = Station(1, "Central Terminal", "Downtown Hub");
    stations[2] = Station(2, "Tech Park", "Cyber City");
    stations[3] = Station(3, "University Square", "Campus District");
    stations[4] = Station(4, "Airport Express", "North Terminal");
    stations[5] = Station(5, "South Ridge", "Suburban Sector");
    stations[6] = Station(6, "Harbor Point", "Coastal Bay");

    // Connections (Bidirectional weighted edges in km)
    stations[1].addConnection(2, 4.2);
    stations[2].addConnection(1, 4.2);

    stations[2].addConnection(3, 3.8);
    stations[3].addConnection(2, 3.8);

    stations[1].addConnection(3, 6.5);
    stations[3].addConnection(1, 6.5);

    stations[2].addConnection(4, 9.1);
    stations[4].addConnection(2, 9.1);

    stations[1].addConnection(5, 5.0);
    stations[5].addConnection(1, 5.0);

    stations[5].addConnection(6, 4.0);
    stations[6].addConnection(5, 4.0);

    stations[3].addConnection(6, 8.4);
    stations[6].addConnection(3, 8.4);

    nextStationId = 7;

    // 2. Trains
    trains[101] = Train(101, "Red Line Metro - 01", 150, "IN_SERVICE");
    trains[102] = Train(102, "Blue Line Metro - 02", 200, "IN_SERVICE");
    trains[103] = Train(103, "Airport Shuttle - 03", 100, "IN_SERVICE");
    trains[104] = Train(104, "Green Line Standby", 180, "STANDBY");

    nextTrainId = 105;

    // 3. Sample Passengers (Polymorphic hierarchy)
    passengers[1] = std::make_unique<Passenger>(1, "Alex Morgan", "alex.morgan@email.com");
    passengers[2] = std::make_unique<StudentPassenger>(2, "David Chen", "david.chen@univ.edu", "National Institute of Tech", "STU-8821");
    passengers[3] = std::make_unique<SeniorPassenger>(3, "Robert Wilson", "r.wilson@seniorcare.org", 68, "SR-55201");

    nextPassengerId = 4;
}

// ---------------- MENU OPERATIONS ----------------

void MetroSystem::addStationMenu() {
    std::cout << "\n--- Add New Station ---\n";
    std::string name = readLine("Enter Station Name (e.g., Grand Plaza): ");
    if (name.empty()) {
        std::cout << "[ERROR] Station name cannot be empty.\n";
        return;
    }
    std::string location = readLine("Enter Station Location / Area (e.g., Sector 14): ");

    int id = nextStationId++;
    stations[id] = Station(id, name, location);
    std::cout << "[SUCCESS] Station '" << name << "' added successfully with ID [" << id << "].\n";
}

void MetroSystem::displayAllStations() const {
    std::cout << "\n=======================================================\n";
    std::cout << "                 METROX STATION NETWORK                \n";
    std::cout << "=======================================================\n";
    if (stations.empty()) {
        std::cout << "No stations registered in the network.\n";
        return;
    }
    for (const auto& [id, st] : stations) {
        st.display();
    }
    std::cout << "Total Stations: " << stations.size() << "\n";
    std::cout << "=======================================================\n";
}

void MetroSystem::connectStationsMenu() {
    std::cout << "\n--- Connect Two Stations ---\n";
    if (stations.size() < 2) {
        std::cout << "[ERROR] At least 2 stations must exist to create a track connection.\n";
        return;
    }
    displayAllStations();

    int id1 = readInt("Enter Source Station ID: ", 1);
    if (stations.find(id1) == stations.end()) {
        std::cout << "[ERROR] Station ID [" << id1 << "] does not exist.\n";
        return;
    }

    int id2 = readInt("Enter Destination Station ID: ", 1);
    if (stations.find(id2) == stations.end()) {
        std::cout << "[ERROR] Station ID [" << id2 << "] does not exist.\n";
        return;
    }

    if (id1 == id2) {
        std::cout << "[ERROR] Source and destination stations must be distinct.\n";
        return;
    }

    double dist = readDouble("Enter track distance between them in km (e.g., 5.4): ", 0.1, 500.0);

    // Bidirectional connection
    stations[id1].addConnection(id2, dist);
    stations[id2].addConnection(id1, dist);

    std::cout << "[SUCCESS] Connected Station [" << id1 << "] (" << stations.at(id1).getName() << ") <---> "
              << "Station [" << id2 << "] (" << stations.at(id2).getName() << ") with distance "
              << std::fixed << std::setprecision(1) << dist << " km.\n";
}

void MetroSystem::addTrainMenu() {
    std::cout << "\n--- Add New Train ---\n";
    std::string name = readLine("Enter Train Name / Line Model (e.g., Silver Express 401): ");
    if (name.empty()) {
        std::cout << "[ERROR] Train name cannot be empty.\n";
        return;
    }
    int capacity = readInt("Enter Passenger Capacity (e.g., 200): ", 10, 10000);

    std::cout << "Select Operational Status:\n";
    std::cout << "  1. IN_SERVICE (Active for passenger boarding)\n";
    std::cout << "  2. STANDBY\n";
    std::cout << "  3. MAINTENANCE\n";
    int statusChoice = readInt("Enter choice (1-3): ", 1, 3);
    std::string status = (statusChoice == 1) ? "IN_SERVICE" : (statusChoice == 2 ? "STANDBY" : "MAINTENANCE");

    int id = nextTrainId++;
    trains[id] = Train(id, name, capacity, status);
    std::cout << "[SUCCESS] Train '" << name << "' registered with ID [" << id << "] (Capacity: " << capacity << ").\n";
}

void MetroSystem::displayTrainsAndStatus() const {
    std::cout << "\n=========================================================================================\n";
    std::cout << "                               METROX TRAIN FLEET STATUS                                 \n";
    std::cout << "=========================================================================================\n";
    if (trains.empty()) {
        std::cout << "No trains registered in the fleet.\n";
        return;
    }
    for (const auto& [id, tr] : trains) {
        tr.display();
    }
    std::cout << "Total Trains in Fleet: " << trains.size() << "\n";
    std::cout << "=========================================================================================\n";
}

void MetroSystem::registerNormalPassengerMenu() {
    std::cout << "\n--- Register Regular Passenger ---\n";
    std::string name = readLine("Enter Passenger Full Name: ");
    if (name.empty()) {
        std::cout << "[ERROR] Name cannot be empty.\n";
        return;
    }
    std::string email = readLine("Enter Passenger Email: ");

    int id = nextPassengerId++;
    passengers[id] = std::make_unique<Passenger>(id, name, email);
    std::cout << "[SUCCESS] Regular Passenger registered with ID [" << id << "] (Standard Fare, 0% discount).\n";
}

void MetroSystem::registerStudentPassengerMenu() {
    std::cout << "\n--- Register Student Passenger ---\n";
    std::string name = readLine("Enter Student Full Name: ");
    if (name.empty()) {
        std::cout << "[ERROR] Name cannot be empty.\n";
        return;
    }
    std::string email = readLine("Enter Student Email: ");
    std::string college = readLine("Enter College / University Name: ");
    std::string cardId = readLine("Enter Student ID Card Number: ");

    int id = nextPassengerId++;
    passengers[id] = std::make_unique<StudentPassenger>(id, name, email, college, cardId);
    std::cout << "[SUCCESS] Student Passenger registered with ID [" << id 
              << "] (Eligible for 20% Concession).\n";
}

void MetroSystem::registerSeniorPassengerMenu() {
    std::cout << "\n--- Register Senior Citizen Passenger ---\n";
    std::string name = readLine("Enter Senior Citizen Full Name: ");
    if (name.empty()) {
        std::cout << "[ERROR] Name cannot be empty.\n";
        return;
    }
    std::string email = readLine("Enter Email: ");
    int age = readInt("Enter Age (must be 60 or above): ", 60, 130);
    std::string cardId = readLine("Enter Senior Citizen Card / ID Proof: ");

    int id = nextPassengerId++;
    passengers[id] = std::make_unique<SeniorPassenger>(id, name, email, age, cardId);
    std::cout << "[SUCCESS] Senior Citizen registered with ID [" << id 
              << "] (Eligible for 30% Concession).\n";
}

void MetroSystem::displayAllPassengers() const {
    std::cout << "\n=========================================================================================\n";
    std::cout << "                                METROX REGISTERED PASSENGERS                             \n";
    std::cout << "=========================================================================================\n";
    if (passengers.empty()) {
        std::cout << "No passengers registered.\n";
        return;
    }
    for (const auto& [id, pPassenger] : passengers) {
        if (pPassenger) {
            pPassenger->display(); // Polymorphic call
        }
    }
    std::cout << "Total Registered Passengers: " << passengers.size() << "\n";
    std::cout << "=========================================================================================\n";
}

void MetroSystem::findRouteBFSMenu() const {
    std::cout << "\n--- Find Route (Minimum Stops / BFS) ---\n";
    if (stations.size() < 2) {
        std::cout << "[ERROR] Need at least 2 stations to calculate routes.\n";
        return;
    }
    displayAllStations();

    int srcId = readInt("Enter Origin Station ID: ", 1);
    if (stations.find(srcId) == stations.end()) {
        std::cout << "[ERROR] Origin Station [" << srcId << "] not found.\n";
        return;
    }

    int destId = readInt("Enter Destination Station ID: ", 1);
    if (stations.find(destId) == stations.end()) {
        std::cout << "[ERROR] Destination Station [" << destId << "] not found.\n";
        return;
    }

    if (srcId == destId) {
        std::cout << "[NOTICE] Origin and destination are the same station (0 stops, 0.0 km).\n";
        return;
    }

    std::vector<int> path;
    double dist = 0.0;
    bool found = RouteFinder::findRouteBFS(stations, srcId, destId, path, dist);
    if (found) {
        RouteFinder::printRouteSummary(path, dist, stations, "Breadth-First Search (Minimum Stops)");
    } else {
        std::cout << "[ERROR] No connected rail route exists between Station [" << srcId << "] and Station [" << destId << "].\n";
    }
}

void MetroSystem::findShortestRouteDijkstraMenu() const {
    std::cout << "\n--- Find Shortest Route (Dijkstra's Algorithm) ---\n";
    if (stations.size() < 2) {
        std::cout << "[ERROR] Need at least 2 stations to calculate routes.\n";
        return;
    }
    displayAllStations();

    int srcId = readInt("Enter Origin Station ID: ", 1);
    if (stations.find(srcId) == stations.end()) {
        std::cout << "[ERROR] Origin Station [" << srcId << "] not found.\n";
        return;
    }

    int destId = readInt("Enter Destination Station ID: ", 1);
    if (stations.find(destId) == stations.end()) {
        std::cout << "[ERROR] Destination Station [" << destId << "] not found.\n";
        return;
    }

    if (srcId == destId) {
        std::cout << "[NOTICE] Origin and destination are the same station (0.0 km).\n";
        return;
    }

    std::vector<int> path;
    double dist = 0.0;
    bool found = RouteFinder::findShortestRouteDijkstra(stations, srcId, destId, path, dist);
    if (found) {
        RouteFinder::printRouteSummary(path, dist, stations, "Dijkstra's Shortest Path Algorithm");
    } else {
        std::cout << "[ERROR] No connected rail path exists between Station [" << srcId << "] and Station [" << destId << "].\n";
    }
}

double MetroSystem::calculateFare(double distance, double discountFraction) const {
    double base = baseFare + (ratePerKm * distance);
    double discount = base * discountFraction;
    double finalFare = base - discount;
    return std::max(finalFare, 5.0); // Minimum fare threshold
}

void MetroSystem::bookTicketMenu() {
    std::cout << "\n--- Book Metro Ticket ---\n";

    if (passengers.empty()) {
        std::cout << "[ERROR] No registered passengers found. Please register a passenger first (Menu 6, 7, or 8).\n";
        return;
    }
    if (stations.size() < 2) {
        std::cout << "[ERROR] Need at least 2 connected stations to book a journey.\n";
        return;
    }
    if (trains.empty()) {
        std::cout << "[ERROR] No trains registered in the fleet. Please add a train first (Menu 4).\n";
        return;
    }

    // 1. Select Passenger
    displayAllPassengers();
    int pId = readInt("Enter Passenger ID: ", 1);
    auto pIt = passengers.find(pId);
    if (pIt == passengers.end() || !pIt->second) {
        std::cout << "[ERROR] Passenger ID [" << pId << "] not found.\n";
        return;
    }
    const auto& passenger = pIt->second;

    // 2. Select Route
    displayAllStations();
    int srcId = readInt("Enter Origin Station ID: ", 1);
    if (stations.find(srcId) == stations.end()) {
        std::cout << "[ERROR] Origin Station ID [" << srcId << "] does not exist.\n";
        return;
    }

    int destId = readInt("Enter Destination Station ID: ", 1);
    if (stations.find(destId) == stations.end()) {
        std::cout << "[ERROR] Destination Station ID [" << destId << "] does not exist.\n";
        return;
    }

    if (srcId == destId) {
        std::cout << "[ERROR] Origin and Destination stations must be distinct.\n";
        return;
    }

    // 3. Find valid shortest route
    std::vector<int> path;
    double journeyDistance = 0.0;
    bool routeFound = RouteFinder::findShortestRouteDijkstra(stations, srcId, destId, path, journeyDistance);
    if (!routeFound) {
        std::cout << "[ERROR] No connected path between Station [" << srcId << "] and [" << destId << "]. Cannot proceed with booking.\n";
        return;
    }

    std::cout << "\n[OK] Path Verified! Shortest Track Distance: " 
              << std::fixed << std::setprecision(2) << journeyDistance << " km across " 
              << path.size() << " stations.\n";

    // 4. Select Train and Validate Capacity
    std::cout << "\nAvailable Trains for Departure:\n";
    std::vector<int> eligibleTrains;
    for (const auto& [tId, tr] : trains) {
        if (tr.getStatus() == "IN_SERVICE" && tr.canBoard(1)) {
            eligibleTrains.push_back(tId);
            std::cout << "  [" << tId << "] " << tr.getName() << " | Available Seats: " 
                      << tr.getAvailableCapacity() << " / " << tr.getCapacity() << "\n";
        }
    }

    if (eligibleTrains.empty()) {
        std::cout << "[ERROR] No trains in service currently have available capacity! All trains are full or out of service.\n";
        return;
    }

    int chosenTrainId = readInt("Enter Train ID to assign: ", 1);
    auto trIt = trains.find(chosenTrainId);
    if (trIt == trains.end()) {
        std::cout << "[ERROR] Train ID [" << chosenTrainId << "] does not exist.\n";
        return;
    }

    Train& train = trIt->second;
    if (train.getStatus() != "IN_SERVICE") {
        std::cout << "[ERROR] Train [" << chosenTrainId << "] is currently " << train.getStatus() 
                  << " and not accepting passengers.\n";
        return;
    }
    if (!train.canBoard(1)) {
        std::cout << "[ERROR] Train [" << chosenTrainId << "] has reached full capacity (" 
                  << train.getCapacity() << " seats). Booking cannot proceed.\n";
        return;
    }

    // 5. Calculate Fare using Polymorphic Passenger Discount
    double rawBaseFare = baseFare + (ratePerKm * journeyDistance);
    double discountFraction = passenger->getDiscount(); // Runtime polymorphism!
    double discountAmount = rawBaseFare * discountFraction;
    double finalFare = rawBaseFare - discountAmount;
    if (finalFare < 5.0) finalFare = 5.0; // minimum floor

    std::cout << "\n---------------- FARE SUMMARY ----------------\n";
    std::cout << " Passenger Category : " << passenger->getPassengerType() << "\n";
    std::cout << " Distance           : " << std::fixed << std::setprecision(2) << journeyDistance << " km\n";
    std::cout << " Base Fare          : ₹" << std::fixed << std::setprecision(2) << rawBaseFare << "\n";
    std::cout << " Concession Rate    : " << std::fixed << std::setprecision(0) << (discountFraction * 100.0) 
              << "% (-₹" << std::setprecision(2) << discountAmount << ")\n";
    std::cout << " Net Payable Amount : ₹" << std::fixed << std::setprecision(2) << finalFare << "\n";
    std::cout << "----------------------------------------------\n";

    // 6. Select Payment Method
    std::cout << "Select Payment Method:\n";
    std::cout << "  1. UPI (Google Pay, PhonePe, Paytm simulation)\n";
    std::cout << "  2. Credit / Debit Card simulation\n";
    std::cout << "  3. Cash (Ticket Vending Machine / Counter simulation)\n";
    std::cout << "  4. Cancel Booking\n";
    int payChoice = readInt("Choose option (1-4): ", 1, 4);

    if (payChoice == 4) {
        std::cout << "[INFO] Booking aborted by user.\n";
        return;
    }

    std::unique_ptr<Payment> paymentHandler;
    std::string chosenMethodName;

    if (payChoice == 1) {
        std::string vpa = readLine("Enter UPI Virtual Payment Address (e.g. user@okhdfcbank): ");
        paymentHandler = std::make_unique<UPIPayment>(vpa);
        chosenMethodName = "UPI";
    } else if (payChoice == 2) {
        std::string cNum = readLine("Enter 16-Digit Card Number: ");
        std::string cHolder = readLine("Enter Cardholder Name: ");
        std::string cExp = readLine("Enter Card Expiry (MM/YY): ");
        std::string cCvv = readLine("Enter 3-digit CVV: ");
        paymentHandler = std::make_unique<CardPayment>(cNum, cHolder, cExp, cCvv);
        chosenMethodName = "Card";
    } else {
        paymentHandler = std::make_unique<CashPayment>();
        chosenMethodName = "Cash";
    }

    // 7. Execute Simulated Payment
    bool paymentSuccess = paymentHandler->pay(finalFare);
    if (!paymentSuccess) {
        std::cout << "[BOOKING FAILED] Payment simulation was not successful. Ticket will NOT be issued.\n";
        return;
    }

    // 8. On Payment Success: Board passenger onto train & Issue Ticket
    train.boardPassengers(1);

    int newTicketId = nextTicketId++;
    Ticket newTicket(newTicketId, pId, srcId, destId, chosenTrainId,
                     journeyDistance, rawBaseFare, discountFraction, finalFare, chosenMethodName);
    tickets[newTicketId] = newTicket;

    std::cout << "[BOOKING CONFIRMED] Payment authorized and ticket booked successfully!\n";
    newTicket.displayDetailed(passenger->getName(), passenger->getPassengerType(),
                             stations.at(srcId).getName(), stations.at(destId).getName(),
                             train.getName());
}

void MetroSystem::cancelTicketMenu() {
    std::cout << "\n--- Cancel Ticket ---\n";
    if (tickets.empty()) {
        std::cout << "[INFO] No tickets currently in the system.\n";
        return;
    }

    // Display confirmed tickets
    std::cout << "Active Confirmed Tickets:\n";
    int activeCount = 0;
    for (const auto& [tId, tkt] : tickets) {
        if (tkt.isBooked()) {
            tkt.display();
            activeCount++;
        }
    }

    if (activeCount == 0) {
        std::cout << "[INFO] No active confirmed tickets eligible for cancellation.\n";
        return;
    }

    int cancelId = readInt("Enter Ticket ID to cancel: ", 1);
    auto tIt = tickets.find(cancelId);
    if (tIt == tickets.end()) {
        std::cout << "[ERROR] Ticket #" << cancelId << " not found.\n";
        return;
    }

    Ticket& tkt = tIt->second;
    if (!tkt.isBooked()) {
        std::cout << "[ERROR] Ticket #" << cancelId << " is already " << tkt.getBookingStatus() 
                  << ". Only active CONFIRMED tickets can be cancelled.\n";
        return;
    }

    // Cancel ticket and release train seat
    if (tkt.cancelTicket()) {
        // Release train capacity
        auto trIt = trains.find(tkt.getTrainId());
        if (trIt != trains.end()) {
            trIt->second.alightPassengers(1);
        }

        std::cout << "\n=======================================================\n";
        std::cout << "             TICKET CANCELLATION SUCCESSFUL            \n";
        std::cout << "=======================================================\n";
        std::cout << " Ticket ID       : #" << cancelId << "\n";
        std::cout << " Refund Amount   : ₹" << std::fixed << std::setprecision(2) << tkt.getFinalFare() << "\n";
        std::cout << " Refund Method   : Original Payment Method (" << tkt.getPaymentMethod() << ")\n";
        std::cout << " Train Seat      : Released on Train [" << tkt.getTrainId() << "]\n";
        std::cout << " New Status      : CANCELLED (Refund Processed)\n";
        std::cout << "=======================================================\n\n";
    }
}

void MetroSystem::displayAllTickets() const {
    std::cout << "\n====================================================================================================\n";
    std::cout << "                                      METROX ISSUED TICKETS                                         \n";
    std::cout << "====================================================================================================\n";
    if (tickets.empty()) {
        std::cout << "No tickets have been booked yet.\n";
        return;
    }
    for (const auto& [id, tkt] : tickets) {
        tkt.display();
    }
    std::cout << "Total Tickets: " << tickets.size() << "\n";
    std::cout << "====================================================================================================\n";
}

void MetroSystem::simulateStandalonePaymentMenu() {
    std::cout << "\n--- Standalone Payment Gateway Simulator ---\n";
    std::cout << "This tool demonstrates the polymorphic Payment subsystem independently.\n";
    double amt = readDouble("Enter simulated billing amount (₹): ", 1.0, 50000.0);

    std::cout << "Select Payment Channel:\n";
    std::cout << "  1. UPI Payment Simulation\n";
    std::cout << "  2. Debit/Credit Card Simulation\n";
    std::cout << "  3. Cash Payment Simulation (with Change Calculation)\n";
    int choice = readInt("Choose channel (1-3): ", 1, 3);

    std::unique_ptr<Payment> pGateway;
    if (choice == 1) {
        std::string vpa = readLine("Enter simulated UPI ID (e.g., student@okicici): ");
        pGateway = std::make_unique<UPIPayment>(vpa);
    } else if (choice == 2) {
        std::string cNum = readLine("Enter Card Number: ");
        std::string cName = readLine("Enter Cardholder Name: ");
        std::string exp = readLine("Enter Expiry (MM/YY): ");
        std::string cvv = readLine("Enter CVV: ");
        pGateway = std::make_unique<CardPayment>(cNum, cName, exp, cvv);
    } else {
        double tendered = readDouble("Enter Cash Tendered by Customer (₹): ", 0.0, 100000.0);
        pGateway = std::make_unique<CashPayment>(tendered);
    }

    std::cout << "\nExecuting simulation through interface [Payment::pay()]...\n";
    bool success = pGateway->pay(amt);
    if (success) {
        std::cout << "[GATEWAY REPORT] Simulation outcome: APPROVED via " << pGateway->getMethodName() << "\n";
    } else {
        std::cout << "[GATEWAY REPORT] Simulation outcome: DECLINED / INSUFFICIENT via " << pGateway->getMethodName() << "\n";
    }
}

void MetroSystem::displayTrainCapacity() const {
    std::cout << "\n=========================================================================================\n";
    std::cout << "                               FLEET CAPACITY MONITOR                                    \n";
    std::cout << "=========================================================================================\n";
    if (trains.empty()) {
        std::cout << "No trains in fleet.\n";
        return;
    }

    for (const auto& [id, tr] : trains) {
        std::cout << "Train [" << id << "] " << std::setw(22) << std::left << tr.getName()
                  << " | " << std::setw(11) << tr.getStatus()
                  << " | Load: " << std::setw(3) << tr.getCurrentPassengers() << " / " << tr.getCapacity()
                  << " | Avail: " << std::setw(3) << tr.getAvailableCapacity()
                  << " | ";

        // Visual ASCII bar
        double pct = tr.getOccupancyRate();
        int filled = static_cast<int>(std::round(pct / 10.0));
        std::cout << "[";
        for (int i = 0; i < 10; ++i) {
            if (i < filled) std::cout << "#";
            else std::cout << "-";
        }
        std::cout << "] " << std::fixed << std::setprecision(1) << pct << "%\n";
    }
    std::cout << "=========================================================================================\n";
}

void MetroSystem::saveDataMenu() {
    std::cout << "\n--- Saving System Data to Files ---\n";
    FileManager::ensureDirectoryExists(dataDirectory);

    std::string stFile = dataDirectory + "/stations.txt";
    std::string trFile = dataDirectory + "/trains.txt";
    std::string psFile = dataDirectory + "/passengers.txt";
    std::string tkFile = dataDirectory + "/tickets.txt";

    bool ok1 = FileManager::saveStations(stFile, stations);
    bool ok2 = FileManager::saveTrains(trFile, trains);
    bool ok3 = FileManager::savePassengers(psFile, passengers);
    bool ok4 = FileManager::saveTickets(tkFile, tickets);

    if (ok1 && ok2 && ok3 && ok4) {
        std::cout << "[SUCCESS] All system entities saved successfully!\n";
        std::cout << "  - Stations:   " << stations.size() << " saved to " << stFile << "\n";
        std::cout << "  - Trains:     " << trains.size() << " saved to " << trFile << "\n";
        std::cout << "  - Passengers: " << passengers.size() << " saved to " << psFile << "\n";
        std::cout << "  - Tickets:    " << tickets.size() << " saved to " << tkFile << "\n";
    } else {
        std::cout << "[WARNING] Some files could not be saved. Check file permissions.\n";
    }
}

void MetroSystem::loadDataMenu() {
    std::cout << "\n--- Loading Saved System Data ---\n";
    std::string stFile = dataDirectory + "/stations.txt";
    std::string trFile = dataDirectory + "/trains.txt";
    std::string psFile = dataDirectory + "/passengers.txt";
    std::string tkFile = dataDirectory + "/tickets.txt";

    int maxSt = 0, maxTr = 100, maxPs = 0, maxTk = 1000;
    bool ok1 = FileManager::loadStations(stFile, stations, maxSt);
    bool ok2 = FileManager::loadTrains(trFile, trains, maxTr);
    bool ok3 = FileManager::loadPassengers(psFile, passengers, maxPs);
    bool ok4 = FileManager::loadTickets(tkFile, tickets, maxTk);

    if (ok1 || ok2 || ok3 || ok4) {
        if (maxSt >= nextStationId) nextStationId = maxSt + 1;
        if (maxTr >= nextTrainId) nextTrainId = maxTr + 1;
        if (maxPs >= nextPassengerId) nextPassengerId = maxPs + 1;
        if (maxTk >= nextTicketId) nextTicketId = maxTk + 1;

        std::cout << "[SUCCESS] Data loaded successfully!\n";
        std::cout << "  - Stations loaded   : " << stations.size() << "\n";
        std::cout << "  - Trains loaded     : " << trains.size() << "\n";
        std::cout << "  - Passengers loaded : " << passengers.size() << "\n";
        std::cout << "  - Tickets loaded    : " << tickets.size() << "\n";
    } else {
        std::cout << "[INFO] No existing data files found in '" << dataDirectory 
                  << "'. Initializing system with sample seed.\n";
        seedSampleData();
    }
}

// ---------------- SAFE INPUT HELPERS ----------------

void MetroSystem::clearInputBuffer() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

int MetroSystem::readInt(const std::string& prompt, int minVal, int maxVal) {
    int val;
    while (true) {
        std::cout << prompt;
        if (std::cin >> val) {
            if (val >= minVal && val <= maxVal) {
                clearInputBuffer();
                return val;
            }
            std::cout << "[INPUT ERROR] Please enter a number between " << minVal << " and " << maxVal << ".\n";
        } else {
            std::cout << "[INPUT ERROR] Invalid integer entered. Please try again.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        }
    }
}

double MetroSystem::readDouble(const std::string& prompt, double minVal, double maxVal) {
    double val;
    while (true) {
        std::cout << prompt;
        if (std::cin >> val) {
            if (val >= minVal && val <= maxVal) {
                clearInputBuffer();
                return val;
            }
            std::cout << "[INPUT ERROR] Value must be between " << minVal << " and " << maxVal << ".\n";
        } else {
            std::cout << "[INPUT ERROR] Invalid numeric value. Please try again.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        }
    }
}

std::string MetroSystem::readString(const std::string& prompt) {
    std::string val;
    while (true) {
        std::cout << prompt;
        if (std::cin >> val) {
            clearInputBuffer();
            return val;
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

std::string MetroSystem::readLine(const std::string& prompt) {
    std::cout << prompt;
    std::string line;
    std::getline(std::cin, line);
    // Trim leading and trailing whitespace
    size_t first = line.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "";
    size_t last = line.find_last_not_of(" \t\r\n");
    return line.substr(first, (last - first + 1));
}

// ---------------- PROGRAMMATIC SERVICE API IMPLEMENTATION ----------------

const std::map<int, Station>& MetroSystem::getStations() const {
    return stations;
}

const std::map<int, Train>& MetroSystem::getTrains() const {
    return trains;
}

const std::map<int, std::unique_ptr<Passenger>>& MetroSystem::getPassengers() const {
    return passengers;
}

const std::map<int, Ticket>& MetroSystem::getTickets() const {
    return tickets;
}

int MetroSystem::addStation(const std::string& name, const std::string& location) {
    if (name.empty()) return -1;
    int id = nextStationId++;
    stations[id] = Station(id, name, location);
    return id;
}

bool MetroSystem::connectStations(int id1, int id2, double distance) {
    if (id1 == id2 || distance <= 0.0) return false;
    auto it1 = stations.find(id1);
    auto it2 = stations.find(id2);
    if (it1 == stations.end() || it2 == stations.end()) return false;
    it1->second.addConnection(id2, distance);
    it2->second.addConnection(id1, distance);
    return true;
}

int MetroSystem::addTrain(const std::string& name, int capacity, const std::string& status) {
    if (name.empty() || capacity <= 0) return -1;
    int id = nextTrainId++;
    trains[id] = Train(id, name, capacity, status);
    return id;
}

int MetroSystem::registerNormalPassenger(const std::string& name, const std::string& email) {
    if (name.empty()) return -1;
    int id = nextPassengerId++;
    passengers[id] = std::make_unique<Passenger>(id, name, email);
    return id;
}

int MetroSystem::registerStudentPassenger(const std::string& name, const std::string& email, const std::string& college, const std::string& cardId) {
    if (name.empty()) return -1;
    int id = nextPassengerId++;
    passengers[id] = std::make_unique<StudentPassenger>(id, name, email, college, cardId);
    return id;
}

int MetroSystem::registerSeniorPassenger(const std::string& name, const std::string& email, int age, const std::string& cardId) {
    if (name.empty() || age < 60) return -1;
    int id = nextPassengerId++;
    passengers[id] = std::make_unique<SeniorPassenger>(id, name, email, age, cardId);
    return id;
}

bool MetroSystem::findRouteBFS(int srcId, int destId, std::vector<int>& outPath, double& outDistance) const {
    return RouteFinder::findRouteBFS(stations, srcId, destId, outPath, outDistance);
}

bool MetroSystem::findShortestRouteDijkstra(int srcId, int destId, std::vector<int>& outPath, double& outDistance) const {
    return RouteFinder::findShortestRouteDijkstra(stations, srcId, destId, outPath, outDistance);
}

MetroSystem::BookingResult MetroSystem::bookTicketProgrammatic(
    int passengerId, int srcId, int destId, int trainId,
    const std::string& paymentMethod,
    const std::string& upiId,
    const std::string& cardNumber, const std::string& cardHolder,
    const std::string& cardExp, const std::string& cardCvv,
    double cashTendered
) {
    BookingResult result{false, "", 0, 0.0, 0.0, "", "", "", "", ""};

    auto pIt = passengers.find(passengerId);
    if (pIt == passengers.end() || !pIt->second) {
        result.message = "Passenger not found.";
        return result;
    }
    const auto& passenger = pIt->second;
    result.passengerName = passenger->getName();
    result.passengerType = passenger->getPassengerType();

    if (stations.find(srcId) == stations.end() || stations.find(destId) == stations.end()) {
        result.message = "Invalid origin or destination station.";
        return result;
    }
    if (srcId == destId) {
        result.message = "Origin and Destination stations must be distinct.";
        return result;
    }

    result.sourceName = stations.at(srcId).getName();
    result.destName = stations.at(destId).getName();

    std::vector<int> path;
    double journeyDistance = 0.0;
    bool routeFound = RouteFinder::findShortestRouteDijkstra(stations, srcId, destId, path, journeyDistance);
    if (!routeFound) {
        result.message = "No connected rail path between the selected stations.";
        return result;
    }

    auto trIt = trains.find(trainId);
    if (trIt == trains.end()) {
        result.message = "Selected train does not exist.";
        return result;
    }
    Train& train = trIt->second;
    result.trainName = train.getName();

    if (train.getStatus() != "IN_SERVICE") {
        result.message = "Train is currently not in service.";
        return result;
    }
    if (!train.canBoard(1)) {
        result.message = "Train has reached maximum seat capacity.";
        return result;
    }

    // Dynamic fare calculation with polymorphic concession
    double rawBaseFare = baseFare + (ratePerKm * journeyDistance);
    double discountFraction = passenger->getDiscount();
    double finalFare = calculateFare(journeyDistance, discountFraction);
    result.fare = finalFare;

    // Simulated Payment Gateway Execution
    std::unique_ptr<Payment> paymentHandler;
    std::string chosenMethodName;

    if (paymentMethod == "UPI") {
        paymentHandler = std::make_unique<UPIPayment>(upiId);
        chosenMethodName = "UPI";
    } else if (paymentMethod == "Card") {
        paymentHandler = std::make_unique<CardPayment>(cardNumber, cardHolder, cardExp, cardCvv);
        chosenMethodName = "Card";
    } else if (paymentMethod == "Cash") {
        paymentHandler = std::make_unique<CashPayment>(cashTendered);
        chosenMethodName = "Cash";
    } else {
        result.message = "Unsupported payment method.";
        return result;
    }

    bool paymentSuccess = paymentHandler->pay(finalFare);
    if (!paymentSuccess) {
        result.message = "Payment authorization failed. Ticket not issued.";
        return result;
    }

    if (paymentMethod == "Cash") {
        auto cashPtr = dynamic_cast<CashPayment*>(paymentHandler.get());
        if (cashPtr) result.change = cashPtr->getChangeAmount();
    }

    // Board passenger onto train
    train.boardPassengers(1);

    // Issue ticket
    int newTicketId = nextTicketId++;
    Ticket newTicket(newTicketId, passengerId, srcId, destId, trainId,
                     journeyDistance, rawBaseFare, discountFraction, finalFare, chosenMethodName);
    tickets[newTicketId] = newTicket;

    result.success = true;
    result.message = "Ticket booked and seat reserved successfully!";
    result.ticketId = newTicketId;

    // Auto-save to data files on successful mutation
    saveData();

    return result;
}

MetroSystem::CancelResult MetroSystem::cancelTicketProgrammatic(int ticketId) {
    CancelResult result{false, "", 0.0, 0};

    auto tIt = tickets.find(ticketId);
    if (tIt == tickets.end()) {
        result.message = "Ticket ID not found.";
        return result;
    }

    Ticket& tkt = tIt->second;
    if (!tkt.isBooked()) {
        result.message = "Ticket is already cancelled or invalid.";
        return result;
    }

    if (tkt.cancelTicket()) {
        int trnId = tkt.getTrainId();
        auto trIt = trains.find(trnId);
        if (trIt != trains.end()) {
            trIt->second.alightPassengers(1);
        }

        result.success = true;
        result.message = "Ticket cancelled and seat released.";
        result.refundAmount = tkt.getFinalFare();
        result.releasedTrainId = trnId;

        // Auto-save on mutation
        saveData();
    } else {
        result.message = "Failed to cancel ticket.";
    }

    return result;
}

bool MetroSystem::saveData() {
    FileManager::ensureDirectoryExists(dataDirectory);
    std::string stFile = dataDirectory + "/stations.txt";
    std::string trFile = dataDirectory + "/trains.txt";
    std::string psFile = dataDirectory + "/passengers.txt";
    std::string tkFile = dataDirectory + "/tickets.txt";

    bool ok1 = FileManager::saveStations(stFile, stations);
    bool ok2 = FileManager::saveTrains(trFile, trains);
    bool ok3 = FileManager::savePassengers(psFile, passengers);
    bool ok4 = FileManager::saveTickets(tkFile, tickets);
    return (ok1 && ok2 && ok3 && ok4);
}

bool MetroSystem::loadData() {
    std::string stFile = dataDirectory + "/stations.txt";
    std::string trFile = dataDirectory + "/trains.txt";
    std::string psFile = dataDirectory + "/passengers.txt";
    std::string tkFile = dataDirectory + "/tickets.txt";

    int maxSt = 0, maxTr = 100, maxPs = 0, maxTk = 1000;
    bool ok1 = FileManager::loadStations(stFile, stations, maxSt);
    bool ok2 = FileManager::loadTrains(trFile, trains, maxTr);
    bool ok3 = FileManager::loadPassengers(psFile, passengers, maxPs);
    bool ok4 = FileManager::loadTickets(tkFile, tickets, maxTk);

    if (ok1 || ok2 || ok3 || ok4) {
        if (maxSt >= nextStationId) nextStationId = maxSt + 1;
        if (maxTr >= nextTrainId) nextTrainId = maxTr + 1;
        if (maxPs >= nextPassengerId) nextPassengerId = maxPs + 1;
        if (maxTk >= nextTicketId) nextTicketId = maxTk + 1;
        return true;
    }
    return false;
}
