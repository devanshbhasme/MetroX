#include <iostream>
#include <cstdlib>
#include "./include/MetroSystem.h"
using namespace std;

void displayBanner() {
    cout << "\n";
    cout << "███╗   ███╗███████╗████████╗██████╗  ██████╗ ██╗  ██╗\n";
    cout << "████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝\n";
    cout << "██╔████╔██║█████╗     ██║   ██████╔╝██║   ██║ ╚███╔╝ \n";
    cout << "██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██║   ██║ ██╔██╗ \n";
    cout << "██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗\n";
    cout << "╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝\n";
    cout << "        Smart Metro Transit Management System        \n";
    cout << "              College OOP Project (C++17)            \n";
    cout << "=====================================================\n";
}

void printMenu() {
    cout << "\n================= METROX MAIN MENU ==================\n";
    cout << " [1]  Add a station\n";
    cout << " [2]  Display all stations\n";
    cout << " [3]  Connect two stations with a distance\n";
    cout << " [4]  Add a train\n";
    cout << " [5]  Display trains and their status\n";
    cout << " [6]  Register a normal passenger\n";
    cout << " [7]  Register a student passenger (20% off)\n";
    cout << " [8]  Register a senior passenger (30% off)\n";
    cout << " [9]  Display all passengers\n";
    cout << " [10] Find a route between two stations (BFS / Min Stops)\n";
    cout << " [11] Find shortest-distance route (Dijkstra's Algorithm)\n";
    cout << " [12] Book a ticket\n";
    cout << " [13] Cancel a ticket\n";
    cout << " [14] Display all tickets\n";
    cout << " [15] Simulate payment using UPI, card, or cash\n";
    cout << " [16] Display train capacity\n";
    cout << " [17] Save system data to files\n";
    cout << " [18] Load saved system data\n";
    cout << " [19] Exit\n";
    cout << "=====================================================\n";
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
                cout << "\n[METROX] Thank you for using MetroX Smart Transit System. Goodbye!\n";
                running = false;
                break;
            default:
                cout << "[ERROR] Invalid selection.\n";
                break;
        }
    }

    return 0;
}
