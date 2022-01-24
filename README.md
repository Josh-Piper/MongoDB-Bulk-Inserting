# Overview

A batch loading job that inserts orders into a MongoDB database from a CSV file located online.

Following the schema
Customers:
customerId, firstName, lastName

Orders:
orderId, customerId, item, quantity

Ensures the customerId exists before importing the order.

# Installation

```bash
git clone https://github.com/Josh-Piper/MongoDB-Bulk-Inserting.git
cd ./MongoDB-Bulk-Inserting
yarn install
yarn run dev
```
