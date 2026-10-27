#include "../include/FileManager.h"
#include "../include/StudentPassenger.h"
#include "../include/SeniorPassenger.h"

#include <fstream>
#include <sstream>
#include <iostream>
#include <sys/stat.h>
#include <algorithm>

#if defined(_WIN32)
#include <direct.h>
#define MKDIR(d) _mkdir(d)
#else
#define MKDIR(d) mkdir(d, 0755)
#endif

void FileManager::ensureDirectoryExists(const std::string& dirPath) {
    MKDIR(dirPath.c_str());
}

static std::vector<std::string> split(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::string token;
    std::istringstream tokenStream(str);
    while (std::getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

// ---------------- STATIONS ----------------

bool FileManager::saveStations(const std::string& filename, const std::map<int, Station>& stations) {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, station] : stations) {
        outFile << station.getId() << "|"
                << station.getName() << "|"
                << station.getLocation() << "|";
        
        const auto& conns = station.getConnections();
        for (size_t i = 0; i < conns.size(); ++i) {
            outFile << conns[i].first << ":" << conns[i].second;
            if (i + 1 < conns.size()) outFile << ",";
        }
        outFile << "\n";
    }
    return true;
}

bool FileManager::loadStations(const std::string& filename, std::map<int, Station>& stations, int& maxId) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    stations.clear();
    std::string line;
    while (std::getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 3) {
            int id = std::stoi(tokens[0]);
            std::string name = tokens[1];
            std::string loc = tokens[2];
            Station st(id, name, loc);

            if (tokens.size() >= 4 && !tokens[3].empty()) {
                auto connPairs = split(tokens[3], ',');
                for (const auto& cp : connPairs) {
                    auto parts = split(cp, ':');
                    if (parts.size() == 2) {
                        int neighbor = std::stoi(parts[0]);
                        double dist = std::stod(parts[1]);
                        st.addConnection(neighbor, dist);
                    }
                }
            }

            stations[id] = st;
            if (id > maxId) maxId = id;
        }
    }
    return true;
}

// ---------------- TRAINS ----------------

bool FileManager::saveTrains(const std::string& filename, const std::map<int, Train>& trains) {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, train] : trains) {
        outFile << train.getId() << "|"
                << train.getName() << "|"
                << train.getCapacity() << "|"
                << train.getCurrentPassengers() << "|"
                << train.getStatus() << "\n";
    }
    return true;
}

bool FileManager::loadTrains(const std::string& filename, std::map<int, Train>& trains, int& maxId) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    trains.clear();
    std::string line;
    while (std::getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 5) {
            int id = std::stoi(tokens[0]);
            std::string name = tokens[1];
            int cap = std::stoi(tokens[2]);
            int curr = std::stoi(tokens[3]);
            std::string status = tokens[4];

            Train tr(id, name, cap, status);
            if (curr > 0) {
                tr.boardPassengers(curr);
            }
            trains[id] = tr;
            if (id > maxId) maxId = id;
        }
    }
    return true;
}

// ---------------- PASSENGERS (POLYMORPHIC) ----------------

bool FileManager::savePassengers(const std::string& filename, const std::map<int, std::unique_ptr<Passenger>>& passengers) {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, pPassenger] : passengers) {
        if (pPassenger) {
            outFile << pPassenger->serialize() << "\n";
        }
    }
    return true;
}

bool FileManager::loadPassengers(const std::string& filename, std::map<int, std::unique_ptr<Passenger>>& passengers, int& maxId) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    passengers.clear();
    std::string line;
    while (std::getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() < 4) continue;

        std::string type = tokens[0];
        int id = std::stoi(tokens[1]);
        std::string name = tokens[2];
        std::string email = tokens[3];

        if (type == "STUDENT" && tokens.size() >= 6) {
            std::string college = tokens[4];
            std::string cardId = tokens[5];
            passengers[id] = std::make_unique<StudentPassenger>(id, name, email, college, cardId);
        } else if (type == "SENIOR" && tokens.size() >= 6) {
            int age = std::stoi(tokens[4]);
            std::string cardId = tokens[5];
            passengers[id] = std::make_unique<SeniorPassenger>(id, name, email, age, cardId);
        } else {
            // Default to Regular
            passengers[id] = std::make_unique<Passenger>(id, name, email);
        }

        if (id > maxId) maxId = id;
    }
    return true;
}

// ---------------- TICKETS ----------------

bool FileManager::saveTickets(const std::string& filename, const std::map<int, Ticket>& tickets) {
    std::ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, ticket] : tickets) {
        outFile << ticket.serialize() << "\n";
    }
    return true;
}

bool FileManager::loadTickets(const std::string& filename, std::map<int, Ticket>& tickets, int& maxId) {
    std::ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    tickets.clear();
    std::string line;
    while (std::getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 12) {
            int tId = std::stoi(tokens[0]);
            int pId = std::stoi(tokens[1]);
            int srcId = std::stoi(tokens[2]);
            int destId = std::stoi(tokens[3]);
            int trnId = std::stoi(tokens[4]);
            double dist = std::stod(tokens[5]);
            double baseFare = std::stod(tokens[6]);
            double disc = std::stod(tokens[7]);
            double finalFare = std::stod(tokens[8]);
            std::string status = tokens[9];
            std::string payStatus = tokens[10];
            std::string payMethod = tokens[11];
            std::string timeStr = (tokens.size() >= 13) ? tokens[12] : "";

            Ticket tkt(tId, pId, srcId, destId, trnId, dist, baseFare, disc, finalFare, payMethod, timeStr);
            tkt.setBookingStatus(status);
            tkt.setPaymentStatus(payStatus);

            tickets[tId] = tkt;
            if (tId > maxId) maxId = tId;
        }
    }
    return true;
}
