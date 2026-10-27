#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <sstream>
#include <iomanip>

#include "include/httplib.h"
#include "include/json.hpp"
#include "include/MetroSystem.h"
#include "include/StudentPassenger.h"
#include "include/SeniorPassenger.h"

using json = nlohmann::json;

// Global system instance
static MetroSystem g_system;

void setCorsHeaders(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
}

int main(int argc, char* argv[]) {
    int port = 8080;
    if (argc > 1) {
        port = std::stoi(argv[1]);
    }

    std::cout << "=====================================================\n";
    std::cout << "      MetroX C++ Core Engine HTTP REST Server        \n";
    std::cout << "=====================================================\n";

    // Attempt to load existing saved data from data/ folder, or seed sample data
    bool loaded = g_system.loadData();
    if (loaded && !g_system.getStations().empty()) {
        std::cout << "[SYSTEM] Successfully restored persisted data from data/ folder.\n";
    } else {
        std::cout << "[SYSTEM] Initializing sample metro network topology...\n";
        g_system.seedSampleData();
        g_system.saveData();
    }

    httplib::Server svr;

    // Global Pre-routing handler for CORS preflight
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        res.status = 204;
    });

    // Health check
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json j = {
            {"status", "ok"},
            {"engine", "MetroX C++17 Core Engine"},
            {"persistence", "Flat-file (data/*.txt)"}
        };
        res.set_content(j.dump(), "application/json");
    });

    // 1. GET /api/stations
    svr.Get("/api/stations", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        const auto& stations = g_system.getStations();
        json arr = json::array();
        for (const auto& [id, st] : stations) {
            json connections = json::array();
            for (const auto& conn : st.getConnections()) {
                std::string targetName = "Unknown";
                auto tIt = stations.find(conn.first);
                if (tIt != stations.end()) targetName = tIt->second.getName();
                connections.push_back({
                    {"targetId", conn.first},
                    {"targetName", targetName},
                    {"distance", conn.second}
                });
            }
            arr.push_back({
                {"id", st.getId()},
                {"name", st.getName()},
                {"location", st.getLocation()},
                {"connections", connections}
            });
        }
        res.set_content(arr.dump(), "application/json");
    });

    // 2. POST /api/stations
    svr.Post("/api/stations", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string name = body.value("name", "");
            std::string location = body.value("location", "");
            if (name.empty()) {
                res.status = 400;
                res.set_content(json({{"error", "Station name cannot be empty"}}).dump(), "application/json");
                return;
            }
            int id = g_system.addStation(name, location);
            g_system.saveData();
            res.set_content(json({{"success", true}, {"id", id}, {"name", name}, {"location", location}}).dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 3. POST /api/stations/connect
    svr.Post("/api/stations/connect", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            int srcId = body.value("sourceId", 0);
            int destId = body.value("destinationId", 0);
            double distance = body.value("distance", 0.0);

            if (srcId <= 0 || destId <= 0 || srcId == destId || distance <= 0.0) {
                res.status = 400;
                res.set_content(json({{"error", "Invalid station IDs or distance must be positive"}}).dump(), "application/json");
                return;
            }

            bool ok = g_system.connectStations(srcId, destId, distance);
            if (ok) {
                g_system.saveData();
                res.set_content(json({{"success", true}, {"sourceId", srcId}, {"destinationId", destId}, {"distance", distance}}).dump(), "application/json");
            } else {
                res.status = 400;
                res.set_content(json({{"error", "Stations not found or cannot connect"}}).dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 4. GET /api/trains
    svr.Get("/api/trains", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        const auto& trains = g_system.getTrains();
        json arr = json::array();
        for (const auto& [id, tr] : trains) {
            arr.push_back({
                {"id", tr.getId()},
                {"name", tr.getName()},
                {"capacity", tr.getCapacity()},
                {"currentPassengers", tr.getCurrentPassengers()},
                {"availableCapacity", tr.getAvailableCapacity()},
                {"occupancyRate", tr.getOccupancyRate()},
                {"status", tr.getStatus()}
            });
        }
        res.set_content(arr.dump(), "application/json");
    });

    // 5. POST /api/trains
    svr.Post("/api/trains", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string name = body.value("name", "");
            int capacity = body.value("capacity", 100);
            std::string status = body.value("status", "IN_SERVICE");

            if (name.empty() || capacity <= 0) {
                res.status = 400;
                res.set_content(json({{"error", "Invalid train name or capacity"}}).dump(), "application/json");
                return;
            }

            int id = g_system.addTrain(name, capacity, status);
            g_system.saveData();
            res.set_content(json({{"success", true}, {"id", id}, {"name", name}, {"capacity", capacity}, {"status", status}}).dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 6. GET /api/passengers
    svr.Get("/api/passengers", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        const auto& passengers = g_system.getPassengers();
        json arr = json::array();
        for (const auto& [id, pPassenger] : passengers) {
            if (!pPassenger) continue;
            json p = {
                {"id", pPassenger->getId()},
                {"name", pPassenger->getName()},
                {"email", pPassenger->getEmail()},
                {"type", pPassenger->getPassengerType()},
                {"discountPercent", pPassenger->getDiscount() * 100.0}
            };

            if (auto student = dynamic_cast<StudentPassenger*>(pPassenger.get())) {
                p["collegeName"] = student->getCollegeName();
                p["studentCardId"] = student->getStudentCardId();
            } else if (auto senior = dynamic_cast<SeniorPassenger*>(pPassenger.get())) {
                p["age"] = senior->getAge();
                p["seniorCardId"] = senior->getSeniorCardId();
            }
            arr.push_back(p);
        }
        res.set_content(arr.dump(), "application/json");
    });

    // 7. POST /api/passengers
    svr.Post("/api/passengers", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            std::string type = body.value("type", "REGULAR");
            std::string name = body.value("name", "");
            std::string email = body.value("email", "");

            if (name.empty()) {
                res.status = 400;
                res.set_content(json({{"error", "Passenger name cannot be empty"}}).dump(), "application/json");
                return;
            }

            int id = -1;
            if (type == "STUDENT") {
                std::string college = body.value("collegeName", "Institute of Tech");
                std::string cardId = body.value("studentCardId", "STU-001");
                id = g_system.registerStudentPassenger(name, email, college, cardId);
            } else if (type == "SENIOR") {
                int age = body.value("age", 65);
                std::string cardId = body.value("seniorCardId", "SR-001");
                id = g_system.registerSeniorPassenger(name, email, age, cardId);
            } else {
                id = g_system.registerNormalPassenger(name, email);
            }

            g_system.saveData();
            res.set_content(json({{"success", true}, {"id", id}, {"name", name}, {"type", type}}).dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 8. GET /api/routes/find?source=1&destination=4&mode=dijkstra
    svr.Get("/api/routes/find", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        if (!req.has_param("source") || !req.has_param("destination")) {
            res.status = 400;
            res.set_content(json({{"error", "source and destination query params are required"}}).dump(), "application/json");
            return;
        }

        int src = std::stoi(req.get_param_value("source"));
        int dest = std::stoi(req.get_param_value("destination"));
        std::string mode = req.has_param("mode") ? req.get_param_value("mode") : "dijkstra";

        std::vector<int> path;
        double distance = 0.0;
        bool found = false;

        if (mode == "bfs") {
            found = g_system.findRouteBFS(src, dest, path, distance);
        } else {
            found = g_system.findShortestRouteDijkstra(src, dest, path, distance);
        }

        if (!found) {
            res.status = 404;
            res.set_content(json({{"success", false}, {"error", "No connected route between the specified stations"}}).dump(), "application/json");
            return;
        }

        const auto& stations = g_system.getStations();
        json pathStations = json::array();
        for (int sId : path) {
            auto it = stations.find(sId);
            if (it != stations.end()) {
                pathStations.push_back({
                    {"id", it->second.getId()},
                    {"name", it->second.getName()},
                    {"location", it->second.getLocation()}
                });
            }
        }

        json resp = {
            {"success", true},
            {"algorithm", mode == "bfs" ? "BFS (Minimum Hops)" : "Dijkstra (Shortest Distance)"},
            {"path", path},
            {"pathStations", pathStations},
            {"distance", distance},
            {"hops", path.size() > 0 ? path.size() - 1 : 0}
        };
        res.set_content(resp.dump(), "application/json");
    });

    // 9. POST /api/fare/calculate
    svr.Post("/api/fare/calculate", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            double distance = body.value("distance", 0.0);
            int passengerId = body.value("passengerId", 0);

            double discount = 0.0;
            std::string passType = "Regular";
            const auto& passengers = g_system.getPassengers();
            auto pIt = passengers.find(passengerId);
            if (pIt != passengers.end() && pIt->second) {
                discount = pIt->second->getDiscount();
                passType = pIt->second->getPassengerType();
            }

            double base = g_system.getBaseFare() + (g_system.getRatePerKm() * distance);
            double discountAmt = base * discount;
            double finalFare = g_system.calculateFare(distance, discount);

            json j = {
                {"distance", distance},
                {"baseFare", base},
                {"discountPercent", discount * 100.0},
                {"discountAmount", discountAmt},
                {"finalFare", finalFare},
                {"passengerType", passType}
            };
            res.set_content(j.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 10. POST /api/tickets/book
    svr.Post("/api/tickets/book", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            int passengerId = body.value("passengerId", 0);
            int srcId = body.value("sourceStationId", 0);
            int destId = body.value("destinationStationId", 0);
            int trainId = body.value("trainId", 0);
            std::string paymentMethod = body.value("paymentMethod", "UPI");

            std::string upiId = body.value("upiId", "");
            std::string cNum = body.value("cardNumber", "");
            std::string cHolder = body.value("cardHolder", "");
            std::string cExp = body.value("cardExp", "");
            std::string cCvv = body.value("cardCvv", "");
            double cashTendered = body.value("cashTendered", 0.0);

            auto outcome = g_system.bookTicketProgrammatic(
                passengerId, srcId, destId, trainId, paymentMethod,
                upiId, cNum, cHolder, cExp, cCvv, cashTendered
            );

            if (outcome.success) {
                json j = {
                    {"success", true},
                    {"message", outcome.message},
                    {"ticketId", outcome.ticketId},
                    {"fare", outcome.fare},
                    {"change", outcome.change},
                    {"passengerName", outcome.passengerName},
                    {"passengerType", outcome.passengerType},
                    {"sourceName", outcome.sourceName},
                    {"destName", outcome.destName},
                    {"trainName", outcome.trainName}
                };
                res.set_content(j.dump(), "application/json");
            } else {
                res.status = 400;
                res.set_content(json({{"success", false}, {"error", outcome.message}}).dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 11. POST /api/tickets/cancel
    svr.Post("/api/tickets/cancel", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        try {
            auto body = json::parse(req.body);
            int ticketId = body.value("ticketId", 0);

            auto outcome = g_system.cancelTicketProgrammatic(ticketId);
            if (outcome.success) {
                json j = {
                    {"success", true},
                    {"message", outcome.message},
                    {"refundAmount", outcome.refundAmount},
                    {"releasedTrainId", outcome.releasedTrainId}
                };
                res.set_content(j.dump(), "application/json");
            } else {
                res.status = 400;
                res.set_content(json({{"success", false}, {"error", outcome.message}}).dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // 12. GET /api/tickets
    svr.Get("/api/tickets", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        const auto& tickets = g_system.getTickets();
        const auto& stations = g_system.getStations();
        const auto& passengers = g_system.getPassengers();
        const auto& trains = g_system.getTrains();

        json arr = json::array();
        for (const auto& [tId, tkt] : tickets) {
            std::string pName = "Unknown";
            std::string pType = "Regular";
            auto pIt = passengers.find(tkt.getPassengerId());
            if (pIt != passengers.end() && pIt->second) {
                pName = pIt->second->getName();
                pType = pIt->second->getPassengerType();
            }

            std::string srcName = "Station " + std::to_string(tkt.getSourceStationId());
            auto sIt = stations.find(tkt.getSourceStationId());
            if (sIt != stations.end()) srcName = sIt->second.getName();

            std::string destName = "Station " + std::to_string(tkt.getDestinationStationId());
            auto dIt = stations.find(tkt.getDestinationStationId());
            if (dIt != stations.end()) destName = dIt->second.getName();

            std::string trnName = "Train " + std::to_string(tkt.getTrainId());
            auto trIt = trains.find(tkt.getTrainId());
            if (trIt != trains.end()) trnName = trIt->second.getName();

            arr.push_back({
                {"ticketId", tkt.getTicketId()},
                {"passengerId", tkt.getPassengerId()},
                {"passengerName", pName},
                {"passengerType", pType},
                {"sourceStationId", tkt.getSourceStationId()},
                {"sourceStationName", srcName},
                {"destinationStationId", tkt.getDestinationStationId()},
                {"destinationStationName", destName},
                {"trainId", tkt.getTrainId()},
                {"trainName", trnName},
                {"distance", tkt.getDistance()},
                {"baseFare", tkt.getBaseFare()},
                {"discountPercent", tkt.getDiscountPercent() * 100.0},
                {"finalFare", tkt.getFinalFare()},
                {"bookingStatus", tkt.getBookingStatus()},
                {"paymentStatus", tkt.getPaymentStatus()},
                {"paymentMethod", tkt.getPaymentMethod()},
                {"bookingTime", tkt.getBookingTime()}
            });
        }
        res.set_content(arr.dump(), "application/json");
    });

    // 13. POST /api/system/save
    svr.Post("/api/system/save", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        bool ok = g_system.saveData();
        res.set_content(json({{"success", ok}, {"message", ok ? "Saved state to data/*.txt" : "Save failed"}}).dump(), "application/json");
    });

    // 14. POST /api/system/load
    svr.Post("/api/system/load", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        bool ok = g_system.loadData();
        res.set_content(json({{"success", ok}, {"message", ok ? "Loaded state from data/*.txt" : "Load failed"}}).dump(), "application/json");
    });

    // 15. GET /api/system/stats
    svr.Get("/api/system/stats", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        const auto& stations = g_system.getStations();
        const auto& trains = g_system.getTrains();
        const auto& passengers = g_system.getPassengers();
        const auto& tickets = g_system.getTickets();

        double totalRevenue = 0.0;
        int activeTickets = 0;
        for (const auto& [id, tkt] : tickets) {
            if (tkt.getBookingStatus() == "CONFIRMED") {
                totalRevenue += tkt.getFinalFare();
                activeTickets++;
            }
        }

        double totalCapacity = 0;
        double currentOccupancy = 0;
        for (const auto& [id, tr] : trains) {
            totalCapacity += tr.getCapacity();
            currentOccupancy += tr.getCurrentPassengers();
        }

        double avgOccupancy = totalCapacity > 0 ? (currentOccupancy / totalCapacity) * 100.0 : 0.0;

        json stats = {
            {"stationCount", stations.size()},
            {"trainCount", trains.size()},
            {"passengerCount", passengers.size()},
            {"ticketCount", tickets.size()},
            {"activeTickets", activeTickets},
            {"totalRevenue", totalRevenue},
            {"fleetCapacity", totalCapacity},
            {"currentPassengers", currentOccupancy},
            {"averageOccupancyPercent", avgOccupancy}
        };
        res.set_content(stats.dump(), "application/json");
    });

    std::cout << "[METROX HTTP] C++ Core Server listening on http://127.0.0.1:" << port << "\n";
    std::cout << "[METROX HTTP] Press Ctrl+C in terminal to stop server.\n";
    svr.listen("127.0.0.1", port);

    return 0;
}
