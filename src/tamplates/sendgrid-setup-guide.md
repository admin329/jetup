# SendGrid Email Templates Setup Guide

## 📧 JETUP Email Templates (Updated)

Bu dosyada 4 adet email template'i hazırlandı:

### 1. **Customer Welcome Email** (`welcome-customer-email.html`)
- **Kullanım:** Yeni müşteri kaydı doğrulama
- **Template Variables:**
  - `{{to_name}}` - Kullanıcı adı
  - `{{to_email}}` - Email adresi
  - `{{confirmation_link}}` - Doğrulama linki

### 2. **Operator Welcome Email** (`welcome-operator-email.html`)
- **Kullanım:** Yeni operator kaydı doğrulama
- **Template Variables:**
  - `{{to_name}}` - Şirket adı
  - `{{to_email}}` - Email adresi
  - `{{confirmation_link}}` - Doğrulama linki

### 3. **Login Verification Email** (`login-verification-email.html`)
- **Kullanım:** 2FA giriş doğrulama kodu
- **Template Variables:**
  - `{{to_name}}` - Kullanıcı adı
  - `{{to_email}}` - Email adresi
  - `{{verification_code}}` - 6 haneli kod
  - `{{login_time}}` - Giriş zamanı
  - `{{login_ip}}` - IP adresi
  - `{{device_info}}` - Cihaz bilgisi

### 4. **Password Reset Email** (`password-reset-email.html`)
- **Kullanım:** Şifre yenileme linki
- **Template Variables:**
  - `{{to_name}}` - Kullanıcı adı
  - `{{to_email}}` - Email adresi
  - `{{user_role}}` - Kullanıcı rolü
  - `{{reset_link}}` - Şifre yenileme linki
  - `{{request_time}}` - İstek zamanı
  - `{{request_ip}}` - IP adresi

## 🚀 SendGrid'de Setup Adımları:

### 1. **Dynamic Templates Oluştur:**
```
SendGrid Dashboard → Email API → Dynamic Templates → Create Template
```

### 2. **Her Template için:**
1. Template adı ver (örn: "JETUP Welcome Email")
2. HTML içeriğini kopyala-yapıştır
3. Template ID'yi kaydet (d-xxxxxxxxx formatında)

### 3. **Environment Variables:**
```env
VITE_SENDGRID_API_KEY=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
VITE_SENDGRID_FROM_EMAIL=noreply@jetup.aero
VITE_SENDGRID_CUSTOMER_WELCOME_TEMPLATE_ID=d-xxxxxxxxx
VITE_SENDGRID_OPERATOR_WELCOME_TEMPLATE_ID=d-yyyyyyyyy
VITE_SENDGRID_OPERATOR_WELCOME_TEMPLATE_ID=d-yyyyyyyyy
VITE_SENDGRID_LOGIN_TEMPLATE_ID=d-yyyyyyyyy
VITE_SENDGRID_RESET_TEMPLATE_ID=d-zzzzzzzzz
```

### 4. **Sender Authentication:**
- Domain authentication için jetup.aero domain'i verify et
- Veya single sender verification ile noreply@jetup.aero'yu verify et

## 🎨 **Template Özellikleri:**

### **Tasarım:**
- ✅ JETUP brand renkleri (#0B1733, kırmızı)
- ✅ Responsive design (mobile-friendly)
- ✅ Professional aviation teması
- ✅ Gradient backgrounds
- ✅ Modern button styles

### **Güvenlik:**
- ✅ Expiry time bilgileri
- ✅ Security warnings
- ✅ IP address tracking
- ✅ Device information

### **Branding:**
- ✅ JETUP logo
- ✅ Company information
- ✅ Social media links
- ✅ Contact details

## 📝 **Sonraki Adımlar:**

1. **SendGrid'de template'leri oluştur**
2. **Template ID'leri al**
3. **Environment variables'ları güncelle**
4. **Test email'leri gönder**
5. **Production'da aktif et**

**Template'ler hazır! SendGrid'de oluşturmaya başlayabilirsiniz! 🎯**