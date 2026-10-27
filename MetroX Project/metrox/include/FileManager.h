#pragma once

#include <string>
#include <map>
#include <memory>
#include "Station.h"
#include "Train.h"
#include "Passenger.h"
#include "Ticket.h"

/**
 * @class FileManager
 * @brief Handles file persistence for MetroX data entities.
 * Demonstrates: File Stream I/O (std::ifstream, std::ofstream), parsing, error recovery, serialization.
 */
class FileManager {
public:
    static bool saveStations(const std::string& filename, const std::map<int, Station>& stations);
    static bool loadStations(const std::string& filename, std::map<int, Station>& stations, int& maxId);

    static bool saveTrains(const std::string& filename, const std::map<int, Train>& trains);
    static bool loadTrains(const std::string& filename, std::map<int, Train>& trains, int& maxId);

    static bool savePassengers(const std::string& filename, const std::map<int, std::unique_ptr<Passenger>>& passengers);
    static bool loadPassengers(const std::string& filename, std::map<int, std::unique_ptr<Passenger>>& passengers, int& maxId);

    static bool saveTickets(const std::string& filename, const std::map<int, Ticket>& tickets);
    static bool loadTickets(const std::string& filename, std::map<int, Ticket>& tickets, int& maxId);

    // Directory creation helper
    static void ensureDirectoryExists(const std::string& dirPath);
};
