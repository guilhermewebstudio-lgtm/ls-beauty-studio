// models/i18n.js
// Dicionário central de traduções. Cada chave tem uma versão 'pt' e 'en'.
// Templates usam <%= t('chave') %> e o middleware em server.js escolhe
// o idioma certo consoante o cookie 'lang'.

const dict = {
  pt: {
    nav_home: 'Início',
    nav_services: 'Serviços',
    nav_book: 'Marcar',
    nav_contact: 'Contactos',

    hero_eyebrow: 'Benfica · Lisboa',
    hero_title_pre: 'Beleza que ',
    hero_title_em: 'se sente',
    hero_title_post: ',\nantes de se ver.',
    hero_sub: 'Unhas, cabelo, sobrancelhas, pestanas e estética facial — num espaço pensado para desacelerares.',
    hero_btn_book: 'Marcar sessão',
    hero_btn_services: 'Ver serviços',
    hero_scroll: 'Descobre mais',

    stats_services: 'Serviços especializados',
    stats_categories: 'Categorias de tratamento',
    stats_hours_label: 'Horário de funcionamento',
    stats_products: 'Produtos profissionais',

    intro_eyebrow: 'O estúdio',
    intro_title: 'Um cuidado atento, em cada detalhe.',
    intro_body: 'No LS Beauty Studio, cada marcação é um momento só teu. Trabalhamos com produtos de qualidade e técnicas atuais, num ambiente calmo em pleno coração de Benfica.',
    intro_quote: '"Não é só sobre unhas ou cabelo — é sobre saíres daqui a sentir-te mais tu."',
    intro_quote_author: '— Equipa LS Beauty Studio',

    hours_eyebrow: 'Horário',
    hours_title: 'Estamos por perto quando precisas',
    hours_body: 'Aberto de Terça a Sábado. Marca com antecedência para garantires o horário que preferires.',
    day_mon: 'Segunda-feira',
    day_tue: 'Terça-feira',
    day_wed: 'Quarta-feira',
    day_thu: 'Quinta-feira',
    day_fri: 'Sexta-feira',
    day_sat: 'Sábado',
    day_sun: 'Domingo',
    closed: 'Fechado',
    hours_time_range: '10h00 – 19h30',

    why_eyebrow: 'Porquê nós',
    why_title: 'O que nos torna diferentes',
    why_1_title: 'Cuidado genuíno',
    why_1_body: 'Cada marcação é tratada com atenção total — sem pressas, sem rotina.',
    why_2_title: 'Produtos de qualidade',
    why_2_body: 'Trabalhamos só com marcas profissionais, escolhidas a pensar na saúde da pele e das unhas.',
    why_3_title: 'Sem esperas',
    why_3_body: 'Marcações online simples, para o teu horário nunca ser um problema.',
    why_4_title: 'Ambiente calmo',
    why_4_body: 'Um espaço pensado para desacelerares, no coração de Benfica.',

    services_eyebrow: 'Serviços',
    services_title: 'O que fazemos por ti',
    services_from: 'desde',
    services_see_all: 'Ver todos os serviços',

    gallery_eyebrow: 'Galeria',
    gallery_title: 'Trabalhos que falam por si',

    pricing_eyebrow: 'Preços',
    pricing_title: 'Investe em ti, sem surpresas',
    pricing_btn: 'Marcar sessão',

    cta_title: 'Pronta para o teu momento de cuidado?',
    cta_btn: 'Marcar agora',

    footer_hours: 'Horário',
    footer_hours_days: 'Terça – Sábado',
    footer_hours_time: '10h00 – 19h30',
    footer_explore: 'Explorar',
    footer_follow: 'Segue-nos',
    footer_rights: 'Todos os direitos reservados.',

    page_services_eyebrow: 'Serviços',
    page_services_title: 'O menu completo',
    page_services_sub: 'Preços e durações — escolhe o que precisas e marca em segundos.',

    page_book_eyebrow: 'Marcação',
    page_book_title: 'Reserva a tua sessão',
    page_book_sub: 'Escolhe o serviço, o dia e a hora que preferires.',
    form_name: 'Nome completo',
    form_phone: 'Telefone',
    form_email: 'Email',
    form_service: 'Serviço',
    form_service_placeholder: 'Escolhe um serviço',
    form_date: 'Data',
    form_time: 'Hora',
    form_notes: 'Notas (opcional)',
    form_notes_placeholder: 'Alguma preferência ou pedido especial?',
    form_confirm: 'Confirmar marcação',
    booking_success_title: 'Marcação recebida! 🎉',
    booking_success_body: 'Vamos confirmar por email ou telefone brevemente. Obrigada pela preferência.',
    booking_error_fields: 'Preenche todos os campos obrigatórios.',
    booking_error_conflict: 'Esse horário já está reservado. Escolhe outro, por favor.',

    page_contact_eyebrow: 'Contactos',
    page_contact_title: 'Fala connosco',
    contact_address_title: 'Morada',
    contact_address: 'Rua Cláudio Nunes, nº8, Benfica, Lisboa',
    contact_hours_title: 'Horário',
    contact_social_title: 'Redes sociais',
    form_message: 'Mensagem',
    form_send: 'Enviar mensagem',
    contact_success: 'Mensagem enviada! Respondemos assim que possível.',
    map_eyebrow: 'Onde estamos',
    map_title: 'Vem visitar-nos',

    chat_title: 'Assistente LS',
    chat_subtitle: 'Normalmente responde em segundos',
    chat_intro: 'Olá! 👋 Sou o assistente do LS Beauty Studio. Pergunta-me sobre horários, preços, serviços ou marcações.',
    chat_quick_hours: 'Horários',
    chat_quick_prices: 'Preços',
    chat_quick_book: 'Marcar',
    chat_quick_hours_msg: 'Quais são os horários?',
    chat_quick_prices_msg: 'Quanto custam os serviços?',
    chat_quick_book_msg: 'Como faço uma marcação?',
    chat_placeholder: 'Escreve a tua pergunta…',
    chat_error: 'Ups, houve um problema de ligação. Tenta novamente.',

    notfound_title: 'Esta página não existe',
    notfound_btn: 'Voltar ao início',

    nav_login: 'Entrar',
    nav_register: 'Registar',
    nav_logout: 'Sair',
    form_password: 'Palavra-passe',
    form_password_confirm: 'Confirmar palavra-passe',
    auth_register_eyebrow: 'Criar conta',
    auth_register_title: 'Junta-te ao LS Beauty Studio',
    auth_register_sub: 'Cria a tua conta para acompanhares as tuas marcações.',
    auth_register_btn: 'Criar conta',
    auth_login_eyebrow: 'Entrar',
    auth_login_title: 'Bem-vinda de volta',
    auth_login_sub: 'Entra para veres as tuas marcações.',
    auth_login_btn: 'Entrar',
    auth_have_account: 'Já tens conta?',
    auth_no_account: 'Ainda não tens conta?',
    auth_error_fields: 'Preenche todos os campos.',
    auth_error_email: 'Introduz um email válido.',
    auth_error_password_short: 'A palavra-passe deve ter pelo menos 6 caracteres.',
    auth_error_password_match: 'As palavras-passe não coincidem.',
    auth_error_exists: 'Já existe uma conta com este email.',
    auth_error_credentials: 'Email ou palavra-passe incorretos.',
    account_eyebrow: 'A minha conta',
    account_greeting: 'Olá,',
    account_bookings_eyebrow: 'Histórico',
    account_bookings_title: 'As tuas marcações',
    account_no_bookings: 'Ainda não tens marcações.'
  },
  en: {
    nav_home: 'Home',
    nav_services: 'Services',
    nav_book: 'Book',
    nav_contact: 'Contact',

    hero_eyebrow: 'Benfica · Lisbon',
    hero_title_pre: 'Beauty you ',
    hero_title_em: 'feel',
    hero_title_post: ',\nbefore you see it.',
    hero_sub: 'Nails, hair, brows, lashes and facial aesthetics — in a space designed for you to slow down.',
    hero_btn_book: 'Book a session',
    hero_btn_services: 'View services',
    hero_scroll: 'Discover more',

    stats_services: 'Specialized services',
    stats_categories: 'Treatment categories',
    stats_hours_label: 'Opening hours',
    stats_products: 'Professional products',

    intro_eyebrow: 'The studio',
    intro_title: 'Attentive care, in every detail.',
    intro_body: 'At LS Beauty Studio, every appointment is a moment just for you. We work with quality products and current techniques, in a calm setting in the heart of Benfica.',
    intro_quote: '"It\'s not just about nails or hair — it\'s about leaving here feeling more like yourself."',
    intro_quote_author: '— LS Beauty Studio team',

    hours_eyebrow: 'Hours',
    hours_title: "We're here when you need us",
    hours_body: 'Open Tuesday to Saturday. Book ahead to secure the time that suits you best.',
    day_mon: 'Monday',
    day_tue: 'Tuesday',
    day_wed: 'Wednesday',
    day_thu: 'Thursday',
    day_fri: 'Friday',
    day_sat: 'Saturday',
    day_sun: 'Sunday',
    closed: 'Closed',
    hours_time_range: '10am – 7:30pm',

    why_eyebrow: 'Why us',
    why_title: 'What sets us apart',
    why_1_title: 'Genuine care',
    why_1_body: 'Every appointment gets full attention — no rush, no routine.',
    why_2_title: 'Quality products',
    why_2_body: 'We only work with professional brands, chosen with skin and nail health in mind.',
    why_3_title: 'No waiting around',
    why_3_body: 'Simple online booking, so your schedule is never a problem.',
    why_4_title: 'A calm space',
    why_4_body: 'A space designed for you to slow down, in the heart of Benfica.',

    services_eyebrow: 'Services',
    services_title: 'What we do for you',
    services_from: 'from',
    services_see_all: 'See all services',

    gallery_eyebrow: 'Gallery',
    gallery_title: 'Work that speaks for itself',

    pricing_eyebrow: 'Pricing',
    pricing_title: 'Invest in yourself, no surprises',
    pricing_btn: 'Book a session',

    cta_title: 'Ready for your moment of care?',
    cta_btn: 'Book now',

    footer_hours: 'Hours',
    footer_hours_days: 'Tuesday – Saturday',
    footer_hours_time: '10am – 7:30pm',
    footer_explore: 'Explore',
    footer_follow: 'Follow us',
    footer_rights: 'All rights reserved.',

    page_services_eyebrow: 'Services',
    page_services_title: 'The full menu',
    page_services_sub: 'Prices and durations — pick what you need and book in seconds.',

    page_book_eyebrow: 'Booking',
    page_book_title: 'Reserve your session',
    page_book_sub: 'Choose the service, day and time you prefer.',
    form_name: 'Full name',
    form_phone: 'Phone',
    form_email: 'Email',
    form_service: 'Service',
    form_service_placeholder: 'Choose a service',
    form_date: 'Date',
    form_time: 'Time',
    form_notes: 'Notes (optional)',
    form_notes_placeholder: 'Any preference or special request?',
    form_confirm: 'Confirm booking',
    booking_success_title: 'Booking received! 🎉',
    booking_success_body: 'We\'ll confirm shortly by email or phone. Thanks for choosing us.',
    booking_error_fields: 'Please fill in all required fields.',
    booking_error_conflict: 'That time slot is already booked. Please choose another.',

    page_contact_eyebrow: 'Contact',
    page_contact_title: 'Get in touch',
    contact_address_title: 'Address',
    contact_address: 'Rua Cláudio Nunes, nº8, Benfica, Lisbon',
    contact_hours_title: 'Hours',
    contact_social_title: 'Social media',
    form_message: 'Message',
    form_send: 'Send message',
    contact_success: 'Message sent! We\'ll get back to you as soon as possible.',
    map_eyebrow: 'Find us',
    map_title: 'Come visit us',

    chat_title: 'LS Assistant',
    chat_subtitle: 'Usually replies within seconds',
    chat_intro: 'Hi! 👋 I\'m the LS Beauty Studio assistant. Ask me about hours, prices, services or bookings.',
    chat_quick_hours: 'Hours',
    chat_quick_prices: 'Prices',
    chat_quick_book: 'Book',
    chat_quick_hours_msg: 'What are your opening hours?',
    chat_quick_prices_msg: 'How much do the services cost?',
    chat_quick_book_msg: 'How do I make a booking?',
    chat_placeholder: 'Type your question…',
    chat_error: 'Oops, there was a connection issue. Please try again.',

    notfound_title: 'This page doesn\'t exist',
    notfound_btn: 'Back to home',

    nav_login: 'Log in',
    nav_register: 'Sign up',
    nav_logout: 'Log out',
    form_password: 'Password',
    form_password_confirm: 'Confirm password',
    auth_register_eyebrow: 'Create account',
    auth_register_title: 'Join LS Beauty Studio',
    auth_register_sub: 'Create your account to keep track of your bookings.',
    auth_register_btn: 'Create account',
    auth_login_eyebrow: 'Log in',
    auth_login_title: 'Welcome back',
    auth_login_sub: 'Log in to see your bookings.',
    auth_login_btn: 'Log in',
    auth_have_account: 'Already have an account?',
    auth_no_account: 'Don\'t have an account yet?',
    auth_error_fields: 'Please fill in all fields.',
    auth_error_email: 'Enter a valid email.',
    auth_error_password_short: 'Password must be at least 6 characters.',
    auth_error_password_match: 'Passwords don\'t match.',
    auth_error_exists: 'An account with this email already exists.',
    auth_error_credentials: 'Incorrect email or password.',
    account_eyebrow: 'My account',
    account_greeting: 'Hi,',
    account_bookings_eyebrow: 'History',
    account_bookings_title: 'Your bookings',
    account_no_bookings: 'You don\'t have any bookings yet.'
  }
};

