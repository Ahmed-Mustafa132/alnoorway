import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { action, userId, role, isActive, email } = await req.json();

        // Note: In a real Base44 app, we might not have direct access to SUPABASE_SERVICE_ROLE_KEY
        // We will try to use base44.asServiceRole if possible, or fallback to User entity updates
        // For this demo, we assume we can update the User entity which mirrors auth
        
        // Verify admin
        const user = await base44.auth.me();
        const { data: currentUserProfile } = await base44.entities.User.filter({email: user.email});
        const isAdmin = currentUserProfile?.[0]?.role === 'admin';
        
        if (!isAdmin) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (action === "update_role") {
            // Update User entity
            await base44.entities.User.update(userId, { role });
            return Response.json({ success: true, message: "Role updated" });
        }
        
        if (action === "toggle_active") {
            await base44.entities.User.update(userId, { is_active: isActive });
            return Response.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}` });
        }

        if (action === "reset_password") {
             // Simulating password reset since we might not have auth.admin access
             // In a real scenario with service key:
             // const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
             // await supabaseAdmin.auth.admin.sendPasswordResetEmail(email);
             
             return Response.json({ success: true, message: "Password reset instructions sent (Simulated)" });
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});