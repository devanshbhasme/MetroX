#include "../include/StudentPassenger.h"
#include <iostream>
#include <iomanip>
#include <sstream>
using namespace std;

StudentPassenger::StudentPassenger()
    : Passenger(), collegeName(""), studentCardId("") {}

StudentPassenger::StudentPassenger(int id, const string& name, const string& email,
                                   const string& collegeName, const string& studentCardId)
    : Passenger(id, name, email), collegeName(collegeName), studentCardId(studentCardId) {}

string StudentPassenger::getCollegeName() const {
    return collegeName;
}

string StudentPassenger::getStudentCardId() const {
    return studentCardId;
}

void StudentPassenger::setCollegeName(const string& college) {
    collegeName = college;
}

void StudentPassenger::setStudentCardId(const string& cardId) {
    studentCardId = cardId;
}

double StudentPassenger::getDiscount() const {
    return 0.20; // 20% discount for students
}

string StudentPassenger::getPassengerType() const {
    return "Student";
}

void StudentPassenger::display() const {
    cout << "Passenger ID: " << setw(4) << id
              << " | Type: " << setw(9) << getPassengerType()
              << " | Name: " << setw(20) << left << name
              << " | Email: " << setw(25) << email
              << " | Discount: " << fixed << setprecision(0) << (getDiscount() * 100.0) << "%\n"
              << right;
    cout << "   └── College: " << collegeName << " (Student ID Card: " << studentCardId << ")\n";
}

string StudentPassenger::serialize() const {
    // Format: TYPE|ID|NAME|EMAIL|COLLEGE|STUDENT_CARD
    ostringstream oss;
    oss << "STUDENT|" << id << "|" << name << "|" << email << "|" << collegeName << "|" << studentCardId;
    return oss.str();
}
