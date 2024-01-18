import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import { Input } from '@/components/UI/Input';
import AddressInputForm from './AddressInputForm';

export function DialogDemo() {
  return (
    <Dialog open>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="p-8 sm:max-w-3xl">
        <AddressInputForm />
      </DialogContent>
    </Dialog>
  );
}
