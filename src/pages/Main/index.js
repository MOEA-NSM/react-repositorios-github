import React, { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Main() {
  const [newRepo, setNewRepo] = useState("facebook/react");
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //Buscar no localStorage
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");
    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  //Salvar alterações
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(null);
        try {
          if (newRepo === "") {
            throw new Error("Informe um repositorio");
          }

          const hasRepo = repositorios.find((res) => res.name === newRepo);
          if (hasRepo) {
            throw new Error("Repositorio já existe");
          }

          const response = await api.get(`repos/${newRepo}`);
          console.log(response);

          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
          setAlert(true);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositorios]
  );

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => r.name !== repo);
      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus repositorios{" "}
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          value={newRepo}
          onChange={handleInputChange}
          placeholder="Adicionar Repositórios"
        />
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
