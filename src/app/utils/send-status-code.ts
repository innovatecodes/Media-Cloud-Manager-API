import { StatusCode } from "./enums.js";

export const sendStatusCodeMessage = (status: StatusCode): string => {
  let statusMessage: string = "";

  switch (status) {
    case StatusCode.OK:
      statusMessage =
        "A solicitação foi bem-sucedida e a resposta contém os dados solicitados!";
      break;
    case StatusCode.CREATED:
      statusMessage =
        "A solicitação foi bem-sucedida e resultou na criação de um novo recurso!";
      break;
    case StatusCode.NO_CONTENT:
      statusMessage =
        "A solicitação foi bem-sucedida, mas não há conteúdo para retornar!";
      break;
    case StatusCode.BAD_REQUEST:
      statusMessage =
        "O servidor não conseguiu entender a solicitação devido a erros de sintaxe!";
      break;
    case StatusCode.UNAUTHORIZED:
      statusMessage = "Credenciais inválidas, a autenticação falhou!";
      break;
    case StatusCode.FORBIDDEN:
      statusMessage =
        "O servidor entendeu a solicitação, mas recusa a autorizar o acesso ao recurso!";
      break;
    case StatusCode.NOT_FOUND:
      statusMessage =
        "O servidor não conseguiu encontrar o recurso solicitado!";
      break;
    case StatusCode.METHOD_NOT_ALLOWED:
      statusMessage =
        "O método HTTP usado não é permitido para o recurso solicitado!";
      break;
    case StatusCode.CONTENT_TOO_LARGE:
      statusMessage =
        "O arquivo enviado é muito grande. O limite de tamanho foi excedido!";
      break;
    case StatusCode.UNSUPPORTED_MEDIA_TYPE:
      statusMessage =
        "O tipo de mídia enviado não é suportado. Verifique o formato do arquivo!";
      break;
    case StatusCode.INTERNAL_SERVER_ERROR:
      statusMessage =
        "Erro interno do servidor!";
      break;
  }
  return statusMessage;
};
