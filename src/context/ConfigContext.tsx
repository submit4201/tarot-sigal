import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the hierarchical JSON structure for preferences
export interface GridpunkConfig {
    world: {
        aiVerbosity: 'minimal' | 'balanced' | 'verbose';
        narrativeTone: 'mystic' | 'clinical' | 'cyberpunk';
        theme: 'void' | 'neon' | 'monochrome';
        dynamicBackgrounds: boolean;
    };
    technical: {
        apiGateway: string;
        enableTelemetry: boolean;
        debugMode: boolean;
        dataSyncInterval: number;
        apiKeys: {
            llmApiKey: string;
            syncApiKey: string;
        };
    };
}

const defaultConfig: GridpunkConfig = {
    world: {
        aiVerbosity: 'balanced',
        narrativeTone: 'mystic',
        theme: 'void',
        dynamicBackgrounds: true,
    },
    technical: {
        apiGateway: 'https://api.gridpunk.net/v1',
        enableTelemetry: true,
        debugMode: false,
        dataSyncInterval: 3600,
        apiKeys: {
            llmApiKey: '',
            syncApiKey: '',
        }
    }
};

interface ConfigContextType {
    config: GridpunkConfig;
    updateWorldConfig: (updates: Partial<GridpunkConfig['world']>) => void;
    updateTechnicalConfig: (updates: Partial<GridpunkConfig['technical']>) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<GridpunkConfig>(() => {
        const saved = localStorage.getItem('gridpunk_config');
        if (saved) {
            try {
                // Perform a deep merge-ish to assure all keys exist if schema changes
                const parsed = JSON.parse(saved);
                return {
                    world: { ...defaultConfig.world, ...(parsed.world || {}) },
                    technical: { ...defaultConfig.technical, ...(parsed.technical || {}) }
                };
            } catch (e) {
                console.error('Failed to parse config:', e);
            }
        }
        return defaultConfig;
    });

    useEffect(() => {
        localStorage.setItem('gridpunk_config', JSON.stringify(config));
    }, [config]);

    const updateWorldConfig = (updates: Partial<GridpunkConfig['world']>) => {
        setConfig(prev => ({
            ...prev,
            world: { ...prev.world, ...updates }
        }));
    };

    const updateTechnicalConfig = (updates: Partial<GridpunkConfig['technical']>) => {
        setConfig(prev => ({
            ...prev,
            technical: { ...prev.technical, ...updates }
        }));
    };

    const resetConfig = () => setConfig(defaultConfig);

    return (
        <ConfigContext.Provider value={{ config, updateWorldConfig, updateTechnicalConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
