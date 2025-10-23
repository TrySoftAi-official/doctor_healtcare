const Testimonials = () => {
    return (
      <div className="bg-white">
        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Patients Say
            </h1>
            <p className="text-lg text-gray-600">
              Real stories from families we've cared for
            </p>
          </div>
  
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Margaret Johnson Testimonial */}
            <div className="bg-blue-50 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
                    alt="Margaret Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Margaret Johnson</h3>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The staff here is incredibly caring and professional. They made my mother feel comfortable and respected during every visit."
              </p>
            </div>
  
            {/* Robert Chen Testimonial */}
            <div className="bg-blue-50 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                    alt="Robert Chen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Robert Chen</h3>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Booking appointments online is so easy, and the home care visits have been a blessing for our family."
              </p>
            </div>
  
            {/* Sarah Williams Testimonial */}
            <div className="bg-blue-50 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" 
                    alt="Sarah Williams"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Sarah Williams</h3>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Dr. Smith and her team provide exceptional care. They really listen and take time to explain everything clearly."
              </p>
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-200 mb-16"></div>
        </div>
      </div>
    );
  };
  
  export default Testimonials;