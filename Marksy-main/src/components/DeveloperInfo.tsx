import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Github, 
  MessageCircle, 
  Twitter, 
  GraduationCap,
  MapPin,
  Code
} from 'lucide-react';

const DeveloperInfo: React.FC = () => {
  const socialLinks = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      href: "mailto:kaveegimx@gmail.com",
      username: "kaveegimx@gmail.com"
    },
    {
      icon: <Github className="h-4 w-4" />,
      label: "GitHub",
      href: "https://github.com/kaveeshagimsara",
      username: "@kaveeshagimsara"
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "Telegram",
      href: "https://t.me/kaveeshagimsara",
      username: "@kaveeshagimsara"
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      label: "Twitter",
      href: "https://twitter.com/kaveeshagimsara",
      username: "@kaveeshagimsara"
    }
  ];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src="/developer-avatar.jpg"
              alt="Kaveesha Gimsara - Developer"
              className="w-20 h-20 rounded-full border-4 border-blue-300 dark:border-blue-700 shadow-lg object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <Code className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Kaveesha Gimsara
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Sri Lanka
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            Full Stack Developer
          </Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Building academic excellence tools for A/L students across Sri Lanka. 
            Empowering students with modern technology to track their progress and achieve their educational goals.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-center mb-3">Connect with me</h4>
          <div className="grid grid-cols-1 gap-2">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-8 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20"
                asChild
              >
                <a 
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {link.icon}
                  <span className="flex-1 text-left">{link.label}</span>
                  <span className="text-muted-foreground text-xs">{link.username}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for Sri Lankan Students
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperInfo;