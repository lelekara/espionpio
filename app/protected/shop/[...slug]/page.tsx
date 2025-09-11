import React from 'react';

interface ShopPageProps {
    params: { slug?: string[] };
}

const ShopPage: React.FC<ShopPageProps> = ({ params }) => {
    const slugPath = params.slug?.join('/') || 'Accueil';

    return (
        <main>
            <h1>Boutique</h1>
            <p>Chemin : {slugPath}</p>
            <p>Bienvenue sur la page de la boutique.</p>
        </main>
    );
};

export default ShopPage;