
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Alunos from './pages/Alunos';
import Treinos from './pages/Treinos';
import Mensalidades from './pages/Mensalidades';
import { alunoService, treinoService, mensalidadeService } from './services/api';

function Dashboard() {
  const [stats, setStats] = useState({ alunos: 0, treinos: 0, mensalidades: 0 });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [resAlunos, resTreinos, resMensal] = await Promise.all([
        alunoService.getAll(),
        treinoService.getAll(),
        mensalidadeService.getAll()
      ]);

      const mensalidades = resMensal.data;

      setStats({
        alunos: resAlunos.data.length,
        treinos: resTreinos.data.length,
        mensalidades: mensalidades.length
      });
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Bem-vindo ao Personal Tracker</h1>
      <p style={{ marginBottom: '3rem', color: '#666' }}>Feito para gerenciar a rotina dos seus alunos</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '10px' }}>
          <h3>Alunos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.alunos}</p>
        </div>

        <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '10px' }}>
          <h3>Treinos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.treinos}</p>
        </div>

        <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '10px' }}>
          <h3>Mensalidades</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.mensalidades}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#e8f5e9', textAlign: 'center' }}>
        <Link to="/" style={{ margin: '0 1rem', textDecoration: 'none', color: '#333' }}>Início</Link>
        <Link to="/alunos" style={{ margin: '0 1rem', textDecoration: 'none', color: '#333' }}>Alunos</Link>
        <Link to="/treinos" style={{ margin: '0 1rem', textDecoration: 'none', color: '#333' }}>Treinos</Link>
        <Link to="/mensalidades" style={{ margin: '0 1rem', textDecoration: 'none', color: '#333' }}>Mensalidades</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/treinos" element={<Treinos />} />
        <Route path="/mensalidades" element={<Mensalidades />} />
      </Routes>
    </BrowserRouter>
  );
}
