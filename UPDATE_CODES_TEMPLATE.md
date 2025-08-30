# 🔧 Update Google Analytics & Search Console Codes

## 📋 **STEP-BY-STEP CODE REPLACEMENT**

After you get your codes from Google Analytics and Search Console, I'll help you update them. Here's what we need:

### **1. Google Analytics Measurement ID**
- Format: `G-XXXXXXXXXX` (starts with G-)
- Example: `G-ABC123DEF456`

### **2. Google Search Console Verification Code**
- Format: Long alphanumeric string
- Example: `ABC123DEF456GHI789JKL012MNO345PQR678`

---

## 🎯 **WHAT TO DO NEXT**

### **OPTION A: Tell Me Your Codes** 
Share your codes and I'll update the files immediately:
```
Google Analytics ID: G-XXXXXXXXXX  
Search Console Code: YOUR_VERIFICATION_CODE
```

### **OPTION B: Manual Update Guide**
If you prefer to update yourself, here are the exact locations:

#### **File: index.html**

**Line 10** - Replace:
```html
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE_HERE" />
```
**With:**
```html
<meta name="google-site-verification" content="YOUR_ACTUAL_VERIFICATION_CODE" />
```

**Line 140** - Replace:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```
**With:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Line 145** - Replace:
```html
gtag('config', 'GA_MEASUREMENT_ID', {
```
**With:**
```html
gtag('config', 'G-XXXXXXXXXX', {
```

---

## ⚠️ **IMPORTANT NOTES**

1. **Case Sensitive**: Copy codes exactly as provided by Google
2. **No Spaces**: Make sure there are no extra spaces
3. **Keep Quotes**: Don't remove the quotation marks
4. **Test After**: Check that both services recognize your site after updating

---

## ✅ **VERIFICATION CHECKLIST**

After updating codes:
- [ ] Google Analytics shows data (may take 24-48 hours)
- [ ] Search Console shows "Verified" status
- [ ] No console errors in browser developer tools
- [ ] Both services recognize ainiseflow.com

Let me know your codes and I'll update them instantly! 🚀