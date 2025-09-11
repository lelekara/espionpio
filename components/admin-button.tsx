import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const AdminButton: React.FC = () => {
    return (
       <Button><Link href="protected/admin/">Aller au Dashboard Admin</Link></Button>
    );
};

export default AdminButton;
