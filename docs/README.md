# Media Cloud Manager API

- **Descrição**: API que permite gerenciar e listar mídias, como vídeos, séries e músicas, projetada para simular o comportamento de uma aplicação em produção, utilizando dados mockados para fins de desenvolvimento e teste. Os dados mockados foram armazenados em um arquivo chamado data.json, que simula respostas de um banco de dados real.
- **Versão**: 2.0
- **Autor**: Ronaldo Lopes <contato@innovatecodes.com>
- **Criado em**: 2024-12-04 13:17:14
- **Última atualização**: 2025-01-07 21:52:24

## Licença

- **Tipo**: MIT
- **URL**: [MIT License](https://opensource.org/licenses/MIT)
- **Termos**: Permite a utilização, cópia, modificação, fusão, publicação, distribuição, sublicenciamento e/ou venda de cópias do Software, desde que a cópia do aviso de copyright e a permissão sejam incluídas em todas as cópias do Software.

## Endpoints da API

### `GET /api/media/`
- **Descrição**: Lista todas as mídias.
- **Método HTTP**: GET
- **Resposta esperada**: Retorna todos os registros de mídias.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/api/media/
    ```
  - #### Exemplo de resposta: 
    ```json
        [
            { "media_id": 1,
            "genres": ["comedy"],
            "categories": [
            "movies"
            ],
            "media_description": "O filme é baseado na peça homônima criada e estrelada pelo próprio Paulo e que levou milhões de espectadores ao teatro ao longo dos anos em cartaz.",
            "title": "Minha mãe é uma peça",
            "media_posted_at": "2024-12-13 11:11:48",
            "media_updated_at": "",
            "link": "https://youtu.be/xn0MWFAR1cY?si=hOZnqbbbQ2YBfmdC",
            "default_image_file": "http://localhost:8081/uploads/no-image.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
            },
            {
            "media_id": 2,
            "genres": ["romance"],
            "categories": [
                "movies"
            ],
            "media_description": "Prestes a competir em um importante concurso culinário, Ária, uma confeteira talentosa, vê seus planos desmoronarem quando seu parceiro a abandona poucos dias antes do evento. Desesperada, ela encontra apoio em um charmoso pai solteiro que a ajuda a descobrir não apenas um ingrediente secreto para sua receita,  mas também o caminho para a verdadeira felicidade. Confeteira Desesperada Encontra o Ingrediente Secreto da Felicidade!",
            "title": "Por amor ao chocolate",
            "media_posted_at": "2024-12-13 11:13:48",
            "media_updated_at": "",
            "link": "https://youtu.be/Dv5J-fAZu0E?si=jslhtU7R1kOqU3Fc",
            "default_image_file": "http://localhost:8081/uploads/no-image.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
            }                       
        ]          
    ```

### `GET /api/media/search?genre=action` 
### `GET /api/media/search?category=movies` 
### `GET /api/media/search?search=O%20cunhado%20perigoso` 
### `GET /api/media?page=2`
- **Descrição**:  Realiza uma pesquisa de mídia com base no gênero, categoria, termo fornecido ou realiza paginação na listagem geral de mídias.
- **Método HTTP**: GET
- **Parâmetros**:
- - **1**: `genre` - Filtro por gênero (opcional).
  - **2**: `category` - Filtro por categoria (opcional).
  - **3**: `search` - Filtro por busca (opcional).
  - **4**: `page` -  Número da página para paginação (opcional).  
- **Resposta esperada**: Retorna uma lista de mídias correspondente ao tipo de pesquisa ou à página selecionada, com os dados paginados se o parâmetro `page` estiver presente.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/api/media/search?genre=action
    ```
    ```bash
        GET http://localhost:8081/api/media/search?category=movies
    ```
    ```bash
        GET http://localhost:8081/api/media/search?search=O%20cunhado%20perigoso
    ```
    ```bash
        GET http://localhost:8081/api/media?page=2
    ```
  - #### Exemplo de resposta:
    ```json
        {
            "media_id": 11,
            "genres": ["action"],
            "categories": [
                "movies"
            ],
            "media_description": "Em Velozes & Furiosos 5: Operação Rio, Dominic Toretto (Vin Diesel) foi resgatado da prisão por sua irmã Mia (Jordana Brewster) e Brian O'Conner (Paul Walker), que realizam um ousa...",
            "title": "Velozes e furiosos 5: Operação Rio",
            "media_posted_at": "2024-12-13 11:19:31",
            "media_updated_at": "",
            "link": "https://youtu.be/rc4k0Y_-9qU?si=7WJndY1j34rCy_Yg",
            "default_image_file": "http://localhost:8081/uploads/no-image.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
        }              
    ```

  - #### Exemplo de resposta:
    ```json
        {
            "media_id": 6,
            "genres": ["thriller"],
            "categories": [
                "movies"
            ],
            "media_description": "Clara, é uma rica , que mora em um lugar com vizinhos ricos, mas ela tem seu mundo virado de cabeça para baixo com a chegada inesperada do seu cunhado.",
            "title": "O cunhado perigoso",
            "media_posted_at": "2024-12-13 12:23:30",
            "media_updated_at": "",
            "link": "https://youtu.be/IfJoMkbWD7E?si=0IEbY13JMyjDnRYR",
            "default_image_file": "http://localhost:8081/uploads/no-image.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
        }              
    ```

### `GET /api/media/{id}`
- **Descrição**: Busca uma mídia específica pelo id.
- **Método HTTP**: GET
- **Parâmetros**: `{id}` - Id da mídia (vídeo, música, série, etc.) a ser buscada.
- **Resposta esperada**: Retorna a mídia correspondente ao id informado.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/api/media/1
    ```
  - #### Exemplo de resposta:
    ```json
        {
            "media_id": 1,
            "genres": ["comedy"],
            "categories": [
                "movies"
            ],
            "media_description": "O filme é baseado na peça homônima criada e estrelada pelo próprio Paulo e que levou milhões de espectadores ao teatro ao longo dos anos em cartaz.",
            "title": "Minha mãe é uma peça",
            "media_posted_at": "2024-12-13 11:11:48",
            "media_updated_at": "",
            "link": "https://youtu.be/xn0MWFAR1cY?si=hOZnqbbbQ2YBfmdC",
            "default_image_file": "http://localhost:8081/uploads/no-image.jpg",
            "cloudinary_secure_url": "",
            "temporary_public_id": "",
        }
    ```

