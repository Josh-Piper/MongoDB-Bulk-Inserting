# Overview

A batch loading job that inserts orders into a MongoDB database from a CSV file located online.
The current project utilises multi-threading and basic unit tests.

## Things to Add
- Performance testing via Artillery
- Use an Express server to utilise Artillery. POST request for the url.
- How would the batch event occur? could be an endpoint expecting webhooks. OR a scheduled batch event that reads from a URL which contains all the required files to sync. These files could then be moved into an archived folder once synced.

# Installation

```bash
git clone https://github.com/Josh-Piper/MongoDB-Bulk-Inserting.git
cd ./MongoDB-Bulk-Inserting
yarn install
yarn run dev
```
