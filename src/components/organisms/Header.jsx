import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ 
  onSearch,
  onUpload,
  onMenuToggle,
  className,
  ...props 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/files":
        return "All Files";
      case "/recent":
        return "Recent Files";
      case "/starred":
        return "Starred";
      case "/trash":
        return "Trash";
      default:
        return "Files";
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Cloud" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Storify
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Cloud Storage Platform</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <SearchBar 
            placeholder={`Search in ${getPageTitle().toLowerCase()}...`}
            onSearch={onSearch}
            className={cn(
              "transition-all duration-200",
              isSearchFocused && "scale-[1.02]"
            )}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <ApperIcon name="Search" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Upload button */}
          <Button
            onClick={onUpload}
            icon="Upload"
            size="md"
            className="shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">Upload</span>
          </Button>

          {/* Profile/Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 hidden sm:block">
            <ApperIcon name="Settings" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-6 pb-4">
        <SearchBar 
          placeholder={`Search in ${getPageTitle().toLowerCase()}...`}
          onSearch={onSearch}
        />
      </div>
    </header>
  );
};

export default Header;