import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const email = "admin@glowspa.com";
    const password = "Admin123!";

    // Check if admin already exists
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users.find((u: any) => u.email === email);
    
    if (existing) {
      // Ensure role exists
      const { data: roleExists } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", existing.id).single();
      if (!roleExists) {
        await supabaseAdmin.from("user_roles").insert({ user_id: existing.id, role: "admin" });
      }
      return new Response(JSON.stringify({ message: "Admin already exists", user_id: existing.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });

    if (error) throw error;

    // Update profile and assign role
    await supabaseAdmin.from("profiles").update({ full_name: "Admin" }).eq("user_id", newUser.user!.id);
    await supabaseAdmin.from("user_roles").insert({ user_id: newUser.user!.id, role: "admin" });

    return new Response(JSON.stringify({ message: "Admin created", user_id: newUser.user!.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
