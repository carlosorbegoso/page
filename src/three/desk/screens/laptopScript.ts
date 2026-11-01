export const INK = {
  background: '#1e1f22',
  panel: '#2b2d30',
  gutter: '#4b5059',
  plain: '#bcbec4',
  keyword: '#cf8e6d',
  annotation: '#b3ae60',
  string: '#6aab73',
  number: '#2aacb8',
  type: '#e3e5e8',
  comment: '#7a7e85',
  method: '#56a8f5',
  info: '#79c48a',
  warn: '#e5c07b',
  prompt: '#e3e5e8',
  dim: '#8c9099'
} as const;

export interface Token {
  text: string;
  color: string;
  column: number;
}

const JAVA = `@Path("/payments")
@ApplicationScoped
public class PaymentResource {

    @Inject
    PaymentService service;

    @POST
    @Transactional
    public Uni<Response> create(PaymentRequest request) {
        return service.authorize(request)
            .onItem().transform(p -> Response.status(201).entity(p).build())
            .onFailure().recoverWithItem(this::declined);
    }

    @GET
    @Path("/{id}")
    public Uni<Payment> find(@PathParam("id") UUID id) {
        return Payment.findById(id);
    }
}`;

const KEYWORDS = new Set(['public', 'class', 'return', 'this', 'new', 'private', 'final', 'static', 'void']);
const TOKEN = /(@\w+)|("[^"]*")|(\b\d+\b)|(\b[A-Za-z_]\w*\b)(?=\()|(\b[A-Z]\w*\b)|(\b\w+\b)|(\s+|[^\w\s"@]+)/g;

function colorOf(match: RegExpExecArray): string {
  if (match[1]) return INK.annotation;
  if (match[2]) return INK.string;
  if (match[3]) return INK.number;
  if (match[4]) return KEYWORDS.has(match[4]) ? INK.keyword : INK.method;
  if (match[5]) return INK.type;
  if (match[6]) return KEYWORDS.has(match[6]) ? INK.keyword : INK.plain;
  return INK.plain;
}

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  for (const match of line.matchAll(TOKEN)) {
    if (!match[0].trim()) continue;
    tokens.push({ text: match[0], color: colorOf(match), column: match.index ?? 0 });
  }
  return tokens;
}

export const EDITOR_LINES: readonly { length: number; tokens: Token[] }[] = JAVA.split('\n').map(line => ({ length: line.length, tokens: tokenize(line) }));

export const TERMINAL_LINES: readonly { text: string; color: string }[] = [
  ['$ ./mvnw quarkus:dev', INK.prompt],
  ['[INFO] Scanning for projects...', INK.dim],
  ['[INFO] --- quarkus:3.17:dev @ ventixs-api ---', INK.dim],
  ['__  ____  __  _____   ___  __ ____  ______', INK.method],
  [' --/ __ \\/ / / / _ | / _ \\/ //_/ / / / __/', INK.method],
  [' -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\\ \\', INK.method],
  ['--\\___\\_\\____/_/ |_/_/|_/_/|_|\\____/___/', INK.method],
  ['INFO  ventixs-api 1.8.0 started in 1.412s', INK.info],
  ['INFO  Listening on: http://localhost:8080', INK.info],
  ['INFO  Profile dev activated. Live Coding activated.', INK.info],
  ['INFO  Features: [hibernate-reactive-panache, rest,', INK.info],
  ['      smallrye-health, micrometer, opentelemetry]', INK.info],
  ['INFO  POST /payments 201 38ms', INK.plain],
  ['INFO  POST /payments 201 41ms', INK.plain],
  ['INFO  GET  /payments/7f3c 200 6ms', INK.plain],
  ['WARN  gateway: upstream 503, retry 1/3', INK.warn],
  ['INFO  POST /payments 201 52ms', INK.plain],
  ['INFO  Restarting: PaymentResource.java changed', INK.info],
  ['INFO  Live reload total time: 0.734s', INK.info],
  ['INFO  POST /payments 201 35ms', INK.plain],
  ['$ git log --oneline -4', INK.prompt],
  ['a3f9c21 feat(payments): idempotency keys', INK.warn],
  ['7be04d0 fix(gateway): back off with jitter', INK.warn],
  ['52c1e8a perf: CQRS read model for statements', INK.warn],
  ['e19aa7f chore(otel): export traces to Tempo', INK.warn],
  ['$ ./mvnw test -q', INK.prompt],
  ['[INFO] Tests run: 148, Failures: 0, Errors: 0', INK.info],
  ['[INFO] BUILD SUCCESS', INK.info],
  ['', INK.plain]
].map(([text, color]) => ({ text: text!, color: color! }));
