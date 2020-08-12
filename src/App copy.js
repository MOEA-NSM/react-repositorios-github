import React, { useState, useEffect, useMemo, useCallback } from "react";

function App() {
  const [tarefas, setTarefas] = useState([
    "Pagar a conta de luz",
    "Estudar react hooks",
  ]);

  const [nome, setNome] = useState(["Deyvid"]);

  const [input, setInput] = useState("");

  useEffect(() => {
    const tarefasStorage = localStorage.getItem("tarefas");
    if (tarefasStorage) {
      setTarefas(JSON.parse(tarefasStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const handleAdd = useCallback(() => {
    setTarefas([...tarefas, input]);
    setInput("");
    setNome("Jonas");
  }, [input, tarefas]);

  const totalTarefas = useMemo(() => tarefas.length, [tarefas]);

  return (
    <div>
      <h1>hooks</h1>
      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa}>{tarefa}</li>
        ))}
      </ul>

      <strong>Voce tem {totalTarefas} tarefas!</strong>

      <h1>{nome}</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button type="button" onClick={handleAdd}>
        Adicionar
      </button>
    </div>
  );
}

export default App;
