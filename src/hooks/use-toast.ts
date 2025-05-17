
// Import from the correct location
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "../components/ui/toast/use-toast";

// Export both toast implementations for flexibility
export const toast = sonnerToast;
export const useToast = useShadcnToast;
