import React, { useState } from 'react';
import { CheckSquare, Trash2, Send, Archive, Download, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkAction: (action: string, ids: string[]) => void;
  totalItems: number;
}

export function BulkActions({
  selectedIds,
  onClearSelection,
  onBulkAction,
  totalItems,
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) {
      toast.error('No items selected');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onBulkAction(action, selectedIds);

      const actionMessages: Record<string, string> = {
        delete: 'deleted',
        archive: 'archived',
        assign: 'assigned',
        export: 'exported',
        cancel: 'cancelled',
      };

      toast.success(`Successfully ${actionMessages[action]} ${selectedIds.length} items`);
      onClearSelection();
    } catch (error) {
      toast.error('Action failed', {
        description: 'Please try again or contact support.',
      });
    }

    setIsProcessing(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setShowDeleteDialog(false);
    await handleBulkAction('delete');
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-gray-900 border-2 border-purple-500/30 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[500px]">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">
                {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {totalItems - selectedIds.length} remaining
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleBulkAction('export')}
              disabled={isProcessing}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isProcessing}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleBulkAction('assign')}>
                  <Send className="w-4 h-4 mr-2" />
                  Assign to Driver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('cancel')}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Jobs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={onClearSelection} variant="ghost" size="sm">
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Checkbox component for selecting all items
export function SelectAllCheckbox({
  checked,
  onCheckedChange,
  indeterminate,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={indeterminate ? 'data-[state=checked]:bg-purple-600' : ''}
      />
      {indeterminate && (
        <Badge variant="secondary" className="text-xs">
          Some selected
        </Badge>
      )}
    </div>
  );
}
