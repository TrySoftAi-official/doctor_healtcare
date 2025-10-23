import { Heart, Stethoscope, Pill, Clipboard } from "lucide-react";

const AppointmentHero = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#1A6DFF' }}>
      {/* Background Icons */}
      <div className="absolute inset-0 opacity-30">
        {/* Top Left - Heart */}
        <div className="absolute top-12 left-12">
          <Heart className="w-8 h-8 text-white" />
        </div>
        
        {/* Bottom Left - Pill */}
        <div className="absolute bottom-12 left-12">
          <Pill className="w-7 h-7 text-white" />
        </div>
        
        {/* Top Right - Stethoscope */}
        <div className="absolute top-12 right-12">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        
        {/* Bottom Right - Clipboard */}
        <div className="absolute bottom-12 right-12">
          <Clipboard className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-4xl font-bold mb-6 leading-tight">
              Book Your Appointment Easily
            </h1>
            <p className="text-xl text-white leading-relaxed max-w-lg">
              Select your doctor, describe your problem, and attach reports — all in one step.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#E0EBF5' }}>
              <div className="flex items-center justify-center space-x-6">
                {/* Patient - Older Woman */}
                <div className="text-center">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
                    <div className="w-4 h-4 bg-blue-200 rounded-full mx-auto"></div>
                  </div>
                </div>
                
                {/* Doctor - Younger Man */}
                <div className="text-center">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
                    <div className="w-4 h-4 bg-blue-200 rounded-full mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentHero;
