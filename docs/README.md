# Media Cloud Manager API

- **Descrição**: API que permite gerenciar e listar mídias, como vídeos, séries e músicas, projetada para simular o comportamento de uma aplicação em produção, utilizando dados mockados para fins de desenvolvimento e teste. Os dados mockados foram armazenados em um arquivo chamado data.json, que simula respostas de um banco de dados real.
- **Versão**: 1.0
- **Autor**: Ronaldo Lopes <contato@innovatecodes.com>
- **Criado em**: 2024-12-04 13:17:14
- **Última atualização**: Não definida

## Licença

- **Tipo**: MIT
- **URL**: [MIT License](https://opensource.org/licenses/MIT)
- **Termos**: Permite a utilização, cópia, modificação, fusão, publicação, distribuição, sublicenciamento e/ou venda de cópias do Software, desde que a cópia do aviso de copyright e a permissão sejam incluídas em todas as cópias do Software.

## Endpoints da API

### `GET /v1/api/media/`
- **Descrição**: Lista todas as mídias.
- **Método HTTP**: GET
- **Resposta esperada**: Retorna todos os registros de mídias.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/v1/api/media/
    ```
  - #### Exemplo de resposta: 
    ```json
        [
            { "media_id": 1,
            "genres": "video",
            "categories": [
            "comedy"
            ],
            "media_description": "O filme é baseado na peça homônima criada e estrelada pelo próprio Paulo e que levou milhões de espectadores ao teatro ao longo dos anos em cartaz.",
            "title": "Minha mãe é uma peça",
            "media_posted_at": "2024-12-13 11:11:48",
            "media_updated_at": "",
            "link": "https://youtu.be/xn0MWFAR1cY?si=hOZnqbbbQ2YBfmdC",
            "default_image_file": "http://127.0.0.1:8081/uploads/default-image-file-98d8c367-1eae-4e84-b91e-1e26b519cc5d-1735075685178-148181922.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
            },
            {
            "media_id": 2,
            "genres": "video",
            "categories": [
                "romance"
            ],
            "media_description": "Prestes a competir em um importante concurso culinário, Ária, uma confeteira talentosa, vê seus planos desmoronarem quando seu parceiro a abandona poucos dias antes do evento. Desesperada, ela encontra apoio em um charmoso pai solteiro que a ajuda a descobrir não apenas um ingrediente secreto para sua receita,  mas também o caminho para a verdadeira felicidade. Confeteira Desesperada Encontra o Ingrediente Secreto da Felicidade!",
            "title": "Por amor ao chocolate",
            "media_posted_at": "2024-12-13 11:13:48",
            "media_updated_at": "",
            "link": "https://youtu.be/Dv5J-fAZu0E?si=jslhtU7R1kOqU3Fc",
            "default_image_file": "http://127.0.0.1:8081/uploads/default-image-file-2c98dfd7-efdf-4f33-9f8c-f6435480a1d6-1735075749840-650163747.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
            }                       
        ]          
    ```

### `GET /v1/api/media?genre=action` ou `GET /v1/api/media?category=movies` ou `GET /v1/api/media?terms=?terms=O%20cunhado%20perigoso` 
- **Descrição**: Realiza uma pesquisa de mídia com base no gênero, categoria ou termo fornecido.
- **Método HTTP**: GET
- **Parâmetros**:
- - **1**: `genre` - Filtro por gênero (opcional).
  - **2**: `category` - Filtro por categoria (opcional).
  - **3**: `terms` - Filtro por termo de busca (opcional).
- **Resposta esperada**: Retorna uma lista de mídia(s) correspondente(s) ao tipo de pesquisa.
  - ### Exemplo de requisição:
  -  ```bash
        GET http://localhost:8081/v1/api/media?genre=action
  - ```bash
        GET http://localhost:8081/v1/api/media?category=movies
  - ```bash
        GET http://localhost:8081/v1/api/media?terms=O%20cunhado%20perigoso
    ```
     - #### Exemplo de resposta:
    ```json
        {
            "media_id": 11,
            "genres": "action",
            "categories": [
                "movies"
            ],
            "media_description": "Em Velozes & Furiosos 5: Operação Rio, Dominic Toretto (Vin Diesel) foi resgatado da prisão por sua irmã Mia (Jordana Brewster) e Brian O'Conner (Paul Walker), que realizam um ousa...",
            "title": "Velozes e furiosos 5: Operação Rio",
            "media_posted_at": "2024-12-13 11:19:31",
            "media_updated_at": "",
            "link": "https://youtu.be/rc4k0Y_-9qU?si=7WJndY1j34rCy_Yg",
            "default_image_file": "http://127.0.0.1:8081/uploads/default-image-file-02da2c43-35e3-4231-941c-8d27b28f6e72-1735072746014-990036758.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
        }              
    ```

    - #### Exemplo de resposta:
    ```json
        {
            "media_id": 6,
            "genres": "thriller",
            "categories": [
                "movies"
            ],
            "media_description": "Clara, é uma rica , que mora em um lugar com vizinhos ricos, mas ela tem seu mundo virado de cabeça para baixo com a chegada inesperada do seu cunhado.",
            "title": "O cunhado perigoso",
            "media_posted_at": "2024-12-13 12:23:30",
            "media_updated_at": "",
            "link": "https://youtu.be/IfJoMkbWD7E?si=0IEbY13JMyjDnRYR",
            "default_image_file": "http://127.0.0.1:8081/uploads/default-image-file-d64cf58b-4f49-4fe7-931a-ff045c6e04d5-1735075630057-300622454.jpg",
             "cloudinary_secure_url": "",
             "temporary_public_id": "",
        }              
    ```

### `GET /v1/api/media/{id}`
- **Descrição**: Busca uma mídia específica pelo id.
- **Método HTTP**: GET
- **Parâmetros**: `{id}` - Id da mídia (vídeo, música, série, etc.) a ser buscada.
- **Resposta esperada**: Retorna a mídia correspondente ao id informado.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/v1/api/media/1
    ```
  - #### Exemplo de resposta:
    ```json
        {
            "media_id": 1,
            "genres": "comedy",
            "categories": [
                "movies"
            ],
            "media_description": "O filme é baseado na peça homônima criada e estrelada pelo próprio Paulo e que levou milhões de espectadores ao teatro ao longo dos anos em cartaz.",
            "title": "Minha mãe é uma peça",
            "media_posted_at": "2024-12-13 11:11:48",
            "media_updated_at": "",
            "link": "https://youtu.be/xn0MWFAR1cY?si=hOZnqbbbQ2YBfmdC",
            "default_image_file": "http://127.0.0.1:8081/uploads/default-image-file-98d8c367-1eae-4e84-b91e-1e26b519cc5d-1735075685178-148181922.jpg",
            "cloudinary_secure_url": "",
            "temporary_public_id": "",
        }
    ```

