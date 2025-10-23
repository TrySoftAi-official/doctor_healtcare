import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

// Mock feedback data since we don't have a feedback API yet
const mockFeedbackData = [
  {
    id: 1,
    patientName: "John Carter",
    feedback: "Excellent care and very professional!",
    rating: 5,
    date: "2024-01-15"
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    feedback: "Dr. Smith was very thorough and explained everything clearly.",
    rating: 5,
    date: "2024-01-14"
  },
  {
    id: 3,
    patientName: "Mike Wilson",
    feedback: "Great experience, highly recommend!",
    rating: 4,
    date: "2024-01-13"
  }
];

const FeedbackCard = ({ name, text, rating }: { name: string; text: string; rating: number }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Patient Feedback</h4>
      <div className="flex items-center text-yellow-400 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-sm text-gray-700 mb-2">{text}</p>
      <p className="text-xs text-gray-500">{name}</p>
    </div>
  );
};

export default function PatientFeedbackList() {
  const { user } = useAuth();
  
  // For now, we'll use mock data since there's no feedback API
  // In the future, this would be replaced with a real API call
  const { data: feedbackData, isLoading, error } = useQuery({
    queryKey: ['patient-feedback', user?.id],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockFeedbackData;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
        <div className="text-red-600 text-center">
          <p className="text-sm">Error loading feedback</p>
        </div>
      </div>
    );
  }

  if (!feedbackData || feedbackData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="text-gray-500 text-center">
          <p className="text-sm">No feedback available yet</p>
        </div>
      </div>
    );
  }

  // Get the most recent feedback
  const recentFeedback = feedbackData[0];

  return (
    <FeedbackCard 
      name={recentFeedback.patientName} 
      text={recentFeedback.feedback}
      rating={recentFeedback.rating}
    />
  );
}
