# 📦 دليل بناء تطبيق Seoul Steps (APK + IPA)

> هذا الدليل يبدأ من **الصفر** ويصل بك إلى ملف **APK مُوقّع** جاهز للتثبيت
> أو ملف **IPA** جاهز للرفع على App Store. مكتوب خطوة بخطوة بدون اختصار.

---

## 0) تجهيز الجهاز (مرة واحدة فقط)

| الأداة | الإصدار المطلوب | للتنزيل |
|---|---|---|
| **Node.js** | ≥ 20.x | https://nodejs.org |
| **Android Studio** | **Ladybug 2024.2.1** أو أحدث | https://developer.android.com/studio |
| **JDK** | 17 (مدمج داخل Android Studio) | تلقائي |
| **Xcode** *(لـ iPA فقط)* | ≥ 15 على macOS | App Store |

> ✅ بعد تثبيت Android Studio افتحه مرة واحدة ووافق على تنزيل الـ SDK + Build Tools.

---

## 1) سحب المشروع من GitHub

```bash
git clone <رابط-المستودع-بتاعك>.git seoul-steps
cd seoul-steps
npm install
```

---

## 2) ⚠️ حلّ مشكلة "AGP 8.13.0 incompatible"

> هذه هي المشكلة التي ظهرت لك في آخر خطوة.
> Capacitor قد يولّد إصدار AGP أحدث من اللي يدعمه Android Studio عندك.
> الحل بسيط جداً: **نُثبّت إصدار متوافق** قبل أي شيء.

### 2.1 أضف منصة Android

```bash
npx cap add android
npx cap sync android
```

### 2.2 افتح الملف التالي:
```
android/variables.gradle
```

### 2.3 استبدل محتواه بالكامل بهذا (ملف جاهز ومتوافق 100%):

```gradle
ext {
    minSdkVersion = 23
    compileSdkVersion = 35
    targetSdkVersion = 35
    androidxActivityVersion = '1.9.2'
    androidxAppCompatVersion = '1.7.0'
    androidxCoordinatorLayoutVersion = '1.2.0'
    androidxCoreVersion = '1.13.1'
    androidxFragmentVersion = '1.8.4'
    coreSplashScreenVersion = '1.0.1'
    androidxWebkitVersion = '1.12.1'
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.2.1'
    androidxEspressoCoreVersion = '3.6.1'
    cordovaAndroidVersion = '10.1.1'
}
```

### 2.4 افتح الملف:
```
android/build.gradle
```
وتأكد أن السطر التالي **بالضبط** هكذا (إذا كان `8.13.0` غيّره إلى `8.7.2`):

```gradle
classpath 'com.android.tools.build:gradle:8.7.2'
```

