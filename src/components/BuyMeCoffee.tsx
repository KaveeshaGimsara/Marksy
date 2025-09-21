import React, { useState } from 'react';
import { Heart, Coffee, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BuyMeCoffeeProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'minimal';
}

export const BuyMeCoffee: React.FC<BuyMeCoffeeProps> = ({ 
  className = '', 
  variant = 'floating' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Changed to false so it doesn't show by default

  // Buy Me Coffee configurations
  const coffeeConfig = {
    username: 'geekyedu',
    url: 'https://buymeacoffee.com/geekyedu',
    message: 'Support Marksy Development',
    description: 'Help us keep this tool free and improve it with new features!'
  };

  const handleDonation = (amount?: number) => {
    let url = coffeeConfig.url;
    if (amount) {
      url += `?price=${amount}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const FloatingWidget = () => (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'} ${className}`}>
      <div className="relative">
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 shadow-md z-10"
        >
          <X className="h-3 w-3" />
        </Button>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coffee className="h-4 w-4 text-orange-600" />
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Buy Me Coffee
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Supporting A/L students' success
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-3">
              Love this tool? Help us keep it free and add more features!
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleDonation(5)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs"
              >
                $5
              </Button>
              <Button
                size="sm"
                onClick={() => handleDonation()}
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const InlineWidget = () => (
    <Card className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="relative">
            <Coffee className="h-5 w-5 text-orange-600" />
            <Heart className="h-3 w-3 text-red-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Support Our Mission
          </span>
        </CardTitle>
        <CardDescription>
          Empowering A/L students with free educational tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              🎯 This tool has helped thousands of A/L students track their progress and achieve success.
            </p>
            <p className="mb-3">
              Your support helps us maintain this platform and develop new features to benefit more students.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleDonation(5)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Buy Coffee ($5)
            </Button>
            <Button
              onClick={() => handleDonation(10)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Support ($10)
            </Button>
            <Button
              onClick={() => handleDonation()}
              variant="outline"
              className="relative border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:text-amber-300 dark:border-amber-400 dark:hover:bg-amber-900/30 dark:hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Custom Amount
            </Button>
          </div>
          
          <div className="pt-2 border-t border-orange-200">
            <p className="text-xs text-gray-500 text-center">
              Built with ❤️ by KGX • All donations help improve the platform
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MinimalWidget = () => (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
      <div className="flex items-center gap-2">
        <Coffee className="h-5 w-5 text-orange-600" />
        <span className="text-sm font-medium text-gray-700">Enjoying this tool?</span>
      </div>
      <Button
        size="sm"
        onClick={() => handleDonation()}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
      >
        <Heart className="h-3 w-3 mr-1" />
        Support
      </Button>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'floating':
      return <FloatingWidget />;
    case 'inline':
      return <InlineWidget />;
    case 'minimal':
      return <MinimalWidget />;
    default:
      return <FloatingWidget />;
  }
};

export default BuyMeCoffee;