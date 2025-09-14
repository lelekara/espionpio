import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ShieldUser } from 'lucide-react';

const AdminButton: React.FC = () => {
    return (
       <Button size="lg" className='flex items-center gap-2 text-lg font-semibold'>
        <ShieldUser className="w-5 h-5" />
        <Link href="protected/admin/">Aller au Dashboard Admin</Link>
        </Button>
    );
};

export default AdminButton;
