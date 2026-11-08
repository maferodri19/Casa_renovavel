/* ==========================================================
   DADOS FICTÍCIOS — usados só para a apresentação do projeto.
   Para trocar por dados reais, edite este arquivo (ou ligue
   estas listas a uma coleção do Firestore).
   ========================================================== */

export const PROGRESS = 68; // % geral da obra

/** Fator de emissão usado para estimar o CO₂ evitado (t/MWh). Valor ilustrativo. */
export const EMISSION_FACTOR = 0.505;

export const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out'];

/** Geração mensal em MWh (2026) */
export const WIND  = [96, 104, 118, 140, 160, 188, 214, 236, 252, 267];
export const SOLAR = [38,  44,  52,  58,  61,  59,  56,  63,  65,  65];

export const AVAILABILITY = 94; // %

export const HISTORY_NOTES = [
  'Primeiras 4 turbinas conectadas à rede',
  'Ajustes de calibragem nos sensores',
  'Entrada do 1º bloco solar (2 MWp)',
  'Manutenção programada, 2 dias',
  'Operação estável',
  'Recorde de geração do semestre',
  'Parada de 6 h por tempestade',
  'Mais 3 turbinas em teste',
  'Entrada do 2º bloco solar',
  'Melhor mês desde o início da operação'
];

export const STEPS = [
  { t: 'Licenciamento e conversas com a comunidade', d: 'Licenças ambientais emitidas e 6 audiências públicas realizadas nos povoados vizinhos.', when: 'Jan a Dez 2025', st: 'done', pct: 100 },
  { t: 'Estradas de acesso e canteiro de obras', d: 'Reforma de 18 km de estradas, que também servem aos moradores.', when: 'Fev a Jun 2025', st: 'done', pct: 100 },
  { t: 'Fundações das torres eólicas', d: '14 das 14 fundações concluídas e inspecionadas.', when: 'Jul a Dez 2025', st: 'done', pct: 100 },
  { t: 'Montagem das torres e turbinas', d: '10 de 14 turbinas já estão de pé. Transporte das pás acontece à noite, para não atrapalhar o trânsito.', when: 'Jan a Dez 2026', st: 'now', pct: 72 },
  { t: 'Instalação dos painéis solares', d: '2 dos 4 blocos de painéis estão instalados e gerando.', when: 'Abr 2026 a Mar 2027', st: 'now', pct: 55 },
  { t: 'Subestação e linha de transmissão', d: 'Obras da subestação começam depois da montagem das últimas turbinas.', when: 'Previsto: 2027', st: 'next', pct: 15 },
  { t: 'Testes finais e operação completa', d: 'Todos os equipamentos funcionando juntos e entrega do parque.', when: 'Previsto: meio de 2027', st: 'next', pct: 0 }
];

export const INVESTMENTS = [
  { v: 'R$ 4,2 mi', t: 'Reforma de estradas de acesso entre os povoados' },
  { v: 'R$ 1,8 mi', t: 'Reforma e ampliação da escola municipal' },
  { v: 'R$ 650 mil', t: 'Cursos gratuitos de capacitação' },
  { v: 'R$ 420 mil', t: 'Equipamentos para o posto de saúde' },
  { v: '187 vagas', t: 'Empregos na obra, 62% preenchidos por moradores da região' }
];

export const NEWS = [
  { d: '2026-11-03', t: 'Décima turbina montada', p: 'A torre 10 foi erguida na semana passada. Restam 4 turbinas para a montagem terminar.' },
  { d: '2026-10-21', t: 'Inscrições abertas para o curso de manutenção de turbinas', p: 'São 25 vagas, com aulas práticas no próprio parque e certificado ao final.' },
  { d: '2026-10-09', t: 'Comunicado: transporte de pás nas estradas', p: 'Entre 22h e 4h, em 12 e 13 de outubro, haverá comboio lento na estrada de acesso. Desvio sinalizado.' },
  { d: '2026-09-25', t: 'Feira de empregos reúne 14 empresas parceiras', p: 'Mais de 300 pessoas passaram pela feira e 41 já foram chamadas para entrevistas.' }
];

/* ---------- Cursos ----------
   tipo: basica | tecnica     area: eolica | solar | geral     local: presencial | online */
