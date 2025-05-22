
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  FileText,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
}

const ServicesModule = ({ userType }: ServicesModuleProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 1,
      name: 'Building Permits',
      category: 'Construction',
      description: 'Apply for building permits and construction approvals',
      status: 'Available',
      processingTime: '5-7 business days',
      requests: 23
    },
    {
      id: 2,
      name: 'Utility Bill Payment',
      category: 'Utilities',
      description: 'Pay water, electricity, and waste management bills',
      status: 'Available',
      processingTime: 'Instant',
      requests: 156
    },
    {
      id: 3,
      name: 'Street Light Repair',
      category: 'Infrastructure',
      description: 'Report broken or malfunctioning street lights',
      status: 'Available',
      processingTime: '1-3 business days',
      requests: 8
    },
    {
      id: 4,
      name: 'Park Event Booking',
      category: 'Recreation',
      description: 'Reserve public parks and facilities for events',
      status: 'Available',
      processingTime: '2-4 weeks',
      requests: 12
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">City Services</h2>
          <p className="text-gray-600">
            {userType === 'employee' 
              ? 'Manage and monitor city services' 
              : 'Access available city services'}
          </p>
        </div>
        {userType === 'employee' && (
          <Button>Add New Service</Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant="secondary">{service.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Processing: {service.processingTime}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Status: {service.status}</span>
                </div>
                {userType === 'employee' && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Active requests: {service.requests}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">
                  {userType === 'employee' ? 'Manage' : 'Apply'}
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesModule;
