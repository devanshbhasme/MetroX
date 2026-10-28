#pragma once

#include <string>
#include <map>
#include <memory>
#include "Station.h"
#include "Train.h"
#include "Passenger.h"
#include "Ticket.h"
using namespace std;

class FileManager {
public:
    static bool saveStations(const string& filename, const map<int, Station>& stations);
    static bool loadStations(const string& filename, map<int, Station>& stations, int& maxId);

    static bool saveTrains(const string& filename, const map<int, Train>& trains);
    static bool loadTrains(const string& filename, map<int, Train>& trains, int& maxId);

    static bool savePassengers(const string& filename, const map<int, unique_ptr<Passenger>>& passengers);
    static bool loadPassengers(const string& filename, map<int, unique_ptr<Passenger>>& passengers, int& maxId);

    static bool saveTickets(const string& filename, const map<int, Ticket>& tickets);
    static bool loadTickets(const string& filename, map<int, Ticket>& tickets, int& maxId);

    // Directory creation helper
    static void ensureDirectoryExists(const string& dirPath);
};
