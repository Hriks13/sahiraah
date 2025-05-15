
// Import from the correct location - Radix UI Toast doesn't export useToast directly
import { ToastProvider } from "@radix-ui/react-toast";
import { useToast as useShadcnToast } from "../components/ui/toast/use-toast";

// Export the toast from sonner
export { toast } from "sonner";
// Export useToast from shadcn implementation
export { useShadcnToast as useToast };
