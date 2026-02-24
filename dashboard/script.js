/**
 * AURADash V2 - Dashboard Script
 * Foco: Gestão de Studios de Estética e Salões
 */

// 1. Inicialização assim que o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    // Renderiza os ícones do Lucide
    lucide.createIcons();

    // Verifica se o usuário está logado
    const user = await checkAuth();
    if (!user) return;

    // Carrega informações da interface
    setWelcomeMessage(user);
    updateDate();

    // Carrega os dados dos cards (Stats)
    loadDashboardStats();
}

// 2. Sistema de Autenticação e Proteção de Rota
async function checkAuth() {
    const { data: { session }, error } = await _supabase.auth.getSession();

    if (error || !session) {
        window.location.href = '../login/index.html';
        return null;
    }
    return session.user;
}

// 3. Funções de Interface (UI)
function setWelcomeMessage(user) {
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
        // Pega o nome antes do @ do email para um boas-vindas amigável
        const userName = user.email.split('@')[0];
        nameElement.innerText = userName.charAt(0).toUpperCase() + userName.slice(1);
    }
}

function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        dateElement.innerText = new Date().toLocaleDateString('pt-br', options);
    }
}

// 4. Carregamento de Dados do Supabase (O Coração do Dashboard)
async function loadDashboardStats() {
    try {
        // Buscamos os dados das tabelas que criamos no SQL

        // Exemplo: Contagem de Agendamentos para Hoje
        const today = new Date().toISOString().split('T')[0];
        const { count: agendamentosHoje, error: err1 } = await _supabase
            .from('agenda')
            .select('*', { count: 'exact', head: true })
            .eq('data_hora', today);

        // Exemplo: Busca de Profissionais ativos
        const { count: totalProfissionais, error: err2 } = await _supabase
            .from('profissionais')
            .select('*', { count: 'exact', head: true });

        // Atualiza os números na tela (se os elementos existirem)
        // Nota: No seu HTML atual, estamos usando classes ou IDs genéricos
        const stats = document.querySelectorAll('.stat');
        if (stats.length >= 3) {
            stats[0].innerText = agendamentosHoje || 0;
            stats[1].innerText = `R$ 0,00`; // Placeholder para finanças
            stats[2].innerText = totalProfissionais || 0;
        }

    } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
    }
}

// 5. Evento de Logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        const { error } = await _supabase.auth.signOut();
        if (error) {
            alert("Erro ao sair: " + error.message);
        } else {
            window.location.href = '../login/index.html';
        }
    });
}