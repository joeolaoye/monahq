import LeadForm from "@/components/LeadForm";
const Index = () => {
  return <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">Mona</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Join the waitlist for the next-generation CRM platform designed to help your business grow faster, 
              connect deeper, and close more deals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 animate-slide-up">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">Lightning Fast</h3>
              <p className="text-primary-foreground/80">
                Manage contacts, deals, and conversations in one unified platform.
              </p>
            </div>

            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 animate-slide-up" style={{
            animationDelay: "0.1s"
          }}>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">Smart Automation</h3>
              <p className="text-primary-foreground/80">
                AI-powered workflows that save time and increase conversions.
              </p>
            </div>

            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 animate-slide-up" style={{
            animationDelay: "0.2s"
          }}>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">Enterprise Security</h3>
              <p className="text-primary-foreground/80">
                Bank-level encryption and compliance to keep your data safe.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
                Get Early Access
              </h2>
              <p className="text-primary-foreground/90">
                Be among the first to experience the future of CRM. Limited spots available.
              </p>
            </div>
            
            <LeadForm />
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-12 text-primary-foreground/70">
            <p className="text-sm">Join 200+ businesses already on the waitlist</p>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;