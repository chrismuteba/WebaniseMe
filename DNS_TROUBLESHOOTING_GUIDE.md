# DNS Configuration Troubleshooting Guide for Vercel + Hostinger

## Current Issue
Vercel showing "invalid configuration" despite adding required DNS records to Hostinger for domain `ainiseflow.com`.

## Step-by-Step Resolution Process

### 1. Verify Current DNS Records at Hostinger

**Required DNS Records for Vercel:**
```
Type: A
Name: @ (or root/blank)
Value: 76.76.19.61

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Additional A Record (if required by Vercel):**
```
Type: A
Name: @ (or root/blank)  
Value: 216.198.79.1
```

### 2. Common DNS Issues and Solutions

#### Issue A: Multiple A Records Conflict
**Problem:** Old A records (like 84.32.84.32) still exist alongside new ones
**Solution:** 
- Delete ALL existing A records for the root domain (@)
- Add only the A record(s) specified by Vercel
- Wait 5-10 minutes for propagation

#### Issue B: Incorrect CNAME Configuration
**Problem:** CNAME pointing to wrong target or conflicting with A records
**Solution:**
- Ensure CNAME for "www" points to `cname.vercel-dns.com`
- Remove any conflicting CNAME records

#### Issue C: TTL Settings Too High
**Problem:** DNS changes taking too long to propagate due to high TTL
**Solution:**
- Set TTL to 300 seconds (5 minutes) for faster propagation
- Wait for old TTL period to expire before testing

#### Issue D: Subdomain vs Root Domain Configuration
**Problem:** Records added to wrong subdomain level
**Solution:**
- Root domain (@): Use A record
- www subdomain: Use CNAME record
- Ensure no conflicts between different record types

### 3. DNS Propagation Check Commands

Run these commands to verify DNS propagation:

```bash
# Check A record for root domain
dig ainiseflow.com A

# Check CNAME for www subdomain  
dig www.ainiseflow.com CNAME

# Check from different DNS servers
dig @8.8.8.8 ainiseflow.com A
dig @1.1.1.1 ainiseflow.com A
```

### 4. Vercel Configuration Steps

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Remove any old domain configurations
   - Add `ainiseflow.com` as primary domain
   - Add `www.ainiseflow.com` as additional domain (optional)

2. **Wait for Verification:**
   - Vercel will automatically detect DNS changes
   - This can take 5-48 hours depending on propagation
   - Check status periodically

### 5. Hostinger-Specific Instructions

**Access DNS Management:**
1. Login to Hostinger control panel
2. Go to "Domains" → "Manage"
3. Click on `ainiseflow.com`
4. Navigate to "DNS Zone"

**Clear Old Records:**
1. Delete any existing A records with old IP addresses
2. Delete any CNAME records for root domain (@)
3. Keep only essential records (MX for email, etc.)

**Add New Records:**
1. Add A record: Name=@ or blank, Value=76.76.19.61, TTL=300
2. Add CNAME: Name=www, Value=cname.vercel-dns.com, TTL=300
3. Save changes and wait

### 6. Advanced Troubleshooting

#### If Issue Persists After 24 Hours:

**Check for Hidden Characters:**
- Ensure no spaces or hidden characters in DNS values
- Copy-paste values directly from Vercel

**Verify Domain Ownership:**
- Ensure domain is not locked or in transfer status
- Check domain expiration date

**Contact Support:**
- Hostinger support for DNS configuration issues
- Vercel support for platform-specific problems

### 7. Alternative Approaches

#### Option 1: Use Vercel Nameservers
1. In Hostinger, change nameservers to Vercel's
2. Configure all DNS in Vercel dashboard
3. More reliable but requires migrating all DNS records

#### Option 2: Temporary Subdomain
1. Use a subdomain like `app.ainiseflow.com` temporarily
2. Point subdomain to Vercel while troubleshooting root domain
3. Switch back when DNS is resolved

### 8. Testing and Validation

**Once DNS is configured:**
```bash
# Test website accessibility
curl -I https://ainiseflow.com
curl -I https://www.ainiseflow.com

# Check SSL certificate
curl -sI https://ainiseflow.com | grep -i "HTTP\|ssl\|certificate"
```

**Verify in Browser:**
- Clear browser cache
- Test in incognito/private mode
- Test from different devices/networks

## Emergency Rollback Plan

If issues persist:
1. Keep old domain active temporarily
2. Document all DNS changes made
3. Consider using Cloudflare as DNS provider for better control
4. Set up 301 redirects from old domain to new domain once resolved

## Estimated Timeline
- DNS propagation: 5 minutes to 48 hours
- Vercel verification: Automatic once DNS propagates
- SSL certificate: Automatic after domain verification

## Next Steps
1. Verify current DNS records in Hostinger match requirements exactly
2. Check DNS propagation status using online tools
3. Wait appropriate time for propagation
4. Contact support if issues persist beyond 48 hours