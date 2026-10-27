#include "../include/Train.h"
#include <iostream>
#include <iomanip>

Train::Train() : id(0), name(""), capacity(0), currentPassengers(0), status("IN_SERVICE") {}

Train::Train(int id, const std::string& name, int capacity, const std::string& status)
    : id(id), name(name), capacity(capacity > 0 ? capacity : 100), currentPassengers(0), status(status) {}

int Train::getId() const {
    return id;
}

std::string Train::getName() const {
    return name;
}

int Train::getCapacity() const {
    return capacity;
}

int Train::getCurrentPassengers() const {
    return currentPassengers;
}

std::string Train::getStatus() const {
    return status;
}

void Train::setName(const std::string& newName) {
    name = newName;
}

void Train::setCapacity(int newCapacity) {
    if (newCapacity >= currentPassengers) {
        capacity = newCapacity;
    }
}

void Train::setStatus(const std::string& newStatus) {
    status = newStatus;
}

bool Train::canBoard(int count) const {
    if (status != "IN_SERVICE") return false;
    return (currentPassengers + count) <= capacity;
}

bool Train::boardPassengers(int count) {
    if (count <= 0) return false;
    if (canBoard(count)) {
        currentPassengers += count;
        return true;
    }
    return false;
}

bool Train::alightPassengers(int count) {
    if (count <= 0) return false;
    if (currentPassengers - count >= 0) {
        currentPassengers -= count;
        return true;
    }
    // Cannot alight more passengers than currently onboard
    currentPassengers = 0;
    return true;
}

int Train::getAvailableCapacity() const {
    int avail = capacity - currentPassengers;
    return avail > 0 ? avail : 0;
}

double Train::getOccupancyRate() const {
    if (capacity <= 0) return 0.0;
    return (static_cast<double>(currentPassengers) / capacity) * 100.0;
}

void Train::display() const {
    std::cout << "Train ID: " << std::setw(3) << id 
              << " | Model/Line: " << std::setw(18) << std::left << name 
              << " | Status: " << std::setw(12) << status
              << " | Capacity: " << std::setw(4) << std::right << capacity
              << " | Onboard: " << std::setw(4) << std::right << currentPassengers
              << " | Available: " << std::setw(4) << std::right << getAvailableCapacity()
              << " | Load: " << std::fixed << std::setprecision(1) << getOccupancyRate() << "%\n";
}
