import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  children,
  variant = "default",
  padding = "default",
  hover = false,
  className,
  ...props
}, ref) => {
  const baseStyles = "bg-white rounded-xl border transition-all duration-200";
  
  const variants = {
    default: "border-gray-200 shadow-sm",
    elevated: "border-gray-200 shadow-lg",
    gradient: "border-transparent bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg",
    glass: "border-white/20 bg-white/10 backdrop-blur-sm shadow-lg"
  };
  
  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  };
  
  const hoverStyles = hover ? "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 cursor-pointer" : "";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;