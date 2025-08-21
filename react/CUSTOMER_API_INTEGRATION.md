# Customer API Endpoints Integration

Bu sənəd React tətbiqində inteqrasiya edilmiş bütün Customer API endpoint-lərini göstərir.

## ✅ Tamamlanmış Endpoint-lər

### 1. **POST /customers/add**
- **Hook:** `useCreateCustomerMutation`
- **Funksionallıq:** Yeni müştəri əlavə etmək
- **İstifadə:** Form submit zamanı avtomatik çağırılır
- **Status:** ✅ Tamamlanıb

### 2. **PATCH /customers/update/{id}**
- **Hook:** `useUpdateCustomerMutation`
- **Funksionallıq:** Mövcud müştəri məlumatlarını yeniləmək
- **İstifadə:** Edit form submit zamanı avtomatik çağırılır
- **Status:** ✅ Tamamlanıb

### 3. **GET /customers/{id}**
- **Hook:** `useGetCustomerByIdQuery`
- **Funksionallıq:** ID-yə görə tək müştəri məlumatını əldə etmək
- **İstifadə:** 
  - ID ilə axtarış
  - Müştəri detallarını göstərmək
- **Status:** ✅ Tamamlanıb

### 4. **GET /customers/search-by-phone**
- **Hook:** `useSearchCustomerByPhoneQuery`
- **Funksionallıq:** Telefon nömrəsinə görə müştəri axtarmaq
- **İstifadə:** Avtomatik telefon axtarışı
- **Status:** ✅ Tamamlanıb

### 5. **GET /customers/search-by-name-surname**
- **Hook:** `useSearchCustomerByNameSurnameQuery`
- **Funksionallıq:** Ad və soyada görə müştəri axtarmaq
- **İstifadə:** Avtomatik ad/soyad axtarışı
- **Status:** ✅ Tamamlanıb

### 6. **GET /customers/export**
- **Hook:** `useExportCustomersQuery`
- **Funksionallıq:** Müştəri siyahısını Excel formatında export etmək
- **İstifadə:** Export düyməsi ilə
- **Status:** ✅ Tamamlanıb

### 7. **GET /customers/count**
- **Hook:** `useGetCustomerCountQuery`
- **Funksionallıq:** Ümumi müştəri sayını əldə etmək
- **İstifadə:** Header-də statistika göstərmək
- **Status:** ✅ Tamamlanıb

### 8. **GET /customers/all**
- **Hook:** `useGetCustomersQuery`
- **Funksionallıq:** Bütün müştərilərin siyahısını əldə etmək
- **İstifadə:** Ana cədvəli doldurmaq
- **Status:** ✅ Tamamlanıb

### 9. **DELETE /customers/delete/{id}**
- **Hook:** `useDeleteCustomerMutation`
- **Funksionallıq:** Müştərini silmək
- **İstifadə:** Hər sətirdəki sil düyməsi ilə
- **Status:** ✅ Tamamlanıb

## 🔧 Texniki Detallar

### API Base URL
```
http://62.171.154.6:9090
```

### RTK Query Konfiqurasiyası
- **Tag Types:** `['Customer']`
- **Cache Invalidation:** Avtomatik
- **Error Handling:** Daxili error handling
- **Loading States:** Avtomatik loading state-lər

### Komponent İnteqrasiyası
- **CustomerData.jsx:** Əsas komponent
- **apiSlice.js:** API endpoint-lər
- **AuthContext:** Autentifikasiya
- **Redux Store:** State management

## 📱 İstifadəçi İnterfeysi

### Axtarış Funksionallığı
1. **Ümumi Axtarış:** Ad, soyad, ünvan, telefon, qiymət
2. **Telefon Axtarışı:** Avtomatik telefon formatı tanıma
3. **Ad/Soyad Axtarışı:** Avtomatik ad və soyad ayrımı
4. **ID Axtarışı:** Birbaşa ID ilə axtarış

### CRUD Əməliyyatları
1. **Create:** Yeni müştəri əlavə etmək
2. **Read:** Müştəri siyahısı və detalları
3. **Update:** Müştəri məlumatlarını yeniləmək
4. **Delete:** Müştərini silmək

### Əlavə Funksionallıqlar
- **Export:** Excel formatında export
- **Statistics:** Müştəri sayı
- **Modal:** Müştəri detalları
- **Responsive:** Mobil uyğun dizayn

## 🚀 İstifadə Təlimatı

### 1. Müştəri Əlavə Etmək
- "Yeni Müştəri Əlavə Et" düyməsinə basın
- Formu doldurun
- "Müştəri Əlavə Et" düyməsinə basın

### 2. Müştəri Axtarmaq
- Axtarış sahəsinə məlumat daxil edin
- Avtomatik axtarış tipi seçiləcək
- ID ilə axtarış üçün ayrı sahə istifadə edin

### 3. Müştəri Redaktə Etmək
- Hər sətirdə "Redaktə" düyməsinə basın
- Formu yeniləyin
- "Müştərini Yenilə" düyməsinə basın

### 4. Müştəri Silmək
- Hər sətirdə "Sil" düyməsinə basın
- Təsdiq mesajını təsdiqləyin

### 5. Export Etmək
- "Excel Export" düyməsinə basın
- Fayl avtomatik yüklənəcək

## 🔍 Debug və Test

### Console Log-lar
- Bütün API çağırışları console-da izlənir
- Error-lar detallı şəkildə göstərilir

### Network Tab
- Browser Network tab-ında API çağırışları izlənə bilər
- Response və request detalları görünür

### Error Handling
- API error-ları istifadəçiyə göstərilir
- Retry funksionallığı mövcuddur

## 📋 Gələcək Təkmilləşdirmələr

### Planlaşdırılan
- [ ] Pagination (səhifələmə)
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Customer history
- [ ] Customer analytics

### Təklif Edilən
- [ ] Real-time updates
- [ ] Offline support
- [ ] Data validation
- [ ] Performance optimization

## 📞 Dəstək

Əgər hər hansı problem yaranırsa və ya sualınız varsa:

1. Console error-larını yoxlayın
2. Network tab-da API response-ları izləyin
3. Browser developer tools istifadə edin
4. API endpoint-lərin backend-də mövcud olduğunu təsdiqləyin

---

**Status:** ✅ Bütün 9 Customer API endpoint-i uğurla inteqrasiya edilib və işləyir.
**Son Yeniləmə:** 2024
**Versiya:** 1.0.0
