#include "../include/Train.h"
#include <iostream>
#include <iomanip>
using namespace std;

Train::Train() : id(0), name(""), capacity(0), currentPassengers(0), status("IN_SERVICE") {}

Train::Train(int id, const string& name, int capacity, const string& status)
    : id(id), name(name), capacity(capacity > 0 ? capacity : 100), currentPassengers(0), status(status) {}

int Train::getId() const {
    return id;
}

string Train::getName() const {
    return name;
}

int Train::getCapacity() const {
    return capacity;
}

int Train::getCurrentPassengers() const {
    return currentPassengers;
}

string Train::getStatus() const {
    return status;
}

void Train::setName(const string& newName) {
    name = newName;
}

void Train::setCapacity(int newCapacity) {
    if (newCapacity >= currentPassengers) {
        capacity = newCapacity;
    }
}

void Train::setStatus(const string& newStatus) {
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
    cout << "Train ID: " << setw(3) << id 
              << " | Model/Line: " << setw(18) << left << name 
              << " | Status: " << setw(12) << status
              << " | Capacity: " << setw(4) << right << capacity
              << " | Onboard: " << setw(4) << right << currentPassengers
              << " | Available: " << setw(4) << right << getAvailableCapacity()
              << " | Load: " << fixed << setprecision(1) << getOccupancyRate() << "%\n";
}