export const COURSES = [
  { id:'c1', t:'Inclusão Digital Básica', tipo:'basica', area:'geral', local:'presencial', ini:'2026-11-16', fim:'2026-12-18', h:40, vagas:30, ocup:22,
    d:'Aprenda a usar computador, internet, e-mail e serviços públicos digitais, do zero.', req:'Nenhum. Ter 16 anos ou mais.' },
  { id:'c2', t:'Comunicação e Atendimento', tipo:'basica', area:'geral', local:'presencial', ini:'2026-11-23', fim:'2026-12-22', h:32, vagas:25, ocup:19,
    d:'Como se comunicar bem no trabalho, atender pessoas e escrever mensagens claras.', req:'Ensino fundamental completo.' },
  { id:'c3', t:'Preparação para o Mercado de Trabalho', tipo:'basica', area:'geral', local:'online', ini:'2026-11-30', fim:'2027-01-15', h:24, vagas:60, ocup:35,
    d:'Currículo, entrevista, direitos do trabalhador e como se candidatar às vagas do parque.', req:'Celular ou computador com internet.' },
  { id:'c4', t:'Introdução à Energia Eólica (Básico)', tipo:'basica', area:'eolica', local:'presencial', ini:'2026-11-18', fim:'2026-12-12', h:30, vagas:40, ocup:31,
    d:'Como o vento vira energia, as partes de uma turbina e as regras de segurança em um parque.', req:'Ensino fundamental completo.' },
  { id:'c5', t:'Manutenção Preventiva Solar (Técnico)', tipo:'tecnica', area:'solar', local:'presencial', ini:'2026-12-01', fim:'2027-01-29', h:80, vagas:20, ocup:20,
    d:'Inspeção, limpeza e testes em painéis e inversores solares, com prática no parque.', req:'Curso de Eletricidade Básica ou experiência comprovada.' },
  { id:'c6', t:'Operação e Manutenção de Turbinas', tipo:'tecnica', area:'eolica', local:'presencial', ini:'2027-01-11', fim:'2027-03-26', h:120, vagas:25, ocup:11,
    d:'Formação técnica para atuar na operação e na manutenção das turbinas do parque.', req:'Ensino médio completo e Introdução à Energia Eólica.' },
  { id:'c7', t:'Segurança em Trabalho em Altura (NR-35)', tipo:'tecnica', area:'eolica', local:'presencial', ini:'2026-12-07', fim:'2026-12-11', h:8, vagas:30, ocup:12,
    d:'Treinamento obrigatório para quem vai trabalhar nas torres, com certificado válido em todo o país.', req:'Maior de 18 anos e atestado de saúde ocupacional.' },
  { id:'c8', t:'Instalador de Sistemas Fotovoltaicos', tipo:'tecnica', area:'solar', local:'online', ini:'2027-01-18', fim:'2027-03-12', h:60, vagas:45, ocup:17,
    d:'Projeto e instalação de energia solar em casas e comércios, com aulas ao vivo e simulador.', req:'Ensino médio completo.' }
];

/** Inscrição de exemplo, para mostrar como ficam turmas e certificados */
export const EXAMPLE_ENROLLMENT = {
  id: 'exemplo', example: true, courseTitle: 'Inclusão Digital Básica (Turma 1)', name: 'Maria das Graças (exemplo)',
  ini: '2026-09-07', fim: '2026-10-09', h: 40
};

