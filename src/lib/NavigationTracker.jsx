import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '@/components/api/supabaseClient';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    // Post navigation changes to parent window
    useEffect(() => {
        window.parent?.postMessage({
            type: "app_changed_url",
            url: window.location.href
        }, '*');
    }, [location]);

    // Log user activity when navigating to a page
    useEffect(() => {
        const logPageView = async () => {
            // Extract page name from pathname
            const pathname = location.pathname;
            let pageName;
            
            if (pathname === '/' || pathname === '') {
                pageName = mainPageKey;
            } else {
                // Remove leading slash and get the first segment
                const pathSegment = pathname.replace(/^\//, '').split('/')[0];
                
                // Try case-insensitive lookup in Pages config
                const pageKeys = Object.keys(Pages);
                const matchedKey = pageKeys.find(
                    key => key.toLowerCase() === pathSegment.toLowerCase()
                );
                
                pageName = matchedKey || null;
            }

            if (isAuthenticated && user && pageName) {
                try {
                    // Log page view to Supabase (optional - create a page_views table)
                    await supabase.from('PageView').insert({
                        user_id: user.id,
                        user_email: user.email,
                        page_name: pageName,
                        path: location.pathname,
                        search: location.search,
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    // Silently fail - logging shouldn't break the app
                    console.log('Page view logging failed:', error);
                }
            }
        };

        logPageView();
    }, [location, isAuthenticated, user, Pages, mainPageKey]);

    return null;
}
