const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Tenta fazer o login no Supabase
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Erro ao entrar: " + error.message);
    } else {
        // Sucesso! Vai para o Dashboard
        window.location.href = '../dashboard/index.html';
    }
});

// Lógica simples para Cadastro (Signup) se desejar implementar depois
document.getElementById('go-to-signup').onclick = async (e) => {
    e.preventDefault();
    const email = prompt("Digite seu e-mail para cadastro:");
    const password = prompt("Defina uma senha (mínimo 6 caracteres):");

    if (email && password) {
        const { error } = await _supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert("Verifique seu e-mail para confirmar o cadastro!");
    }
};