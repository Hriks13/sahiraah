
// Export from our new import location
import { useToast } from "../ui/toast/use-toast";
import { toast as toastFunction } from "../ui/toast/use-toast";

export const toast = toastFunction;
export { useToast };