function t(lang, key) {
  return (dict[lang] && dict[lang][key]) || dict.pt[key] || key;
}

// Traduções dos dados dos serviços (guardados em português na base de dados)
const SERVICE_TRANSLATIONS = {
  'Manicure Clássica': { nome: 'Classic Manicure', descricao: 'Complete nail treatment with polish of your choice.' },
  'Verniz Gel': { nome: 'Gel Polish', descricao: 'Long-lasting gel polish application.' },
  'Pedicure Spa': { nome: 'Spa Pedicure', descricao: 'Exfoliation, hydration and polish.' },
  'Extensão de Pestanas': { nome: 'Eyelash Extensions', descricao: 'Lash-by-lash volume effect.' },
  'Design de Sobrancelhas': { nome: 'Eyebrow Design', descricao: 'Personalized shaping and definition.' },
  'Corte + Escova': { nome: 'Cut + Blow-dry', descricao: 'Cut tailored to your face with a shaping blow-dry.' },
  'Coloração Completa': { nome: 'Full Coloring', descricao: 'Even color from root to tip.' },
  'Limpeza de Pele': { nome: 'Facial Cleansing', descricao: 'Deep cleansing with extraction and a soothing mask.' },
  'Massagem Relaxante': { nome: 'Relaxing Massage', descricao: 'Full-body massage to relieve tension.' }
};

const CATEGORY_TRANSLATIONS = {
  'Unhas': 'Nails',
  'Olhar': 'Eyes',
  'Cabelo': 'Hair',
  'Estética Facial': 'Facial Aesthetics',
  'Corpo': 'Body'
};

function localizeServicos(servicos, lang) {
  if (lang !== 'en') return servicos;
  return servicos.map((s) => {
    const tr = SERVICE_TRANSLATIONS[s.nome];
    return {
      ...s,
      nome: tr ? tr.nome : s.nome,
      descricao: tr ? tr.descricao : s.descricao,
      categoria: CATEGORY_TRANSLATIONS[s.categoria] || s.categoria
    };
  });
}

module.exports = { t, localizeServicos };
