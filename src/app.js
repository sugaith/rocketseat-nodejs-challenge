const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const {title, url, techs} = request.body;

  if (!title || !url) {
    return response.status(400).json({error: 'No url and no title available to create a repo.'});
  }

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs: techs || [],
    likes: 0,
  };

  repositories.push(newRepo);
  return response.json(newRepo);
});

app.put('/repositories/:id', (request, response) => {
  const {id} = request.params;
  const repo2update_index = repositories.findIndex(repo => repo.id === id);

  if (repo2update_index < 0) {
    return response.status(400).json({error: 'Repo not found.'});
  }

  const {title, url, techs} = request.body;
  repositories[repo2update_index].title = title;
  repositories[repo2update_index].url = url;
  repositories[repo2update_index].techs = techs;
  return response.json(repositories[repo2update_index]);
});

app.delete('/repositories/:id', (request, response) => {
  const {id} = request.params;
  const repo2delete_index = repositories.findIndex(repo => repo.id === id);

  if (repo2delete_index < 0) {
    return response.status(400).json({error: 'Repo not found.'});
  }

  repositories.splice(repo2delete_index, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const {id} = request.params;
  const repo2like_index = repositories.findIndex(repo => repo.id === id);

  if (repo2like_index < 0) {
    return response.status(400).json({error: 'Repo not found.'});
  }

  repositories[repo2like_index].likes += 1;
  return response.json({ likes: repositories[repo2like_index].likes});
});

module.exports = app;
