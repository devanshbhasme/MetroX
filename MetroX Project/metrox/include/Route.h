#pragma once

#include <string>
#include <vector>
#include <map>

class Station;

/**
 * @class Route
 * @brief Represents a scheduled transit corridor or path comprising a sequence of stations and cumulative distance.
 * Demonstrates: STL sequence containers (std::vector) and association with stations.
 */
class Route {
private:
    int routeId;
    std::string routeName;
    std::vector<int> stationSequence;
    double totalDistance;

public:
    Route();
    Route(int routeId, const std::string& routeName = "");

    int getRouteId() const;
    std::string getRouteName() const;
    double getTotalDistance() const;
    const std::vector<int>& getStationSequence() const;

    void setRouteName(const std::string& name);
    void setTotalDistance(double distance);
    void addStation(int stationId, double segmentDistance = 0.0);
    void setStations(const std::vector<int>& sequence, double distance);

    void display() const;
    void displayDetailed(const std::map<int, Station>& stations) const;
};
