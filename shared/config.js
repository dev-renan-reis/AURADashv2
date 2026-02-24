// Configurações globais do AURADash V2
const CONFIG = {
    SUPABASE_URL: 'https://cabbrpcaxnynmfidyzzq.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYmJycGNheG55bm1maWR5enpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTk2MDIsImV4cCI6MjA4NzM3NTYwMn0.OH94pI0R-DPqUByrx25RBg7i5wM3jlJJsmZqxNiWKmQ'
};

// Inicializa o cliente Supabase globalmente
const _supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);