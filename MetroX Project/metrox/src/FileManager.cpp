#include "../include/FileManager.h"
#include "../include/StudentPassenger.h"
#include "../include/SeniorPassenger.h"
using namespace std;

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

void FileManager::ensureDirectoryExists(const string& dirPath) {
    MKDIR(dirPath.c_str());
}

static vector<string> split(const string& str, char delimiter) {
    vector<string> tokens;
    string token;
    istringstream tokenStream(str);
    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

// ---------------- STATIONS ----------------

bool FileManager::saveStations(const string& filename, const map<int, Station>& stations) {
    ofstream outFile(filename);
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

bool FileManager::loadStations(const string& filename, map<int, Station>& stations, int& maxId) {
    ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    stations.clear();
    string line;
    while (getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 3) {
            int id = stoi(tokens[0]);
            string name = tokens[1];
            string loc = tokens[2];
            Station st(id, name, loc);

            if (tokens.size() >= 4 && !tokens[3].empty()) {
                auto connPairs = split(tokens[3], ',');
                for (const auto& cp : connPairs) {
                    auto parts = split(cp, ':');
                    if (parts.size() == 2) {
                        int neighbor = stoi(parts[0]);
                        double dist = stod(parts[1]);
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

bool FileManager::saveTrains(const string& filename, const map<int, Train>& trains) {
    ofstream outFile(filename);
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

bool FileManager::loadTrains(const string& filename, map<int, Train>& trains, int& maxId) {
    ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    trains.clear();
    string line;
    while (getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 5) {
            int id = stoi(tokens[0]);
            string name = tokens[1];
            int cap = stoi(tokens[2]);
            int curr = stoi(tokens[3]);
            string status = tokens[4];

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

bool FileManager::savePassengers(const string& filename, const map<int, unique_ptr<Passenger>>& passengers) {
    ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, pPassenger] : passengers) {
        if (pPassenger) {
            outFile << pPassenger->serialize() << "\n";
        }
    }
    return true;
}

bool FileManager::loadPassengers(const string& filename, map<int, unique_ptr<Passenger>>& passengers, int& maxId) {
    ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    passengers.clear();
    string line;
    while (getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() < 4) continue;

        string type = tokens[0];
        int id = stoi(tokens[1]);
        string name = tokens[2];
        string email = tokens[3];

        if (type == "STUDENT" && tokens.size() >= 6) {
            string college = tokens[4];
            string cardId = tokens[5];
            passengers[id] = make_unique<StudentPassenger>(id, name, email, college, cardId);
        } else if (type == "SENIOR" && tokens.size() >= 6) {
            int age = stoi(tokens[4]);
            string cardId = tokens[5];
            passengers[id] = make_unique<SeniorPassenger>(id, name, email, age, cardId);
        } else {
            // Default to Regular
            passengers[id] = make_unique<Passenger>(id, name, email);
        }

        if (id > maxId) maxId = id;
    }
    return true;
}

// ---------------- TICKETS ----------------

bool FileManager::saveTickets(const string& filename, const map<int, Ticket>& tickets) {
    ofstream outFile(filename);
    if (!outFile.is_open()) return false;

    for (const auto& [id, ticket] : tickets) {
        outFile << ticket.serialize() << "\n";
    }
    return true;
}

bool FileManager::loadTickets(const string& filename, map<int, Ticket>& tickets, int& maxId) {
    ifstream inFile(filename);
    if (!inFile.is_open()) return false;

    tickets.clear();
    string line;
    while (getline(inFile, line)) {
        if (line.empty() || line[0] == '#') continue;
        auto tokens = split(line, '|');
        if (tokens.size() >= 12) {
            int tId = stoi(tokens[0]);
            int pId = stoi(tokens[1]);
            int srcId = stoi(tokens[2]);
            int destId = stoi(tokens[3]);
            int trnId = stoi(tokens[4]);
            double dist = stod(tokens[5]);
            double baseFare = stod(tokens[6]);
            double disc = stod(tokens[7]);
            double finalFare = stod(tokens[8]);
            string status = tokens[9];
            string payStatus = tokens[10];
            string payMethod = tokens[11];
            string timeStr = (tokens.size() >= 13) ? tokens[12] : "";

            Ticket tkt(tId, pId, srcId, destId, trnId, dist, baseFare, disc, finalFare, payMethod, timeStr);
            tkt.setBookingStatus(status);
            tkt.setPaymentStatus(payStatus);

            tickets[tId] = tkt;
            if (tId > maxId) maxId = tId;
        }
    }
    return true;
}
