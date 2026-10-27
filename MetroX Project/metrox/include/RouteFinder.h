#pragma once

#include <vector>
#include <map>
#include <string>
#include "Station.h"

/**
 * @class RouteFinder
 * @brief Provides graph pathfinding algorithms for the metro network.
 * Demonstrates: Graph Theory, BFS (minimum hops/stations), and Dijkstra's Algorithm (shortest physical distance).
 */
class RouteFinder {
public:
    /**
     * @brief Finds a route with the minimum number of station hops using Breadth-First Search (BFS).
     * @param stations Map of all network stations.
     * @param startId Origin station ID.
     * @param targetId Destination station ID.
     * @param outPath Output vector populated with the sequence of station IDs.
     * @param outDistance Output cumulative distance along the route.
     * @return true if a connected path exists, false otherwise.
     */
    static bool findRouteBFS(const std::map<int, Station>& stations,
                             int startId, int targetId,
                             std::vector<int>& outPath, double& outDistance);

    /**
     * @brief Finds the shortest-distance route using Dijkstra's Algorithm with a min-priority queue.
     * @param stations Map of all network stations.
     * @param startId Origin station ID.
     * @param targetId Destination station ID.
     * @param outPath Output vector populated with the sequence of station IDs.
     * @param outDistance Output total physical distance of the shortest route.
     * @return true if a connected path exists, false otherwise.
     */
    static bool findShortestRouteDijkstra(const std::map<int, Station>& stations,
                                         int startId, int targetId,
                                         std::vector<int>& outPath, double& outDistance);

    /**
     * @brief Formats and displays a human-readable route summary with station names and segment distances.
     */
    static void printRouteSummary(const std::vector<int>& path, double distance,
                                  const std::map<int, Station>& stations,
                                  const std::string& algorithmName);
};
