const { useState, useEffect, useRef } = React;

// API Service
const API = {
    async getNotebook(id) {
        const response = await fetch(`/api/notebooks/${id}`);
        return response.json();
    },
    
    async updateNotebook(id, data) {
        const response = await fetch(`/api/notebooks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async addColumn(notebookId, name) {
        const response = await fetch(`/api/notebooks/${notebookId}/columns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        return response.json();
    },
    
    async updateColumn(notebookId, columnId, data) {
        const response = await fetch(`/api/notebooks/${notebookId}/columns/${columnId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async deleteColumn(notebookId, columnId) {
        const response = await fetch(`/api/notebooks/${notebookId}/columns/${columnId}`, {
            method: 'DELETE'
        });
        return response.json();
    },
    
    async addRow(notebookId) {
        const response = await fetch(`/api/notebooks/${notebookId}/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    },
    
    async updateRow(notebookId, rowId, data) {
        const response = await fetch(`/api/notebooks/${notebookId}/rows/${rowId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    async deleteRow(notebookId, rowId) {
        const response = await fetch(`/api/notebooks/${notebookId}/rows/${rowId}`, {
            method: 'DELETE'
        });
        return response.json();
    },
    
    async updateCell(notebookId, rowId, columnId, content) {
        const response = await fetch(`/api/notebooks/${notebookId}/cells/${rowId}/${columnId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        return response.json();
    },
    
    async fillColumn(notebookId, columnId, prompt) {
        const response = await fetch(`/api/notebooks/${notebookId}/ai/fill-column`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columnId, prompt })
        });
        return response.json();
    },
    
    async generateColumn(notebookId, prompt) {
        const response = await fetch(`/api/notebooks/${notebookId}/ai/generate-column`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        return response.json();
    },
    
    async compareColumns(notebookId, columnIds) {
        const response = await fetch(`/api/notebooks/${notebookId}/ai/compare-columns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columnIds })
        });
        return response.json();
    }
};

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

// Context Menu Component
function ContextMenu({ x, y, items, onClose }) {
    const menuRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    
    return (
        <div 
            ref={menuRef}
            className="context-menu" 
            style={{ left: x, top: y }}
        >
            {items.map((item, index) => (
                item.divider ? (
                    <div key={index} className="context-menu-divider" />
                ) : (
                    <div 
                        key={index}
                        className={`context-menu-item ${item.danger ? 'danger' : ''}`}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        {item.label}
                    </div>
                )
            ))}
        </div>
    );
}

// Table View Component
function TableView({ notebook, onUpdate }) {
    const [contextMenu, setContextMenu] = useState(null);
    const [editingColumn, setEditingColumn] = useState(null);
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [draggedRow, setDraggedRow] = useState(null);
    
    const handleColumnRightClick = (e, column) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            items: [
                {
                    icon: 'fa-edit',
                    label: 'Rename Column',
                    onClick: () => setEditingColumn(column.id)
                },
                {
                    icon: 'fa-plus',
                    label: 'Insert Column Left',
                    onClick: () => handleInsertColumn(column, 'left')
                },
                {
                    icon: 'fa-plus',
                    label: 'Insert Column Right',
                    onClick: () => handleInsertColumn(column, 'right')
                },
                { divider: true },
                {
                    icon: 'fa-robot',
                    label: 'Fill Column with AI...',
                    onClick: () => handleFillColumnWithAI(column)
                },
                { divider: true },
                {
                    icon: 'fa-trash',
                    label: 'Delete Column',
                    danger: true,
                    onClick: () => handleDeleteColumn(column)
                }
            ]
        });
    };
    
    const handleInsertColumn = async (targetColumn, position) => {
        const newColumn = await API.addColumn(notebook.id, `New Column`);
        const updatedNotebook = await API.getNotebook(notebook.id);
        onUpdate(updatedNotebook);
    };
    
    const handleDeleteColumn = async (column) => {
        if (confirm(`Delete column "${column.name}"? This will remove all data in this column.`)) {
            await API.deleteColumn(notebook.id, column.id);
            const updatedNotebook = await API.getNotebook(notebook.id);
            onUpdate(updatedNotebook);
        }
    };
    
    const handleFillColumnWithAI = (column) => {
        const prompt = window.prompt(`Enter a prompt to fill "${column.name}" column:`);
        if (prompt) {
            API.fillColumn(notebook.id, column.id, prompt).then(() => {
                API.getNotebook(notebook.id).then(onUpdate);
            });
        }
    };
    
    const handleCellChange = async (rowId, columnId, content) => {
        await API.updateCell(notebook.id, rowId, columnId, content);
        const updatedNotebook = await API.getNotebook(notebook.id);
        onUpdate(updatedNotebook);
    };
    
    const handleDeleteRow = async (rowId) => {
        if (confirm('Delete this row?')) {
            await API.deleteRow(notebook.id, rowId);
            const updatedNotebook = await API.getNotebook(notebook.id);
            onUpdate(updatedNotebook);
        }
    };
    
    const handleColumnNameChange = async (columnId, newName) => {
        await API.updateColumn(notebook.id, columnId, { name: newName });
        const updatedNotebook = await API.getNotebook(notebook.id);
        onUpdate(updatedNotebook);
        setEditingColumn(null);
    };
    
    return (
        <div className="table-view">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>#</th>
                            {notebook.columns.filter(col => col.visible).map(column => (
                                <th 
                                    key={column.id}
                                    onContextMenu={(e) => handleColumnRightClick(e, column)}
                                    draggable
                                    onDragStart={() => setDraggedColumn(column)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => {
                                        // Handle column reorder
                                        setDraggedColumn(null);
                                    }}
                                >
                                    <div className="column-header">
                                        {editingColumn === column.id ? (
                                            <input
                                                type="text"
                                                defaultValue={column.name}
                                                autoFocus
                                                onBlur={(e) => handleColumnNameChange(column.id, e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleColumnNameChange(column.id, e.target.value);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span onDoubleClick={() => setEditingColumn(column.id)}>
                                                {column.name}
                                            </span>
                                        )}
                                        <div className="column-actions">
                                            <button 
                                                onClick={() => handleFillColumnWithAI(column)}
                                                title="Fill with AI"
                                            >
                                                <i className="fas fa-robot"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteColumn(column)}
                                                title="Delete column"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="resize-handle"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notebook.rows.map((row, index) => (
                            <tr 
                                key={row.id}
                                draggable
                                onDragStart={() => setDraggedRow(row)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                    // Handle row reorder
                                    setDraggedRow(null);
                                }}
                            >
                                <td>
                                    <div className="row-actions">
                                        <button 
                                            onClick={() => handleDeleteRow(row.id)}
                                            title="Delete row"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                                {notebook.columns.filter(col => col.visible).map(column => (
                                    <td key={column.id}>
                                        <textarea
                                            className="cell-content"
                                            value={row.cells[column.id] || ''}
                                            onChange={(e) => handleCellChange(row.id, column.id, e.target.value)}
                                            placeholder="Enter content..."
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={contextMenu.items}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}

// List View Component
function ListView({ notebook }) {
    const titleColumn = notebook.columns[0];
    
    return (
        <div className="list-view">
            {notebook.rows.map(row => (
                <div key={row.id} className="note-card">
                    <h3>{row.cells[titleColumn?.id] || 'Untitled Note'}</h3>
                    {notebook.columns.slice(1).map(column => (
                        row.cells[column.id] && (
                            <div key={column.id} style={{ marginTop: '12px' }}>
                                <strong className="text-muted text-small">{column.name}:</strong>
                                <p style={{ marginTop: '4px' }}>{row.cells[column.id]}</p>
                            </div>
                        )
                    ))}
                </div>
            ))}
        </div>
    );
}

// Main App Component
function App() {
    const [notebook, setNotebook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('table'); // 'list' or 'table'
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiAction, setAiAction] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    
    useEffect(() => {
        loadNotebook();
    }, []);
    
    const loadNotebook = async () => {
        try {
            const data = await API.getNotebook('default');
            setNotebook(data);
        } catch (error) {
            console.error('Failed to load notebook:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddColumn = async () => {
        const name = prompt('Enter column name:');
        if (name) {
            await API.addColumn(notebook.id, name);
            loadNotebook();
        }
    };
    
    const handleAddRow = async () => {
        await API.addRow(notebook.id);
        loadNotebook();
    };
    
    const handleAIAction = (action) => {
        setAiAction(action);
        setAiModalOpen(true);
        setAiPrompt('');
        setSelectedColumns([]);
    };
    
    const executeAIAction = async () => {
        try {
            if (aiAction === 'generate') {
                await API.generateColumn(notebook.id, aiPrompt);
            } else if (aiAction === 'compare' && selectedColumns.length >= 2) {
                const result = await API.compareColumns(notebook.id, selectedColumns);
                alert(result.comparison);
            }
            setAiModalOpen(false);
            loadNotebook();
        } catch (error) {
            console.error('AI action failed:', error);
            alert('AI action failed. Please try again.');
        }
    };
    
    if (loading) {
        return (
            <div className="loading">
                <div>
                    <div className="spinner"></div>
                    <p>Loading notebook...</p>
                </div>
            </div>
        );
    }
    
    if (!notebook) {
        return <div className="loading"><p>Notebook not found</p></div>;
    }
    
    return (
        <div className="app-container">
            <header className="header">
                <div className="header-content">
                    <h1>
                        <i className="fas fa-book"></i>
                        {notebook.name}
                    </h1>
                    <div className="view-toggle">
                        <button 
                            className={view === 'list' ? 'active' : ''}
                            onClick={() => setView('list')}
                        >
                            <i className="fas fa-list"></i> List View
                        </button>
                        <button 
                            className={view === 'table' ? 'active' : ''}
                            onClick={() => setView('table')}
                        >
                            <i className="fas fa-table"></i> Table View
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="toolbar">
                <button onClick={handleAddRow} className="primary">
                    <i className="fas fa-plus"></i>
                    Add Row
                </button>
                <button onClick={handleAddColumn}>
                    <i className="fas fa-columns"></i>
                    Add Column
                </button>
                <button onClick={() => handleAIAction('generate')}>
                    <i className="fas fa-robot"></i>
                    Generate Column with AI
                </button>
                <button onClick={() => handleAIAction('compare')}>
                    <i className="fas fa-balance-scale"></i>
                    Compare Columns
                </button>
            </div>
            
            <div className="main-content">
                {view === 'list' ? (
                    <ListView notebook={notebook} />
                ) : (
                    <TableView notebook={notebook} onUpdate={setNotebook} />
                )}
            </div>
            
            <Modal 
                isOpen={aiModalOpen} 
                onClose={() => setAiModalOpen(false)}
                title={aiAction === 'generate' ? 'Generate Column with AI' : 'Compare Columns'}
            >
                {aiAction === 'generate' ? (
                    <>
                        <label>Prompt</label>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., Add a 'Tone' column and analyze the writing style for each source"
                        />
                        <div className="modal-actions">
                            <button onClick={() => setAiModalOpen(false)}>Cancel</button>
                            <button onClick={executeAIAction} className="primary">Generate</button>
                        </div>
                    </>
                ) : (
                    <>
                        <label>Select columns to compare (minimum 2)</label>
                        {notebook.columns.map(col => (
                            <div key={col.id} style={{ marginBottom: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.includes(col.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedColumns([...selectedColumns, col.id]);
                                            } else {
                                                setSelectedColumns(selectedColumns.filter(id => id !== col.id));
                                            }
                                        }}
                                        style={{ marginRight: '8px' }}
                                    />
                                    {col.name}
                                </label>
                            </div>
                        ))}
                        <div className="modal-actions" style={{ marginTop: '24px' }}>
                            <button onClick={() => setAiModalOpen(false)}>Cancel</button>
                            <button 
                                onClick={executeAIAction} 
                                className="primary"
                                disabled={selectedColumns.length < 2}
                            >
                                Compare
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
