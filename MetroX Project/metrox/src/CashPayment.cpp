#include "../include/CashPayment.h"
#include <iostream>
#include <iomanip>
using namespace std;

CashPayment::CashPayment() : cashTendered(0.0), changeAmount(0.0) {}

CashPayment::CashPayment(double cashTendered)
    : cashTendered(cashTendered), changeAmount(0.0) {}

double CashPayment::getCashTendered() const {
    return cashTendered;
}

double CashPayment::getChangeAmount() const {
    return changeAmount;
}

void CashPayment::setCashTendered(double tendered) {
    cashTendered = tendered;
}

string CashPayment::getMethodName() const {
    return "Cash (Ticket Counter / TVM)";
}

bool CashPayment::pay(double amount) {
    cout << "\n=========================================\n";
    cout << "       [SIMULATION] CASH PAYMENT         \n";
    cout << "=========================================\n";
    cout << ">> Total Payable Amount: ₹" << fixed << setprecision(2) << amount << "\n";

    // If cash tendered was not preset, prompt user
    if (cashTendered <= 0.0) {
        cout << ">> Enter cash tendered by passenger: ₹";
        if (!(cin >> cashTendered)) {
            cin.clear();
            string dummy;
            getline(cin, dummy);
            cout << "[ERROR] Invalid cash amount entered.\n";
            return false;
        }
    }

    cout << ">> Cash Tendered: ₹" << fixed << setprecision(2) << cashTendered << "\n";

    if (cashTendered < amount) {
        double deficit = amount - cashTendered;
        cout << "[ERROR] Insufficient cash provided!\n";
        cout << "        Shortfall: ₹" << fixed << setprecision(2) << deficit << "\n";
        cout << "[TRANSACTION FAILED] Payment cancelled due to insufficient funds.\n";
        return false;
    }

    changeAmount = cashTendered - amount;
    cout << "[SUCCESS] Payment Accepted.\n";
    cout << "-----------------------------------------\n";
    cout << "  Amount Billed:      ₹" << setw(8) << fixed << setprecision(2) << amount << "\n";
    cout << "  Cash Received:      ₹" << setw(8) << cashTendered << "\n";
    cout << "  Change Returned:    ₹" << setw(8) << changeAmount << "\n";
    cout << "-----------------------------------------\n";
    cout << "[NOTICE] This is a simulated cash payment.\n";
    cout << "=========================================\n\n";
    return true;
}
