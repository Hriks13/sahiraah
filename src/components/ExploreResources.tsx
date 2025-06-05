
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AdBanner from "@/components/AdBanner";

const ExploreResources = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-[#1d3557] mb-2">Explore Resources</h2>
      <p className="text-[#1d3557] mb-6">Based on your interests and strengths, here are some career resources:</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">Career Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557] mb-4">
              Explore comprehensive career roadmaps with step-by-step learning paths for Technology, Healthcare, Business, Creative Industries, and Education careers.
            </p>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• Technology: Software Development, Data Science</div>
              <div>• Healthcare: Medicine, Nursing, Administration</div>
              <div>• Business: Finance, Marketing, Entrepreneurship</div>
              <div>• Creative: Design, Media, Digital Arts</div>
              <div>• Education: Teaching, Research, Training</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              asChild
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              <Link to="/career-guides">
                Browse Guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">Skill Development</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557] mb-4">
              Access curated learning resources from top platforms including Coursera, edX, YouTube, and freeCodeCamp for hands-on skill building.
            </p>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• Web Development (HTML, CSS, JavaScript)</div>
              <div>• Data Science & Python Programming</div>
              <div>• Graphic Design & UI/UX</div>
              <div>• Business Management & Leadership</div>
              <div>• Mobile App Development</div>
              <div>• Digital Marketing & Analytics</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              asChild
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              <Link to="/courses">
                Discover Courses
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-[#1d3557]">Expert Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#1d3557]">
              Connect with mentors and professionals in your field of interest through our upcoming networking platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              disabled
              variant="outline" 
              className="border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white w-full flex justify-between"
            >
              Coming Soon
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Resources Section Ad */}
      <AdBanner size="leaderboard" className="mt-8" />
    </div>
  );
};

export default ExploreResources;
