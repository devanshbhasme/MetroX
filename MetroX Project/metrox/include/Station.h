#pragma once

#include <string>
#include <vector>
#include <utility>

/**
 * @class Station
 * @brief Represents a metro station with network connectivity.
 * Demonstrates: Encapsulation and Data Structures (std::vector, std::pair).
 */
class Station {
private:
    int id;
    std::string name;
    std::string location;
    // Adjacency list storing pairs of (connectedStationId, distanceInKm)
    std::vector<std::pair<int, double>> connections;

public:
    Station();
    Station(int id, const std::string& name, const std::string& location);

    // Getters and Setters
    int getId() const;
    std::string getName() const;
    std::string getLocation() const;
    void setName(const std::string& name);
    void setLocation(const std::string& location);

    // Network connection operations
    void addConnection(int neighborId, double distance);
    bool removeConnection(int neighborId);
    const std::vector<std::pair<int, double>>& getConnections() const;
    bool hasConnection(int neighborId) const;
    double getConnectionDistance(int neighborId) const;

    // Display
    void display() const;
};
