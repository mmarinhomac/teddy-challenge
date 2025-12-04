import { Button } from '@/shadcn/components/button';
import { Dialog, DialogContent, DialogTitle } from '@/shadcn/components/dialog';

export const DialogConfirmation = ({
  title,
  message,
  actionMessage,
  action,
  isOpen,
  onOpenChange,
  destructive = true,
}: {
  title: string;
  message: string;
  actionMessage: string;
  action: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  destructive?: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] py-8">
        <DialogTitle>{title}</DialogTitle>

        <div className="mt-4">
          <p>{message}</p>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            className={
              destructive
                ? ''
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-600'
            }
            onClick={action}
          >
            {actionMessage}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
