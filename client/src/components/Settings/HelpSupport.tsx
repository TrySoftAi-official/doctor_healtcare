import { HelpCircle, Search, Mail, Phone, MessageCircle } from "lucide-react";

const HelpSupport = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Help & Support</h2>
          <p className="text-gray-600">Get assistance when you need it</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search help topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Support */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Contact Support</h3>
          <p className="text-sm text-gray-600 mb-4">Get help from our support team</p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">support@carpediemhealth.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">+1 800 123 456</span>
            </div>
          </div>
        </div>

        {/* Live Chat */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
