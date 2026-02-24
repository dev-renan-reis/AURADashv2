// Inicializa os ícones do Lucide
lucide.createIcons();

// Verifica se o usuário está logado
async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser();

    if (!user) {
        window.location.href = '../login/index.html';
    } else {
        document.getElementById('user-name').innerText = user.email.split('@')[0];
    }
}

// Botão de Logout
document.getElementById('btn-logout').addEventListener('click', async (e) => {
    e.preventDefault();
    await _supabase.auth.signOut();
    window.location.href = '../login/index.html';
});

// Data Atual
document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-br');

checkUser();// dashboard/script.js

// 1. Inicializa os ícones assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    checkUser();
    updateDate();
});

// 2. Verifica autenticação no Supabase
async function checkUser() {
    const { data: { session }, error } = await _supabase.auth.getSession();
    
    if (error || !session) {
        // Se não houver sessão, volta para o login
        window.location.href = '../login/index.html';
        return;
    }

    // Exibe o e-mail ou nome do usuário
    const userEmail = session.user.email;
    document.getElementById('user-name').innerText = userEmail.split('@')[0];
}

// 3. Função de Logout
document.getElementById('btn-logout').addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await _supabase.auth.signOut();
    if (error) {
        alert("Erro ao sair: " + error.message);
    } else {
        window.location.href = '../login/index.html';
    }
});

// 4. Atualiza a data no topo
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('current-date').innerText = today.toLocaleDateString('pt-br', options);
}