#pragma once

#include <string>

/**
 * @class Ticket
 * @brief Represents an issued metro transit ticket, recording passenger, trip, financial, and operational details.
 * Demonstrates: Encapsulation, State Management, and Business Invariants.
 */
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
    std::string bookingStatus; // "CONFIRMED", "CANCELLED"
    std::string paymentStatus; // "PAID", "REFUNDED", "FAILED"
    std::string paymentMethod; // "UPI", "Card", "Cash"
    std::string bookingTime;

public:
    Ticket();
    Ticket(int ticketId, int passengerId, int sourceId, int destId, int trainId,
           double distance, double baseFare, double discountPercent, double finalFare,
           const std::string& paymentMethod, const std::string& bookingTime = "");

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
    std::string getBookingStatus() const;
    std::string getPaymentStatus() const;
    std::string getPaymentMethod() const;
    std::string getBookingTime() const;
    bool isBooked() const;

    // Setters / Modifiers
    void setBookingStatus(const std::string& status);
    void setPaymentStatus(const std::string& status);
    bool cancelTicket();

    // Presentation
    void display() const;
    void displayDetailed(const std::string& passengerName,
                         const std::string& passengerType,
                         const std::string& sourceName,
                         const std::string& destName,
                         const std::string& trainName) const;
    std::string serialize() const;
};
