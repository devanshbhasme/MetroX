#pragma once

#include <vector>
#include <map>
#include <string>
#include "Station.h"
using namespace std;

class RouteFinder {
public:
    static bool findRouteBFS(const map<int, Station>& stations,
                             int startId, int targetId,
                             vector<int>& outPath, double& outDistance);
    static bool findShortestRouteDijkstra(const map<int, Station>& stations,
                                         int startId, int targetId,
                                         vector<int>& outPath, double& outDistance);

    static void printRouteSummary(const vector<int>& path, double distance,
                                  const map<int, Station>& stations,
                                  const string& algorithmName);
};
