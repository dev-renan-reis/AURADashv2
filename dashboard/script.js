// dashboard/script.js

async function inicializarDashboard() {
    // 1. Verifica se existe sessão ativa
    const { data: { session } } = await _supabase.auth.getSession();

    if (!session) {
        // Se não está logado, volta pro login imediatamente
        window.location.href = '../login/index.html';
        return;
    }

    // 2. Mostra quem está logado
    document.getElementById('user-email').innerText = session.user.email;

    // 3. Busca contagem de Profissionais no Supabase
    const { count, error } = await _supabase
        .from('profissionais')
        .select('*', { count: 'exact', head: true });

    if (!error) {
        document.getElementById('total-profissionais').innerText = count;
    }

    // 4. Configura o botão de logout
    document.getElementById('btn-logout').onclick = async () => {
        await _supabase.auth.signOut();
        window.location.href = '../login/index.html';
    };
}

inicializarDashboard();