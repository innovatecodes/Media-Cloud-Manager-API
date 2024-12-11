# Tube Server Manager - Detalhes da API

- **Descrição**: API que permite gerenciar e listar vídeos do YouTube, projetada para simular o comportamento de uma aplicação em produção, utilizando dados mockados para fins de desenvolvimento e teste. Os dados mockados foram armazenados em arquivo chamado videos.json, que simula respostas de um banco de dados real.
- **Versão**: 1.0
- **Autor**: Ronaldo Lopes <contato@innovatecodes.com>
- **Criado em**: 2024-12-04 13:17:14
- **Última atualização**: Não definida

## Licença

- **Tipo**: MIT
- **URL**: [MIT License](https://opensource.org/licenses/MIT)
- **Termos**: Permite a utilização, cópia, modificação, fusão, publicação, distribuição, sublicenciamento e/ou venda de cópias do Software, desde que a cópia do aviso de copyright e a permissão sejam incluídas em todas as cópias do Software.

## Endpoints da API

### `GET /api/v1/videos/`
- **Descrição**: Lista todos os vídeos.
- **Método HTTP**: GET
- **Resposta esperada**: Retorna todos os vídeos registrados.
  
### `GET /api/v1/videos/search`
- **Descrição**: Pesquisa vídeos por categoria.
- **Método HTTP**: GET
- **Parâmetros**: `category` (obrigatório) - Filtra vídeos por categoria.
- **Resposta esperada**: Retorna uma lista de vídeo(s) correspondente(s) à categoria fornecida.

### `GET /api/v1/videos/{id}`
- **Descrição**: Busca um vídeo específico pelo id.
- **Método HTTP**: GET
- **Parâmetros**: `{id}` - Id do vídeo a ser buscado.
- **Resposta esperada**: Retorna o vídeo correspondente ao id informado.

<!--
### `POST /api/v1/videos/`
- **Descrição**: Cria um novo vídeo.
- **Método HTTP**: POST
- **Corpo da requisição**: Necessário enviar dados do vídeo (categoria, descrição, título, link).
- **Resposta esperada**: Retorna o vídeo criado com o status de sucesso.


### `PUT /api/v1/videos/{id}`
- **Descrição**: Atualiza um vídeo específico.
- **Método HTTP**: PUT
- **Parâmetros**: `{id}` - Id do vídeo a ser atualizado.
- **Corpo da requisição**: Necessário enviar dados atualizados do vídeo.
- **Resposta esperada**: Retorna o vídeo atualizado.

### `DELETE /api/v1/videos/{id}`
- **Descrição**: Deleta um vídeo específico.
- **Método HTTP**: DELETE
- **Parâmetros**: `{id}` - Id do vídeo a ser deletado.
- **Resposta esperada**: Retorna uma confirmação de que o vídeo foi deletado com sucesso.
-->