/* ---------- Vagas ---------- */
export const JOBS = [
  { id:'j1', t:'Auxiliar de montagem de torres', co:'Casa dos Ventos', loc:'Parque Energia Viva', tipo:'emprego', d:'Apoio à equipe de montagem. Treinamento NR-35 oferecido pela empresa.', date:'2026-11-02' },
  { id:'j2', t:'Técnico(a) de segurança do trabalho', co:'Casa dos Ventos', loc:'Parque Energia Viva', tipo:'emprego', d:'Acompanhamento diário da obra, inspeções e treinamentos de equipe.', date:'2026-10-28' },
  { id:'j3', t:'Estágio em engenharia elétrica', co:'Casa dos Ventos', loc:'Parque Energia Viva', tipo:'estagio', d:'Para estudantes de engenharia elétrica. Bolsa, vale-transporte e refeição.', date:'2026-10-30' },
  { id:'j4', t:'Estágio em comunicação e relacionamento', co:'Casa dos Ventos', loc:'Escritório regional', tipo:'estagio', d:'Atuação com a comunidade, redes sociais e produção de conteúdo do projeto.', date:'2026-10-25' },
  { id:'j5', t:'Cozinheiro(a) para refeitório', co:'Sabor do Sertão Alimentação', loc:'Povoado vizinho', tipo:'parceira', d:'Empresa parceira que atende o canteiro. Experiência em cozinha industrial é um diferencial.', date:'2026-11-01' },
  { id:'j6', t:'Motorista de caminhão pipa', co:'TransVale Logística', loc:'Região do parque', tipo:'parceira', d:'CNH categoria D. Rotas curtas entre cidades vizinhas e o canteiro.', date:'2026-10-27' },
  { id:'j7', t:'Eletricista de manutenção solar', co:'SolarTec Serviços', loc:'Parque Energia Viva', tipo:'emprego', d:'Para quem concluiu o curso de Manutenção Preventiva Solar ou tem experiência.', date:'2026-11-04' },
  { id:'j8', t:'Auxiliar administrativo', co:'Construtora Horizonte', loc:'Escritório da obra', tipo:'parceira', d:'Rotina de documentos, compras e controle de entrada de pessoas no canteiro.', date:'2026-10-22' },
  { id:'j9', t:'Jovem aprendiz em operação', co:'Casa dos Ventos', loc:'Parque Energia Viva', tipo:'estagio', d:'Programa para jovens de 16 a 22 anos, com formação teórica e prática no parque.', date:'2026-10-18' }
];

/* ---------- Comentários fictícios ----------
   ago = minutos atrás. Fotos: retratos fictícios (randomuser.me). */
const P = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;
export const SEED_COMMENTS = [
  { id:'s1', name:'Fernanda Lima', photo:P('women',44), type:'sugestao', ago:60, likes:14,
    text:'Gostaria de ver mais cursos de energia solar disponíveis em breve. Tem muita gente aqui interessada em instalar painel em casa.' },
  { id:'s2', name:'Carlos Silva', photo:P('men',32), type:'opiniao', ago:61, likes:23,
    text:'Muito bom ver o impacto real na nossa região. A comunidade agradece, principalmente pela reforma da estrada.' },
  { id:'s3', name:'Joana Pereira', photo:P('women',68), type:'duvida', ago:380, likes:9,
    text:'Quando abre a próxima turma do curso de operação de turbinas? Já fiz o básico e quero me preparar.',
    reply:{ by:'Equipe Casa Renovável', text:'Oi, Joana! As inscrições do curso técnico já estão abertas aqui na página, na área de Capacitações. A turma começa em janeiro.' } },
  { id:'s4', name:'Antônio Ribeiro', photo:P('men',75), type:'duvida', ago:1500, likes:6,
    text:'O barulho das turbinas vai incomodar quem mora perto? Minha casa fica a uns 2 km do parque.',
    reply:{ by:'Equipe Casa Renovável', text:'Seu Antônio, as turbinas respeitam a distância mínima das casas e o ruído é medido com frequência. Os resultados vão ser publicados aqui, nos comunicados.' } },
  { id:'s5', name:'Aline Souza', photo:P('women',12), type:'opiniao', ago:2900, likes:31,
    text:'Meu filho conseguiu o estágio depois da feira de empregos. Foi a primeira oportunidade dele na área de engenharia, estamos muito felizes.' },
  { id:'s6', name:'Rafael Costa', photo:P('men',18), type:'sugestao', ago:4300, likes:11,
    text:'Seria bom ter uma visita guiada ao parque nos fins de semana para as escolas da região conhecerem.' },
  { id:'s7', name:'Patrícia Gomes', photo:P('women',26), type:'opiniao', ago:7200, likes:17,
    text:'Gostei de poder acompanhar a geração mês a mês. Dá confiança saber que os números estão abertos para todo mundo.' },
  { id:'s8', name:'Marcos Oliveira', photo:P('men',52), type:'duvida', ago:10100, likes:4,
    text:'Os cursos online precisam de internet boa? Aqui no povoado o sinal é fraco.',
    reply:{ by:'Equipe Casa Renovável', text:'Marcos, os cursos presenciais acontecem no centro comunitário, que tem internet liberada. Para os online, o material também pode ser baixado e visto depois.' } }
];

/** Distribuição fictícia de avaliações (quantidade de notas 5, 4, 3, 2, 1) */
export const SEED_RATINGS = { 5: 48, 4: 27, 3: 9, 2: 3, 1: 2 };
