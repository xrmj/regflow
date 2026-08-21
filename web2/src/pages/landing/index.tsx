import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import styles from './landing.module.css';

const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;

type PlanState = {
  plan: string;
  price: string;
  cycle: string;
};

type FormData = {
  cardholder: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const InitialForm: FormData = {
  cardholder: '',
  email: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const InitialPlan: PlanState = {
  plan: 'Monthly',
  price: '29',
  cycle: 'month',
};

function validate(payload: FormData): string | null {
  if (!payload.cardholder || payload.cardholder.trim().length < 2)
    return 'Please enter the cardholder name.';
  if (
    !payload.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())
  )
    return 'Please enter a valid email address.';
  const digits = payload.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return 'Card number must be 13–19 digits.';
  if (!/^\d{2}\/\d{2}$/.test(payload.expiry))
    return 'Expiry must be in MM/YY format.';
  const [mm, yy] = payload.expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Expiry month is invalid.';
  const now = new Date();
  const expDate = new Date(2000 + yy, mm);
  if (expDate <= now) return 'Card has expired.';
  if (!/^\d{3,4}$/.test(payload.cvc)) return 'CVC must be 3–4 digits.';
  return null;
}

function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<PlanState>(InitialPlan);
  const [formData, setFormData] = useState<FormData>(InitialForm);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const cardholderRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback((plan: string, price: string, cycle: string) => {
    setCurrent({ plan, price, cycle });
    setFormData(InitialForm);
    setErrorMsg('');
    setSuccessMsg('');
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      const t = window.setTimeout(() => cardholderRef.current?.focus(), 50);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [modalOpen]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalOpen) closeModal();
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [modalOpen, closeModal]);

  const handleStartMonthly = useCallback(() => {
    openModal('Monthly', '29', 'month');
  }, [openModal]);
  const handleStartQuarterly = useCallback(() => {
    openModal('Quarterly', '79', 'quarter');
  }, [openModal]);
  const handleStartYearly = useCallback(() => {
    openModal('Yearly', '279', 'year');
  }, [openModal]);

  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal],
  );

  const handleCardholderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, cardholder: e.target.value }));
    },
    [],
  );
  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  }, []);
  const handleCardNumberChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    },
    [],
  );
  const handleExpiryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
      const formatted =
        digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setFormData((prev) => ({ ...prev, expiry: formatted }));
    },
    [],
  );
  const handleCvcChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, cvc: cleaned }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');
      const err = validate(formData);
      if (err) {
        setErrorMsg(err);
        return;
      }
      setSuccessMsg('开通成功，请使用开通邮箱登录');
      window.setTimeout(() => {
        closeModal();
        window.location.href = '/login';
      }, 1800);
    },
    [formData, closeModal],
  );

  return (
    <div className={styles.page}>
      <div className={cn(styles.glow, styles.one)}></div>
      <div className={cn(styles.glow, styles.two)}></div>

      <div className={styles.shell}>
        <nav className={styles.nav}>
          <a className={styles.brand} href="#top" aria-label="LocalSpace Home">
            <span className={styles['brand-mark']} aria-hidden="true">
              <img src={logoUrl} alt="LocalSpace logo" />
            </span>
            <span>
              LocalSpace<small>Local AI Knowledge Base</small>
            </span>
          </a>
          <div className={styles['nav-links']}>
            <div className={styles['nav-dropdown']}>
              <button
                type="button"
                className={styles['nav-dropdown-trigger']}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Solutions
                <svg
                  className={styles['nav-dropdown-caret']}
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 4.5l3.5 3.5 3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={styles['nav-dropdown-menu']} role="menu">
                <a
                  className={styles['nav-dropdown-item']}
                  href="#solutions-finance"
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 19V9m5 10V5m5 14v-8m5 8V7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Financial Services
                </a>
                <a
                  className={styles['nav-dropdown-item']}
                  href="#solutions-legal"
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3v18M5 8h14M6 8l-2 6a4 4 0 0 0 8 0L10 8M14 8l-2 6a4 4 0 0 0 8 0L18 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Legal & Compliance
                </a>
                <a
                  className={styles['nav-dropdown-item']}
                  href="#solutions-manufacturing"
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 20V10l5 3V10l5 3V6l6 4v10z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Manufacturing
                </a>
                <a
                  className={styles['nav-dropdown-item']}
                  href="#solutions-education"
                  role="menuitem"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 9l10-5 10 5-10 5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  Education
                </a>
              </div>
            </div>
            <a href="#features">Core Features</a>
            <a href="#showcase">Showcase</a>
            <a href="#workflow">Workflow</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <a
            className={styles['pill-button']}
            href="/login"
          >
            Free Trial &#8599;
          </a>
        </nav>
      </div>

      <header className={styles.hero} id="top">
        <div className={cn(styles.shell, styles['hero-grid'])}>
          <div>
            <div className={styles.eyebrow}>
              <svg
                className={styles['eyebrow-icon']}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z"
                  fill="currentColor"
                />
                <path
                  d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"
                  fill="currentColor"
                  opacity=".7"
                />
              </svg>{' '}
              Private Knowledge Base &middot; RAG-Enhanced Retrieval &middot;
              Traceable Answers
            </div>
            <h1>
              <span className={styles['gradient-text']}>
                Turn Local Documents
              </span>
              <br />
              Into an AI Assistant That Thinks
            </h1>
            <p className={styles['hero-desc']}>
              LocalSpace is an intelligent Q&A platform for enterprise and
              personal knowledge assets. It parses complex documents, builds
              searchable knowledge indexes, generates accurate answers through
              retrieval augmentation, and preserves citations so your local RAG
              site stays useful, reliable, and verifiable.
            </p>
            <div className={styles.actions}>
              <a
                className={cn(styles.btn, styles['btn-primary'])}
                href="/login"
              >
                Launch LocalSpace
              </a>
              <a
                className={cn(styles.btn, styles['btn-dark'])}
                href="#features"
              >
                Explore Features
              </a>
            </div>
            <div className={styles['status-row']}>
              <span className={styles.status}>
                <i className={styles['status-dot']}></i> Local deployment entry
                configured
              </span>
              <span className={styles.status}>
                Knowledge Q&A / Citation tracing / Multi-turn chat
              </span>
            </div>
          </div>

          <div
            className={styles['product-panel']}
            aria-label="LocalSpace product interface showcase"
          >
            <div className={styles['mock-window']}>
              <div className={styles['window-bar']}>
                <div className={styles.dots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>LocalSpace Console &middot; Knowledge Chat</span>
              </div>
              <div className={styles.dashboard}>
                <aside className={styles.sidebar}>
                  <div className={styles['side-title']}>Knowledge Bases</div>
                  <div className={styles['kb-item']}>
                    <strong>Corporate Policy KB</strong>
                    <span>128 docs &middot; Vectorized</span>
                  </div>
                  <div className={styles['kb-item']}>
                    <strong>Product Manual Hub</strong>
                    <span>84 docs &middot; Semantic retrieval</span>
                  </div>
                  <div className={styles['kb-item']}>
                    <strong>Support Ticket Archive</strong>
                    <span>3,629 chunks &middot; Traceable</span>
                  </div>
                  <div className={styles['kb-item']}>
                    <strong>Project Delivery Docs</strong>
                    <span>31 docs &middot; Multi-turn Q&A</span>
                  </div>
                </aside>
                <div className={styles['chat-area']}>
                  <div className={styles.question}>
                    How can I quickly generate a customer-facing Q&A brief from
                    internal company documents?
                  </div>
                  <div className={styles.answer}>
                    Start by selecting the "Product Manual Hub" and "Support
                    Ticket Archive" knowledge bases. LocalSpace will retrieve
                    highly relevant passages from related documents, then
                    compose a structured response with sources attached to each
                    conclusion for fast review.
                    <div className={styles['citation-grid']}>
                      <div className={styles.citation}>
                        <span>Product Feature Guide.pdf &middot; Page 12</span>
                        <span className={styles.score}>96%</span>
                      </div>
                      <div className={styles.citation}>
                        <span>After-Sales FAQ.xlsx &middot; Sheet 2</span>
                        <span className={styles.score}>91%</span>
                      </div>
                      <div className={styles.citation}>
                        <span>
                          Customer Delivery Handbook.docx &middot; Section 3.4
                        </span>
                        <span className={styles.score}>87%</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles['input-bar']}>
                    <span>Follow up: rewrite this as a sales script...</span>
                    <span className={styles.send}>&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="features">
          <div className={styles.shell}>
            <div className={styles['section-head']}>
              <div>
                <div className={styles['section-kicker']}>Core Features</div>
                <h2>
                  From Document Parsing to Intelligent Answers, LocalSpace
                  Connects the Entire Pipeline
                </h2>
              </div>
              <p className={styles['section-desc']}>
                Ideal for enterprise knowledge bases, internal assistants,
                product Q&A, support knowledge centers, and R&D document search
                systems.
              </p>
            </div>

            <div className={styles['feature-grid']}>
              <article
                className={styles['feature-card']}
                id="document-parsing"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M5 4.8A2.8 2.8 0 0 1 7.8 2H20v17H7.4A2.4 2.4 0 0 0 5 21.4V4.8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 19.2A2.8 2.8 0 0 1 7.8 16.4H20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 6.5h7M9 10h5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Complex Document Parsing</h3>
                <p>
                  Import PDFs, Word files, Excel sheets, web pages, and more
                  while preserving paragraphs, tables, and hierarchy to reduce
                  knowledge loss.
                </p>
              </article>
              <article
                className={styles['feature-card']}
                id="rag-generation"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9 4.5A3.5 3.5 0 0 0 5.5 8v.5A3.5 3.5 0 0 0 4 15a4 4 0 0 0 7.5 2M15 4.5A3.5 3.5 0 0 1 18.5 8v.5A3.5 3.5 0 0 1 20 15a4 4 0 0 1-7.5 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5v14M8 9.5h2M14 9.5h2M8.5 14H10M14 14h1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Retrieval-Augmented Generation</h3>
                <p>
                  Combine semantic retrieval, keyword recall, and LLM generation
                  so answers are grounded in real documents instead of
                  guesswork.
                </p>
              </article>
              <article
                className={styles['feature-card']}
                id="citation-tracing"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9.5 14.5l5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 6.5l1.1-1.1a4.2 4.2 0 0 1 5.9 5.9l-1.8 1.8a4.2 4.2 0 0 1-5.4.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13.5 17.5l-1.1 1.1a4.2 4.2 0 0 1-5.9-5.9l1.8-1.8a4.2 4.2 0 0 1 5.4-.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Citation Source Tracing</h3>
                <p>
                  Automatically attach cited passages, source documents, and
                  relevance scores for auditing, review, and continuous
                  improvement.
                </p>
              </article>
              <article
                className={styles['feature-card']}
                id="knowledge-qa"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-4.8 4v-4.4A3.5 3.5 0 0 1 5 12V6.5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 8h7M8.5 11h4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Multi-Turn Knowledge Q&A</h3>
                <p>
                  Support contextual follow-ups, summaries, rewrites,
                  extraction, and comparisons so the knowledge base works like
                  a real assistant.
                </p>
              </article>
              <article
                className={styles['feature-card']}
                id="local-deployment"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3l7 2.8v5.5c0 4.4-2.8 7.8-7 9.7-4.2-1.9-7-5.3-7-9.7V5.8L12 3z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Private Local Deployment</h3>
                <p>
                  Designed for local or intranet environments, keeping documents
                  on your own server for sensitive and internal use cases.
                </p>
              </article>
              <article
                className={styles['feature-card']}
                id="model-configuration"
              >
                <div className={styles['feature-icon']}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 15.4A3.4 3.4 0 1 0 12 8.6a3.4 3.4 0 0 0 0 6.8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M19.4 13.5a7.7 7.7 0 0 0 0-3l2-1.5-2-3.5-2.4 1a8.2 8.2 0 0 0-2.6-1.5L14 2.5h-4L9.6 5a8.2 8.2 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.7 7.7 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5A8.2 8.2 0 0 0 17 17.5l2.4 1 2-3.5-2-1.5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Flexible Model Configuration</h3>
                <p>
                  Configure models, prompts, knowledge scopes, and retrieval
                  strategies to create dedicated assistants for different
                  business lines.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="showcase">
          <div className={styles.shell}>
            <div className={styles['section-head']}>
              <div>
                <div className={styles['section-kicker']}>Showcase</div>
                <h2>More Than Q&A: A Command Center for Knowledge Work</h2>
              </div>
              <p className={styles['section-desc']}>
                Unify knowledge collection, search, answers, citations, and
                summaries so teams spend less time digging and more time acting.
              </p>
            </div>

            <div className={styles.showcase}>
              <div className={styles.metric}>
                <strong>PDF</strong>
                <span>
                  Parse contracts, reports, papers, and proposal documents
                </span>
              </div>
              <div className={styles.metric}>
                <strong>Excel</strong>
                <span>
                  Bulk-import tabular knowledge, data notes, and FAQs
                </span>
              </div>
              <div className={styles.metric}>
                <strong>Chat</strong>
                <span>
                  Ask in natural language, follow up, and generate summaries
                </span>
              </div>
              <div className={styles.metric}>
                <strong>Trace</strong>
                <span>
                  Trace citations to reduce errors and hallucination risk
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow">
          <div className={styles.shell}>
            <div className={styles['section-head']}>
              <div>
                <div className={styles['section-kicker']}>Workflow</div>
                <h2>A Typical Local LocalSpace Workflow</h2>
              </div>
              <p className={styles['section-desc']}>
                From ingestion to business use, organize documents by knowledge
                base and let the workflow do the rest.
              </p>
            </div>

            <div className={styles['flow-panel']}>
              <div className={styles.flow}>
                <div className={styles['flow-step']}>
                  <b>1</b>
                  <h3>Create a Knowledge Base</h3>
                  <p>
                    Create independent knowledge spaces by business line,
                    department, or project.
                  </p>
                </div>
                <div className={styles['flow-step']}>
                  <b>2</b>
                  <h3>Upload Documents</h3>
                  <p>
                    Import PDFs, Word files, Excel sheets, web pages, or text
                    documents.
                  </p>
                </div>
                <div className={styles['flow-step']}>
                  <b>3</b>
                  <h3>Parse and Chunk</h3>
                  <p>
                    Automatically clean, chunk, embed, and build retrieval
                    indexes.
                  </p>
                </div>
                <div className={styles['flow-step']}>
                  <b>4</b>
                  <h3>Configure the Assistant</h3>
                  <p>
                    Set the model, prompts, citation rules, and response style.
                  </p>
                </div>
                <div className={styles['flow-step']}>
                  <b>5</b>
                  <h3>Start Asking</h3>
                  <p>
                    Open the entry point to your team and continuously grow
                    high-value knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className={styles.shell}>
            <div className={styles['section-head']}>
              <div>
                <div className={styles['section-kicker']}>Pricing</div>
                <h2>Choose the Billing Cycle That Fits Your Team</h2>
              </div>
              <p className={styles['section-desc']}>
                Every plan unlocks the full LocalSpace experience &mdash; deep
                document parsing, hybrid retrieval, and cited answers. Pick the
                cadence that matches your rollout.
              </p>
            </div>

            <div className={styles['pricing-grid']}>
              <article className={styles['price-card']}>
                <div className={styles['price-plan']}>Monthly</div>
                <div className={styles['price-tagline']}>
                  Try it out or run a short pilot with no long-term commitment.
                </div>
                <div className={styles['price-amount']}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.value}>29</span>
                  <span className={styles.cycle}>/ month</span>
                </div>
                <div className={styles['price-note']}>
                  Billed monthly, cancel anytime.
                </div>
                <ul className={styles['price-features']}>
                  <li>Unlimited knowledge bases and documents</li>
                  <li>Deep parsing for PDF, Office, HTML, images</li>
                  <li>Hybrid vector + keyword retrieval</li>
                  <li>Cited, traceable answers</li>
                  <li>Community support</li>
                </ul>
                <div className={styles['price-cta']}>
                  <button
                    type="button"
                    className={cn(styles.btn, styles['btn-primary'])}
                    onClick={handleStartMonthly}
                  >
                    Start Monthly
                  </button>
                </div>
              </article>

              <article
                className={cn(styles['price-card'], styles.featured)}
              >
                <span className={styles['price-badge']}>Popular</span>
                <div className={styles['price-plan']}>Quarterly</div>
                <div className={styles['price-tagline']}>
                  A balanced cadence for teams growing their knowledge base.
                </div>
                <div className={styles['price-amount']}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.value}>79</span>
                  <span className={styles.cycle}>/ quarter</span>
                </div>
                <div className={styles['price-note']}>
                  Roughly $26.33 / month &middot;{' '}
                  <span className={styles['price-save']}>Save 9%</span>
                </div>
                <ul className={styles['price-features']}>
                  <li>Everything in Monthly</li>
                  <li>Up to 10 team members with roles</li>
                  <li>Scheduled document ingestion</li>
                  <li>Advanced reranking and prompt templates</li>
                  <li>Email support with 48h response</li>
                </ul>
                <div className={styles['price-cta']}>
                  <button
                    type="button"
                    className={cn(styles.btn, styles['btn-primary'])}
                    onClick={handleStartQuarterly}
                  >
                    Start Quarterly
                  </button>
                </div>
              </article>

              <article className={styles['price-card']}>
                <div className={styles['price-plan']}>Yearly</div>
                <div className={styles['price-tagline']}>
                  The best value for teams running LocalSpace in production.
                </div>
                <div className={styles['price-amount']}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.value}>279</span>
                  <span className={styles.cycle}>/ year</span>
                </div>
                <div className={styles['price-note']}>
                  Roughly $23.25 / month &middot;{' '}
                  <span className={styles['price-save']}>Save 20%</span>
                </div>
                <ul className={styles['price-features']}>
                  <li>Everything in Quarterly</li>
                  <li>Unlimited team members and workspaces</li>
                  <li>Priority support with 4h response</li>
                  <li>Custom integrations and model routing</li>
                  <li>Annual roadmap review session</li>
                </ul>
                <div className={styles['price-cta']}>
                  <button
                    type="button"
                    className={cn(styles.btn, styles['btn-primary'])}
                    onClick={handleStartYearly}
                  >
                    Start Yearly
                  </button>
                </div>
              </article>

              <article className={styles['price-card']}>
                <div className={styles['price-plan']}>Custom</div>
                <div className={styles['price-tagline']}>
                  Tailored deployment and pricing for organizations with
                  specific requirements.
                </div>
                <div className={styles['price-amount']}>
                  <span className={styles.value}>Contact us</span>
                </div>
                <div className={styles['price-note']}>
                  Bespoke plan aligned to your scale and compliance needs.
                </div>
                <ul className={styles['price-features']}>
                  <li>Everything in Yearly</li>
                  <li>Dedicated deployment and onboarding</li>
                  <li>Private model hosting and SSO</li>
                  <li>Custom SLA and dedicated account manager</li>
                  <li>Security review and compliance support</li>
                </ul>
                <div className={styles['price-cta']}>
                  <a
                    className={cn(styles.btn, styles['btn-primary'])}
                    href="#contact"
                  >
                    Contact Sales
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className={styles.shell}>
            <div className={styles['contact-layout']}>
              <div className={styles['contact-card']}>
                <h2>Contact Us</h2>
                <form
                  className={styles['contact-form']}
                  action="mailto:service@ragflow.local"
                  method="post"
                  encType="text/plain"
                >
                  <div className={styles['form-row']}>
                    <div className={styles.field}>
                      <label htmlFor="firstName">
                        First Name <span>*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="lastName">
                        Last Name <span>*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email">
                      Business Email <span>*</span>
                    </label>
                    <input id="email" name="email" type="email" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="company">
                      Company Name <span>*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="message">
                      Message <span>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                    ></textarea>
                  </div>
                  <button className={styles['submit-btn']} type="submit">
                    Submit
                  </button>
                </form>
              </div>

              <aside className={styles['contact-info-card']}>
                <h3>Get in touch</h3>
                <p className={styles['contact-info-intro']}>
                  Reach out for deployment help, custom integrations, or
                  partnership inquiries. Our team responds within one business
                  day.
                </p>
                <ul className={styles['contact-info-list']}>
                  <li>
                    <span
                      className={styles['contact-info-icon']}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6h16v12H4z" />
                        <path d="M4 7l8 6 8-6" />
                      </svg>
                    </span>
                    <div>
                      <small>Email</small>
                      <a href="mailto:service@ragflow.local">
                        service@ragflow.local
                      </a>
                    </div>
                  </li>
                  <li>
                    <span
                      className={styles['contact-info-icon']}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6.6 3.8l3 3-2 2c1.2 2.5 3.1 4.4 5.6 5.6l2-2 3 3-1.4 3c-.4.9-1.4 1.4-2.4 1.1C9 18.1 5.9 15 4.5 9.6c-.3-1 .2-2 1.1-2.4l1-3.4z" />
                      </svg>
                    </span>
                    <div>
                      <small>Phone</small>
                      <a href="tel:+12098027093">+1 209 802 7093</a>
                    </div>
                  </li>
                  <li>
                    <span
                      className={styles['contact-info-icon']}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.3" />
                      </svg>
                    </span>
                    <div>
                      <small>Address</small>
                      <strong>
                        332 2nd Ave N, Greybull, WY, United States
                      </strong>
                    </div>
                  </li>
                  <li>
                    <span
                      className={styles['contact-info-icon']}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3 12h18" />
                      </svg>
                    </span>
                    <div>
                      <small>Business hours</small>
                      <strong>
                        Mon&ndash;Fri &middot; 9:00 &ndash; 18:00 (PST)
                      </strong>
                    </div>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles['solutions-section']} id="solutions">
          <div className={styles.shell}>
            <article
              className={styles['solution-card']}
              id="solutions-finance"
            >
              <div className={styles['solution-hero']}>
                <h1>
                  Convert diverse financial data into informed decisions
                </h1>
                <p>
                  Tailor financial scenarios with multimodal data parsing and
                  traceable techniques to de-risk investments, streamline
                  business operations and enhance your competitive position.
                </p>
              </div>

              <div className={styles['solution-features']}>
                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g opacity=".45">
                        <rect x="8" y="46" width="42" height="52" rx="4" />
                        <line x1="16" y1="60" x2="42" y2="60" />
                        <line x1="16" y1="70" x2="36" y2="70" />
                        <line x1="16" y1="80" x2="42" y2="80" />
                      </g>
                      <g opacity=".75">
                        <rect x="22" y="36" width="42" height="52" rx="4" />
                        <line x1="30" y1="50" x2="56" y2="50" />
                        <line x1="30" y1="60" x2="50" y2="60" />
                        <line x1="30" y1="70" x2="56" y2="70" />
                      </g>
                      <path d="M72 62 h22" strokeDasharray="3 3" />
                      <path d="M100 46 l24 -6 v56 l-24 -6 z" />
                      <circle cx="112" cy="68" r="4" fill="currentColor" stroke="none" />
                      <path d="M126 68 h20" strokeDasharray="3 3" />
                      <g>
                        <rect x="150" y="34" width="80" height="16" rx="3" />
                        <line x1="158" y1="42" x2="220" y2="42" opacity=".5" />
                      </g>
                      <g>
                        <rect x="150" y="60" width="80" height="16" rx="3" />
                        <line x1="158" y1="68" x2="210" y2="68" opacity=".5" />
                      </g>
                      <g>
                        <rect x="150" y="86" width="80" height="16" rx="3" />
                        <line x1="158" y1="94" x2="220" y2="94" opacity=".5" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3>Connect analysis with operations</h3>
                    <ul>
                      <li>
                        A one-stop solution for cleansing and extracting
                        multimodal data including reports, contracts and
                        recordings.
                      </li>
                      <li>
                        Auto-recognize financial document layouts to produce
                        traceable knowledge chunks.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="120" cy="70" r="42" opacity=".35" />
                      <circle cx="120" cy="70" r="30" opacity=".6" />
                      <circle cx="120" cy="70" r="12" />
                      <path d="M126 76 l10 10" strokeWidth="2" />
                      <g>
                        <rect x="52" y="60" width="20" height="20" rx="3" />
                        <line x1="56" y1="66" x2="68" y2="66" opacity=".5" />
                        <line x1="56" y1="72" x2="64" y2="72" opacity=".5" />
                      </g>
                      <g>
                        <rect x="168" y="60" width="20" height="20" rx="3" />
                        <line x1="172" y1="66" x2="184" y2="66" opacity=".5" />
                        <line x1="172" y1="72" x2="180" y2="72" opacity=".5" />
                      </g>
                      <g>
                        <rect x="110" y="14" width="20" height="14" rx="2" />
                        <line x1="114" y1="21" x2="126" y2="21" opacity=".5" />
                      </g>
                      <g>
                        <rect x="110" y="112" width="20" height="14" rx="2" />
                        <line x1="114" y1="119" x2="126" y2="119" opacity=".5" />
                      </g>
                      <path
                        d="M72 70 h30 M138 70 h30 M120 28 v20 M120 92 v20"
                        strokeDasharray="2 3"
                        opacity=".55"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Decision-ready industry insights</h3>
                    <ul>
                      <li>
                        Combine entity extraction with semantic and
                        context-aware structures to locate and interpret
                        statutes from massive reports, cases and contracts.
                      </li>
                      <li>
                        Each response cites its source, enabling one-click
                        navigation to the original paragraph or clause.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="16" y="30" width="60" height="80" rx="6" opacity=".7" />
                      <circle cx="46" cy="52" r="10" />
                      <path
                        d="M42 52 a4 4 0 0 0 8 0 M46 48 v-3 M46 59 v-3 M40 52 h-3 M55 52 h-3"
                        opacity=".8"
                      />
                      <g>
                        <rect x="24" y="76" width="10" height="20" fill="currentColor" opacity=".55" />
                        <rect x="38" y="70" width="10" height="26" fill="currentColor" opacity=".75" />
                        <rect x="52" y="82" width="10" height="14" fill="currentColor" opacity=".55" />
                      </g>
                      <g opacity=".6">
                        <rect x="90" y="38" width="26" height="16" rx="3" />
                        <text x="103" y="49" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none">
                          API
                        </text>
                      </g>
                      <g opacity=".6">
                        <rect x="90" y="86" width="26" height="16" rx="3" />
                        <text x="103" y="97" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none">
                          DB
                        </text>
                      </g>
                      <path
                        d="M76 60 h14 M76 80 h14 M116 46 h20 M116 94 h20"
                        strokeDasharray="3 3"
                        opacity=".5"
                      />
                      <g>
                        <rect x="146" y="26" width="80" height="88" rx="6" />
                        <line x1="156" y1="42" x2="216" y2="42" opacity=".55" />
                        <line x1="156" y1="56" x2="200" y2="56" opacity=".45" />
                        <line x1="156" y1="70" x2="216" y2="70" opacity=".45" />
                        <line x1="156" y1="84" x2="196" y2="84" opacity=".45" />
                        <line x1="156" y1="98" x2="210" y2="98" opacity=".45" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3>Research and risk workflows</h3>
                    <ul>
                      <li>
                        Integrate natively with mainstream financial data
                        sources to support research and decision-making.
                      </li>
                      <li>
                        Agent execution is transparent from data retrieval
                        through to analytical conclusions, building trust in
                        every response.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="90" y="55" width="60" height="42" rx="6" />
                      <path d="M108 68 h24 M108 78 h18 M108 86 h20" opacity=".55" />
                      <circle cx="60" cy="34" r="12" />
                      <path d="M52 46 a8 8 0 0 1 16 0" opacity=".6" />
                      <text x="60" y="20" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" opacity=".7">
                        Team
                      </text>
                      <circle cx="180" cy="34" r="12" />
                      <path d="M175 30 v10 h10 v-10 z M180 30 v-4" opacity=".8" />
                      <text x="180" y="20" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" opacity=".7">
                        Role
                      </text>
                      <circle cx="60" cy="110" r="12" />
                      <path d="M56 108 v-3 a4 4 0 0 1 8 0 v3 M52 108 h16 v6 h-16 z" opacity=".8" />
                      <text x="60" y="130" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" opacity=".7">
                        Permission
                      </text>
                      <circle cx="180" cy="110" r="12" />
                      <path d="M172 106 h16 v10 h-16 z M172 106 l4 -4 h8 l4 4" opacity=".8" />
                      <text x="180" y="130" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" opacity=".7">
                        Project
                      </text>
                      <path
                        d="M72 42 l16 12 M168 42 l-16 12 M72 102 l16 -12 M168 102 l-16 -12"
                        strokeDasharray="2 3"
                        opacity=".55"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Granular access control</h3>
                    <ul>
                      <li>
                        Real-time document-level ACLs enable fine-tuned control,
                        ensuring users' access to data is precisely scoped to
                        their organizational privileges.
                      </li>
                      <li>
                        Implement granular, multi-level isolation (tenant,
                        department, role and project-level), enforcing strict
                        static and dynamic security boundaries.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className={styles['use-cases-heading']}>Use cases</h2>
              <div className={styles['use-cases-grid']}>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 19V9m5 10V5m5 14v-8m5 8V7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 19h16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Research assistant</h4>
                  <p>
                    A query "Analyze NVDA recent quarter AI revenue" triggers
                    retrieval from internal reports, external research and raw
                    data, culminating in an AI-generated citeable brief.
                  </p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="9"
                      r="3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Sales compliance assistant</h4>
                  <p>
                    Check sales scripts and product recommendations against
                    regulatory and institutional rules in real-time to reduce
                    sales compliance risks.
                  </p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8 9h2M8 13h2M8 17h2M13 8l2 2 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h4>Post-investment tracking assistant</h4>
                  <p>
                    RTrack portfolio companies' finance, operations and risk
                    signals, then generate traceable reports to support
                    informed decision-making.
                  </p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3h8l4 4v14H7z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 3v4h4M10 12h6M10 16h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Compliance and audit assistant</h4>
                  <p>
                    Consolidate regulatory documents and internal rules,
                    enabling auditors to quickly locate compliance evidence.
                  </p>
                </div>
              </div>
            </article>

            <article
              className={styles['solution-card']}
              id="solutions-legal"
            >
              <div className={styles['solution-hero']}>
                <h1>Turn contracts and case files into defensible conclusions</h1>
                <p>
                  For law firms and in-house legal teams, unify contracts, due
                  diligence materials, and statutes or case law to produce
                  review outcomes that are verifiable, citeable, and ready to
                  deliver.
                </p>
              </div>

              <div className={styles['solution-stack']}>
                <div className={styles['solution-row']}>
                  <div>
                    <h3>Contract and dossier understanding</h3>
                    <ul>
                      <li>Parse clause structure, key obligations, and risk hotspots</li>
                      <li>
                        Extract parties, key dates and terms, breach triggers,
                        and dispute resolution elements
                      </li>
                      <li>
                        Build an evidence timeline and an indexed exhibit list
                        from case materials
                      </li>
                    </ul>
                  </div>
                  <div className={styles['solution-row-visual']}>
                    <svg
                      viewBox="0 0 320 200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g opacity=".55">
                        <rect x="20" y="66" width="70" height="68" rx="5" />
                        <path d="M20 82 h70" opacity=".7" />
                        <text x="55" y="78" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Contract
                        </text>
                      </g>
                      <g opacity=".75">
                        <rect x="34" y="52" width="70" height="68" rx="5" />
                        <path d="M34 68 h70" opacity=".7" />
                        <text x="69" y="64" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Case File
                        </text>
                        <path d="M46 82 h44 M46 92 h36 M46 102 h44" opacity=".5" />
                      </g>
                      <path d="M120 96 l30 0 m-6 -6 l6 6 -6 6" strokeWidth="1.6" />
                      <g>
                        <rect x="164" y="34" width="130" height="132" rx="6" />
                        <path d="M164 54 h130" opacity=".6" />
                        <text x="229" y="48" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none">
                          Structured Dossier
                        </text>
                        <g>
                          <circle cx="180" cy="72" r="4" />
                          <path d="M190 72 h90" opacity=".5" />
                        </g>
                        <g>
                          <circle cx="180" cy="92" r="4" />
                          <path d="M190 92 h80" opacity=".5" />
                        </g>
                        <g>
                          <circle cx="180" cy="112" r="4" />
                          <path d="M190 112 h94" opacity=".5" />
                        </g>
                        <g>
                          <circle cx="180" cy="132" r="4" />
                          <path d="M190 132 h74" opacity=".5" />
                        </g>
                        <g>
                          <circle cx="180" cy="152" r="4" />
                          <path d="M190 152 h84" opacity=".5" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>

                <div className={cn(styles['solution-row'], styles.reverse)}>
                  <div>
                    <h3>Argument-ready retrieval</h3>
                    <ul>
                      <li>Locate the exact source text by clause, issue, or party</li>
                      <li>Attach relevant statutes and precedents to each conclusion</li>
                      <li>
                        Support validation by highlighting missing support and
                        surfacing counterexamples
                      </li>
                    </ul>
                  </div>
                  <div className={styles['solution-row-visual']}>
                    <svg
                      viewBox="0 0 320 200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="160" cy="100" r="14" strokeWidth="1.8" />
                      <path d="M156 100 l3 3 5 -6" strokeWidth="1.8" />
                      <circle cx="160" cy="100" r="34" opacity=".6" />
                      <circle cx="160" cy="100" r="60" opacity=".35" strokeDasharray="4 4" />
                      <g opacity=".85">
                        <circle cx="112" cy="72" r="6" />
                        <text x="112" y="60" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          § Statute
                        </text>
                      </g>
                      <g opacity=".85">
                        <circle cx="208" cy="72" r="6" />
                        <text x="208" y="60" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Case #01
                        </text>
                      </g>
                      <g opacity=".85">
                        <circle cx="112" cy="140" r="6" />
                        <text x="112" y="158" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Precedent
                        </text>
                      </g>
                      <g opacity=".85">
                        <circle cx="208" cy="140" r="6" />
                        <text x="208" y="158" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Clause 4.2
                        </text>
                      </g>
                      <path
                        d="M112 78 L154 92 M208 78 L166 92 M112 134 L154 108 M208 134 L166 108"
                        opacity=".55"
                        strokeDasharray="3 3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className={styles['use-cases-heading']}>Use cases</h2>
              <div className={styles['use-cases-grid']}>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8v4M12 15.5v.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Contract risk review assistant</h4>
                  <p>
                    Contract risk review assistant: Identify high-risk clauses
                    and propose revisions with supporting authority.
                  </p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7M12 17v.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Due diligence Q&A</h4>
                  <p>
                    Generate a due diligence brief from public and internal
                    materials, with citations.
                  </p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8c2-3 4-3 6 0s4 3 6 0 4-3 4 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 16c2-3 4-3 6 0s4 3 6 0 4-3 4 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Litigation file organizer</h4>
                  <p>Produce timelines, issue lists, and exhibit numbering and indexes.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3h8l4 4v14H7z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 3v4h4M10 12h6M10 16h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Clause library and compliance templates</h4>
                  <p>
                    Standardize clause templates to reduce inconsistency across
                    collaborators.
                  </p>
                </div>
              </div>
            </article>

            <article
              className={styles['solution-card']}
              id="solutions-manufacturing"
            >
              <div className={styles['solution-hero']}>
                <h1>
                  Convert work orders and manuals into on-site resolution
                  playbooks
                </h1>
                <p>
                  For plant managers, equipment owners, and engineers, connect
                  manuals, work orders, and quality reports to reduce downtime,
                  rework, and information gaps on the shop floor.
                </p>
              </div>

              <div className={styles['solution-features']}>
                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="34" y="16" width="72" height="108" rx="5" opacity=".8" />
                      <path d="M46 32 h48 M46 42 h40 M46 52 h48 M46 62 h34" opacity=".55" />
                      <g>
                        <rect x="128" y="24" width="80" height="20" rx="4" />
                        <text x="168" y="38" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none">
                          Manuals
                        </text>
                      </g>
                      <g>
                        <rect x="128" y="52" width="80" height="20" rx="4" />
                        <text x="168" y="66" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none">
                          Alarms
                        </text>
                      </g>
                      <g>
                        <rect x="128" y="80" width="80" height="20" rx="4" />
                        <text x="168" y="94" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none">
                          Defects
                        </text>
                      </g>
                      <g>
                        <rect x="128" y="108" width="80" height="20" rx="4" />
                        <text x="168" y="122" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none">
                          Criteria
                        </text>
                      </g>
                      <path
                        d="M106 34 h20 M106 62 h20 M106 90 h20 M106 118 h20"
                        strokeDasharray="3 3"
                        opacity=".55"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Unify manuals and work orders</h3>
                    <ul>
                      <li>Ingest SOPs, work instructions, equipment manuals, and work order data</li>
                      <li>Identify parts, alarm codes, parameters, and step-by-step procedures</li>
                      <li>Extract defect types and acceptance criteria from quality reports</li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g opacity=".7">
                        <circle cx="46" cy="30" r="4" fill="currentColor" stroke="none" />
                        <circle cx="46" cy="55" r="4" fill="currentColor" stroke="none" />
                        <circle cx="46" cy="80" r="4" fill="currentColor" stroke="none" />
                        <circle cx="46" cy="105" r="4" fill="currentColor" stroke="none" />
                      </g>
                      <circle cx="118" cy="68" r="16" strokeWidth="1.8" />
                      <path d="M110 66 l6 6 12 -12" strokeWidth="1.8" />
                      <path d="M50 30 h60 M50 55 h60 M50 80 h60 M50 105 h60" strokeDasharray="3 3" opacity=".55" />
                      <g>
                        <rect x="156" y="16" width="72" height="20" rx="4" />
                        <text x="192" y="30" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          End-to-End
                        </text>
                      </g>
                      <g>
                        <rect x="156" y="44" width="72" height="20" rx="4" />
                        <text x="192" y="58" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Automation
                        </text>
                      </g>
                      <g>
                        <rect x="156" y="72" width="72" height="20" rx="4" />
                        <text x="192" y="86" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Dataset reuse
                        </text>
                      </g>
                      <g>
                        <rect x="156" y="100" width="72" height="20" rx="4" />
                        <text x="192" y="114" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Closed loop
                        </text>
                      </g>
                      <path
                        d="M134 62 h20 M134 68 h20 M134 74 h20 M134 82 h20"
                        strokeDasharray="2 3"
                        opacity=".5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Ops and quality closed loop</h3>
                    <ul>
                      <li>
                        Cover alerts, incident handling, and process changes end
                        to end, then generate work orders and analysis
                        conclusions
                      </li>
                      <li>
                        Turn team experience into reusable operational and
                        quality knowledge
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="102" y="52" width="36" height="36" rx="6" strokeWidth="1.8" />
                      <path d="M112 62 l8 8 8 -8 M120 62 v16" strokeWidth="1.8" />
                      <g>
                        <rect x="24" y="20" width="46" height="26" rx="4" />
                        <path d="M32 30 h6 v-4 h14 v10 h-20 z" opacity=".65" />
                      </g>
                      <g>
                        <rect x="170" y="20" width="46" height="26" rx="4" />
                        <path
                          d="M178 33 l6 -8 6 8 M184 25 v14 M196 25 h12 M196 33 h9 M196 41 h12"
                          opacity=".65"
                        />
                      </g>
                      <g>
                        <rect x="24" y="94" width="46" height="26" rx="4" />
                        <path d="M40 100 l-6 8 M40 100 l6 8 M32 108 h16 M28 118 h24" opacity=".65" />
                      </g>
                      <g>
                        <rect x="170" y="94" width="46" height="26" rx="4" />
                        <path
                          d="M186 100 v10 M186 118 v.5 M196 100 v10 M196 118 v.5 M206 100 v10 M206 118 v.5"
                          opacity=".65"
                        />
                      </g>
                      <path
                        d="M70 32 L100 60 M170 32 L138 60 M70 108 L100 82 M170 108 L138 82"
                        strokeDasharray="3 3"
                        opacity=".55"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Troubleshooting with traceability</h3>
                    <ul>
                      <li>Jump to the right manual section by alarm code, component, or station</li>
                      <li>Ground every recommendation in the original manual or work order text</li>
                      <li>Compare similar historical incidents to see what worked and what did not</li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g>
                        <rect x="16" y="18" width="76" height="24" rx="4" />
                        <path d="M28 30 h4 v-6 h6 v6 h4" opacity=".7" />
                        <text x="72" y="34" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Device
                        </text>
                      </g>
                      <g>
                        <rect x="120" y="18" width="104" height="20" rx="4" />
                        <path d="M130 26 l4 4 8 -6" opacity=".7" />
                        <text x="180" y="32" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Order_2024_08_17.xlsx
                        </text>
                      </g>
                      <g>
                        <rect x="120" y="52" width="104" height="20" rx="4" />
                        <path d="M130 60 l4 4 8 -6" opacity=".7" />
                        <text x="180" y="66" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Equipment_5000.pdf.mp3
                        </text>
                      </g>
                      <g>
                        <rect x="120" y="86" width="104" height="20" rx="4" />
                        <path d="M130 94 l4 4 8 -6" opacity=".7" />
                        <text x="180" y="100" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Report_240915.docx
                        </text>
                      </g>
                      <path
                        d="M92 30 h26 M92 62 c14 0 12 0 26 0 M92 30 c14 30 12 66 26 66"
                        strokeDasharray="3 3"
                        opacity=".55"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Line knowledge accumulation</h3>
                    <ul>
                      <li>Build equipment profiles and summarize recurring failures and effective fixes</li>
                      <li>Capture handover risks and critical steps for shift teams</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className={styles['use-cases-heading']}>Use cases</h2>
              <div className={styles['use-cases-grid']}>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4a5 5 0 0 0-5 5v3l-2 3h14l-2-3V9a5 5 0 0 0-5-5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 18a2 2 0 0 0 4 0M12 3v-1M4 8l-1-1M20 8l1-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Equipment troubleshooting assistant</h4>
                  <p>Input an alarm code and get step-by-step checks and cautions with citations.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 17l4-5 3 3 4-6 5 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 20h16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Quality exception analysis</h4>
                  <p>Summarize defect descriptions and data, then draft corrective actions with an evidence.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="6" cy="6" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="6" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="18" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M8 6h4a4 4 0 0 1 4 4v.5M8 18h4a4 4 0 0 0 4-4v-.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Process change review</h4>
                  <p>Pull SOPs and ECNs, then list impacted steps and key risks.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="6"
                      y="4"
                      width="12"
                      height="17"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M9 3h6v3H9z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11h6M9 15h6M9 18h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Incoming inspection for suppliers</h4>
                  <p>Check specs against inspection criteria and recommend deviation handling.</p>
                </div>
              </div>
            </article>

            <article
              className={styles['solution-card']}
              id="solutions-education"
            >
              <div className={styles['solution-hero']}>
                <h1>Build personalized courseware and learning paths</h1>
                <p>
                  For education teams, unify courseware, question banks, and
                  classroom content to improve lesson prep efficiency, feedback
                  quality, and personalized learning outcomes.
                </p>
              </div>

              <div className={styles['solution-features']}>
                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="120" cy="70" r="26" strokeWidth="1.6" />
                      <g fill="currentColor" stroke="none">
                        <circle cx="112" cy="66" r="1.6" />
                        <circle cx="120" cy="60" r="1.6" />
                        <circle cx="128" cy="66" r="1.6" />
                        <circle cx="126" cy="76" r="1.6" />
                        <circle cx="114" cy="76" r="1.6" />
                      </g>
                      <text x="76" y="30" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Question Types
                      </text>
                      <text x="168" y="30" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Key Concepts
                      </text>
                      <text x="76" y="60" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Pitfalls
                      </text>
                      <text x="168" y="60" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Skills
                      </text>
                      <text x="120" y="130" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Knowledge Graph
                      </text>
                      <path
                        d="M94 44 l8 12 M146 44 l-8 12 M94 66 l8 4 M146 66 l-8 4 M120 96 v18"
                        strokeDasharray="2 3"
                        opacity=".5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Courseware understanding</h3>
                    <ul>
                      <li>Parse textbook and handout structure and map knowledge concepts</li>
                      <li>Extract tested skills, question types, common misconceptions, and explanations</li>
                      <li>Turn class recordings into key points and lesson handout drafts</li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <g>
                        <rect x="30" y="20" width="180" height="26" rx="4" />
                        <path d="M40 33 h4 v-6 h6 v6 h4" opacity=".65" />
                        <text x="128" y="37" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Courseware, Math Section & Final.xls
                        </text>
                      </g>
                      <g>
                        <rect x="30" y="56" width="180" height="42" rx="4" />
                        <path d="M42 68 h156 M42 78 h140 M42 88 h156" opacity=".5" />
                      </g>
                      <g>
                        <rect x="30" y="108" width="180" height="20" rx="4" />
                        <path d="M42 118 l4 4 8 -6" opacity=".65" />
                        <text x="128" y="122" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none">
                          Lab Report, Physics 03, Group A.pdf
                        </text>
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3>Explainability with citations</h3>
                    <ul>
                      <li>Tie answers to textbook chapters and curriculum standards</li>
                      <li>Provide step-by-step reasoning with references</li>
                      <li>Explain why an answer is wrong and how to fix it with root cause feedback</li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="80" cy="70" r="18" strokeWidth="1.6" />
                      <path d="M72 68 l4 4 12 -12" strokeWidth="1.6" />
                      <circle cx="160" cy="70" r="18" strokeWidth="1.6" />
                      <path
                        d="M152 70 l8 -6 8 6 -8 6 z"
                        fill="currentColor"
                        fillOpacity=".25"
                      />
                      <path
                        d="M98 70 h44 M110 62 h22 M110 78 h22 M132 62 l8 8 -8 8"
                        strokeWidth="1.8"
                      />
                      <text x="80" y="30" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Lesson Prep
                      </text>
                      <text x="160" y="30" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        In-Class Delivery
                      </text>
                      <text x="80" y="120" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Teaching Review
                      </text>
                      <text x="160" y="120" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".75">
                        Auto Grading
                      </text>
                      <path
                        d="M80 88 v18 M160 88 v18"
                        strokeDasharray="2 3"
                        opacity=".5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3>Prep to teaching quality review</h3>
                    <ul>
                      <li>
                        Support the workflow from lesson prep to in-class
                        delivery for faster, higher-quality teaching
                      </li>
                      <li>
                        Grade assignments and analyze mistakes to continuously
                        improve learning outcomes
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles['solution-feature']}>
                  <div className={styles['solution-feature-visual']}>
                    <svg
                      viewBox="0 0 240 140"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <ellipse cx="120" cy="118" rx="70" ry="8" opacity=".35" />
                      <g transform="translate(66 50)">
                        <rect width="52" height="32" rx="4" />
                        <path d="M8 12 h36 M8 22 h28" opacity=".5" />
                        <text x="26" y="8" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">
                          Procedures
                        </text>
                      </g>
                      <g transform="translate(122 50)">
                        <rect width="52" height="32" rx="4" />
                        <path d="M8 12 h36 M8 22 h28" opacity=".5" />
                        <text x="26" y="8" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">
                          Policies
                        </text>
                      </g>
                      <g transform="translate(94 20)">
                        <rect width="52" height="32" rx="4" />
                        <path d="M8 12 h36 M8 22 h28" opacity=".5" />
                        <text x="26" y="8" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">
                          FAQs
                        </text>
                      </g>
                      <text x="120" y="112" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" opacity=".8">
                        School dataset
                      </text>
                    </svg>
                  </div>
                  <div>
                    <h3>Student insights and school dataset</h3>
                    <ul>
                      <li>
                        Build student profiles covering weaknesses, mastery
                        levels, and practice preferences
                      </li>
                      <li>
                        Maintain a school knowledge base covering policies,
                        procedures, and FAQs
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className={styles['use-cases-heading']}>Use cases</h2>
              <div className={styles['use-cases-grid']}>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="6"
                      y="4"
                      width="12"
                      height="17"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M9 3h6v3H9z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11h6M9 15h6M9 18h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Lesson prep assistant</h4>
                  <p>Input a chapter and generate lesson structure, board notes, and practice sets.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Homework review assistant</h4>
                  <p>Cluster error patterns and output leveled, personalized feedback and exercises.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4v16M8 8h5a2 2 0 0 1 0 4H8zM8 12h6a2 2 0 0 1 0 4H8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h4>Personalized practice</h4>
                  <p>Recommend similar questions based on wrong answers and explain key thinking steps.</p>
                </div>
                <div className={styles['use-case-card']}>
                  <svg
                    className={styles['use-case-icon']}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 4h11a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 18a2 2 0 0 1 2-2h11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4>Academic affairs Q&A</h4>
                  <p>Answer process questions quickly with policy sources attached.</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={styles['legal-section']} id="legal">
          <div className={cn(styles.shell, styles['legal-grid'])}>
            <article className={styles['legal-card']} id="privacy-policy">
              <h3>Privacy Policy</h3>
              <span className={styles['legal-meta']}>
                Last updated: January 2026
              </span>
              <p>
                LocalSpace is a retrieval-augmented generation platform built
                for private, local-first knowledge workflows. This Privacy
                Policy explains how LocalSpace handles the documents, knowledge
                bases, chat history, and configuration data that pass through
                your deployment, and describes the limited information collected
                through this portal page.
              </p>

              <h4>1. Scope of This Policy</h4>
              <p>
                This policy applies to (a) information you submit through the
                contact and inquiry forms on this portal, and (b) data processed
                by the self-hosted LocalSpace instance you deploy from this
                page. LocalSpace is designed to run entirely within your own
                infrastructure, and by default no document content, embeddings,
                or query history is transmitted to LocalSpace maintainers.
              </p>

              <h4>2. Data Processed Inside Your LocalSpace Deployment</h4>
              <p>
                When you use LocalSpace to build knowledge bases and run
                retrieval or chat workflows, the following categories of data
                are processed and stored locally on the infrastructure you
                control:
              </p>
              <ul>
                <li>
                  Source documents you upload, including PDFs, Word, PowerPoint,
                  spreadsheets, images processed through OCR, and web content
                  you import.
                </li>
                <li>
                  Parsed chunks, layout metadata, tables, and structured
                  elements extracted by the deep document understanding
                  pipeline.
                </li>
                <li>
                  Vector embeddings and full-text indexes generated by the
                  configured embedding models and search backend.
                </li>
                <li>
                  Chat sessions, prompts, retrieved citations, agent traces,
                  and workflow execution logs.
                </li>
                <li>
                  Knowledge base configuration, chunking parameters, prompt
                  templates, API keys for external model providers, and user
                  account information for tenants of your deployment.
                </li>
              </ul>
              <p>
                All of the above remains inside your database, object storage,
                and vector store. LocalSpace does not phone home with document
                content, embeddings, or user queries.
              </p>

              <h4>3. Information Submitted Through This Portal</h4>
              <p>
                If you contact us through this page, we process only the
                details you provide (such as name, email address, organization,
                and message content) for the purpose of responding to your
                inquiry, providing deployment assistance, and following up on
                requested services. This information is not used for
                advertising or sold to third parties.
              </p>

              <h4>4. Third-Party Model and Storage Providers</h4>
              <p>
                LocalSpace can be configured to connect to external services,
                including large language model APIs, embedding providers,
                rerankers, object storage, and vector databases. When you
                enable such an integration, prompts, retrieved passages, or
                embeddings are transmitted to the provider you selected under
                that provider's own terms and privacy practices. You are
                responsible for reviewing and accepting those terms, and for
                choosing local or self-hosted alternatives where required by
                your compliance posture.
              </p>

              <h4>5. Security and Access Controls</h4>
              <p>
                Because LocalSpace is deployed within your environment, the
                security of stored documents, indexes, and credentials depends
                on the controls you apply at the network, operating system,
                container, and database layers. We recommend enabling
                authentication, restricting administrative endpoints, rotating
                API keys used for external model providers, and encrypting
                storage volumes that hold ingested content.
              </p>

              <h4>6. Data Retention and Deletion</h4>
              <p>
                Documents, chunks, embeddings, and chat history persist in your
                LocalSpace deployment until you remove them. Deleting a
                knowledge base, dataset, or conversation from the LocalSpace
                interface removes the associated records from the underlying
                stores you configured. Inquiries submitted to this portal are
                retained only as long as needed to complete the requested
                follow-up.
              </p>

              <h4>7. Your Rights</h4>
              <p>
                You retain full ownership of the documents and derived data
                inside your LocalSpace deployment. For any personal information
                you have submitted through this portal, you may request access,
                correction, or deletion by contacting us at the address below.
              </p>

              <h4>8. Updates to This Policy</h4>
              <p>
                We may revise this Privacy Policy to reflect changes in
                LocalSpace features, integrations, or applicable regulations.
                Material changes will be reflected on this page along with an
                updated revision date.
              </p>

              <h4>9. Contact</h4>
              <p>
                Questions about this Privacy Policy or about the handling of
                data by your LocalSpace deployment can be sent to
                service@ragflow.local.
              </p>
            </article>
            <article className={styles['legal-card']} id="terms-of-service">
              <h3>Terms of Service</h3>
              <span className={styles['legal-meta']}>
                Last updated: January 2026
              </span>
              <p>
                These Terms of Service govern your use of the LocalSpace portal
                page and the LocalSpace software you deploy from it. By
                accessing this page or running a LocalSpace instance, you agree
                to the terms below. If you do not agree, please discontinue use
                of the portal and the software.
              </p>

              <h4>1. Description of the Service</h4>
              <p>
                LocalSpace is an open-source retrieval-augmented generation
                engine that ingests documents, performs deep layout-aware
                parsing, builds hybrid vector and full-text indexes, and
                orchestrates chat, agent, and workflow scenarios on top of your
                knowledge bases. This portal provides an entry point to a
                locally deployed LocalSpace instance and related informational
                resources; it does not host user content on our infrastructure.
              </p>

              <h4>2. License</h4>
              <p>
                The LocalSpace software is distributed under its published
                open-source license (currently the Apache License 2.0, subject
                to the terms bundled with the release you use). Your right to
                use, modify, and redistribute the software is granted by that
                license. Nothing in these Terms overrides the rights granted or
                the obligations imposed by the applicable open-source license.
              </p>

              <h4>3. Eligibility and Accounts</h4>
              <p>
                You must have the legal capacity to enter into these Terms and
                must be authorized to operate the infrastructure on which
                LocalSpace is deployed. If you administer a LocalSpace instance
                for other users, you are responsible for creating and managing
                their accounts, permissions, and access to the knowledge bases
                hosted by that deployment.
              </p>

              <h4>4. Acceptable Use</h4>
              <p>
                You agree not to use LocalSpace or content produced by
                LocalSpace to:
              </p>
              <ul>
                <li>
                  Ingest, index, or generate material that infringes
                  intellectual property rights, violates confidentiality
                  obligations, or contains unlawful content.
                </li>
                <li>
                  Process personal or sensitive data in a manner that violates
                  applicable privacy, data protection, export control, or
                  sector-specific regulations.
                </li>
                <li>
                  Circumvent access controls, tenant isolation, or rate limits
                  configured by the deployment administrator.
                </li>
                <li>
                  Attack, probe, or disrupt the availability of third-party
                  services connected through model, embedding, storage, or
                  search integrations.
                </li>
                <li>
                  Generate outputs presented as professional advice (medical,
                  legal, financial, or similar) without appropriate human
                  review by qualified professionals.
                </li>
              </ul>

              <h4>5. Your Content and Knowledge Bases</h4>
              <p>
                You retain all rights to the documents, prompts, and knowledge
                bases you upload to your LocalSpace deployment. You are
                responsible for the legality and accuracy of the content you
                ingest, for obtaining any consents required to process it, and
                for the retrieved passages, citations, and generated responses
                your users produce through LocalSpace.
              </p>

              <h4>6. Third-Party Integrations</h4>
              <p>
                LocalSpace can connect to third-party large language models,
                embedding providers, rerankers, object storage systems, and
                vector databases. Your use of any such integration is subject
                to that provider's terms and pricing. You are responsible for
                supplying valid credentials, monitoring usage, and complying
                with each provider's acceptable-use policy.
              </p>

              <h4>7. Availability and Support</h4>
              <p>
                LocalSpace is provided on an "as available" basis. Because the
                software runs inside your own environment, availability,
                performance, backup, and disaster recovery depend on the
                infrastructure and operational practices you put in place.
                Community support is available through the project's public
                issue tracker and discussion channels; commercial support,
                when offered, is governed by a separate agreement.
              </p>

              <h4>8. Disclaimers</h4>
              <p>
                LocalSpace and its outputs are provided without warranties of
                any kind, express or implied, including merchantability,
                fitness for a particular purpose, non-infringement, or the
                accuracy of retrieved and generated content. Retrieval-augmented
                generation can produce incorrect, incomplete, or misleading
                information; you are responsible for reviewing outputs before
                relying on them for consequential decisions.
              </p>

              <h4>9. Limitation of Liability</h4>
              <p>
                To the maximum extent permitted by applicable law, the
                LocalSpace maintainers shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or
                for loss of data, revenue, or business, arising from the use
                of, or inability to use, the LocalSpace software or this
                portal, even if advised of the possibility of such damages.
              </p>

              <h4>10. Termination</h4>
              <p>
                You may stop using this portal and uninstall your LocalSpace
                deployment at any time. We may update, restrict, or discontinue
                features of this portal at any time. Termination does not
                affect obligations that by their nature survive, including
                intellectual property rights, disclaimers, and limitations of
                liability.
              </p>

              <h4>11. Changes to These Terms</h4>
              <p>
                We may revise these Terms to reflect changes in LocalSpace
                features, integrations, or applicable law. Continued use of
                the portal or a deployed LocalSpace instance after an update
                constitutes acceptance of the revised Terms.
              </p>

              <h4>12. Contact</h4>
              <p>
                Questions about these Terms can be sent to
                service@ragflow.local.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles['site-footer']}>
        <div className={styles['footer-inner']}>
          <div className={styles['footer-grid']}>
            <div>
              <a
                className={styles['footer-brand']}
                href="#top"
                aria-label="LocalSpace Home"
              >
                <span className={styles['footer-mark']} aria-hidden="true">
                  <img src={logoUrl} alt="LocalSpace logo" />
                </span>
                <span>LocalSpace</span>
              </a>
              <p className={styles['footer-summary']}>
                Building intelligent knowledge experiences with
                retrieval-augmented generation, private document intelligence,
                and local AI workflows.
              </p>
              <div
                className={styles['footer-contact']}
                style={{ display: 'none' }}
              >
                <a href="mailto:service@ragflow.local">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 6h16v12H4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M4 7l8 6 8-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  service@ragflow.local
                </a>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6.6 3.8l3 3-2 2c1.2 2.5 3.1 4.4 5.6 5.6l2-2 3 3-1.4 3c-.4.9-1.4 1.4-2.4 1.1C9 18.1 5.9 15 4.5 9.6c-.3-1 .2-2 1.1-2.4l1-3.4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +1 209 802 7093
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  332 2nd Ave N, Greybull, WY
                </span>
              </div>
              <p className={styles['footer-copyright']}>
                &copy; 2026 LocalSpace. All rights reserved. &middot; Local
                Knowledge AI Platform
              </p>
            </div>

            <div className={styles['footer-col']}>
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="#top">About LocalSpace</a>
                </li>
                <li>
                  <a href="#showcase">Showcase</a>
                </li>
                <li>
                  <a href="#workflow">Workflow</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className={styles['footer-col']}>
              <h3>Legal</h3>
              <ul>
                <li>
                  <a href="#privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms-of-service">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div
        className={cn(
          styles['modal-overlay'],
          modalOpen && styles['is-open'],
        )}
        id="subscribeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribeModalTitle"
        onClick={handleOverlayClick}
      >
        <div className={styles.modal}>
          <div className={styles['modal-header']}>
            <div>
              <h3 id="subscribeModalTitle">
                Subscribe to{' '}
                <span className={styles['js-modal-plan']}>{current.plan}</span>
              </h3>
              <p className={styles['modal-subtitle']}>
                Total:{' '}
                <strong className={styles['js-modal-price']}>
                  ${current.price}
                </strong>{' '}
                / <span className={styles['js-modal-cycle']}>{current.cycle}</span>
              </p>
            </div>
            <button
              type="button"
              className={styles['modal-close']}
              aria-label="Close"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
          <form
            className={styles['modal-form']}
            id="subscribeForm"
            noValidate
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="plan" value={current.plan} readOnly />
            <input type="hidden" name="price" value={current.price} readOnly />
            <input type="hidden" name="cycle" value={current.cycle} readOnly />
            <div className={styles.field}>
              <label htmlFor="ccName">Cardholder Name</label>
              <input
                ref={cardholderRef}
                id="ccName"
                name="cardholder"
                type="text"
                autoComplete="cc-name"
                placeholder="John Smith"
                required
                value={formData.cardholder}
                onChange={handleCardholderChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="ccEmail">Email</label>
              <input
                id="ccEmail"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="ccNumber">Card Number</label>
              <input
                id="ccNumber"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>
            <div className={styles['form-row']}>
              <div className={styles.field}>
                <label htmlFor="ccExpiry">Expiry (MM/YY)</label>
                <input
                  id="ccExpiry"
                  name="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  value={formData.expiry}
                  onChange={handleExpiryChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="ccCvc">CVC</label>
                <input
                  id="ccCvc"
                  name="cvc"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  required
                  value={formData.cvc}
                  onChange={handleCvcChange}
                />
              </div>
            </div>
            <div
              className={cn(
                styles['modal-error'],
                errorMsg && styles['is-visible'],
              )}
              id="subscribeError"
            >
              {errorMsg}
            </div>
            <div
              className={cn(
                styles['modal-success'],
                successMsg && styles['is-visible'],
              )}
              id="subscribeSuccess"
            >
              {successMsg}
            </div>
            <button
              className={styles['submit-btn']}
              type="submit"
              id="subscribeSubmit"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Landing;
