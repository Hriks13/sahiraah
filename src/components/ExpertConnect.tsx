
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

interface Expert {
  name: string;
  title: string;
  linkedinUrl: string;
  imageUrl: string;
  expertise: string[];
}

const experts: Expert[] = [
  {
    name: "Sundar Pichai",
    title: "CEO of Google & Alphabet",
    linkedinUrl: "https://www.linkedin.com/in/sundarpichai/",
    imageUrl: "https://media.licdn.com/dms/image/D4D03AQHM_dbkFVJ0Pw/profile-displayphoto-shrink_800_800/0/1680643432827?e=1720742400&v=beta&t=EtutCv2ZBd-pCnNyoODRlO_3NJ2MyraeCZGr2loOQaI",
    expertise: ["AI/ML", "Leadership", "Technology Strategy"]
  },
  {
    name: "Satya Nadella",
    title: "CEO of Microsoft",
    linkedinUrl: "https://www.linkedin.com/in/satyanadella/",
    imageUrl: "https://media.licdn.com/dms/image/C5603AQHHUuOSlRVA1w/profile-displayphoto-shrink_800_800/0/1561758348611?e=1720742400&v=beta&t=7_XfuMnXpZeec_4_7lRQpu_JCrV4E-2Hbvvx3ITqPcA",
    expertise: ["Cloud Computing", "Business Transformation", "Leadership"]
  },
  {
    name: "Falguni Nayar",
    title: "Founder & CEO of Nykaa",
    linkedinUrl: "https://www.linkedin.com/in/falguni-nayar-9743431/?originalSubdomain=in",
    imageUrl: "https://media.licdn.com/dms/image/C4D03AQF6kc1Ndk_yQw/profile-displayphoto-shrink_800_800/0/1626208340393?e=1720742400&v=beta&t=n7nAZ6GeZXygwneEmdaDXIdzXcG-01ds2_1bgeML62I",
    expertise: ["E-commerce", "Entrepreneurship", "Consumer Retail"]
  },
  {
    name: "Indra Nooyi",
    title: "Former CEO of PepsiCo",
    linkedinUrl: "https://www.linkedin.com/in/indra-nooyi-3145b3213/",
    imageUrl: "https://media.licdn.com/dms/image/C5603AQEbDu8FveMURg/profile-displayphoto-shrink_800_800/0/1627110328084?e=1720742400&v=beta&t=q8j4F5S2X1NHoVn89PGWA9iEYg2t9PeQFA22ErciKMg",
    expertise: ["Global Business", "Leadership", "Sustainability"]
  }
];

const ExpertConnect = () => {
  return (
    <div className="py-12 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">Connect with Experts</h2>
        <p className="text-blue-700 text-center mb-8">Get insights from industry leaders to guide your career journey</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-4">
                  <img 
                    src={expert.imageUrl} 
                    alt={expert.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <CardTitle className="text-xl text-center text-blue-900">{expert.name}</CardTitle>
                <CardDescription className="text-center text-blue-700">{expert.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {expert.expertise.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white flex items-center justify-center gap-2"
                  asChild
                >
                  <a href={expert.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    Connect on LinkedIn
                    <ExternalLinkIcon size={16} />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertConnect;
