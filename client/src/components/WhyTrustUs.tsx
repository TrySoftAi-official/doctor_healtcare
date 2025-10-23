const WhyTrustUs = () => {
    return (
      <div className="bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                Why Families Trust Us
              </h1>
  
              {/* Features List */}
              <div className="space-y-8">
                {/* Experienced Care Team */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Experienced Care Team
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Our healthcare professionals have decades of experience caring for patients of all ages.
                    </p>
                  </div>
                </div>
  
                {/* Flexible Scheduling */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Flexible Scheduling
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Easy online booking with flexible appointment times that work around your schedule.
                    </p>
                  </div>
                </div>
  
                {/* Compassionate Approach */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Compassionate Approach
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      We treat every patient like family, providing personalized care with empathy and respect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Column - Image Content */}
            <div className="relative">
              <div className="relative rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop" 
                  alt="Nurse caring for elderly patient"
                  className="w-full h-auto"
                />
              </div>
              {/* Heartbeat Icon in top right corner */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default WhyTrustUs;