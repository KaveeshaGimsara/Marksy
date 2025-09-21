import React from 'react';
import { ArrowLeft, Heart, Code, Coffee, Github, Shield, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeartLogo from './HeartLogo';

interface LicensePageProps {
  onBack?: () => void;
}

const LicensePage: React.FC<LicensePageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              License & Credits
            </h1>
            <p className="text-gray-600 mt-2">
              Open source licensing, attributions, and project information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Our Colorful Heart Logo Card - Moved from About page */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-purple-800">Our Colorful Heart Logo</CardTitle>
              </div>
              <CardDescription className="text-purple-600">
                Symbol of passion for education and student success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <HeartLogo className="w-16 h-16" />
                </div>
              </div>
              <div className="text-sm text-purple-700 space-y-2">
                <p>
                  • <strong>Rainbow Gradient:</strong> Represents the diversity of subjects and learning paths
                </p>
                <p>
                  • <strong>Heart Shape:</strong> Symbolizes our love for education and student growth
                </p>
                <p>
                  • <strong>Sparkle Effects:</strong> Celebrates the moments of understanding and achievement
                </p>
                <p>
                  • <strong>Vibrant Colors:</strong> Reflects the energy and enthusiasm of A/L students
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Education</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">Passion</Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">Success</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Achievement</Badge>
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">MIT License</CardTitle>
              </div>
              <CardDescription className="text-green-600">
                Free and open source software
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-green-700 space-y-3">
                <p>
                  Marksy is released under the MIT License, which grants broad permission to use the software:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>✅ Commercial use</li>
                  <li>✅ Modification</li>
                  <li>✅ Distribution</li>
                  <li>✅ Private use</li>
                  <li>✅ Sublicensing & merging</li>
                </ul>
                <p className="text-xs text-green-600 dark:text-green-400">
                  The license requires preservation of the copyright & permission notice in copies or substantial portions of the Software.
                </p>
                <p className="font-semibold">
                  Copyright © 2025 Kaveesha Gimsara
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/30"
                onClick={() => window.open('https://github.com/kaveeshagimsara/marksy/blob/main/LICENSE', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                View Full License
              </Button>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-blue-800">Technology Stack</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                Built with modern web technologies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">React 18</div>
                  <div className="text-sm text-blue-600">Frontend Framework</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">TypeScript</div>
                  <div className="text-sm text-blue-600">Type Safety</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">Tailwind CSS</div>
                  <div className="text-sm text-blue-600">Styling</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">Vite</div>
                  <div className="text-sm text-blue-600">Build Tool</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">shadcn/ui</div>
                  <div className="text-sm text-blue-600">UI Components</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-900">Recharts</div>
                  <div className="text-sm text-blue-600">Data Visualization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgments */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-800">Acknowledgments</CardTitle>
              </div>
              <CardDescription className="text-orange-600">
                Special thanks to contributors and supporters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-orange-700 space-y-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    A/L Students Community
                  </div>
                  <div className="text-orange-600 text-sm">
                    For valuable feedback and feature suggestions
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Teachers & Educators
                  </div>
                  <div className="text-orange-600 text-sm">
                    For insights into A/L marking system and requirements
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="font-semibold flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Open Source Community
                  </div>
                  <div className="text-orange-600 text-sm">
                    For the amazing libraries and tools that made this possible
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <HeartLogo className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Marksy
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Empowering Sri Lankan A/L students with smart progress tracking and analysis tools. 
                Built with ❤️ by KGX for the student community.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://github.com/kaveeshagimsara/marksy', '_blank')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://buymeacoffee.com/geekyedu', '_blank')}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Support Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicensePage;