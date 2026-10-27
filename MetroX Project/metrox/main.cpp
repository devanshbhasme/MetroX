#include <iostream>
#include <cstdlib>
#include "./include/MetroSystem.h"

void displayBanner() {
    std::cout << "\n";
    std::cout << "███╗   ███╗███████╗████████╗██████╗  ██████╗ ██╗  ██╗\n";
    std::cout << "████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝\n";
    std::cout << "██╔████╔██║█████╗     ██║   ██████╔╝██║   ██║ ╚███╔╝ \n";
    std::cout << "██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██║   ██║ ██╔██╗ \n";
    std::cout << "██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗\n";
    std::cout << "╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝\n";
    std::cout << "        Smart Metro Transit Management System        \n";
    std::cout << "              College OOP Project (C++17)            \n";
    std::cout << "=====================================================\n";
}

void printMenu() {
    std::cout << "\n================= METROX MAIN MENU ==================\n";
    std::cout << " [1]  Add a station\n";
    std::cout << " [2]  Display all stations\n";
    std::cout << " [3]  Connect two stations with a distance\n";
    std::cout << " [4]  Add a train\n";
    std::cout << " [5]  Display trains and their status\n";
    std::cout << " [6]  Register a normal passenger\n";
    std::cout << " [7]  Register a student passenger (20% off)\n";
    std::cout << " [8]  Register a senior passenger (30% off)\n";
    std::cout << " [9]  Display all passengers\n";
    std::cout << " [10] Find a route between two stations (BFS / Min Stops)\n";
    std::cout << " [11] Find shortest-distance route (Dijkstra's Algorithm)\n";
    std::cout << " [12] Book a ticket\n";
    std::cout << " [13] Cancel a ticket\n";
    std::cout << " [14] Display all tickets\n";
    std::cout << " [15] Simulate payment using UPI, card, or cash\n";
    std::cout << " [16] Display train capacity\n";
    std::cout << " [17] Save system data to files\n";
    std::cout << " [18] Load saved system data\n";
    std::cout << " [19] Exit\n";
    std::cout << "=====================================================\n";
}

int main() {
    displayBanner();

    MetroSystem system;
    
    // Automatically restore persisted data from data/ folder, or fallback to sample topology
    bool loaded = system.loadData();
    if (!loaded || system.getStations().empty()) {
        system.seedSampleData();
    }

    bool running = true;
    while (running) {
        printMenu();
        int choice = MetroSystem::readInt("Select an option (1-19): ", 1, 19);

        switch (choice) {
            case 1:  system.addStationMenu(); break;
            case 2:  system.displayAllStations(); break;
            case 3:  system.connectStationsMenu(); break;
            case 4:  system.addTrainMenu(); break;
            case 5:  system.displayTrainsAndStatus(); break;
            case 6:  system.registerNormalPassengerMenu(); break;
            case 7:  system.registerStudentPassengerMenu(); break;
            case 8:  system.registerSeniorPassengerMenu(); break;
            case 9:  system.displayAllPassengers(); break;
            case 10: system.findRouteBFSMenu(); break;
            case 11: system.findShortestRouteDijkstraMenu(); break;
            case 12: system.bookTicketMenu(); break;
            case 13: system.cancelTicketMenu(); break;
            case 14: system.displayAllTickets(); break;
            case 15: system.simulateStandalonePaymentMenu(); break;
            case 16: system.displayTrainCapacity(); break;
            case 17: system.saveDataMenu(); break;
            case 18: system.loadDataMenu(); break;
            case 19:
                std::cout << "\n[METROX] Thank you for using MetroX Smart Transit System. Goodbye!\n";
                running = false;
                break;
            default:
                std::cout << "[ERROR] Invalid selection.\n";
                break;
        }
    }

    return 0;
}
