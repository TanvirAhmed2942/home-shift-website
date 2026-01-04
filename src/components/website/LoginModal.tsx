import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";
import { Logo } from "./Logo";
import { Checkbox } from "../ui/checkbox";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "customer" | "driver" | "admin";
  onAdminLogin?: (email: string, password: string) => boolean;
  onDriverLogin?: (email: string, password: string) => boolean;
  onCustomerLogin?: (email: string, password: string) => boolean;
}

export function LoginModal({
  isOpen,
  onClose,
  initialTab = "customer",
  onAdminLogin,
  onDriverLogin,
  onCustomerLogin,
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "driver" | "admin">(
    initialTab
  );
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // Helper function to reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setAddress("");
    setVehicleType("");
    setShowPassword(false);
  };

  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("🔄 Modal opened with initialTab:", initialTab);
      setActiveTab(initialTab);
      setMode("login"); // Always start with login mode
      resetForm();
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 LOGIN DEBUG:", {
      activeTab,
      mode,
      email,
      password,
      onAdminLogin: !!onAdminLogin,
    });

    // Handle Admin Login
    if (onAdminLogin && activeTab === "admin" && mode === "login") {
      console.log("✅ Attempting admin login...");
      const loginSuccess = onAdminLogin(email, password);
      console.log("Admin login result:", loginSuccess);
      if (loginSuccess) {
        onClose();
        return;
      } else {
        alert(
          "Invalid admin credentials. Please try: admin@shiftmyhome.com / admin123"
        );
        return;
      }
    }

    // Handle Customer Login
    if (onCustomerLogin && activeTab === "customer" && mode === "login") {
      const loginSuccess = onCustomerLogin(email, password);
      if (loginSuccess) {
        onClose();
        return;
      } else {
        alert("Invalid customer credentials. Please try again.");
        return;
      }
    }

    // Handle Driver Login
    if (onDriverLogin && activeTab === "driver" && mode === "login") {
      const loginSuccess = onDriverLogin(email, password);
      if (loginSuccess) {
        onClose();
        return;
      } else {
        alert("Invalid driver credentials. Please try again.");
        return;
      }
    }

    // Default behavior for register mode
    if (mode === "register") {
      alert(
        `Successfully registered as ${activeTab}!\nEmail: ${email}\nYou can now log in.`
      );
      setMode("login");
      setPassword("");
      return;
    }

    // If nothing matched
    alert("Invalid credentials. Please check your email and password.");
  };

  const switchTab = (tab: "customer" | "driver" | "admin") => {
    setActiveTab(tab);
    resetForm();
    setMode("login");
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden relative">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-white/5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex items-start justify-between mb-6">
            <Logo
              variant="white"
              size="md"
              className="h-12 w-auto object-contain"
            />

            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="relative z-10 flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
            <button
              onClick={() => switchTab("customer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                activeTab === "customer"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="font-medium">Customer</span>
            </button>
            <button
              onClick={() => switchTab("driver")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                activeTab === "driver"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span className="font-medium">Driver</span>
            </button>
            <button
              onClick={() => switchTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                activeTab === "admin"
                  ? "bg-white text-red-600 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">Admin</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] p-6">
          {/* Login/Register Toggle - Hide for Admin */}
          {activeTab !== "admin" && (
            <div className="flex gap-4 mb-6 justify-center">
              <button
                onClick={() => switchMode("login")}
                className={`text-sm font-medium pb-2 transition-all ${
                  mode === "login"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`text-sm font-medium pb-2 transition-all ${
                  mode === "register"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Admin-only header */}
          {activeTab === "admin" && (
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">Admin Portal</h3>
              <p className="text-sm text-gray-600 mt-1">
                Restricted access for administrators only
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+44 7000 000000"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "register" && activeTab === "customer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="123 Main St, London"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "register" && activeTab === "driver" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    <option value="small-van">Small Van</option>
                    <option value="large-van">Large Van (Luton)</option>
                    <option value="truck">Truck</option>
                    <option value="motorbike">Motorbike</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#forgot" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-medium transition-all hover:scale-105 shadow-lg ${
                activeTab === "customer"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/30"
                  : activeTab === "driver"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-purple-500/30"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30"
              }`}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Driver Extra Info */}
          {activeTab === "driver" && mode === "register" && (
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium mb-1">
                    Driver Requirements
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Valid UK driving licence</li>
                    <li>✓ Vehicle insurance & MOT</li>
                    <li>✓ Background check required</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          {mode === "login" && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="text-xs font-semibold text-blue-900 mb-2">
                🔑 Demo Credentials:
              </div>
              {activeTab === "customer" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-800">
                    <div>
                      <strong>Customer:</strong> customer@shiftmyhome.com /
                      customer123
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("customer@shiftmyhome.com");
                        setPassword("customer123");
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                    >
                      Fill
                    </button>
                  </div>
                </div>
              ) : activeTab === "driver" ? (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-purple-800">
                    <strong>Driver:</strong> driver@shiftmyhome.com / driver123
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("driver@shiftmyhome.com");
                      setPassword("driver123");
                    }}
                    className="px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
                  >
                    Fill
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-red-800">
                    <strong>Admin:</strong> admin@shiftmyhome.com / admin123
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@shiftmyhome.com");
                      setPassword("admin123");
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                  >
                    Fill
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