### 2.5 افتح الملف:
```
android/gradle/wrapper/gradle-wrapper.properties
```
وتأكد أن السطر:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.11.1-all.zip
```

### 2.6 من جديد:
```bash
npx cap sync android
```

✅ الآن المشروع متوافق تماماً مع Android Studio Ladybug.

---

## 3) بناء الـ APK

### 3.1 ابنِ الواجهة (Web build)
```bash
npm run build
npx cap sync android
```

### 3.2 افتح Android Studio
```bash
npx cap open android
```

انتظر حتى يكتمل **Gradle Sync** (شريط أسفل الشاشة).

### 3.3 بناء APK غير موقّع (للتجربة السريعة)
من القائمة:
```
Build  →  Build Bundle(s) / APK(s)  →  Build APK(s)
```
الناتج:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3.4 بناء **APK موقّع** (للتثبيت الفعلي والتوزيع)

1. من القائمة: **Build → Generate Signed Bundle / APK…**
2. اختر **APK** ثم **Next**
3. اضغط **Create new…** لإنشاء مفتاح توقيع جديد:
   - **Key store path:** اختر مكان (مثلاً `~/seoul-steps.keystore`)
   - **Password / Confirm:** ضع كلمة سر قوية (احفظها!)
   - **Alias:** `seoul-steps`
   - **Validity (years):** `25`
   - املأ بياناتك (اسم، شركة، إلخ)
4. **Next → Build Variant: release → V1 + V2 Signature → Finish**
5. الناتج النهائي:
```
android/app/release/app-release.apk
```

🎉 هذا هو الملف الذي تنقله لهاتفك أو ترفعه على Google Play.

---

## 4) 🔌 وضع Offline الكامل (مفعّل تلقائياً)

في `capacitor.config.ts` تم **تعطيل** خاصية `server.url`، فالتطبيق:

- يحمّل HTML/CSS/JS من داخل الـ APK مباشرة
- يعمل بدون إنترنت تماماً (الواجهة، الترحيب، الفيديوهات، الصور)
- المكالمات إلى Supabase (تسجيل الدخول، حفظ التقدم) تحتاج إنترنت — هذه طبيعة أي تطبيق سحابي.

> ⚠️ لو فعّلت `server.url` للاختبار، **لا تنسَ تعليقه** قبل بناء الـ APK النهائي.

---

## 5) 🍎 بناء IPA لنظام iOS (يتطلب Mac + Xcode)

### 5.1 أضف منصة iOS
```bash
npx cap add ios
npx cap sync ios
```

### 5.2 افتح المشروع في Xcode
```bash
npx cap open ios
```

### 5.3 إعداد التوقيع
- اختر مشروع **App** من الشريط الأيسر
- تبويب **Signing & Capabilities**
- فعّل **Automatically manage signing**
- اختر **Team** (يحتاج Apple Developer Account — 99$/سنة)
- ضع **Bundle Identifier:** `app.lovable.ee47839bdf784c1196781b934ad0f99b`

### 5.4 بناء IPA
1. من شريط الأجهزة اختر **Any iOS Device (arm64)**
2. **Product → Archive** (يستغرق دقائق)
3. عند انتهاء الأرشفة تفتح نافذة **Organizer**
4. اضغط **Distribute App**:
   - **App Store Connect** → للنشر على المتجر
   - **Ad Hoc** → لتثبيت محلي على أجهزة محددة
   - **Development** → لاختبار داخلي
5. اتبع الخطوات → ستحصل على ملف **.ipa**

---

## 6) تحديث التطبيق بعد أي تعديل في Lovable

```bash
git pull
npm install         # في حال تغيّرت الحزم
npm run build
npx cap sync        # ينسخ الواجهة الجديدة لـ android/ios
```
ثم أعد بناء APK / IPA كما في الخطوات السابقة.

---

## 7) قائمة فحص نهائية ✅

- [ ] `capacitor.config.ts` فيه `server` معلّق (offline mode)
- [ ] `android/variables.gradle` يحتوي compileSdk 35
- [ ] `android/build.gradle` يستخدم AGP 8.7.2
- [ ] Gradle Wrapper 8.11.1
- [ ] `npm run build` نجح بدون أخطاء
- [ ] `npx cap sync` نجح
- [ ] Gradle Sync داخل Android Studio أخضر
- [ ] الـ APK يفتح على الهاتف ويعرض شاشة Splash الوردية ثم شاشات الترحيب

---

## 🛟 إذا واجهتك أي مشكلة

| المشكلة | الحل |
|---|---|
| `AGP X.X incompatible` | أعد الخطوة 2 وثبّت AGP 8.7.2 |
| `SDK location not found` | افتح Android Studio مرة، اقبل تنزيل SDK |
| الشاشة بيضاء | تأكد أن `npm run build` نجح وأن `webDir: 'dist'` |
| لا يتصل بالإنترنت داخل APK | تأكد من إضافة صلاحية `INTERNET` في `AndroidManifest.xml` (موجودة افتراضياً) |
| iOS يرفض البناء | تأكد من Apple Developer Team ومن Bundle ID |

