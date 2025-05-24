
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';
import AppealStatusBadges from './AppealStatusBadges';

interface Appeal {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  category: string;
  submitted_by: string;
  created_at: string;
  updated_at: string;
}

interface AppealsTableProps {
  appeals: Appeal[];
  onViewAppeal: (appeal: Appeal) => void;
  onResponseAppeal: (appeal: Appeal) => void;
}

const AppealsTable = ({ appeals, onViewAppeal, onResponseAppeal }: AppealsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'technical': 'Технічне',
      'administrative': 'Адміністративне',
      'complaint': 'Скарга',
      'suggestion': 'Пропозиція',
      'other': 'Інше'
    };
    return labels[category] || category;
  };

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Дата подання</TableHead>
            <TableHead>Заявник</TableHead>
            <TableHead>Категорія</TableHead>
            <TableHead>Тема звернення</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="w-[150px]">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appeals.map((appeal) => (
            <TableRow key={appeal.id} className="hover:bg-gray-50">
              <TableCell className="font-mono text-sm">
                #{appeal.id.slice(-8)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(appeal.created_at)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{appeal.submitted_by}</p>
                  <p className="text-sm text-gray-500">ID: {appeal.id.slice(0, 8)}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getCategoryLabel(appeal.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="font-medium truncate">{appeal.title}</p>
                  <p className="text-sm text-gray-500 truncate">{appeal.content}</p>
                </div>
              </TableCell>
              <TableCell>
                <AppealStatusBadges status={appeal.status} priority={appeal.priority} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewAppeal(appeal)}
                    className="p-1 h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResponseAppeal(appeal)}
                    className="p-1 h-8 w-8"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {appeals.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Звернення не знайдено
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppealsTable;
