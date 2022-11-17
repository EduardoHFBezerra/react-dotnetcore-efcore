import { useEffect, useState } from 'react';
import './App.css';
import { Button, Modal } from 'react-bootstrap';
import AtividadeForm from './components/AtividadeForm';
import AtividadeLista from './components/AtividadeLista';
import api from './api/atividade';

function App() {
    const [showAtividadeModal, setShowAtividadeModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividade, setAtividade] = useState({id: 0});

    const handleCloseAtividadeModal = () => setShowAtividadeModal(false);
    const handleShowAtividadeModal = () => setShowAtividadeModal(true);

    const handleCloseConfirmModal = () => setShowConfirmModal(false);
    const handleShowConfirmModal = (id) => {
        if (id !== 0 && id !== undefined) {
            const atividade = atividades.filter(atividade => atividade.id === id);
            setAtividade(atividade[0]);
        } else {
            setAtividade({id:0})
        }
        setShowConfirmModal(true);
    };

    const pegaTodasAtividades = async () => {
        const response = await api.get('atividade');
        return response.data;
    }

    const novaAtividade = () => {
        setAtividade({id: 0});
        handleShowAtividadeModal();
    };

    useEffect(() => {
        const getAtividades = async () => {
            const todasAtividades = await pegaTodasAtividades();
            if (todasAtividades) setAtividades(todasAtividades);
        };
        getAtividades();
    }, []);

    const addAtividade = async (ativ) => {
        const response = await api.post('atividade', ativ);
        console.log(response.data);
        setAtividades([...atividades, response.data]);
        handleCloseAtividadeModal();
    };

    const pegarAtividade = (id) => {
        const atividade = atividades.filter(atividade => atividade.id === id);
        setAtividade(atividade[0]);
        handleShowAtividadeModal();
    };

    const cancelarAtividade = () => {
        setAtividade({id: 0});
        handleCloseAtividadeModal();
    };

    const atualizarAtividade = async (ativ) => {
        const response = await api.put(`atividade/${ativ.id}`, ativ);
        const { id } = response.data;
        setAtividades(
            atividades.map(item => item.id === id ? response.data : item)
        );
        setAtividade({id: 0});
        handleCloseAtividadeModal();
    };

    const deletarAtividade = async (id) => {
        if (await api.delete(`atividade/${id}`))
        {
            const atividadesFiltradas = atividades.filter(
                (atividade) => atividade.id !== id
            );
            setAtividades([...atividadesFiltradas])
        }
        handleCloseConfirmModal(0);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-end mt-2 pb-3 border-bottom border-1">
                <h1 className="m-0 p-0">Atividade {atividade.id !== 0 ? atividade.id : ''}</h1>

                <Button variant="outline-primary" onClick={novaAtividade}>
                    <i className="fas fa-plus"></i> Adicionar atividade
                </Button>
            </div>

            <AtividadeLista
                atividades={atividades}
                pegarAtividade={pegarAtividade}
                handleShowConfirmModal={handleShowConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
            />

            <Modal 
                show={showAtividadeModal} 
                onHide={handleCloseAtividadeModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Atividade {atividade.id !== 0 ? atividade.id : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AtividadeForm
                        atividades={atividades}
                        cancelarAtividade={cancelarAtividade}
                        atualizarAtividade={atualizarAtividade}
                        ativSelecionada={atividade}
                        addAtividade={addAtividade}
                    />
                </Modal.Body>
            </Modal>

            <Modal 
                size='sm'
                show={showConfirmModal}
                onHide={handleCloseConfirmModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Exluir atividade {''}
                        {atividade.id !== 0 ? atividade.id : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir a atividade {atividade.id}?
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <button
                        className="btn btn-outline-success me-2"
                        onClick={() => deletarAtividade(atividade.id)}
                    >
                        <i className="fas fa-check me-2"></i>
                        Sim
                    </button>
                    <button 
                        className="btn btn-danger me-2"
                        onClick={() => handleCloseConfirmModal(0)}
                    >
                        <i className="fas fa-times me-2"></i>
                        Não
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default App;
