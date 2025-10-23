#!/bin/bash
echo "Running comprehensive database seeding script..."
cd "$(dirname "$0")/.."
npm run seed:comprehensive
