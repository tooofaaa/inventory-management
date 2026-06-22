export type Language = "en" | "ar";

export const translations = {
  en: {
    // Brand
    brandName: "Product & Service",
    brandTagline: "Inventory Management System",

    // Auth
    login: {
      title: "Log in to your account",
      subtitle: "Welcome back! Please enter your details.",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember for 30 days",
      forgotPassword: "Forgot Password",
      signIn: "Sign In",
      signingIn: "Signing In...",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
    },
    signup: {
      title: "Create an account",
      subtitle: "Start your 30-day free trial.",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      passwordHint: "*Must be at least 8 characters.",
      signUp: "Sign Up",
      signingUp: "Signing Up...",
      alreadyAccount: "Already have an account?",
      logIn: "Log In",
    },
    forgotPassword: {
      title: "Forgot Password",
      subtitle: "Enter your email to reset your password.",
      email: "Email",
      emailPlaceholder: "Enter your email",
      sendReset: "Send Reset Link",
      sending: "Sending...",
      backToLogin: "Back to Login",
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      sales: "Sales",
      inventory: "Inventory",
      orders: "Orders",
      customers: "Customers",
      suppliers: "Suppliers",
      reports: "Reports",
      settings: "Settings",
      logOut: "Log Out",
    },

    // Topbar
    topbar: {
      search: "Search...",
      notifications: "Notifications",
      lowStock: "Low Stock",
      noNotifications: "No notifications yet.",
      stockHealthy: "Your stock is healthy!",
      viewAllInventory: "View All Inventory",
      accountSettings: "Account Settings",
      logOut: "Log Out",
      pendingSuppliers: "Pending Suppliers",
      supplierNeedsApproval: "Supplier needs approval",
      viewAllSuppliers: "View Pending Suppliers",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back",
      totalRevenue: "Total Revenue",
      totalOrders: "Total Orders",
      totalProducts: "Total Products",
      lowStockItems: "Low Stock Items",
    },

    // Common
    common: {
      loading: "Loading...",
      redirecting: "Redirecting...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
      status: "Status",
      actions: "Actions",
      noData: "No data found.",
      developedBy: "Developed by",
    },
  },

  ar: {
    // Brand
    brandName: "المنتج والخدمة",
    brandTagline: "نظام إدارة المخزون",

    // Auth
    login: {
      title: "تسجيل الدخول إلى حسابك",
      subtitle: "مرحبًا بعودتك! الرجاء إدخال بياناتك.",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      rememberMe: "تذكرني لمدة 30 يومًا",
      forgotPassword: "نسيت كلمة المرور",
      signIn: "تسجيل الدخول",
      signingIn: "جارٍ تسجيل الدخول...",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
    },
    signup: {
      title: "إنشاء حساب جديد",
      subtitle: "ابدأ تجربتك المجانية لمدة 30 يومًا.",
      name: "الاسم",
      namePlaceholder: "أدخل اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      passwordHint: "*يجب أن تكون 8 أحرف على الأقل.",
      signUp: "إنشاء حساب",
      signingUp: "جارٍ الإنشاء...",
      alreadyAccount: "لديك حساب بالفعل؟",
      logIn: "تسجيل الدخول",
    },
    forgotPassword: {
      title: "نسيت كلمة المرور",
      subtitle: "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      sendReset: "إرسال رابط الإعادة",
      sending: "جارٍ الإرسال...",
      backToLogin: "العودة لتسجيل الدخول",
    },

    // Navigation
    nav: {
      dashboard: "لوحة التحكم",
      sales: "المبيعات",
      inventory: "المخزون",
      orders: "الطلبات",
      customers: "العملاء",
      suppliers: "الموردون",
      reports: "التقارير",
      settings: "الإعدادات",
      logOut: "تسجيل الخروج",
    },

    // Topbar
    topbar: {
      search: "بحث...",
      notifications: "الإشعارات",
      lowStock: "مخزون منخفض",
      noNotifications: "لا توجد إشعارات بعد.",
      stockHealthy: "مخزونك في حالة جيدة!",
      viewAllInventory: "عرض كل المخزون",
      accountSettings: "إعدادات الحساب",
      logOut: "تسجيل الخروج",
      pendingSuppliers: "موردون معلقون",
      supplierNeedsApproval: "المورد يحتاج إلى موافقة",
      viewAllSuppliers: "عرض الموردين المعلقين",
    },

    // Dashboard
    dashboard: {
      title: "لوحة التحكم",
      welcome: "مرحبًا بعودتك",
      totalRevenue: "إجمالي الإيرادات",
      totalOrders: "إجمالي الطلبات",
      totalProducts: "إجمالي المنتجات",
      lowStockItems: "عناصر المخزون المنخفض",
    },

    // Common
    common: {
      loading: "جارٍ التحميل...",
      redirecting: "جارٍ إعادة التوجيه...",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      add: "إضافة",
      search: "بحث",
      filter: "تصفية",
      export: "تصدير",
      import: "استيراد",
      status: "الحالة",
      actions: "الإجراءات",
      noData: "لا توجد بيانات.",
      developedBy: "طُوِّر بواسطة",
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
