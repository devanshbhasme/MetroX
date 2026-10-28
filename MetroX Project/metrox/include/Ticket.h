#pragma once

#include <string>
using namespace std;

class Ticket {
private:
    int ticketId;
    int passengerId;
    int sourceStationId;
    int destinationStationId;
    int trainId;
    double distance;
    double baseFare;
    double discountPercent; // e.g., 0.20 for 20%
    double finalFare;
    string bookingStatus; // "CONFIRMED", "CANCELLED"
    string paymentStatus; // "PAID", "REFUNDED", "FAILED"
    string paymentMethod; // "UPI", "Card", "Cash"
    string bookingTime;

public:
    Ticket();
    Ticket(int ticketId, int passengerId, int sourceId, int destId, int trainId,
           double distance, double baseFare, double discountPercent, double finalFare,
           const string& paymentMethod, const string& bookingTime = "");

    // Getters
    int getTicketId() const;
    int getPassengerId() const;
    int getSourceStationId() const;
    int getDestinationStationId() const;
    int getTrainId() const;
    double getDistance() const;
    double getBaseFare() const;
    double getDiscountPercent() const;
    double getFinalFare() const;
    string getBookingStatus() const;
    string getPaymentStatus() const;
    string getPaymentMethod() const;
    string getBookingTime() const;
    bool isBooked() const;

    // Setters / Modifiers
    void setBookingStatus(const string& status);
    void setPaymentStatus(const string& status);
    bool cancelTicket();

    // Presentation
    void display() const;
    void displayDetailed(const string& passengerName,
                         const string& passengerType,
                         const string& sourceName,
                         const string& destName,
                         const string& trainName) const;
    string serialize() const;
};
