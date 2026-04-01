// Simplified app params for Supabase-based application
// Base44-specific parameters removed

const isNode = typeof window === 'undefined';

const getEnvValue = (key, defaultValue = null) => {
	if (isNode) {
		return defaultValue;
	}
	return import.meta.env[key] || defaultValue;
};

export const appParams = {
	supabaseUrl: getEnvValue('VITE_SUPABASE_URL'),
	supabaseAnonKey: getEnvValue('VITE_SUPABASE_ANON_KEY'),
	appName: getEnvValue('VITE_APP_NAME', 'النور الطريق'),
	environment: getEnvValue('VITE_ENVIRONMENT', 'production'),
};
