# 📱 بناء تطبيق Android APK لـ Seoul Steps

## ✅ ما تم إعداده تلقائياً
- ✅ `@capacitor/core` و `@capacitor/cli`
- ✅ `@capacitor/android` و `@capacitor/ios`
- ✅ `@capacitor/splash-screen` و `@capacitor/status-bar` و `@capacitor/app`
- ✅ ملف الإعدادات `capacitor.config.ts` (App ID + Splash + StatusBar)
- ✅ Hot-reload من Lovable مفعّل أثناء التطوير

---

## 🚀 الخطوات بعد تنزيل المشروع على جهازك

### 1) انقل المشروع لـ GitHub ثم Clone محلياً
زرّ **Export to GitHub** أعلى يمين Lovable → ثم:
```bash
git clone <your-repo-url>
cd seoul-steps
npm install        # أو bun install
```

### 2) أضف منصة Android
```bash
npx cap add android
npx cap update android
```

### 3) ابنِ المشروع وزامنه
```bash
npm run build
npx cap sync
```

### 4) افتح في Android Studio
```bash
npx cap open android
```

داخل Android Studio:
- انتظر حتى ينتهي **Gradle Sync** (3-5 دقائق أول مرة).
- من القائمة: **Build → Generate Signed Bundle / APK → APK**
- أنشئ مفتاح توقيع جديد (keystore) → احفظ كلمة المرور.
- اختر **release** → **Finish**.
- ستجد ملف الـ APK في: `android/app/build/outputs/apk/release/`

---

## 🌐 لإصدار **Offline APK** نهائي (بدون الاعتماد على Lovable):

افتح `capacitor.config.ts` وعلّق على/احذف القسم `server`:
```ts
// server: { url: '...', cleartext: true },
```
ثم:
```bash
npm run build
npx cap sync android
```
وأعد بناء الـ APK كما في الخطوة 4. الآن التطبيق يعمل **offline 100%** من ملفات `dist/`.

---

## 🎨 تخصيص الأيقونة والـ Splash
1. ضع أيقونة 1024x1024 في `resources/icon.png`
2. ضع splash 2732x2732 في `resources/splash.png`
3. ثبّت أداة التوليد:
   ```bash
   npm install -g @capacitor/assets
   npx capacitor-assets generate
   ```
سيتم توليد جميع المقاسات لكل من Android و iOS تلقائياً.

---

## 📦 لإصدار Google Play (AAB)
في Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**
هذا الملف هو الذي يُرفع إلى Google Play Console.

---

## 📱 لـ iOS (يحتاج Mac + Xcode)
```bash
npx cap add ios
npx cap update ios
npm run build
npx cap sync ios
npx cap open ios
```
ثم من Xcode: **Product → Archive → Distribute App**

---

## ❓ مشاكل شائعة
- **خطأ Gradle**: حدّث Android Studio لأحدث إصدار، وحدّث `compileSdk` إلى 34.
- **شاشة بيضاء**: تأكد من تشغيل `npm run build` قبل `npx cap sync`.
- **الأيقونة لم تتحدث**: امسح الكاش `./gradlew clean` داخل مجلد `android/`.

---
المشروع جاهز 100% - فقط نفّذ الأوامر أعلاه على جهازك. 🚀
