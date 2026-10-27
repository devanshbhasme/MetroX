#include "../include/Ticket.h"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>

Ticket::Ticket()
    : ticketId(0), passengerId(0), sourceStationId(0), destinationStationId(0),
      trainId(0), distance(0.0), baseFare(0.0), discountPercent(0.0), finalFare(0.0),
      bookingStatus("PENDING"), paymentStatus("UNPAID"), paymentMethod("N/A"), bookingTime("") {}

Ticket::Ticket(int ticketId, int passengerId, int sourceId, int destId, int trainId,
               double distance, double baseFare, double discountPercent, double finalFare,
               const std::string& paymentMethod, const std::string& bookingTime)
    : ticketId(ticketId), passengerId(passengerId), sourceStationId(sourceId),
      destinationStationId(destId), trainId(trainId), distance(distance),
      baseFare(baseFare), discountPercent(discountPercent), finalFare(finalFare),
      bookingStatus("CONFIRMED"), paymentStatus("PAID"), paymentMethod(paymentMethod),
      bookingTime(bookingTime) {
    if (this->bookingTime.empty()) {
        std::time_t now = std::time(nullptr);
        char buf[64];
        std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
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

std::string Ticket::getBookingStatus() const {
    return bookingStatus;
}

std::string Ticket::getPaymentStatus() const {
    return paymentStatus;
}

std::string Ticket::getPaymentMethod() const {
    return paymentMethod;
}

std::string Ticket::getBookingTime() const {
    return bookingTime;
}

bool Ticket::isBooked() const {
    return bookingStatus == "CONFIRMED";
}

void Ticket::setBookingStatus(const std::string& status) {
    bookingStatus = status;
}

void Ticket::setPaymentStatus(const std::string& status) {
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
    std::cout << "Ticket #" << std::setw(5) << ticketId
              << " | Pass ID: " << std::setw(4) << passengerId
              << " | Route: [" << sourceStationId << "] -> [" << destinationStationId << "]"
              << " | Train: [" << trainId << "]"
              << " | Dist: " << std::fixed << std::setprecision(1) << distance << " km"
              << " | Fare: ₹" << std::setprecision(2) << finalFare
              << " | Status: " << bookingStatus
              << " | Paid: " << paymentStatus << " (" << paymentMethod << ")\n";
}

void Ticket::displayDetailed(const std::string& passengerName,
                             const std::string& passengerType,
                             const std::string& sourceName,
                             const std::string& destName,
                             const std::string& trainName) const {
    std::cout << "\n=======================================================\n";
    std::cout << "               METROX TRANSIT BOARDING PASS            \n";
    std::cout << "=======================================================\n";
    std::cout << " Ticket Number   : #" << ticketId << "\n";
    std::cout << " Booking Time    : " << bookingTime << "\n";
    std::cout << " Passenger       : " << passengerName << " (ID: " << passengerId 
              << ", Category: " << passengerType << ")\n";
    std::cout << " Assigned Train  : " << trainName << " (ID: " << trainId << ")\n";
    std::cout << " Journey         : " << sourceName << " [#" << sourceStationId << "]"
              << "  --->  " << destName << " [#" << destinationStationId << "]\n";
    std::cout << " Total Distance  : " << std::fixed << std::setprecision(2) << distance << " km\n";
    std::cout << "-------------------------------------------------------\n";
    std::cout << " Base Fare       : ₹" << std::fixed << std::setprecision(2) << baseFare << "\n";
    std::cout << " Concession      : " << std::fixed << std::setprecision(0) << (discountPercent * 100.0) 
              << "% (-₹" << std::setprecision(2) << (baseFare * discountPercent) << ")\n";
    std::cout << " Total Fare Paid : ₹" << std::fixed << std::setprecision(2) << finalFare << "\n";
    std::cout << " Payment Method  : " << paymentMethod << " (Simulated)\n";
    std::cout << " Booking Status  : " << bookingStatus << "\n";
    std::cout << " Payment Status  : " << paymentStatus << "\n";
    std::cout << "=======================================================\n\n";
}

std::string Ticket::serialize() const {
    // Format: TICKET_ID|PASS_ID|SRC_ID|DEST_ID|TRAIN_ID|DIST|BASE_FARE|DISCOUNT|FINAL_FARE|STATUS|PAY_STATUS|PAY_METHOD|BOOKING_TIME
    std::ostringstream oss;
    oss << ticketId << "|" << passengerId << "|" << sourceStationId << "|"
        << destinationStationId << "|" << trainId << "|" << distance << "|"
        << baseFare << "|" << discountPercent << "|" << finalFare << "|"
        << bookingStatus << "|" << paymentStatus << "|" << paymentMethod << "|"
        << bookingTime;
    return oss.str();
}
