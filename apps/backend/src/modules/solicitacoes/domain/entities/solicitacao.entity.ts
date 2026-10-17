import { randomUUID } from 'crypto';

export type EstadoSolicitacao =
  | 'AGUARDANDO_TRIAGEM'
  | 'AGUARDANDO_ATRIBUICAO'
  | 'EM_ATENDIMENTO'
  | 'AGUARDANDO_CONFIRMACAO'
  | 'ENCERRADA';

export type PrioridadeSolicitacao = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

type CriarSolicitacaoProps = {
  organizacaoId: string;
  solicitanteId: string;
  titulo: string;
  descricao: string;
  categoria: string;
};
export class Solicitacao {
  id: string;
  organizacaoId: string;
  solicitanteId: string;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade?: PrioridadeSolicitacao;
  equipeResponsavelId?: string | null;
  atendenteResponsavelId?: string | null;
  estado: EstadoSolicitacao;
  criadaEm: Date;

  constructor(props: CriarSolicitacaoProps) {
    this.validate(props);

    this.id = randomUUID();
    this.organizacaoId = props.organizacaoId;
    this.solicitanteId = props.solicitanteId;
    this.titulo = props.titulo;
    this.descricao = props.descricao;
    this.categoria = props.categoria;
    this.atendenteResponsavelId = null;
    this.atendenteResponsavelId = null;
    this.estado = 'AGUARDANDO_TRIAGEM';
    this.criadaEm = new Date();
  }

  private validate({
    categoria,
    descricao,
    organizacaoId,
    solicitanteId,
    titulo,
  }: CriarSolicitacaoProps) {
    if (!categoria) {
      throw new Error('Nao é possivel criar uma solicitacao sem categoria');
    }
    if (!descricao) {
      throw new Error('Nao é possivel criar uma solicitacao sem descricao');
    }
    if (!organizacaoId) {
      throw new Error('Nao é possivel criar uma solicitacao sem organizacaoId');
    }
    if (!solicitanteId) {
      throw new Error('Nao é possivel criar uma solicitacao sem solicitanteId');
    }
    if (!titulo.trim()) {
      throw new Error('O título da solicitação é obrigatório');
    }
  }
}
