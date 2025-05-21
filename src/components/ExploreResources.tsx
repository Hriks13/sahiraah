
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AdPlacement from "./AdPlacement";
import { useLanguage } from "@/hooks/useLanguage";

const ExploreResources = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-[#1d3557] mb-2">{t('explore_resources')}</h2>
      <p className="text-[#1d3557] mb-6">{t('resource_intro')}</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">{t('career_guides')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557]">
              {t('career_guides_desc')}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              asChild
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              <Link to="/career-guides">
                {t('browse_guides')}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">{t('skill_development')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557]">
              {t('skill_dev_desc')}
            </p>
            
            <AdPlacement location="content" className="my-4" />
          </CardContent>
          <CardFooter>
            <Button 
              asChild
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              <Link to="/courses">
                {t('discover_courses')}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">{t('expert_connect')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557]">
              {t('expert_connect_desc')}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              disabled
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              {t('coming_soon')}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ExploreResources;
