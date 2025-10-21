/**
 * Composant de tableau éditable avec calculs automatiques
 * Support de l'ajout/suppression de lignes et des formules
 */

import React, { useCallback, useMemo } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { TableDefinition, TableRow, ColumnDefinition } from '../types';
import { evaluerFormule, arrondir } from '../utils/calculations';
import { formatNumber, generateId } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TableEditableProps {
  table: TableDefinition;
  onUpdate: (updatedTable: TableDefinition) => void;
  className?: string;
}

export function TableEditable({ table, onUpdate, className = '' }: TableEditableProps) {
  /**
   * Ajoute une nouvelle ligne vide
   */
  const handleAddRow = useCallback(() => {
    const newRow: TableRow = {
      id: generateId(),
      ...table.columns.reduce((acc, col) => {
        acc[col.key] = col.type === 'number' ? 0 : '';
        return acc;
      }, {} as Record<string, any>),
    };

    onUpdate({
      ...table,
      rows: [...table.rows, newRow],
    });
  }, [table, onUpdate]);

  /**
   * Supprime une ligne
   */
  const handleDeleteRow = useCallback(
    (rowId: string) => {
      onUpdate({
        ...table,
        rows: table.rows.filter(row => row.id !== rowId),
      });
    },
    [table, onUpdate]
  );

  /**
   * Met à jour une valeur de cellule
   */
  const handleCellChange = useCallback(
    (rowId: string, columnKey: string, value: any) => {
      const updatedRows = table.rows.map(row => {
        if (row.id !== rowId) return row;

        const updatedRow = { ...row, [columnKey]: value };

        // Recalculer les colonnes calculées
        table.columns.forEach(col => {
          if (col.type === 'calculated' && col.formula) {
            const calculatedValue = evaluerFormule(col.formula, updatedRow as Record<string, number>);
            updatedRow[col.key] = arrondir(calculatedValue);
          }
        });

        return updatedRow;
      });

      onUpdate({
        ...table,
        rows: updatedRows,
      });
    },
    [table, onUpdate]
  );

  /**
   * Recalcule toutes les colonnes calculées
   */
  const handleRecalculateAll = useCallback(() => {
    const updatedRows = table.rows.map(row => {
      const updatedRow = { ...row };

      table.columns.forEach(col => {
        if (col.type === 'calculated' && col.formula) {
          const calculatedValue = evaluerFormule(col.formula, updatedRow as Record<string, number>);
          updatedRow[col.key] = arrondir(calculatedValue);
        }
      });

      return updatedRow;
    });

    onUpdate({
      ...table,
      rows: updatedRows,
    });
  }, [table, onUpdate]);

  /**
   * Rendu d'une cellule selon son type
   */
  const renderCell = useCallback(
    (row: TableRow, column: ColumnDefinition) => {
      const value = row[column.key];

      // Colonne calculée (lecture seule)
      if (column.type === 'calculated') {
        return (
          <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
            <span className="font-semibold text-[hsl(215,50%,15%)]">
              {formatNumber(Number(value) || 0)}
            </span>
            <Calculator className="h-3 w-3 text-[hsl(215,50%,15%)]" />
          </div>
        );
      }

      // Colonne de type select
      if (column.type === 'select' && column.options) {
        return (
          <Select
            value={String(value)}
            onValueChange={(newValue) => handleCellChange(row.id, column.key, newValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {column.options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      // Colonne numérique
      if (column.type === 'number') {
        return (
          <Input
            type="number"
            value={Number(value) || ''}
            onChange={(e) => handleCellChange(row.id, column.key, parseFloat(e.target.value) || 0)}
            className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
            step="0.01"
            min="0"
          />
        );
      }

      // Colonne texte
      return (
        <Input
          type="text"
          value={String(value)}
          onChange={(e) => handleCellChange(row.id, column.key, e.target.value)}
          className="w-full border-gray-200 focus:border-[hsl(215,50%,15%)] focus:ring-[hsl(215,50%,15%)]"
        />
      );
    },
    [handleCellChange]
  );

  /**
   * Calcul des totaux par colonne (si applicable)
   */
  const columnTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    table.columns.forEach(col => {
      if (col.type === 'number' || col.type === 'calculated') {
        totals[col.key] = table.rows.reduce((sum, row) => {
          return sum + (Number(row[col.key]) || 0);
        }, 0);
      }
    });

    return totals;
  }, [table]);

  return (
    <Card className={`w-full bg-white border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900">{table.title}</CardTitle>
            <CardDescription className="text-gray-600">{table.rows.length} ligne(s)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateAll}
              title="Recalculer toutes les valeurs"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Calculator className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddRow}
              className="bg-[hsl(215,50%,15%)] hover:bg-[hsl(215,50%,20%)] text-black"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {table.columns.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    style={{ minWidth: col.width || '150px' }}
                  >
                    {col.label}
                    {col.unit && (
                      <span className="ml-1 text-xs text-gray-500 font-normal normal-case">
                        ({col.unit})
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {table.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.columns.length + 1}
                    className="px-4 py-8 text-center text-black-500"
                  >
                    Aucune ligne. Cliquez sur "Ajouter" pour commencer.
                  </td>
                </tr>
              ) : (
                table.rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {table.columns.map(col => (
                      <td key={col.key} className="px-4 py-3">
                        {renderCell(row, col)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Ligne de totaux */}
            {table.rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-blue-50 font-bold">
                  {table.columns.map((col, index) => (
                    <td key={col.key} className="px-4 py-4 text-sm">
                      {index === 0 ? (
                        <span className="uppercase text-gray-900">TOTAL</span>
                      ) : col.type === 'number' || col.type === 'calculated' ? (
                        <span className="text-[hsl(215,50%,15%)] font-bold">
                          {formatNumber(columnTotals[col.key] || 0)}
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
