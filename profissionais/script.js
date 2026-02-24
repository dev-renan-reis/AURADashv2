// profissionais/script.js

async function init() {
    const { data: { session } } = await _supabase.auth.getSession();

    // 1. Bloqueio de Segurança
    if (!session) {
        window.location.href = '../login/index.html';
        return;
    }

    // Nota: Em um sistema real, checaríamos se o session.user.id está em uma tabela 'administradores'.
    // Por enquanto, o dono do login que cadastrar será o ADM desses registros.

    carregarProfissionais();
}

// 2. Cadastrar Profissional
document.getElementById('form-profissional').onsubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await _supabase.auth.getUser();

    // Pega os dias selecionados
    const dias = Array.from(document.querySelectorAll('#dias-atendimento input:checked'))
        .map(cb => cb.value);

    const novoProfissional = {
        nome: document.getElementById('nome').value,
        documento: document.getElementById('cpf').value,
        especialidade: document.getElementById('cargo').value,
        tipo_contrato: document.getElementById('tipo_contrato').value,
        dias_atendimento: dias, // Salvando como array
        user_id: user.id // Vincula ao ADM logado
    };

    const { error } = await _supabase.from('profissionais').insert([novoProfissional]);

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
    } else {
        alert("Profissional cadastrado com sucesso!");
        document.getElementById('form-profissional').reset();
        carregarProfissionais();
    }
};

// 3. Listar Profissionais
async function carregarProfissionais() {
    const { data, error } = await _supabase
        .from('profissionais')
        .select('*');

    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = '';

    if (!error) {
        data.forEach(p => {
            corpoTabela.innerHTML += `
                <tr>
                    <td>${p.nome}</td>
                    <td>${p.especialidade}</td>
                    <td>${p.tipo_contrato}</td>
                    <td>${p.dias_atendimento.join(', ')}</td>
                    <td>
                        <button onclick="excluirProfissional('${p.id}')">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }
}

// 4. Excluir Profissional (Funcionalidade ADM)
window.excluirProfissional = async (id) => {
    if (confirm("Deseja realmente excluir este profissional?")) {
        const { error } = await _supabase.from('profissionais').delete().eq('id', id);
        if (error) alert("Erro ao excluir: " + error.message);
        else carregarProfissionais();
    }
};

init();