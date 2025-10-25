#!/bin/bash
echo "Adding database indexes..."
cd "$(dirname "$0")"
npx ts-node add-database-indexes.ts
