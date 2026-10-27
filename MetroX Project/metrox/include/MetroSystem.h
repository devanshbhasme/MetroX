#pragma once

#include <map>
#include <memory>
#include <string>
#include <vector>

#include "Station.h"
#include "Train.h"
#include "Passenger.h"
#include "StudentPassenger.h"
#include "SeniorPassenger.h"
#include "Ticket.h"
#include "Route.h"
#include "Payment.h"

/**
 * @class MetroSystem
 * @brief Central controller managing stations, trains, passengers, tickets, and fare logic.
 * Demonstrates: Controller Pattern, Polymorphism with std::unique_ptr, Invariant Validation, Safe Input Handling.
 */
class MetroSystem {
private:
    std::map<int, Station> stations;
    std::map<int, Train> trains;
    std::map<int, std::unique_ptr<Passenger>> passengers;
    std::map<int, Ticket> tickets;

    // Auto-increment unique ID generators
    int nextStationId;
    int nextTrainId;
    int nextPassengerId;
    int nextTicketId;

    // Configurable fare parameters
    double baseFare;      // Flat minimum base fare (e.g. ₹10.00)
    double ratePerKm;     // Configurable per-km fare rate (e.g. ₹3.50/km)

    // Data directory path
    std::string dataDirectory;

public:
    struct BookingResult {
        bool success;
        std::string message;
        int ticketId;
        double fare;
        double change;
        std::string passengerName;
        std::string passengerType;
        std::string sourceName;
        std::string destName;
        std::string trainName;
    };

    struct CancelResult {
        bool success;
        std::string message;
        double refundAmount;
        int releasedTrainId;
    };

    MetroSystem();
    ~MetroSystem() = default;

    // Initial setup and sample seed
    void seedSampleData();

    // Direct Programmatic API for Web Service Layer
    const std::map<int, Station>& getStations() const;
    const std::map<int, Train>& getTrains() const;
    const std::map<int, std::unique_ptr<Passenger>>& getPassengers() const;
    const std::map<int, Ticket>& getTickets() const;

    int addStation(const std::string& name, const std::string& location);
    bool connectStations(int id1, int id2, double distance);
    int addTrain(const std::string& name, int capacity, const std::string& status = "IN_SERVICE");
    int registerNormalPassenger(const std::string& name, const std::string& email);
    int registerStudentPassenger(const std::string& name, const std::string& email, const std::string& college, const std::string& cardId);
    int registerSeniorPassenger(const std::string& name, const std::string& email, int age, const std::string& cardId);

    bool findRouteBFS(int srcId, int destId, std::vector<int>& outPath, double& outDistance) const;
    bool findShortestRouteDijkstra(int srcId, int destId, std::vector<int>& outPath, double& outDistance) const;

    BookingResult bookTicketProgrammatic(int passengerId, int srcId, int destId, int trainId,
                                        const std::string& paymentMethod,
                                        const std::string& upiId,
                                        const std::string& cardNumber, const std::string& cardHolder,
                                        const std::string& cardExp, const std::string& cardCvv,
                                        double cashTendered);

    CancelResult cancelTicketProgrammatic(int ticketId);

    bool saveData();
    bool loadData();

    double getBaseFare() const { return baseFare; }
    double getRatePerKm() const { return ratePerKm; }

    // Menu Action Handlers (Options 1 - 18)
    void addStationMenu();
    void displayAllStations() const;
    void connectStationsMenu();
    void addTrainMenu();
    void displayTrainsAndStatus() const;
    void registerNormalPassengerMenu();
    void registerStudentPassengerMenu();
    void registerSeniorPassengerMenu();
    void displayAllPassengers() const;
    void findRouteBFSMenu() const;
    void findShortestRouteDijkstraMenu() const;
    void bookTicketMenu();
    void cancelTicketMenu();
    void displayAllTickets() const;
    void simulateStandalonePaymentMenu();
    void displayTrainCapacity() const;
    void saveDataMenu();
    void loadDataMenu();

    // Fare calculation
    double calculateFare(double distance, double discountFraction) const;

    // Safe input utility functions
    static int readInt(const std::string& prompt, int minVal = -2147483647, int maxVal = 2147483647);
    static double readDouble(const std::string& prompt, double minVal = 0.0, double maxVal = 1e9);
    static std::string readString(const std::string& prompt);
    static std::string readLine(const std::string& prompt);
    static void clearInputBuffer();
};
