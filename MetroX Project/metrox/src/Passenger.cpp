#include "../include/Passenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>

Passenger::Passenger() : id(0), name(""), email("") {}

Passenger::Passenger(int id, const std::string& name, const std::string& email)
    : id(id), name(name), email(email) {}

int Passenger::getId() const {
    return id;
}

std::string Passenger::getName() const {
    return name;
}

std::string Passenger::getEmail() const {
    return email;
}

void Passenger::setName(const std::string& newName) {
    name = newName;
}

void Passenger::setEmail(const std::string& newEmail) {
    email = newEmail;
}

double Passenger::getDiscount() const {
    return 0.0; // 0% discount for regular passengers
}

std::string Passenger::getPassengerType() const {
    return "Regular";
}

void Passenger::display() const {
    std::cout << "Passenger ID: " << std::setw(4) << id
              << " | Type: " << std::setw(9) << getPassengerType()
              << " | Name: " << std::setw(20) << std::left << name
              << " | Email: " << std::setw(25) << email
              << " | Discount: " << std::fixed << std::setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << std::right;
}

std::string Passenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL
    std::ostringstream oss;
    oss << "REGULAR|" << id << "|" << name << "|" << email;
    return oss.str();
}
