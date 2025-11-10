import { cn } from "@/utils/cn";

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100", className)} {...props}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-secondary-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Loading Storify</h3>
          <p className="text-gray-500">Preparing your files...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;