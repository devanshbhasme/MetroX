#include "../include/Station.h"
#include <iostream>
#include <iomanip>
using namespace std;

Station::Station() : id(0), name(""), location("") {}

Station::Station(int id, const string& name, const string& location)
    : id(id), name(name), location(location) {}

int Station::getId() const {
    return id;
}

string Station::getName() const {
    return name;
}

string Station::getLocation() const {
    return location;
}

void Station::setName(const string& newName) {
    name = newName;
}

void Station::setLocation(const string& newLocation) {
    location = newLocation;
}

void Station::addConnection(int neighborId, double distance) {
    for (auto& conn : connections) {
        if (conn.first == neighborId) {
            conn.second = distance; // Update distance if connection already exists
            return;
        }
    }
    connections.emplace_back(neighborId, distance);
}

bool Station::removeConnection(int neighborId) {
    for (auto it = connections.begin(); it != connections.end(); ++it) {
        if (it->first == neighborId) {
            connections.erase(it);
            return true;
        }
    }
    return false;
}

const vector<pair<int, double>>& Station::getConnections() const {
    return connections;
}

bool Station::hasConnection(int neighborId) const {
    for (const auto& conn : connections) {
        if (conn.first == neighborId) {
            return true;
        }
    }
    return false;
}

double Station::getConnectionDistance(int neighborId) const {
    for (const auto& conn : connections) {
        if (conn.first == neighborId) {
            return conn.second;
        }
    }
    return -1.0;
}

void Station::display() const {
    cout << "Station ID: " << setw(3) << id 
              << " | Name: " << setw(20) << left << name 
              << " | Location: " << setw(15) << left << location
              << " | Connections: " << connections.size() << right << "\n";
    if (!connections.empty()) {
        cout << "   └── Direct Links: ";
        for (size_t i = 0; i < connections.size(); ++i) {
            cout << "To Station [" << connections[i].first << "] (" 
                      << fixed << setprecision(1) << connections[i].second << " km)";
            if (i + 1 < connections.size()) cout << ", ";
        }
        cout << "\n";
    }
}
