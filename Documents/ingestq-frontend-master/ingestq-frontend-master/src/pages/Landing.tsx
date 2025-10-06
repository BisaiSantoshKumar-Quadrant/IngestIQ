import { loginUser, registerUser } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Bot, Upload, BarChart3, Cog, Eye, Zap, Shield, FileText, Users, CheckCircle, TrendingUp, LogIn, UserPlus, ArrowRight, Play, Star, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";

function LandingContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();


//   const handleLogin = async () => {
//   try {
//     const res = await loginUser({ email: loginData.email, password: loginData.password });
    
//     // Save token and user info only if login succeeds
//     localStorage.setItem("token", res.token);
//     localStorage.setItem("user", JSON.stringify(res.user));

//     setShowLogin(false);

//     toast({
//       title: "Login successful",
//       description: `Welcome back, ${res.user.username}!`,
//     });

//     navigate("/dashboard/jobs");
//   } catch (err: any) {
//     toast({
//       title: "Login Failed",
//       description: err.message || "Invalid credentials or unregistered user",
//       variant: "destructive",
//     });
//   }
// };
const handleLogin = async () => {
  try {
    const res = await loginUser({ email: loginData.email, password: loginData.password });
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("freshLogin", "true"); // Add flag for fresh login
    setShowLogin(false);
    toast({
      title: "Login successful",
      description: `Welcome back, ${res.user.username}!`,
    });
    navigate("/dashboard/jobs");
  } catch (err: any) {
    toast({
      title: "Login Failed",
      description: err.message || "Invalid credentials or unregistered user",
      variant: "destructive",
    });
  }
};

  
const handleRegister = async () => {
  if (registerData.username && registerData.email && registerData.password) {

    if (registerData.password.length < 8) {
  toast({
    title: "Weak password",
    description: "Password must be at least 8 characters long.",
    variant: "destructive",
  });
  return;
}

    try {
      const data = await registerUser({
        full_name: registerData.username,   // ✅ include username
        email: registerData.email,
        password: registerData.password,
      });

      localStorage.setItem("authenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.user || data));

      setShowRegister(false);

      toast({
        title: "Registration successful",
        description: `Welcome to IngestIQ, ${registerData.username}!`,
      });

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }
};




  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg relative">
                <Brain className="w-5 h-5 text-primary-foreground absolute top-1 left-1" />
                <Database className="w-5 h-5 text-primary-foreground absolute bottom-1 right-1" />
              </div>
              <h1 className="text-xl font-bold text-foreground">IngestIQ</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => smoothScrollTo('home')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => smoothScrollTo('how-it-works')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => smoothScrollTo('features')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => smoothScrollTo('benefits')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Benefits
              </button>
              <button 
                onClick={() => smoothScrollTo('about')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                About Us
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setShowLogin(true)} className="hover:scale-105 transition-transform duration-200">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button onClick={() => setShowRegister(true)} className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Agentic AI
                  <span className="block text-primary">Ingestion</span>
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground">
                  Revolutionizing Data Ingestion with Autonomous Intelligence
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                IngestIQ is an innovative AI-powered data ingestion platform that uses autonomous agents to intelligently process, validate, and transform your data. Our agentic approach means the system learns, adapts, and optimizes itself without constant human intervention.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-medium hover:scale-105 transition-all duration-200">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Auto Schema Detection</h3>
                  <p className="text-xs text-muted-foreground">Intelligent discovery</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Data Validation</h3>
                  <p className="text-xs text-muted-foreground">Quality assured</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-5 h-5 text-warning" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Real-time Analytics</h3>
                  <p className="text-xs text-muted-foreground">Live insights</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-chart-4/20 bg-gradient-to-br from-chart-4/5 to-chart-4/10">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-chart-4/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-chart-4" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Lightning Fast</h3>
                  <p className="text-xs text-muted-foreground">Instant processing</p>
                </CardContent>
              </Card>
              
              <Card className="col-span-2 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 relative">
                    <Brain className="w-6 h-6 text-primary absolute top-1 left-1" />
                    <Database className="w-6 h-6 text-primary absolute bottom-1 right-1" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">Autonomous AI Agents</h3>
                  <p className="text-muted-foreground mt-1 text-sm">Self-learning intelligence</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Agentic AI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Why Agentic AI Ingestion?</h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Say goodbye to rigid ETL pipelines, manual schema updates, and inconsistent data quality. 
            Embrace a fully AI-driven ingestion framework that intelligently adapts, validates, and 
            orchestrates your data workflows — without human bottlenecks.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform transforms data ingestion through intelligent automation and autonomous intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Upload className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Upload Your Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect and upload your data from multiple sources including CSV files, databases, cloud storage platforms, or real-time streaming data with seamless integration.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Quality Checks using AI Generated Rules</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our intelligent system automatically generates comprehensive validation rules and performs thorough data quality assessments to ensure accuracy, completeness, and consistency across your datasets.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Named Entity Resolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI algorithms identify, standardize, and resolve entity references across datasets, eliminating duplicates and creating unified entity profiles for better data consistency.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Cog className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">4</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Apply Your Own Business Logic</h3>
              <p className="text-muted-foreground leading-relaxed">
                Implement custom business rules and domain-specific logic tailored to your organization's requirements, ensuring data processing aligns with your unique business processes and compliance needs.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Bot className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">5</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Perform ETL to Clean Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Execute intelligent Extract, Transform, and Load operations with automated data cleansing, format standardization, and schema mapping to prepare your data for analysis and consumption.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Eye className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">6</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Monitor & Optimize</h3>
              <p className="text-muted-foreground leading-relaxed">
                Continuous monitoring with real-time dashboards and performance insights while the system autonomously learns from patterns to optimize future processing and maintain peak efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Features</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to transform your data ingestion process with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Real-Time Schema Discovery with Schema Evolution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Detects and adapts to evolving schema structures in structured and semi-structured data with automatic evolution tracking and version management.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Multi-File Ingestion Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Seamlessly handles multiple CSV files and XLSX sheets, intelligently linking data across them.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">End-to-End Workflow Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Automates the full ingestion pipeline — from detection and validation to transformation and reporting.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Named Entity Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Identifies and standardizes entity references across datasets to unify and deduplicate information.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Built-In Data Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Auto-generates validation rules and flags anomalies for human review only when necessary.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Interactive Dashboards and Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Monitor pipeline performance, data health, and business metrics in real time.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Key Benefits</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the transformative power of AI-driven data ingestion with measurable business outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Faster Ingestion</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly adapts to schema changes, eliminating manual delays.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-success/10 to-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Trusted Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatic validation ensures clean, consistent, and reliable data.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-4/10 to-chart-4/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <Bot className="w-8 h-8 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Less Manual Work</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI handles complexity — your team focuses on decision-making.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-warning/10 to-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Effortless Scalability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Capable of processing millions of records across files and sources.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-5/10 to-chart-5/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <FileText className="w-8 h-8 text-chart-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Audit-Ready & Transparent</h3>
              <p className="text-muted-foreground leading-relaxed">
                Logged workflows and dashboards ensure full visibility and control.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process and analyze data as it flows through your systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-muted/20 to-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">About IngestIQ</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto mb-8"></div>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Building the future of intelligent data processing with autonomous AI agents
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="space-y-8">
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  IngestIQ represents the next generation of data ingestion technology, built 
                  from the ground up with agentic AI at its core. Our platform focuses on 
                  creating autonomous data processing agents that can understand, adapt, and 
                  optimize data workflows without constant human intervention.
                </p>
                <p className="text-lg leading-relaxed">
                  This innovative platform combines cutting-edge machine learning algorithms with 
                  intuitive user interfaces to deliver a seamless data ingestion experience. Our AI agents 
                  continuously learn from data patterns, automatically adjust to schema changes, and 
                  proactively identify data quality issues.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 group">
                  <div className="w-2 h-2 bg-success rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-foreground font-medium">Built with modern AI and machine learning technologies</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-2 h-2 bg-success rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-foreground font-medium">Designed for enterprise-grade scalability and security</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-2 h-2 bg-success rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-foreground font-medium">Open to innovation and continuous improvement</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 relative">
                  <Brain className="w-6 h-6 text-primary absolute top-0.5 left-0.5" />
                  <Database className="w-6 h-6 text-primary absolute bottom-0.5 right-0.5" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">AI-First</h3>
                <p className="text-sm text-muted-foreground">Approach</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-bold text-success mb-2">Cloud</h3>
                <p className="text-sm text-muted-foreground">Native</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-bold text-warning mb-2">Open</h3>
                <p className="text-sm text-muted-foreground">Source Ready</p>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-chart-4/20 bg-gradient-to-br from-chart-4/5 to-chart-4/10">
                <div className="w-12 h-12 bg-chart-4/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-bold text-chart-4 mb-2">Real-time</h3>
                <p className="text-sm text-muted-foreground">Processing</p>
              </Card>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize intelligent data processing by making advanced AI capabilities accessible to organizations of all sizes, 
                  eliminating the complexity and manual overhead of traditional data ingestion pipelines.
                </p>
              </div>
            </Card>
            
            <Card className="p-8 border-chart-4/20 bg-gradient-to-br from-chart-4/5 to-chart-4/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-chart-4" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where data flows seamlessly from source to insight, powered by autonomous AI agents that understand, 
                  adapt, and optimize without human intervention, enabling organizations to focus on what matters most.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Experience the Future of Data Ingestion</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto"></div>
          </div>
          
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Whether you're building a new data pipeline, modernizing existing infrastructure, or 
            exploring AI-driven automation — IngestIQ provides the intelligence and flexibility 
            to transform your data operations.
          </p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Ready to Get Started?</h3>
              <p className="text-muted-foreground">Discover how agentic AI can revolutionize your data workflows.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-medium hover:scale-105 transition-all duration-200">
                <Play className="w-5 h-5 mr-2" />
                Schedule Demo Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Login to IngestIQ</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email<span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password<span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Demo credentials:</strong> demo@ingestiq.com / demo123
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Login
              </Button>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 text-primary font-medium" 
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create Account</DialogTitle>
            <DialogDescription>
              Sign up for your IngestIQ account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name<span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  type="username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reg-email" className="text-sm font-medium">Email<span className="text-red-500">*</span></Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reg-password" className="text-sm font-medium">Password<span className="text-red-500">*</span></Label>
                    <span className="text-xs text-gray-500">  (min 8 characters)</span>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a password"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleRegister} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Account
              </Button>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button 
                variant="link" 
                className="p-0 text-primary font-medium" 
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Landing() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}