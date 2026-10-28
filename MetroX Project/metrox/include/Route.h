#pragma once

#include <string>
#include <vector>
#include <map>
using namespace std;

class Station;

class Route {
private:
    int routeId;
    string routeName;
    vector<int> stationSequence;
    double totalDistance;

public:
    Route();
    Route(int routeId, const string& routeName = "");

    int getRouteId() const;
    string getRouteName() const;
    double getTotalDistance() const;
    const vector<int>& getStationSequence() const;

    void setRouteName(const string& name);
    void setTotalDistance(double distance);
    void addStation(int stationId, double segmentDistance = 0.0);
    void setStations(const vector<int>& sequence, double distance);

    void display() const;
    void displayDetailed(const map<int, Station>& stations) const;
};
