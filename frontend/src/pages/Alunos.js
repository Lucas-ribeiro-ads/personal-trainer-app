import { useEffect, useState } from 'react';
import { alunoService } from '../services/api';

export default function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        carregarAlunos();
    }, []);

    async function carregarAlunos() {
        const res = await alunoService.getAll();
        setAlunos(res.data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (editingId) {
            await alunoService.update(editingId, form);
            setEditingId(null);
        } else {
            await alunoService.create(form);
        }
        setForm({ nome: '', email: '', telefone: '' });
        carregarAlunos();
    }

    function preencherEdicao(aluno) {
        setForm({ nome: aluno.nome, email: aluno.email, telefone: aluno.telefone || '' });
        setEditingId(aluno.id);
    }

    async function excluir(id) {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            await alunoService.delete(id);
            carregarAlunos();
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Alunos</h1>

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
                    placeholder="Nome completo"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required
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
                    placeholder="E-mail"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
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
                    placeholder="Telefone"
                    value={form.telefone}
                    onChange={e => setForm({ ...form, telefone: e.target.value })}
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        flex: '1.2',
                        minWidth: '140px'
                    }}
                />
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
                        onClick={() => { setEditingId(null); setForm({ nome: '', email: '', telefone: '' }); }}
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
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>Nome</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>E-mail</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #c8e6c9' }}>Telefone</th>
                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #c8e6c9' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}><strong>{a.nome}</strong></td>
                            <td style={{ padding: '1rem', color: '#555' }}>{a.email}</td>
                            <td style={{ padding: '1rem', color: '#555' }}>{a.telefone || '-'}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => preencherEdicao(a)}
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
                                    onClick={() => excluir(a.id)}
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