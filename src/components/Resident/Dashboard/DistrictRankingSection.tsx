
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const DistrictRankingSection = () => {
  const { language } = useLanguage();

  const districtData = [
    {
      rank: 1,
      name: language === 'en' ? 'Halytskyi' : 'Галицький',
      features: language === 'en' ? 
        'Historic center, high prices, cultural life, limited green areas.' :
        'Історичний центр, високі ціни, культурне життя, обмежені зелені зони.',
      rating: 4.7,
      status: language === 'en' ? 'Excellent' : 'Відмінно',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      rank: 2,
      name: language === 'en' ? 'Frankivskyi' : 'Франківський',
      features: language === 'en' ? 
        'Many parks, well-developed infrastructure, prestigious area, higher prices.' :
        'Багато парків, добре розвинена інфраструктура, престижний район, вищі ціни.',
      rating: 4.5,
      status: language === 'en' ? 'Excellent' : 'Відмінно',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      rank: 3,
      name: language === 'en' ? 'Lychakivskyi' : 'Личаківський',
      features: language === 'en' ? 
        'Green areas, combination of old/new buildings, peaceful neighborhoods.' :
        'Зелені зони, поєднання старої/нової забудови, спокійніші райони.',
      rating: 4.3,
      status: language === 'en' ? 'Good' : 'Добре',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      rank: 4,
      name: language === 'en' ? 'Shevchenkivskyi' : 'Шевченківський',
      features: language === 'en' ? 
        'Accessible real estate, developed social infrastructure, large size.' :
        'Доступна нерухомість, розвинена соціальна інфраструктура, великий розмір.',
      rating: 4.1,
      status: language === 'en' ? 'Good' : 'Добре',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      rank: 5,
      name: language === 'en' ? 'Sykhivskyi' : 'Сихівський',
      features: language === 'en' ? 
        'Largest residential area, budget prices, high population density, distance from center.' :
        'Найбільший спальний район, бюджетні ціни, висока щільність населення, віддаленість від центру.',
      rating: 3.8,
      status: language === 'en' ? 'Good' : 'Добре',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {language === 'en' ? 'District Performance Ranking' : 'Рейтинг районів за ефективністю'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium">
                  {language === 'en' ? 'Rank' : 'Ранг'}
                </th>
                <th className="text-left py-2 px-2 font-medium">
                  {language === 'en' ? 'District Name' : 'Назва району'}
                </th>
                <th className="text-left py-2 px-2 font-medium">
                  {language === 'en' ? 'Features and Criteria' : 'Особливості та критерії'}
                </th>
                <th className="text-center py-2 px-2 font-medium">
                  {language === 'en' ? 'Rating (out of 5)' : 'Рейтинг (з 5)'}
                </th>
                <th className="text-center py-2 px-2 font-medium">
                  {language === 'en' ? 'Status' : 'Статус'}
                </th>
              </tr>
            </thead>
            <tbody>
              {districtData.map((district) => (
                <tr key={district.rank} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-semibold text-lg">
                    {district.rank}
                  </td>
                  <td className="py-3 px-2 font-medium">
                    {district.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 max-w-xs">
                    {district.features}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-lg font-bold text-orange-600">
                      {district.rating}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge className={`text-xs ${district.statusColor}`}>
                      {district.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictRankingSection;
