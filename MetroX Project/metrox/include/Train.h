#pragma once

#include <string>

/**
 * @class Train
 * @brief Represents a metro train and tracks onboard passengers, capacity limits, and operational status.
 * Demonstrates: Encapsulation and Data Invariant Enforcement.
 */
class Train {
private:
    int id;
    std::string name;
    int capacity;
    int currentPassengers;
    std::string status; // "IN_SERVICE", "MAINTENANCE", "STANDBY"

public:
    Train();
    Train(int id, const std::string& name, int capacity, const std::string& status = "IN_SERVICE");

    // Getters and Setters
    int getId() const;
    std::string getName() const;
    int getCapacity() const;
    int getCurrentPassengers() const;
    std::string getStatus() const;

    void setName(const std::string& name);
    void setCapacity(int capacity);
    void setStatus(const std::string& status);

    // Operational methods
    bool canBoard(int count = 1) const;
    bool boardPassengers(int count = 1);
    bool alightPassengers(int count = 1);
    int getAvailableCapacity() const;
    double getOccupancyRate() const;

    // Display
    void display() const;
};
