import { useEffect, useState } from 'react';
import { treinoService, alunoService } from '../services/api';

export default function Treinos() {
    const [treinos, setTreinos] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        data: '',
        alunoId: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        const [resTreinos, resAlunos] = await Promise.all([
            treinoService.getAll(),
            alunoService.getAll()
        ]);
        setTreinos(resTreinos.data);
        setAlunos(resAlunos.data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const dados = {
            ...form,
            alunoId: Number(form.alunoId),
            data: new Date(form.data).toISOString()
        };

        if (editingId) {
            await treinoService.update(editingId, dados);
            setEditingId(null);
        } else {
            await treinoService.create(dados);
        }

        setForm({ nome: '', descricao: '', data: '', alunoId: '' });
        carregarDados();
    }

    function preencherEdicao(treino) {
        const dataFormatada = new Date(treino.data).toISOString().slice(0, 16);
        setForm({
            nome: treino.nome,
            descricao: treino.descricao || '',
            data: dataFormatada,
            alunoId: treino.alunoId
        });
        setEditingId(treino.id);
    }

    async function excluir(id) {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            await treinoService.delete(id);
            carregarDados();
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Treinos</h1>

            <form onSubmit={handleSubmit} style={{
                padding: '1.5rem',
                background: '#e8f5e9',
                borderRadius: '10px',
                marginBottom: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center'
            }}>
                <input
                    placeholder="Nome do treino"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        flex: '1.5',
                        minWidth: '150px'
                    }}
                />
                <input
                    placeholder="Descrição"
                    value={form.descricao}
                    onChange={e => setForm({ ...form, descricao: e.target.value })}
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        flex: '2',
                        minWidth: '180px'
                    }}
                />
                <input
                    type="datetime-local"
                    value={form.data}
                    onChange={e => setForm({ ...form, data: e.target.value })}
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem'
                    }}
                />
                <select
                    value={form.alunoId}
                    onChange={e => setForm({ ...form, alunoId: e.target.value })}
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        minWidth: '150px'
                    }}
                >
                    <option value="">Selecione o aluno</option>
                    {alunos.map(a => (<option key={a.id} value={a.id}>{a.nome}</option>))}
                </select>
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#43a047',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    {editingId ? 'Salvar' : 'Cadastrar'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => { setEditingId(null); setForm({ nome: '', descricao: '', data: '', alunoId: '' }); }}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#e0e0e0',
                            color: '#333',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#e8f5e9' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>Treino</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>Aluno</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>Data</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #c8e6c9' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {treinos.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>
                                <strong>{t.nome}</strong>
                                {t.descricao && <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>{t.descricao}</div>}
                            </td>
                            <td style={{ padding: '1rem', color: '#555' }}>{t.aluno?.nome || '-'}</td>
                            <td style={{ padding: '1rem', color: '#555', fontSize: '0.95rem' }}>
                                {new Date(t.data).toLocaleString('pt-BR')}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => preencherEdicao(t)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        background: '#66bb6a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        marginRight: '0.5rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => excluir(t.id)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        background: '#ef5350',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}