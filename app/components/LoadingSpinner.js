export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated food icons */}
        <div className="flex space-x-4 text-4xl">
          <div className="animate-bounce" style={{ animationDelay: '0s' }}>🍕</div>
          <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>🍟</div>
          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍪</div>
          <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>🥤</div>
          <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍿</div>
        </div>
        
        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        
        {/* Message */}
        <p className="text-xl animate-pulse text-center">{message}</p>
        
        {/* Progress bar */}
        <div className="w-48 bg-gray-800 rounded-full h-2">
          <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}