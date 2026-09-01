import axios from 'axios';

const api = axios.create({
    baseURL: 'https://personal-trainer-api-ileo.onrender.com/api'
});

export const alunoService = {
    getAll: () => api.get('/alunos'),
    create: (data) => api.post('/alunos', data),
    update: (id, data) => api.put(`/alunos/${id}`, data),
    delete: (id) => api.delete(`/alunos/${id}`)
};

export const treinoService = {
    getAll: () => api.get('/treinos'),
    create: (data) => api.post('/treinos', data),
    update: (id, data) => api.put(`/treinos/${id}`, data),
    delete: (id) => api.delete(`/treinos/${id}`)
};

export const mensalidadeService = {
    getAll: () => api.get('/mensalidades'),
    getByAluno: (alunoId) => api.get(`/alunos/${alunoId}/mensalidades`),
    create: (data) => api.post('/mensalidades', data),
    update: (id, data) => api.put(`/mensalidades/${id}`, data),
    delete: (id) => api.delete(`/mensalidades/${id}`)
};

export default api;