#pragma once

#include <string>
#include <vector>
#include <utility>
using namespace std;


class Station {
private:
    int id;
    string name;
    string location;
    // Adjacency list storing pairs of (connectedStationId, distanceInKm)
    vector<pair<int, double>> connections;

public:
    Station();
    Station(int id, const string& name, const string& location);

    // Getters and Setters
    int getId() const;
    string getName() const;
    string getLocation() const;
    void setName(const string& name);
    void setLocation(const string& location);

    // Network connection operations
    void addConnection(int neighborId, double distance);
    bool removeConnection(int neighborId);
    const vector<pair<int, double>>& getConnections() const;
    bool hasConnection(int neighborId) const;
    double getConnectionDistance(int neighborId) const;

    // Display
    void display() const;
};
