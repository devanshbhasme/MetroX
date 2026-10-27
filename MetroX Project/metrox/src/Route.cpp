#include "../include/Route.h"
#include "../include/Station.h"
#include <iostream>
#include <iomanip>
using namespace std;

Route::Route() : routeId(0), routeName(""), totalDistance(0.0) {}

Route::Route(int routeId, const string& routeName)
    : routeId(routeId), routeName(routeName), totalDistance(0.0) {}

int Route::getRouteId() const {
    return routeId;
}

string Route::getRouteName() const {
    return routeName;
}

double Route::getTotalDistance() const {
    return totalDistance;
}

const vector<int>& Route::getStationSequence() const {
    return stationSequence;
}

void Route::setRouteName(const string& name) {
    routeName = name;
}

void Route::setTotalDistance(double distance) {
    totalDistance = distance;
}

void Route::addStation(int stationId, double segmentDistance) {
    stationSequence.push_back(stationId);
    totalDistance += segmentDistance;
}

void Route::setStations(const vector<int>& sequence, double distance) {
    stationSequence = sequence;
    totalDistance = distance;
}

void Route::display() const {
    cout << "Route ID: " << routeId << " (" << (routeName.empty() ? "Custom Route" : routeName) << ")\n";
    cout << "Path: ";
    for (size_t i = 0; i < stationSequence.size(); ++i) {
        cout << "[" << stationSequence[i] << "]";
        if (i + 1 < stationSequence.size()) cout << " -> ";
    }
    cout << "\nTotal Distance: " << fixed << setprecision(2) << totalDistance << " km\n";
}

void Route::displayDetailed(const map<int, Station>& stations) const {
    cout << "Route ID: " << routeId << " (" << (routeName.empty() ? "Direct Path" : routeName) << ")\n";
    cout << "Stations (" << stationSequence.size() << " stops):\n";
    for (size_t i = 0; i < stationSequence.size(); ++i) {
        int sId = stationSequence[i];
        auto it = stations.find(sId);
        string sName = (it != stations.end()) ? it->second.getName() : "Unknown";
        cout << "  " << (i + 1) << ". Station [" << sId << "] " << sName;
        if (i + 1 < stationSequence.size()) {
            cout << "\n     ↓";
        }
        cout << "\n";
    }
    cout << "Total Journey Distance: " << fixed << setprecision(2) << totalDistance << " km\n";
}
