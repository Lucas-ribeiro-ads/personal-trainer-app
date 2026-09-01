
import { useEffect, useState } from 'react';
import { mensalidadeService, alunoService } from '../services/api';

export default function Mensalidades() {
    const [mensalidades, setMensalidades] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [form, setForm] = useState({
        alunoId: '',
        valor: '',
        dataVenc: '',
        dataPag: '',
        status: 'PENDENTE',
        observacao: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        const [resMensal, resAlunos] = await Promise.all([
            mensalidadeService.getAll(),
            alunoService.getAll()
        ]);
        setMensalidades(resMensal.data);
        setAlunos(resAlunos.data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const dados = {
            ...form,
            alunoId: Number(form.alunoId),
            valor: Number(form.valor),
            dataVenc: new Date(form.dataVenc).toISOString(),
            dataPag: form.dataPag ? new Date(form.dataPag).toISOString() : null
        };

        if (editingId) {
            await mensalidadeService.update(editingId, dados);
            setEditingId(null);
        } else {
            await mensalidadeService.create(dados);
        }

        setForm({
            alunoId: '',
            valor: '',
            dataVenc: '',
            dataPag: '',
            status: 'PENDENTE',
            observacao: ''
        });

        carregarDados();
    }

    function preencherEdicao(m) {
        setForm({
            alunoId: m.alunoId,
            valor: m.valor,
            dataVenc: new Date(m.dataVenc).toISOString().slice(0, 10),
            dataPag: m.dataPag
                ? new Date(m.dataPag).toISOString().slice(0, 10)
                : '',
            status: m.status,
            observacao: m.observacao || ''
        });

        setEditingId(m.id);
    }

    async function excluir(id) {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            await mensalidadeService.delete(id);
            carregarDados();
        }
    }

    function formatarDinheiro(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function corStatus(status) {
        switch (status) {
            case 'PAGO':
                return '#43a047';
            case 'ATRASADO':
                return '#e53935';
            default:
                return '#f57c00';
        }
    }

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
        }}>
            <h1 style={{
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                Mensalidades
            </h1>

            {/* INDICADORES DE MENSALIDADES */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    padding: '1rem 2rem',
                    background: '#e8f5e9',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '150px'
                }}>
                    <strong style={{
                        display: 'block',
                        fontSize: '1.5rem',
                        color: '#43a047'
                    }}>
                        {mensalidades.filter(
                            m => m.status === 'PAGO'
                        ).length}
                    </strong>

                    <span>Pagas</span>
                </div>

                <div style={{
                    padding: '1rem 2rem',
                    background: '#fff3e0',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '150px'
                }}>
                    <strong style={{
                        display: 'block',
                        fontSize: '1.5rem',
                        color: '#f57c00'
                    }}>
                        {mensalidades.filter(
                            m => m.status === 'PENDENTE'
                        ).length}
                    </strong>

                    <span>Pendentes</span>
                </div>

                <div style={{
                    padding: '1rem 2rem',
                    background: '#ffebee',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '150px'
                }}>
                    <strong style={{
                        display: 'block',
                        fontSize: '1.5rem',
                        color: '#e53935'
                    }}>
                        {mensalidades.filter(
                            m => m.status === 'ATRASADO'
                        ).length}
                    </strong>

                    <span>Atrasadas</span>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    padding: '1.5rem',
                    background: '#e8f5e9',
                    borderRadius: '10px',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    alignItems: 'center'
                }}
            >
                <select
                    value={form.alunoId}
                    onChange={e =>
                        setForm({
                            ...form,
                            alunoId: e.target.value
                        })
                    }
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        minWidth: '160px'
                    }}
                >
                    <option value="">Selecione o aluno</option>

                    {alunos.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.nome}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    value={form.valor}
                    onChange={e =>
                        setForm({
                            ...form,
                            valor: e.target.value
                        })
                    }
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        width: '130px'
                    }}
                />

                <input
                    type="date"
                    placeholder="Vencimento"
                    value={form.dataVenc}
                    onChange={e =>
                        setForm({
                            ...form,
                            dataVenc: e.target.value
                        })
                    }
                    required
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem'
                    }}
                />

                <input
                    type="date"
                    placeholder="Pagamento"
                    value={form.dataPag}
                    onChange={e =>
                        setForm({
                            ...form,
                            dataPag: e.target.value
                        })
                    }
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem'
                    }}
                />

                <select
                    value={form.status}
                    onChange={e =>
                        setForm({
                            ...form,
                            status: e.target.value
                        })
                    }
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem'
                    }}
                >
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGO">Pago</option>
                    <option value="ATRASADO">Atrasado</option>
                </select>

                <input
                    placeholder="Observação"
                    value={form.observacao}
                    onChange={e =>
                        setForm({
                            ...form,
                            observacao: e.target.value
                        })
                    }
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        flex: '1',
                        minWidth: '150px'
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
                        onClick={() => {
                            setEditingId(null);

                            setForm({
                                alunoId: '',
                                valor: '',
                                dataVenc: '',
                                dataPag: '',
                                status: 'PENDENTE',
                                observacao: ''
                            });
                        }}
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

            <table style={{
                width: '100%',
                borderCollapse: 'collapse'
            }}>
                <thead>
                    <tr style={{
                        background: '#e8f5e9'
                    }}>
                        <th style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderBottom: '2px solid #c8e6c9'
                        }}>
                            Aluno
                        </th>

                        <th style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderBottom: '2px solid #c8e6c9'
                        }}>
                            Valor
                        </th>

                        <th style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderBottom: '2px solid #c8e6c9'
                        }}>
                            Vencimento
                        </th>

                        <th style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderBottom: '2px solid #c8e6c9'
                        }}>
                            Status
                        </th>

                        <th style={{
                            padding: '1rem',
                            textAlign: 'center',
                            borderBottom: '2px solid #c8e6c9'
                        }}>
                            Ações
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {mensalidades.map(m => (
                        <tr
                            key={m.id}
                            style={{
                                borderBottom: '1px solid #eee'
                            }}
                        >
                            <td style={{
                                padding: '1rem'
                            }}>
                                <strong>
                                    {m.aluno?.nome || '-'}
                                </strong>
                            </td>

                            <td style={{
                                padding: '1rem',
                                color: '#333',
                                fontWeight: '500'
                            }}>
                                {formatarDinheiro(m.valor)}
                            </td>

                            <td style={{
                                padding: '1rem',
                                color: '#555'
                            }}>
                                {new Date(
                                    m.dataVenc
                                ).toLocaleDateString('pt-BR')}
                            </td>

                            <td style={{
                                padding: '1rem'
                            }}>
                                <span style={{
                                    background: corStatus(m.status),
                                    color: '#fff',
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    {m.status}
                                </span>
                            </td>

                            <td style={{
                                padding: '1rem',
                                textAlign: 'center'
                            }}>
                                <button
                                    onClick={() =>
                                        preencherEdicao(m)
                                    }
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
                                    onClick={() =>
                                        excluir(m.id)
                                    }
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
