#include "../include/Route.h"
#include "../include/Station.h"
#include <iostream>
#include <iomanip>

Route::Route() : routeId(0), routeName(""), totalDistance(0.0) {}

Route::Route(int routeId, const std::string& routeName)
    : routeId(routeId), routeName(routeName), totalDistance(0.0) {}

int Route::getRouteId() const {
    return routeId;
}

std::string Route::getRouteName() const {
    return routeName;
}

double Route::getTotalDistance() const {
    return totalDistance;
}

const std::vector<int>& Route::getStationSequence() const {
    return stationSequence;
}

void Route::setRouteName(const std::string& name) {
    routeName = name;
}

void Route::setTotalDistance(double distance) {
    totalDistance = distance;
}

void Route::addStation(int stationId, double segmentDistance) {
    stationSequence.push_back(stationId);
    totalDistance += segmentDistance;
}

void Route::setStations(const std::vector<int>& sequence, double distance) {
    stationSequence = sequence;
    totalDistance = distance;
}

void Route::display() const {
    std::cout << "Route ID: " << routeId << " (" << (routeName.empty() ? "Custom Route" : routeName) << ")\n";
    std::cout << "Path: ";
    for (size_t i = 0; i < stationSequence.size(); ++i) {
        std::cout << "[" << stationSequence[i] << "]";
        if (i + 1 < stationSequence.size()) std::cout << " -> ";
    }
    std::cout << "\nTotal Distance: " << std::fixed << std::setprecision(2) << totalDistance << " km\n";
}

void Route::displayDetailed(const std::map<int, Station>& stations) const {
    std::cout << "Route ID: " << routeId << " (" << (routeName.empty() ? "Direct Path" : routeName) << ")\n";
    std::cout << "Stations (" << stationSequence.size() << " stops):\n";
    for (size_t i = 0; i < stationSequence.size(); ++i) {
        int sId = stationSequence[i];
        auto it = stations.find(sId);
        std::string sName = (it != stations.end()) ? it->second.getName() : "Unknown";
        std::cout << "  " << (i + 1) << ". Station [" << sId << "] " << sName;
        if (i + 1 < stationSequence.size()) {
            std::cout << "\n     ↓";
        }
        std::cout << "\n";
    }
    std::cout << "Total Journey Distance: " << std::fixed << std::setprecision(2) << totalDistance << " km\n";
}
