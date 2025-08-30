#!/bin/bash

# DNS Configuration Checker for AIniseFlow Domain (using nslookup)
echo "=== DNS Configuration Checker for ainiseflow.com ==="
echo "Timestamp: $(date)"
echo ""

# Check A record for root domain
echo "1. Checking A record for ainiseflow.com:"
nslookup ainiseflow.com 2>/dev/null | grep -A 2 "Name:" || echo "No A record found or domain not resolving"
echo ""

# Check www subdomain
echo "2. Checking www.ainiseflow.com:"
nslookup www.ainiseflow.com 2>/dev/null | grep -A 2 "Name:" || echo "No record found for www subdomain"
echo ""

# Web connectivity test
echo "3. Testing HTTPS connectivity:"
timeout 10 curl -sI https://ainiseflow.com 2>/dev/null | head -1 || echo "❌ HTTPS connection failed"
echo ""

echo "4. Testing HTTP connectivity:"
timeout 10 curl -sI http://ainiseflow.com 2>/dev/null | head -1 || echo "❌ HTTP connection failed"
echo ""

echo "=== Expected Configuration ==="
echo "✅ A Record: Should point to 76.76.19.61 or 216.198.79.1"
echo "✅ CNAME (www): Should point to cname.vercel-dns.com"
echo "✅ HTTPS: Should return 200 or redirect status"
echo ""

echo "=== Troubleshooting Steps ==="
echo "1. In Hostinger DNS Zone for ainiseflow.com:"
echo "   - Delete any A records with old IP (84.32.84.32)"
echo "   - Add A record: @ → 76.76.19.61 (TTL: 300)"
echo "   - Add CNAME: www → cname.vercel-dns.com (TTL: 300)"
echo ""
echo "2. In Vercel Dashboard:"
echo "   - Ensure domain is added correctly as 'ainiseflow.com'"
echo "   - Wait for DNS verification (can take up to 48 hours)"
echo ""
echo "3. If still not working after 24 hours:"
echo "   - Check Hostinger for any conflicts or locked records"
echo "   - Contact Hostinger support for DNS assistance"
echo "   - Consider using Vercel nameservers instead"