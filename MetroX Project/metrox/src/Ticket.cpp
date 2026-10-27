#include "../include/Ticket.h"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>
using namespace std;

Ticket::Ticket()
    : ticketId(0), passengerId(0), sourceStationId(0), destinationStationId(0),
      trainId(0), distance(0.0), baseFare(0.0), discountPercent(0.0), finalFare(0.0),
      bookingStatus("PENDING"), paymentStatus("UNPAID"), paymentMethod("N/A"), bookingTime("") {}

Ticket::Ticket(int ticketId, int passengerId, int sourceId, int destId, int trainId,
               double distance, double baseFare, double discountPercent, double finalFare,
               const string& paymentMethod, const string& bookingTime)
    : ticketId(ticketId), passengerId(passengerId), sourceStationId(sourceId),
      destinationStationId(destId), trainId(trainId), distance(distance),
      baseFare(baseFare), discountPercent(discountPercent), finalFare(finalFare),
      bookingStatus("CONFIRMED"), paymentStatus("PAID"), paymentMethod(paymentMethod),
      bookingTime(bookingTime) {
    if (this->bookingTime.empty()) {
        time_t now = time(nullptr);
        char buf[64];
        strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&now));
        this->bookingTime = buf;
    }
}

int Ticket::getTicketId() const {
    return ticketId;
}

int Ticket::getPassengerId() const {
    return passengerId;
}

int Ticket::getSourceStationId() const {
    return sourceStationId;
}

int Ticket::getDestinationStationId() const {
    return destinationStationId;
}

int Ticket::getTrainId() const {
    return trainId;
}

double Ticket::getDistance() const {
    return distance;
}

double Ticket::getBaseFare() const {
    return baseFare;
}

double Ticket::getDiscountPercent() const {
    return discountPercent;
}

double Ticket::getFinalFare() const {
    return finalFare;
}

string Ticket::getBookingStatus() const {
    return bookingStatus;
}

string Ticket::getPaymentStatus() const {
    return paymentStatus;
}

string Ticket::getPaymentMethod() const {
    return paymentMethod;
}

string Ticket::getBookingTime() const {
    return bookingTime;
}

bool Ticket::isBooked() const {
    return bookingStatus == "CONFIRMED";
}

void Ticket::setBookingStatus(const string& status) {
    bookingStatus = status;
}

void Ticket::setPaymentStatus(const string& status) {
    paymentStatus = status;
}

bool Ticket::cancelTicket() {
    if (bookingStatus == "CONFIRMED") {
        bookingStatus = "CANCELLED";
        paymentStatus = "REFUNDED";
        return true;
    }
    return false;
}

void Ticket::display() const {
    cout << "Ticket #" << setw(5) << ticketId
              << " | Pass ID: " << setw(4) << passengerId
              << " | Route: [" << sourceStationId << "] -> [" << destinationStationId << "]"
              << " | Train: [" << trainId << "]"
              << " | Dist: " << fixed << setprecision(1) << distance << " km"
              << " | Fare: ₹" << setprecision(2) << finalFare
              << " | Status: " << bookingStatus
              << " | Paid: " << paymentStatus << " (" << paymentMethod << ")\n";
}

void Ticket::displayDetailed(const string& passengerName,
                             const string& passengerType,
                             const string& sourceName,
                             const string& destName,
                             const string& trainName) const {
    cout << "\n=======================================================\n";
    cout << "               METROX TRANSIT BOARDING PASS            \n";
    cout << "=======================================================\n";
    cout << " Ticket Number   : #" << ticketId << "\n";
    cout << " Booking Time    : " << bookingTime << "\n";
    cout << " Passenger       : " << passengerName << " (ID: " << passengerId 
              << ", Category: " << passengerType << ")\n";
    cout << " Assigned Train  : " << trainName << " (ID: " << trainId << ")\n";
    cout << " Journey         : " << sourceName << " [#" << sourceStationId << "]"
              << "  --->  " << destName << " [#" << destinationStationId << "]\n";
    cout << " Total Distance  : " << fixed << setprecision(2) << distance << " km\n";
    cout << "-------------------------------------------------------\n";
    cout << " Base Fare       : ₹" << fixed << setprecision(2) << baseFare << "\n";
    cout << " Concession      : " << fixed << setprecision(0) << (discountPercent * 100.0) 
              << "% (-₹" << setprecision(2) << (baseFare * discountPercent) << ")\n";
    cout << " Total Fare Paid : ₹" << fixed << setprecision(2) << finalFare << "\n";
    cout << " Payment Method  : " << paymentMethod << " (Simulated)\n";
    cout << " Booking Status  : " << bookingStatus << "\n";
    cout << " Payment Status  : " << paymentStatus << "\n";
    cout << "=======================================================\n\n";
}

string Ticket::serialize() const {
    // Format: TICKET_ID|PASS_ID|SRC_ID|DEST_ID|TRAIN_ID|DIST|BASE_FARE|DISCOUNT|FINAL_FARE|STATUS|PAY_STATUS|PAY_METHOD|BOOKING_TIME
    ostringstream oss;
    oss << ticketId << "|" << passengerId << "|" << sourceStationId << "|"
        << destinationStationId << "|" << trainId << "|" << distance << "|"
        << baseFare << "|" << discountPercent << "|" << finalFare << "|"
        << bookingStatus << "|" << paymentStatus << "|" << paymentMethod << "|"
        << bookingTime;
    return oss.str();
}
