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

using namespace std;

class MetroSystem {
private:
    map<int, Station> stations;
    map<int, Train> trains;
    map<int, unique_ptr<Passenger>> passengers;
    map<int, Ticket> tickets;

    // Auto-increment unique ID generators
    int nextStationId;
    int nextTrainId;
    int nextPassengerId;
    int nextTicketId;

    // Configurable fare parameters
    double baseFare;      // Flat minimum base fare (e.g. ₹10.00)
    double ratePerKm;     // Configurable per-km fare rate (e.g. ₹3.50/km)

    // Data directory path
    string dataDirectory;

public:
    struct BookingResult {
        bool success;
        string message;
        int ticketId;
        double fare;
        double change;
        string passengerName;
        string passengerType;
        string sourceName;
        string destName;
        string trainName;
    };

    struct CancelResult {
        bool success;
        string message;
        double refundAmount;
        int releasedTrainId;
    };

    MetroSystem();
    ~MetroSystem() = default;

    // Initial setup and sample seed
    void seedSampleData();

    // Direct Programmatic API for Web Service Layer
    const map<int, Station>& getStations() const;
    const map<int, Train>& getTrains() const;
    const map<int, unique_ptr<Passenger>>& getPassengers() const;
    const map<int, Ticket>& getTickets() const;

    int addStation(const string& name, const string& location);
    bool connectStations(int id1, int id2, double distance);
    int addTrain(const string& name, int capacity, const string& status = "IN_SERVICE");
    int registerNormalPassenger(const string& name, const string& email);
    int registerStudentPassenger(const string& name, const string& email, const string& college, const string& cardId);
    int registerSeniorPassenger(const string& name, const string& email, int age, const string& cardId);

    bool findRouteBFS(int srcId, int destId, vector<int>& outPath, double& outDistance) const;
    bool findShortestRouteDijkstra(int srcId, int destId, vector<int>& outPath, double& outDistance) const;

    BookingResult bookTicketProgrammatic(int passengerId, int srcId, int destId, int trainId,
                                        const string& paymentMethod,
                                        const string& upiId,
                                        const string& cardNumber, const string& cardHolder,
                                        const string& cardExp, const string& cardCvv,
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
    static int readInt(const string& prompt, int minVal = -2147483647, int maxVal = 2147483647);
    static double readDouble(const string& prompt, double minVal = 0.0, double maxVal = 1e9);
    static string readString(const string& prompt);
    static string readLine(const string& prompt);
    static void clearInputBuffer();
};
