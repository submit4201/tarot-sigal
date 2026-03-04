import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import GrimoireConfig from '../components/orrery/GrimoireConfig';
import { motion } from 'framer-motion';


const GrimoireHubPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialTab = searchParams.get('tab') as 'identity' | 'world' | 'technical' | null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-screen bg-black"
        >
            <GrimoireConfig
                onClose={() => navigate('/daily')}

                initialTab={initialTab || 'identity'}
            />
        </motion.div>
    );
};

export default GrimoireHubPage;
