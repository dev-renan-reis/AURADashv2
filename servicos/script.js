let idEdicao = null;

async function init() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) { window.location.href = '../login/index.html'; return; }
    carregarServicos();
}

document.getElementById('form-servico').onsubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await _supabase.auth.getUser();

    const dados = {
        nome: document.getElementById('nome-servico').value,
        preco_base: parseFloat(document.getElementById('preco').value),
        duracao_minutos: parseInt(document.getElementById('duracao').value),
        user_id: user.id
    };

    if (idEdicao) {
        const { error } = await _supabase.from('servicos').update(dados).eq('id', idEdicao);
        if (!error) alert("Serviço atualizado!");
    } else {
        const { error } = await _supabase.from('servicos').insert([dados]);
        if (!error) alert("Serviço cadastrado!");
    }

    resetarFormulario();
    carregarServicos();
};

async function carregarServicos() {
    const { data, error } = await _supabase.from('servicos').select('*').order('nome');
    const tabela = document.getElementById('corpo-tabela-servicos');
    tabela.innerHTML = '';

    if (data) {
        data.forEach(s => {
            tabela.innerHTML += `
                <tr>
                    <td>${s.nome}</td>
                    <td>R$ ${s.preco_base.toFixed(2)}</td>
                    <td>${s.duracao_minutos} min</td>
                    <td>
                        <button onclick="prepararEdicao('${s.id}', '${s.nome}', ${s.preco_base}, ${s.duracao_minutos})">Editar</button>
                        <button onclick="excluirServico('${s.id}')">Excluir</button>
                    </td>
                </tr>`;
        });
    }
}

window.prepararEdicao = (id, nome, preco, duracao) => {
    idEdicao = id;
    document.getElementById('nome-servico').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('duracao').value = duracao;
    document.getElementById('btn-salvar').innerText = "Salvar Alterações";
    document.getElementById('btn-cancelar').style.display = "inline";
};

window.excluirServico = async (id) => {
    if (confirm("Excluir este serviço?")) {
        await _supabase.from('servicos').delete().eq('id', id);
        carregarServicos();
    }
};

function resetarFormulario() {
    idEdicao = null;
    document.getElementById('form-servico').reset();
    document.getElementById('btn-salvar').innerText = "Cadastrar Serviço";
    document.getElementById('btn-cancelar').style.display = "none";
}

init();