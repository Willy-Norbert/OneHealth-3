"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, User, Home, Phone, Shield, Heart, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { MedicalTexture } from "@/components/ui/MedicalTexture";
// Using window.alert instead of an external toast lib to avoid extra deps

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  nationalId: string;
  address: string;
  district: string;
  province: string;
  ubudehe: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  insuranceType: string;
  insurerName: string;
  policyNumber: string;
  policyHolderName: string;
  policyExpiry: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  pastMedicalHistory: string;
  chronicConditions: string;
  currentSymptoms: string;
}

interface FileUploads {
  profileImage?: File;
  idDocument?: File;
  insuranceFront?: File;
  insuranceBack?: File;
  medicalFiles: File[];
}

const steps = [
  { id: 1, name: "Personal Info", Icon: User },
  { id: 2, name: "Identity & Address", Icon: Home },
  { id: 3, name: "Emergency Contact", Icon: Phone },
  { id: 4, name: "Insurance Details", Icon: Shield },
  { id: 5, name: "Medical History", Icon: Heart },
  { id: 6, name: "Documents", Icon: FileText },
  { id: 7, name: "Review", Icon: CheckCircle },
];

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusKind, setStatusKind] = useState<'success' | 'error'>('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "Male",
    nationalId: "",
    address: "",
    district: "",
    province: "",
    ubudehe: "1",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    insuranceType: "None",
    insurerName: "",
    policyNumber: "",
    policyHolderName: "",
    policyExpiry: "",
    bloodGroup: "A-",
    allergies: "",
    medications: "",
    pastMedicalHistory: "",
    chronicConditions: "",
    currentSymptoms: "",
  });

  const [files, setFiles] = useState<FileUploads>({
    profileImage: undefined,
    idDocument: undefined,
    insuranceFront: undefined,
    insuranceBack: undefined,
    medicalFiles: [],
  });

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (!/^\+[1-9]\d{6,14}$/.test(formData.phone)) {
          setError("Phone must be in E.164 format (e.g., +2507XXXXXXXX)");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        break;
      case 2:
        if (!formData.dob || !formData.nationalId || !formData.address || !formData.district || !formData.province) {
          setError("Please fill in all required fields");
          return false;
        }
        if (new Date(formData.dob) >= new Date()) {
          setError("Date of birth must be in the past");
          return false;
        }
        break;
      case 3:
        if (!formData.emergencyContactName || !formData.emergencyContactRelation || !formData.emergencyContactPhone) {
          setError("Please fill in all emergency contact fields");
          return false;
        }
        if (!/^\+[1-9]\d{6,14}$/.test(formData.emergencyContactPhone)) {
          setError("Emergency contact phone must be in E.164 format (e.g., +2507XXXXXXXX)");
          return false;
        }
        break;
      case 4:
        if (formData.insuranceType !== "None") {
          if (!formData.insurerName || !formData.policyNumber || !formData.policyHolderName || !formData.policyExpiry) {
            setError("Please fill in all insurance fields");
            return false;
          }
        }
        break;
      case 5:
        if (!formData.allergies || !formData.medications || !formData.pastMedicalHistory || !formData.chronicConditions || !formData.currentSymptoms) {
          setError("Please fill in all medical history fields (enter 'None' if not applicable)");
          return false;
        }
        break;
      case 6:
        if (!files.profileImage) {
          setError("Profile image is required");
          return false;
        }
        if (!files.idDocument) {
          setError("National ID scan is required");
          return false;
        }
        if (formData.insuranceType !== "None" && !files.insuranceFront) {
          setError("Insurance card front is required");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleStepClick = (stepId: number) => {
    // Only allow navigation to completed steps or the next step
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 [REGISTER] Starting registration process...');
    setLoading(true);
    setError(null);

    try {
      // Prepare form data for submission
      const submitData = new FormData();
      console.log('📝 [REGISTER] Preparing FormData from formData state:', formData);
      
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value ?? ""));
      });
      console.log('✅ [REGISTER] Form fields added to FormData');

      // Log file information
      console.log('📎 [REGISTER] Files to upload:');
      console.log('   - profileImage:', files.profileImage ? `${files.profileImage.name} (${files.profileImage.size} bytes)` : 'none');
      console.log('   - idDocument:', files.idDocument ? `${files.idDocument.name} (${files.idDocument.size} bytes)` : 'none');
      console.log('   - insuranceFront:', files.insuranceFront ? `${files.insuranceFront.name} (${files.insuranceFront.size} bytes)` : 'none');
      console.log('   - insuranceBack:', files.insuranceBack ? `${files.insuranceBack.name} (${files.insuranceBack.size} bytes)` : 'none');
      console.log('   - medicalFiles:', files.medicalFiles?.length || 0, 'files');

      if (files.profileImage) submitData.append("profileImage", files.profileImage);
      if (files.idDocument) submitData.append("idDocument", files.idDocument);
      if (files.insuranceFront) submitData.append("insuranceFront", files.insuranceFront);
      if (files.insuranceBack) submitData.append("insuranceBack", files.insuranceBack);
      files.medicalFiles.forEach((f) => submitData.append("medicalFiles", f));

      // Log FormData entries
      console.log('📦 [REGISTER] FormData entries:');
      for (const [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`   ${key}: ${value}`);
        }
      }

      // Real API call
      console.log('📦 [REGISTER] Importing API module...');
      let result;
      
      try {
        // Try importing the API module
        const apiModule = await import('@/lib/api');
        console.log('📦 [REGISTER] API module imported:', apiModule);
        console.log('📦 [REGISTER] API module keys:', Object.keys(apiModule));
        
        // Check if api exists and has the expected structure
        if (!apiModule || !apiModule.api) {
          console.error('❌ [REGISTER] API module does not have api export');
          console.error('   Module:', apiModule);
          console.log('⚠️ [REGISTER] Falling back to direct fetch...');
          throw new Error('API module structure is invalid');
        }
        
        const api = apiModule.api;
        console.log('📦 [REGISTER] API object:', api);
        console.log('📦 [REGISTER] API.patients:', api.patients);
        console.log('📦 [REGISTER] API.patients.register:', api.patients?.register);
        
        if (!api.patients || typeof api.patients.register !== 'function') {
          console.error('❌ [REGISTER] api.patients.register is not a function');
          console.error('   api.patients:', api.patients);
          console.error('   api.patients type:', typeof api.patients);
          if (api.patients) {
            console.error('   api.patients keys:', Object.keys(api.patients));
          }
          console.log('⚠️ [REGISTER] Falling back to direct fetch...');
          throw new Error('api.patients.register is not a function');
        }
        
        console.log('🌐 [REGISTER] Calling API: api.patients.register()');
        console.log('🔗 [REGISTER] API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
        
        result = await api.patients.register(submitData);
        console.log('✅ [REGISTER] Registration successful! Result:', result);
      } catch (importError: any) {
        console.warn('⚠️ [REGISTER] API import/usage failed, using direct fetch as fallback');
        console.warn('   Error:', importError?.message);
        
        // Fallback: Direct fetch approach
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const url = `${API_BASE_URL}/patients/register`;
        
        console.log('🌐 [REGISTER] Using direct fetch to:', url);
        console.log('📦 [REGISTER] FormData entries count:', Array.from(submitData.entries()).length);
        
        const response = await fetch(url, {
          method: 'POST',
          body: submitData,
          cache: 'no-store',
        });
        
        console.log('📥 [REGISTER] Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [REGISTER] Direct fetch failed:', errorText);
          throw new Error(errorText || `Registration failed: ${response.status}`);
        }
        
        result = await response.json();
        console.log('✅ [REGISTER] Registration successful via direct fetch! Result:', result);
      }

      setStatusKind('success');
      setStatusTitle('Success');
      setStatusMessage('Registration successful! Your account is now active. Redirecting to dashboard...');
      setStatusOpen(true);
      setIsRedirecting(true);
      setTimeout(() => {
        setStatusOpen(false);
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('❌ [REGISTER] Registration failed!');
      console.error('   Error type:', err?.constructor?.name || 'Unknown');
      console.error('   Error message:', err?.message);
      console.error('   Error stack:', err?.stack);
      console.error('   Full error object:', err);
      
      const msg = err?.message || "Registration failed. Please try again.";
      setError(msg);
      setStatusKind('error');
      setStatusTitle('Failed');
      setStatusMessage(msg);
      setStatusOpen(true);
    } finally {
      setLoading(false);
      console.log('🏁 [REGISTER] Registration process completed');
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
      {/* Circular gradient backgrounds */}
      <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-300/20 via-blue-300/15 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] left-[-15%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-400/15 via-purple-300/10 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-purple-200/20 to-transparent blur-2xl" />
      <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-200/15 to-transparent blur-2xl" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12">
        {/* Status Modal */}
        {statusOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm bg-emerald-50/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden">
              <MedicalTexture pattern="healthcare" opacity={0.04} className="text-emerald-600" />
              <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${statusKind==='success' ? 'bg-primary' : 'bg-red-500'}`}>
                {statusKind==='success' ? (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-1">{statusTitle}</h3>
              <p className="text-sm text-gray-600 mb-5">{statusMessage}</p>
              {!isRedirecting && (
                <button
                  onClick={() => {
                    setStatusOpen(false);
                    if (statusKind==='success') router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`)
                  }}
                  className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        )}

        {isRedirecting && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="bg-emerald-50/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow relative overflow-hidden">
              <MedicalTexture pattern="medical-cross" opacity={0.03} className="text-emerald-600" />
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-sm text-gray-700">Redirecting to verification...</span>
              </div>
            </div>
          </div>
        )}
        <div className="w-full max-w-6xl bg-emerald-50/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden relative">
          <MedicalTexture pattern="hospital" opacity={0.04} className="text-emerald-600" />
          <div className="flex flex-col lg:flex-row">
            {/* Mobile: Steps at top */}
            <div className="lg:hidden bg-gradient-to-br from-gray-50/80 to-white p-4 border-b border-gray-100">
              {/* Logo/Brand */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/logo.png" alt="OneHealth Connect" className="w-6 h-6 rounded-lg object-contain" />
                  <h2 className="text-lg font-bold text-foreground">OneHealthline</h2>
                </div>
                <p className="text-xs text-muted-foreground">Complete the 7 steps to get started</p>
              </div>

              {/* Mobile Progress Steps */}
              <div className="flex overflow-x-auto gap-2 pb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex-shrink-0">
                    <div 
                      className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                        currentStep > step.id || completedSteps.includes(step.id)
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : currentStep === step.id
                          ? "bg-primary text-white shadow-lg shadow-primary/40 scale-105"
                          : "bg-gray-200 text-gray-400"
                      }`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full">
                        {currentStep > step.id || completedSteps.includes(step.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <step.Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">{step.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Left Sidebar - Steps */}
            <div className="hidden lg:block w-[320px] bg-gradient-to-br from-gray-50/80 to-white p-8 border-r border-gray-100">
              {/* Logo/Brand */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/logo.png" alt="OneHealth Connect" className="w-8 h-8 rounded-lg object-contain" />
                  <h2 className="text-xl font-bold text-foreground">OneHealthline</h2>
                </div>
                <p className="text-sm text-muted-foreground">Complete the 7 steps to get started</p>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-[19px] top-[40px] w-[2px] h-[52px] overflow-hidden">
                        <div 
                          className={`w-full transition-all duration-500 ${
                            currentStep > step.id ? 'h-full bg-primary' : 'h-0 bg-gray-200'
                          }`}
                          style={{
                            transitionDelay: currentStep > step.id ? `${index * 100}ms` : '0ms'
                          }}
                        />
                        <div className={`absolute top-0 w-full ${currentStep > step.id ? 'h-0' : 'h-full bg-gray-200'}`} />
                      </div>
                    )}

                    {/* Step Item */}
                    <div 
                      className="flex items-center gap-4 mb-6 relative z-10 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => handleStepClick(step.id)}
                    >
                      {/* Icon Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                          currentStep > step.id || completedSteps.includes(step.id)
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : currentStep === step.id
                            ? "bg-primary text-white shadow-lg shadow-primary/40 scale-110"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {currentStep > step.id || completedSteps.includes(step.id) ? (
                          <Check className="w-5 h-5 animate-in zoom-in duration-300" />
                        ) : (
                          <step.Icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="flex-1">
                        <p
                          className={`font-medium text-sm transition-colors ${
                            currentStep >= step.id || completedSteps.includes(step.id) ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="flex-1 p-4 sm:p-6 lg:p-10">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Welcome to OneHealthline</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Complete the 7 steps to get started</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-muted-foreground mb-1">Hi, Guest</p>
                  </div>
                </div>

                {/* Progress Bar with Percentage */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-end mb-2">
                    <span className="text-sm font-semibold text-primary">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-2 sm:h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>

                {/* Current Step Title */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-4 sm:mb-6">{steps[currentStep - 1].name}</h2>
              </div>

              {/* Form Content */}
              <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateForm("firstName", e.target.value)}
                          placeholder="Enter first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateForm("lastName", e.target.value)}
                          placeholder="Enter last name"
                          className="mt-1"
                        />
                      </div>
                    </div>
        
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateForm("email", e.target.value)}
                          placeholder="your.email@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateForm("phone", e.target.value)}
                          placeholder="+2507XXXXXXXX"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Include country code (E.164 format)</p>
                      </div>
                    </div>
          
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateForm("password", e.target.value)}
                          placeholder="Min. 8 characters"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateForm("confirmPassword", e.target.value)}
                          placeholder="Re-enter password"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) => updateForm("dob", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => updateForm("gender", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nationalId">National ID Number *</Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) => updateForm("nationalId", e.target.value)}
                        placeholder="Enter government ID number"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Enter the ID number shown on your ID card</p>
                    </div>

                    <div>
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="Street / Cell / Village"
                        className="mt-1"
                      />
                    </div>
          
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) => updateForm("district", e.target.value)}
                          placeholder="e.g., Gasabo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Input
                          id="province"
                          value={formData.province}
                          onChange={(e) => updateForm("province", e.target.value)}
                          placeholder="e.g., Kigali"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ubudehe">Ubudehe Category *</Label>
                        <Select value={formData.ubudehe} onValueChange={(value) => updateForm("ubudehe", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ubudehe 1</SelectItem>
                            <SelectItem value="2">Ubudehe 2</SelectItem>
                            <SelectItem value="3">Ubudehe 3</SelectItem>
                            <SelectItem value="4">Ubudehe 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => updateForm("emergencyContactName", e.target.value)}
                        placeholder="Full name"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                        <Input
                          id="emergencyContactRelation"
                          value={formData.emergencyContactRelation}
                          onChange={(e) => updateForm("emergencyContactRelation", e.target.value)}
                          placeholder="e.g., Mother, Father, Spouse"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                        <Input
                          id="emergencyContactPhone"
                          type="tel"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => updateForm("emergencyContactPhone", e.target.value)}
                          placeholder="+2507XXXXXXXX"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="insuranceType">Insurance Type *</Label>
                      <Select value={formData.insuranceType} onValueChange={(value) => updateForm("insuranceType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mutuelle de Santé (CBHI)">Mutuelle de Santé (CBHI)</SelectItem>
                          <SelectItem value="RSSB">RSSB</SelectItem>
                          <SelectItem value="Private">Private Insurance</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Select "None" if you don't have insurance</p>
          </div>

                    {formData.insuranceType !== "None" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="insurerName">Insurer Name *</Label>
                            <Input
                              id="insurerName"
                              value={formData.insurerName}
                              onChange={(e) => updateForm("insurerName", e.target.value)}
                              placeholder="Insurance company name"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="policyNumber">Policy Number *</Label>
                            <Input
                              id="policyNumber"
                              value={formData.policyNumber}
                              onChange={(e) => updateForm("policyNumber", e.target.value)}
                              placeholder="Policy or membership number"
                              className="mt-1"
                            />
                          </div>
          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="policyHolderName">Policy Holder Name *</Label>
                            <Input
                              id="policyHolderName"
                              value={formData.policyHolderName}
                              onChange={(e) => updateForm("policyHolderName", e.target.value)}
                              placeholder="Name on policy"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="policyExpiry">Policy Expiry Date *</Label>
                            <Input
                              id="policyExpiry"
                              type="date"
                              value={formData.policyExpiry}
                              onChange={(e) => updateForm("policyExpiry", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => updateForm("bloodGroup", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "A-"].map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Optional - helps with emergency care</p>
                </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="allergies">Known Allergies *</Label>
                      <Textarea
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => updateForm("allergies", e.target.value)}
                        placeholder="List any allergies (enter 'None' if none)"
                        className="mt-1"
                        rows={3}
                      />
          </div>

                    <div>
                      <Label htmlFor="medications">Current Medications *</Label>
                      <Textarea
                        id="medications"
                        value={formData.medications}
                        onChange={(e) => updateForm("medications", e.target.value)}
                        placeholder="List current medications (enter 'None' if none)"
                        className="mt-1"
                        rows={3}
                      />
          </div>

            <div>
                      <Label htmlFor="pastMedicalHistory">Past Medical History *</Label>
                      <Textarea
                        id="pastMedicalHistory"
                        value={formData.pastMedicalHistory}
                        onChange={(e) => updateForm("pastMedicalHistory", e.target.value)}
                        placeholder="Major surgeries, hospitalizations (enter 'None' if none)"
                        className="mt-1"
                        rows={3}
              />
            </div>
            
            <div>
                      <Label htmlFor="chronicConditions">Chronic Conditions *</Label>
                      <Input
                        id="chronicConditions"
                        value={formData.chronicConditions}
                        onChange={(e) => updateForm("chronicConditions", e.target.value)}
                        placeholder="e.g., Diabetes, Hypertension (enter 'None' if none)"
                        className="mt-1"
              />
            </div>
            
                    <div>
                      <Label htmlFor="currentSymptoms">Current Symptoms / Reason for Registration *</Label>
                      <Textarea
                        id="currentSymptoms"
                        value={formData.currentSymptoms}
                        onChange={(e) => updateForm("currentSymptoms", e.target.value)}
                        placeholder="Describe why you're registering today"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profileImage">Profile Image *</Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setFiles((prev) => ({ ...prev, profileImage: e.target.files?.[0] }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Accepted: .pdf, .jpg, .png (Max 5MB)</p>
                    </div>

                    <div>
                      <Label htmlFor="idDocument">National ID Scan *</Label>
                      <Input
                        id="idDocument"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setFiles((prev) => ({ ...prev, idDocument: e.target.files?.[0] }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Upload a clear photo or scan of your ID</p>
                    </div>

                    {formData.insuranceType !== "None" && (
                      <>
                        <div>
                          <Label htmlFor="insuranceFront">Insurance Card (Front) *</Label>
                          <Input
                            id="insuranceFront"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => setFiles((prev) => ({ ...prev, insuranceFront: e.target.files?.[0] }))}
                            className="mt-1"
                          />
            </div>

          <div>
                          <Label htmlFor="insuranceBack">Insurance Card (Back)</Label>
                          <Input
                            id="insuranceBack"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => setFiles((prev) => ({ ...prev, insuranceBack: e.target.files?.[0] }))}
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Optional</p>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="medicalFiles">Additional Medical Records</Label>
                      <Input
                        id="medicalFiles"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            medicalFiles: e.target.files ? Array.from(e.target.files) : [],
                          }))
                        }
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Optional: Upload any relevant medical documents</p>
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                      <h4 className="font-semibold text-lg mb-4 text-foreground">Review Your Information</h4>
                      <div className="space-y-4 text-sm">
                        {/* Personal Info */}
                        <div className="border-b pb-3">
                          <h5 className="font-medium text-foreground mb-2">Personal Information</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{formData.email}</span>
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{formData.phone}</span>
                            <span className="text-muted-foreground">Date of Birth:</span>
                            <span className="font-medium">{formData.dob}</span>
                            <span className="text-muted-foreground">Gender:</span>
                            <span className="font-medium">{formData.gender}</span>
                          </div>
                        </div>

                        {/* Identity & Address */}
                        <div className="border-b pb-3">
                          <h5 className="font-medium text-foreground mb-2">Identity & Address</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">National ID:</span>
                            <span className="font-medium">{formData.nationalId}</span>
                            <span className="text-muted-foreground">Address:</span>
                            <span className="font-medium">{formData.address}</span>
                            <span className="text-muted-foreground">District:</span>
                            <span className="font-medium">{formData.district}</span>
                            <span className="text-muted-foreground">Province:</span>
                            <span className="font-medium">{formData.province}</span>
                            <span className="text-muted-foreground">Ubudehe:</span>
                            <span className="font-medium">{formData.ubudehe}</span>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="border-b pb-3">
                          <h5 className="font-medium text-foreground mb-2">Emergency Contact</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{formData.emergencyContactName}</span>
                            <span className="text-muted-foreground">Relationship:</span>
                            <span className="font-medium">{formData.emergencyContactRelation}</span>
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{formData.emergencyContactPhone}</span>
                          </div>
                        </div>

                        {/* Insurance */}
                        <div className="border-b pb-3">
                          <h5 className="font-medium text-foreground mb-2">Insurance</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{formData.insuranceType}</span>
                            {formData.insuranceType !== "None" && (
                              <>
                                <span className="text-muted-foreground">Insurer:</span>
                                <span className="font-medium">{formData.insurerName}</span>
                                <span className="text-muted-foreground">Policy Number:</span>
                                <span className="font-medium">{formData.policyNumber}</span>
                                <span className="text-muted-foreground">Policy Holder:</span>
                                <span className="font-medium">{formData.policyHolderName}</span>
                                <span className="text-muted-foreground">Expiry:</span>
                                <span className="font-medium">{formData.policyExpiry}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Medical Info */}
                        <div className="border-b pb-3">
                          <h5 className="font-medium text-foreground mb-2">Medical Information</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Blood Group:</span>
                            <span className="font-medium">{formData.bloodGroup}</span>
                            <span className="text-muted-foreground">Allergies:</span>
                            <span className="font-medium">{formData.allergies}</span>
                            <span className="text-muted-foreground">Medications:</span>
                            <span className="font-medium">{formData.medications}</span>
                            <span className="text-muted-foreground">Chronic Conditions:</span>
                            <span className="font-medium">{formData.chronicConditions}</span>
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Documents</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Profile Image:</span>
                            <span className="font-medium">{files.profileImage ? files.profileImage.name : "Not uploaded"}</span>
                            <span className="text-muted-foreground">ID Document:</span>
                            <span className="font-medium">{files.idDocument ? files.idDocument.name : "Not uploaded"}</span>
                            {formData.insuranceType !== "None" && (
                              <>
                                <span className="text-muted-foreground">Insurance Front:</span>
                                <span className="font-medium">{files.insuranceFront ? files.insuranceFront.name : "Not uploaded"}</span>
                                {files.insuranceBack && (
                                  <>
                                    <span className="text-muted-foreground">Insurance Back:</span>
                                    <span className="font-medium">{files.insuranceBack.name}</span>
                                  </>
                                )}
                              </>
                            )}
                            {files.medicalFiles.length > 0 && (
                              <>
                                <span className="text-muted-foreground">Medical Files:</span>
                                <span className="font-medium">{files.medicalFiles.length} files</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                      <p className="text-sm text-muted-foreground">
                        By submitting this form, you agree to our terms and conditions. You will receive an email verification link and SMS OTP for phone verification.
                      </p>
                    </div>
                  </div>
                )}
          </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                  className="gap-2 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="sm:sr-only">Previous</span>
                </Button>

                {currentStep < 7 ? (
                  <Button onClick={handleNext} disabled={loading} className="gap-2 min-w-[120px] w-full sm:w-auto">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="min-w-[140px] w-full sm:w-auto">
                    {loading ? "Submitting..." : "Submit Registration"}
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/a/login" className="text-primary hover:underline font-medium">
                    Log in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
