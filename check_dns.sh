#!/bin/bash

# DNS Configuration Checker for AIniseFlow Domain
echo "=== DNS Configuration Checker for ainiseflow.com ==="
echo "Timestamp: $(date)"
echo ""

# Check A record for root domain
echo "1. Checking A record for ainiseflow.com:"
dig +short ainiseflow.com A
echo ""

# Check CNAME for www subdomain
echo "2. Checking CNAME for www.ainiseflow.com:"
dig +short www.ainiseflow.com CNAME
echo ""

# Check from Google DNS
echo "3. Checking from Google DNS (8.8.8.8):"
dig @8.8.8.8 +short ainiseflow.com A
echo ""

# Check from Cloudflare DNS
echo "4. Checking from Cloudflare DNS (1.1.1.1):"
dig @1.1.1.1 +short ainiseflow.com A
echo ""

# Check NS records
echo "5. Checking Nameservers:"
dig +short ainiseflow.com NS
echo ""

# Expected values
echo "=== Expected Values ==="
echo "A Record: Should be 76.76.19.61 or 216.198.79.1"
echo "CNAME (www): Should be cname.vercel-dns.com"
echo "NS: Should be Hostinger nameservers"
echo ""

# Web connectivity test
echo "6. Testing web connectivity:"
curl -sI https://ainiseflow.com | head -1 || echo "Connection failed"
echo ""

echo "=== Troubleshooting Tips ==="
echo "- If A record shows old IP (84.32.84.32), remove it from Hostinger"
echo "- DNS changes can take up to 48 hours to fully propagate"
echo "- Clear browser cache before testing"
echo "- Try accessing from different networks/devices"