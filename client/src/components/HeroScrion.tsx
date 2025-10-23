import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


export default function HeroScrion() {
  return (
    <>
      <section className="h-[90vh] bg-blue-50 relative flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop')",
          }}
        ></div>
        
        {/* Light Blue Overlay */}
        <div className="absolute inset-0 bg-blue-100/60"></div>
        
        {/* Corner Icons */}
        <div className="absolute top-8 left-8 w-12 h-12 bg-blue-200/50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2z"/>
          </svg>
        </div>
        
        <div className="absolute top-8 right-8 w-12 h-12 bg-blue-200/50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Healthcare Appointment Booking
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
            Compassionate care for every generation
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
          >
            <Link to="/appointment" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              Book Appointment
            </Link>
          </Button>
        </div>
      </section>

    </>
  );
}
