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

checkUser();