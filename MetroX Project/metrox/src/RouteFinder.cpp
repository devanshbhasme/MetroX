#include "../include/RouteFinder.h"
#include <iostream>
#include <iomanip>
#include <queue>
#include <limits>
#include <algorithm>
using namespace std;

bool RouteFinder::findRouteBFS(const map<int, Station>& stations,
                               int startId, int targetId,
                               vector<int>& outPath, double& outDistance) {
    outPath.clear();
    outDistance = 0.0;

    if (stations.find(startId) == stations.end() || stations.find(targetId) == stations.end()) {
        return false;
    }

    if (startId == targetId) {
        outPath.push_back(startId);
        outDistance = 0.0;
        return true;
    }

    queue<int> q;
    map<int, bool> visited;
    map<int, int> parent;

    visited[startId] = true;
    q.push(startId);

    bool found = false;
    while (!q.empty()) {
        int current = q.front();
        q.pop();

        if (current == targetId) {
            found = true;
            break;
        }

        auto stIt = stations.find(current);
        if (stIt == stations.end()) continue;

        const auto& connections = stIt->second.getConnections();
        for (const auto& conn : connections) {
            int neighbor = conn.first;
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent[neighbor] = current;
                q.push(neighbor);
            }
        }
    }

    if (!found) return false;

    // Reconstruct path
    int curr = targetId;
    while (curr != startId) {
        outPath.push_back(curr);
        curr = parent[curr];
    }
    outPath.push_back(startId);
    reverse(outPath.begin(), outPath.end());

    // Compute cumulative distance along the path
    for (size_t i = 0; i + 1 < outPath.size(); ++i) {
        int u = outPath[i];
        int v = outPath[i + 1];
        auto uIt = stations.find(u);
        if (uIt != stations.end()) {
            double d = uIt->second.getConnectionDistance(v);
            if (d > 0.0) outDistance += d;
        }
    }

    return true;
}

bool RouteFinder::findShortestRouteDijkstra(const map<int, Station>& stations,
                                           int startId, int targetId,
                                           vector<int>& outPath, double& outDistance) {
    outPath.clear();
    outDistance = 0.0;

    if (stations.find(startId) == stations.end() || stations.find(targetId) == stations.end()) {
        return false;
    }

    if (startId == targetId) {
        outPath.push_back(startId);
        outDistance = 0.0;
        return true;
    }

    // Min-priority queue storing pairs of (distance, stationId)
    using DistPair = pair<double, int>;
    priority_queue<DistPair, vector<DistPair>, greater<DistPair>> pq;

    map<int, double> dist;
    map<int, int> parent;
    const double INF = numeric_limits<double>::infinity();

    for (const auto& pair : stations) {
        dist[pair.first] = INF;
    }

    dist[startId] = 0.0;
    pq.push({0.0, startId});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;
        if (u == targetId) break;

        auto uIt = stations.find(u);
        if (uIt == stations.end()) continue;

        for (const auto& conn : uIt->second.getConnections()) {
            int v = conn.first;
            double weight = conn.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    if (dist[targetId] == INF) {
        return false; // Target unreachable
    }

    // Reconstruct shortest path
    int curr = targetId;
    while (curr != startId) {
        outPath.push_back(curr);
        curr = parent[curr];
    }
    outPath.push_back(startId);
    reverse(outPath.begin(), outPath.end());

    outDistance = dist[targetId];
    return true;
}

void RouteFinder::printRouteSummary(const vector<int>& path, double distance,
                                    const map<int, Station>& stations,
                                    const string& algorithmName) {
    if (path.empty()) {
        cout << "[INFO] No route available.\n";
        return;
    }

    cout << "\n=======================================================\n";
    cout << "  ROUTE FOUND VIA: " << algorithmName << "\n";
    cout << "=======================================================\n";
    cout << "Total Stations in Journey : " << path.size() << " stops (" << (path.size() - 1) << " hops)\n";
    cout << "Total Journey Distance     : " << fixed << setprecision(2) << distance << " km\n";
    cout << "-------------------------------------------------------\n";
    cout << "Itinerary:\n";

    for (size_t i = 0; i < path.size(); ++i) {
        int sId = path[i];
        auto it = stations.find(sId);
        string sName = (it != stations.end()) ? it->second.getName() : "Unknown";
        string sLoc = (it != stations.end()) ? it->second.getLocation() : "";

        cout << "  " << setw(2) << (i + 1) << ". [" << sId << "] " << sName;
        if (!sLoc.empty()) cout << " (" << sLoc << ")";

        if (i + 1 < path.size()) {
            int nextId = path[i + 1];
            double segDist = 0.0;
            if (it != stations.end()) {
                segDist = it->second.getConnectionDistance(nextId);
            }
            cout << "\n       │ (" << fixed << setprecision(1) << segDist << " km)\n       ▼\n";
        } else {
            cout << "  [DESTINATION ARRIVAL]\n";
        }
    }
    cout << "=======================================================\n\n";
}
