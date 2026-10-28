#pragma once

#include <string>
using namespace std;


class Train {
private:
    int id;
    string name;
    int capacity;
    int currentPassengers;
    string status; // "IN_SERVICE", "MAINTENANCE", "STANDBY"

public:
    Train();
    Train(int id, const string& name, int capacity, const string& status = "IN_SERVICE");

    // Getters and Setters
    int getId() const;
    string getName() const;
    int getCapacity() const;
    int getCurrentPassengers() const;
    string getStatus() const;

    void setName(const string& name);
    void setCapacity(int capacity);
    void setStatus(const string& status);

    // Operational methods
    bool canBoard(int count = 1) const;
    bool boardPassengers(int count = 1);
    bool alightPassengers(int count = 1);
    int getAvailableCapacity() const;
    double getOccupancyRate() const;

    // Display
    void display() const;
};
