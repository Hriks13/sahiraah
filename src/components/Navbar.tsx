
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { AlignJustify } from "lucide-react"
import LogoutButton from "@/components/LogoutButton";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";

const Navbar = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-background py-4 border-b">
      <div className="container flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl">
          SahiRaah
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex items-center gap-4">
            <NavigationMenuItem>
              <Link to="/dashboard">{t('dashboard')}</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">{t('about')}</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact">{t('contact')}</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/settings">{t('settings')}</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <LogoutButton />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <LanguageSelector />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger className="md:hidden">
            <AlignJustify />
          </SheetTrigger>
          <SheetContent className="w-full sm:w-3/4 md:w-2/5">
            <SheetHeader>
              <SheetTitle>{t('menu')}</SheetTitle>
              <SheetDescription>
                {t('navigate')}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4">
              <Link to="/dashboard">{t('dashboard')}</Link>
              <Link to="/about">{t('about')}</Link>
              <Link to="/contact">{t('contact')}</Link>
              <Link to="/settings">{t('settings')}</Link>
              <LogoutButton />
              <LanguageSelector />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Navbar
