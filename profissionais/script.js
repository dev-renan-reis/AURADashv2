// profissionais/script.js

let idEdicao = null; // Variável para controlar se estamos editando ou criando

async function init() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = '../login/index.html';
        return;
    }
    carregarProfissionais();
}

// 1. Cadastrar ou Atualizar Profissional
document.getElementById('form-profissional').onsubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await _supabase.auth.getUser();
    const dias = Array.from(document.querySelectorAll('#dias-atendimento input:checked'))
        .map(cb => cb.value);

    const dadosProfissional = {
        nome: document.getElementById('nome').value,
        documento: document.getElementById('cpf').value,
        especialidade: document.getElementById('cargo').value,
        tipo_contrato: document.getElementById('tipo_contrato').value,
        dias_atendimento: dias,
        user_id: user.id
    };

    if (idEdicao) {
        // MODO EDIÇÃO (UPDATE)
        const { error } = await _supabase
            .from('profissionais')
            .update(dadosProfissional)
            .eq('id', idEdicao);

        if (error) alert("Erro ao atualizar: " + error.message);
        else {
            alert("Profissional atualizado!");
            resetarFormulario();
        }
    } else {
        // MODO CADASTRO (INSERT)
        const { error } = await _supabase.from('profissionais').insert([dadosProfissional]);
        if (error) alert("Erro ao cadastrar: " + error.message);
        else {
            alert("Cadastrado com sucesso!");
            resetarFormulario();
        }
    }
    carregarProfissionais();
};

// 2. Preparar para Editar (Preenche o formulário)
window.prepararEdicao = async (id) => {
    const { data, error } = await _supabase
        .from('profissionais')
        .select('*')
        .eq('id', id)
        .single();

    if (data) {
        idEdicao = data.id;
        document.getElementById('nome').value = data.nome;
        document.getElementById('cpf').value = data.documento;
        document.getElementById('cargo').value = data.especialidade;
        document.getElementById('tipo_contrato').value = data.tipo_contrato;

        // Limpa e marca os checkboxes dos dias
        document.querySelectorAll('#dias-atendimento input').forEach(cb => {
            cb.checked = data.dias_atendimento.includes(cb.value);
        });

        // Muda o texto do botão
        document.querySelector('#form-profissional button').innerText = "Salvar Alterações";
    }
};

// 3. Resetar formulário após ação
function resetarFormulario() {
    idEdicao = null;
    document.getElementById('form-profissional').reset();
    document.querySelector('#form-profissional button').innerText = "Cadastrar Profissional";
}

// 4. Listar Profissionais (Adicionado botão de editar na tabela)
async function carregarProfissionais() {
    const { data, error } = await _supabase.from('profissionais').select('*');
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = '';

    if (!error) {
        data.forEach(p => {
            corpoTabela.innerHTML += `
                <tr>
                    <td>${p.nome}</td>
                    <td>${p.especialidade}</td>
                    <td>${p.tipo_contrato}</td>
                    <td>${p.dias_atendimento ? p.dias_atendimento.join(', ') : ''}</td>
                    <td>
                        <button onclick="prepararEdicao('${p.id}')">Editar</button>
                        <button onclick="excluirProfissional('${p.id}')">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }
}

// 5. Excluir Profissional
window.excluirProfissional = async (id) => {
    if (confirm("Deseja realmente excluir?")) {
        const { error } = await _supabase.from('profissionais').delete().eq('id', id);
        if (error) alert("Erro: " + error.message);
        else carregarProfissionais();
    }
};

init();