#include "../include/Passenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>
using namespace std;

Passenger::Passenger() : id(0), name(""), email("") {}

Passenger::Passenger(int id, const string& name, const string& email)
    : id(id), name(name), email(email) {}

int Passenger::getId() const {
    return id;
}

string Passenger::getName() const {
    return name;
}

string Passenger::getEmail() const {
    return email;
}

void Passenger::setName(const string& newName) {
    name = newName;
}

void Passenger::setEmail(const string& newEmail) {
    email = newEmail;
}

double Passenger::getDiscount() const {
    return 0.0; // 0% discount for regular passengers
}

string Passenger::getPassengerType() const {
    return "Regular";
}

void Passenger::display() const {
    cout << "Passenger ID: " << setw(4) << id
              << " | Type: " << setw(9) << getPassengerType()
              << " | Name: " << setw(20) << left << name
              << " | Email: " << setw(25) << email
              << " | Discount: " << fixed << setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << right;
}

string Passenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL
    ostringstream oss;
    oss << "REGULAR|" << id << "|" << name << "|" << email;
    return oss.str();
}
