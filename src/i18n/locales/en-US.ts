export const enUS = {
  common: {
    ok: "OK",
    email: "Email",
    password: "Password",
    update: "Update",
    sync: "Sync",
    scanner: "Scanner",
    package: "Package",
    packages: "Packages",
    status: "Status",
    delivery: "Delivery",
  },

  navigation: {
    home: "Home",
    scanner: "Scanner",
    packages: "Package List",
    packageDetails: "Package Details",
  },

  auth: {
    login: {
      title: "Welcome back.",
      description:
        "Sign in to continue managing your deliveries.",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      submit: "Sign in",
      signup: "Create account",
      noAccount: "Don't have an account yet?",
    },

    signup: {
      title: "Create your account.",
      description:
        "Start organizing and tracking your deliveries in one place.",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Create a password",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder:
        "Enter your password again",
      submit: "Create account",
      alreadyHaveAccount: "Already have an account?",
      login: "Sign in",
      backToLogin: "Back",
      success: "Account created successfully.",
    },

    validation: {
      requiredFields: "Please fill in all fields.",
      invalidEmail: "Enter a valid email address.",
      invalidPassword:
        "Password must be at least 6 characters long.",
      passwordsDoNotMatch: "Passwords do not match.",
    },

    errors: {
      invalidCredentials: "Incorrect email or password.",
      userNotFound: "User not found.",
      invalidEmail: "Invalid email address.",
      userDisabled: "Account disabled.",
      emailAlreadyInUse: "This email is already in use.",
      operationNotAllowed:
        "Account creation is currently disabled.",
      weakPassword:
        "Password is too weak. Use at least 6 characters.",
      unknown: "An unexpected error occurred.",
    },
  },

  home: {
    greeting: "Hello,",
    headline: "Manage your deliveries with ease.",
    description:
      "Scan packages, track their status, and keep your deliveries organized.",
    scanner: {
      title: "Scan package",
      description:
        "Scan a QR Code or barcode to add a package.",
      action: "Get started",
    },
    overview: "Overview",
    stats: {
      packages: "Packages",
      pending: "Pending",
    },
    quickActions: "Actions",
    packageList: {
      title: "All packages",
      description: "View, track, and manage your packages.",
      action: "View packages",
    },
  },

  packages: {
    code: "Code",
    packageStatus: "Package status",
    deliveryStatusLabel: "Delivery status",
    scannedAt: "Scanned",

    details: {
      title: "Package details",
      description: "Package information and tracking.",
      currentStatus: "Current status",
      synchronization: "Synchronization",
      information: "Information",
      code: "Code",
      scannedAt: "Scanned at",
      receiver: "Receiver",
      notAvailable: "Not provided",
      actions: "Actions",
      changeStatus: "Change status",
    },

    list: {
      title: "Packages",
      headline: "Manage your packages",
      description:
        "Search, filter, and track all your packages in one place.",
      searchPlaceholder: "Search by package code...",
      filterByStatus: "Filter by status",
      clearFilters: "Clear",
      all: "All",
      results: "Packages",
      packageCount_one: "{{count}} package",
      packageCount_other: "{{count}} packages",
      empty: "No packages found",
      emptyTitle: "No packages yet",
      emptyDescription:
        "Scan your first package to start tracking deliveries.",
      noResultsTitle: "No matching packages",
      noResultsDescription:
        "Try changing the search or status filter.",
    },

    actions: {
      viewDetails: "View details",
      changeStatus: "Change status",
      updateAll: "Update all",
      syncPackages: "Sync packages",
      viewAll: "View all packages",
      updateAndSync: "Update and sync",
    },

    status: {
      collected: "Collected",
      outForDelivery: "Out for delivery",
      delivered: "Delivered",
    },

    deliveryStatus: {
      pending: "Pending",
      sent: "Sent",
    },

    updateStatus: {
      title: "Change status",
      selectStatus: "Select the new package status:",
      receiverName: "Receiver name:",
      receiverPlaceholder: "E.g. John Smith",
      receiverRequired: "Enter the receiver's name.",
    },

    updateAll: {
      title: "Change status for all packages",
      packagesInSession:
        "Packages scanned in this session: {{count}}",
      selectStatus: "Select the new status:",
      emptySession: "No packages scanned in this session.",
      success:
        "Status updated and packages sent to the webhook!",
      error: "Failed to update packages.",
    },

    feedback: {
      scannedSuccessfully:
        "Package {{code}} scanned successfully!",
      alreadyScanned: "Package already scanned.",
      scanError: "Failed to scan package.",
      allSentSuccessfully:
        "All packages sent successfully!",
      sendSomeFailed: "Failed to send some packages.",
    },

    errors: {
      receiverRequired:
        "Receiver name is required for delivered packages.",
      invalidForSync:
        "Package is invalid for synchronization.",
      syncFailed: "Failed to synchronize package {{code}}.",
      multipleSyncFailed:
        "{{count}} package(s) failed to send.",
      updateStatusFailed: "Failed to update status.",
      unknown: "An unexpected error occurred.",
    },
  },

  scanner: {
    title: "Scan package",
    requestingPermission: "Checking camera permission...",
    preparingCamera: "Preparing camera",
    permissionTitle: "Camera access required",
    permissionRequired:
      "Allow camera access to scan package QR codes and barcodes.",
    grantPermission: "Allow camera access",
    instructionTitle: "Point at the code",
    instructionDescription:
      "Position the QR code or barcode inside the highlighted area.",
    sessionTitle: "Current session",
    sessionCount_one: "{{count}} package scanned",
    sessionCount_other: "{{count}} packages scanned",
    empty: "No packages scanned yet",
    emptyTitle: "No packages scanned",
    emptyDescription:
      "Packages added during this session will appear here.",
  },

  accessibility: {
    input: {
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    header: {
      back: "Go back",
      logout: "Log out",
    },
    modal: {
      close: "Close modal",
    },
  },
} as const;
