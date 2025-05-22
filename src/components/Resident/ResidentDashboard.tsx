
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Calendar, 
  FileText, 
  MessageSquare,
  CreditCard,
  Bell
} from 'lucide-react';

const ResidentDashboard = () => {
  const quickServices = [
    { title: 'Pay Utilities', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
    { title: 'Submit Appeal', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
    { title: 'Book Appointment', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { title: 'View Documents', icon: FileText, color: 'bg-orange-100 text-orange-600' },
  ];

  const cityNews = [
    {
      title: 'New Park Opening This Weekend',
      date: '2024-05-20',
      summary: 'Central Park renovation completed. Grand opening ceremony...'
    },
    {
      title: 'Road Construction Updates',
      date: '2024-05-18',
      summary: 'Main Street construction will continue through next month...'
    },
    {
      title: 'Public Meeting Notice',
      date: '2024-05-15',
      summary: 'Community budget discussion scheduled for next Tuesday...'
    }
  ];

  const myRequests = [
    { id: '001', service: 'Street Light Repair', status: 'In Progress', date: '2024-05-10' },
    { id: '002', service: 'Pothole Report', status: 'Completed', date: '2024-05-05' },
    { id: '003', service: 'Noise Complaint', status: 'Under Review', date: '2024-05-12' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to the City Portal</h2>
        <p className="mb-4">Access city services, submit requests, and stay informed about community news.</p>
        <div className="flex space-x-4 max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search services, information..." 
              className="pl-10 bg-white text-gray-900"
            />
          </div>
          <Button variant="secondary">Search</Button>
        </div>
      </div>

      {/* Quick Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{service.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City News & Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              City News & Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityNews.map((news, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                  <p className="text-xs text-gray-500">{news.date}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All News</Button>
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{request.service}</p>
                    <p className="text-sm text-gray-600">#{request.id} • {request.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Requests</Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive City Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Interactive City Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map with city services and locations</p>
              <Button className="mt-3">Explore Map</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDashboard;
