module.exports = [
"[project]/generated/prisma/query_compiler_fast_bg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var h = Object.defineProperty;
var T = Object.getOwnPropertyDescriptor;
var M = Object.getOwnPropertyNames;
var j = Object.prototype.hasOwnProperty;
var D = (e, t)=>{
    for(var n in t)h(e, n, {
        get: t[n],
        enumerable: !0
    });
}, O = (e, t, n, _)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let r of M(t))!j.call(e, r) && r !== n && h(e, r, {
        get: ()=>t[r],
        enumerable: !(_ = T(t, r)) || _.enumerable
    });
    return e;
};
var B = (e)=>O(h({}, "__esModule", {
        value: !0
    }), e);
var xe = {};
D(xe, {
    QueryCompiler: ()=>F,
    __wbg_Error_e83987f665cf5504: ()=>q,
    __wbg_Number_bb48ca12f395cd08: ()=>C,
    __wbg_String_8f0eb39a4a4c2f66: ()=>k,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68: ()=>W,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763: ()=>V,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f: ()=>z,
    __wbg___wbindgen_is_object_c818261d21f283a4: ()=>L,
    __wbg___wbindgen_is_string_fbb76cb2940daafd: ()=>P,
    __wbg___wbindgen_is_undefined_2d472862bd29a478: ()=>Q,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147: ()=>Y,
    __wbg___wbindgen_number_get_a20bf9b85341449d: ()=>G,
    __wbg___wbindgen_string_get_e4f06c90489ad01b: ()=>J,
    __wbg___wbindgen_throw_b855445ff6a94295: ()=>X,
    __wbg_entries_e171b586f8f6bdbf: ()=>H,
    __wbg_getTime_14776bfb48a1bff9: ()=>K,
    __wbg_get_7bed016f185add81: ()=>Z,
    __wbg_get_with_ref_key_1dc361bd10053bfe: ()=>v,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38: ()=>ee,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98: ()=>te,
    __wbg_isSafeInteger_d216eda7911dde36: ()=>ne,
    __wbg_length_69bca3cb64fc8748: ()=>re,
    __wbg_length_cdd215e10d9dd507: ()=>_e,
    __wbg_new_0_f9740686d739025c: ()=>oe,
    __wbg_new_1acc0b6eea89d040: ()=>ce,
    __wbg_new_5a79be3ab53b8aa5: ()=>ie,
    __wbg_new_68651c719dcda04e: ()=>se,
    __wbg_new_e17d9f43105b08be: ()=>ue,
    __wbg_prototypesetcall_2a6620b6922694b2: ()=>fe,
    __wbg_set_3f1d0b984ed272ed: ()=>be,
    __wbg_set_907fb406c34a251d: ()=>de,
    __wbg_set_c213c871859d6500: ()=>ae,
    __wbg_set_message_82ae475bb413aa5c: ()=>ge,
    __wbg_set_wasm: ()=>N,
    __wbindgen_cast_2241b6af4c4b2941: ()=>le,
    __wbindgen_cast_4625c577ab2ec9ee: ()=>we,
    __wbindgen_cast_9ae0607507abb057: ()=>pe,
    __wbindgen_cast_d6cd19b81560fd6e: ()=>ye,
    __wbindgen_init_externref_table: ()=>me
});
module.exports = B(xe);
var A = ()=>{};
A.prototype = A;
let o;
function N(e) {
    o = e;
}
let p = null;
function a() {
    return (p === null || p.byteLength === 0) && (p = new Uint8Array(o.memory.buffer)), p;
}
let y = new TextDecoder("utf-8", {
    ignoreBOM: !0,
    fatal: !0
});
y.decode();
const U = 2146435072;
let S = 0;
function R(e, t) {
    return S += t, S >= U && (y = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    }), y.decode(), S = t), y.decode(a().subarray(e, e + t));
}
function m(e, t) {
    return e = e >>> 0, R(e, t);
}
let f = 0;
const g = new TextEncoder;
"encodeInto" in g || (g.encodeInto = function(e, t) {
    const n = g.encode(e);
    return t.set(n), {
        read: e.length,
        written: n.length
    };
});
function l(e, t, n) {
    if (n === void 0) {
        const i = g.encode(e), d = t(i.length, 1) >>> 0;
        return a().subarray(d, d + i.length).set(i), f = i.length, d;
    }
    let _ = e.length, r = t(_, 1) >>> 0;
    const s = a();
    let c = 0;
    for(; c < _; c++){
        const i = e.charCodeAt(c);
        if (i > 127) break;
        s[r + c] = i;
    }
    if (c !== _) {
        c !== 0 && (e = e.slice(c)), r = n(r, _, _ = c + e.length * 3, 1) >>> 0;
        const i = a().subarray(r + c, r + _), d = g.encodeInto(e, i);
        c += d.written, r = n(r, _, c, 1) >>> 0;
    }
    return f = c, r;
}
let b = null;
function u() {
    return (b === null || b.buffer.detached === !0 || b.buffer.detached === void 0 && b.buffer !== o.memory.buffer) && (b = new DataView(o.memory.buffer)), b;
}
function x(e) {
    return e == null;
}
function I(e) {
    const t = typeof e;
    if (t == "number" || t == "boolean" || e == null) return `${e}`;
    if (t == "string") return `"${e}"`;
    if (t == "symbol") {
        const r = e.description;
        return r == null ? "Symbol" : `Symbol(${r})`;
    }
    if (t == "function") {
        const r = e.name;
        return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
    }
    if (Array.isArray(e)) {
        const r = e.length;
        let s = "[";
        r > 0 && (s += I(e[0]));
        for(let c = 1; c < r; c++)s += ", " + I(e[c]);
        return s += "]", s;
    }
    const n = /\[object ([^\]]+)\]/.exec(toString.call(e));
    let _;
    if (n && n.length > 1) _ = n[1];
    else return toString.call(e);
    if (_ == "Object") try {
        return "Object(" + JSON.stringify(e) + ")";
    } catch  {
        return "Object";
    }
    return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
}
function $(e, t) {
    return e = e >>> 0, a().subarray(e / 1, e / 1 + t);
}
function w(e) {
    const t = o.__wbindgen_externrefs.get(e);
    return o.__externref_table_dealloc(e), t;
}
const E = typeof FinalizationRegistry > "u" ? {
    register: ()=>{},
    unregister: ()=>{}
} : new FinalizationRegistry((e)=>o.__wbg_querycompiler_free(e >>> 0, 1));
class F {
    __destroy_into_raw() {
        const t = this.__wbg_ptr;
        return this.__wbg_ptr = 0, E.unregister(this), t;
    }
    free() {
        const t = this.__destroy_into_raw();
        o.__wbg_querycompiler_free(t, 0);
    }
    compileBatch(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compileBatch(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
    constructor(t){
        const n = o.querycompiler_new(t);
        if (n[2]) throw w(n[1]);
        return this.__wbg_ptr = n[0] >>> 0, E.register(this, this.__wbg_ptr, this), this;
    }
    compile(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compile(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
}
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
function q(e, t) {
    return Error(m(e, t));
}
function C(e) {
    return Number(e);
}
function k(e, t) {
    const n = String(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function W(e) {
    const t = e, n = typeof t == "boolean" ? t : void 0;
    return x(n) ? 16777215 : n ? 1 : 0;
}
function V(e, t) {
    const n = I(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function z(e, t) {
    return e in t;
}
function L(e) {
    const t = e;
    return typeof t == "object" && t !== null;
}
function P(e) {
    return typeof e == "string";
}
function Q(e) {
    return e === void 0;
}
function Y(e, t) {
    return e == t;
}
function G(e, t) {
    const n = t, _ = typeof n == "number" ? n : void 0;
    u().setFloat64(e + 8 * 1, x(_) ? 0 : _, !0), u().setInt32(e + 4 * 0, !x(_), !0);
}
function J(e, t) {
    const n = t, _ = typeof n == "string" ? n : void 0;
    var r = x(_) ? 0 : l(_, o.__wbindgen_malloc, o.__wbindgen_realloc), s = f;
    u().setInt32(e + 4 * 1, s, !0), u().setInt32(e + 4 * 0, r, !0);
}
function X(e, t) {
    throw new Error(m(e, t));
}
function H(e) {
    return Object.entries(e);
}
function K(e) {
    return e.getTime();
}
function Z(e, t) {
    return e[t >>> 0];
}
function v(e, t) {
    return e[t];
}
function ee(e) {
    let t;
    try {
        t = e instanceof ArrayBuffer;
    } catch  {
        t = !1;
    }
    return t;
}
function te(e) {
    let t;
    try {
        t = e instanceof Uint8Array;
    } catch  {
        t = !1;
    }
    return t;
}
function ne(e) {
    return Number.isSafeInteger(e);
}
function re(e) {
    return e.length;
}
function _e(e) {
    return e.length;
}
function oe() {
    return new Date;
}
function ce() {
    return new Object;
}
function ie(e) {
    return new Uint8Array(e);
}
function se() {
    return new Map;
}
function ue() {
    return new Array;
}
function fe(e, t, n) {
    Uint8Array.prototype.set.call($(e, t), n);
}
function be(e, t, n) {
    e[t] = n;
}
function de(e, t, n) {
    return e.set(t, n);
}
function ae(e, t, n) {
    e[t >>> 0] = n;
}
function ge(e, t) {
    /*TURBOPACK member replacement*/ __turbopack_context__.g.PRISMA_WASM_PANIC_REGISTRY.set_message(m(e, t));
}
function le(e, t) {
    return m(e, t);
}
function we(e) {
    return BigInt.asUintN(64, e);
}
function pe(e) {
    return e;
}
function ye(e) {
    return e;
}
function me() {
    const e = o.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
}
0 && (module.exports = {
    QueryCompiler,
    __wbg_Error_e83987f665cf5504,
    __wbg_Number_bb48ca12f395cd08,
    __wbg_String_8f0eb39a4a4c2f66,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f,
    __wbg___wbindgen_is_object_c818261d21f283a4,
    __wbg___wbindgen_is_string_fbb76cb2940daafd,
    __wbg___wbindgen_is_undefined_2d472862bd29a478,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147,
    __wbg___wbindgen_number_get_a20bf9b85341449d,
    __wbg___wbindgen_string_get_e4f06c90489ad01b,
    __wbg___wbindgen_throw_b855445ff6a94295,
    __wbg_entries_e171b586f8f6bdbf,
    __wbg_getTime_14776bfb48a1bff9,
    __wbg_get_7bed016f185add81,
    __wbg_get_with_ref_key_1dc361bd10053bfe,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98,
    __wbg_isSafeInteger_d216eda7911dde36,
    __wbg_length_69bca3cb64fc8748,
    __wbg_length_cdd215e10d9dd507,
    __wbg_new_0_f9740686d739025c,
    __wbg_new_1acc0b6eea89d040,
    __wbg_new_5a79be3ab53b8aa5,
    __wbg_new_68651c719dcda04e,
    __wbg_new_e17d9f43105b08be,
    __wbg_prototypesetcall_2a6620b6922694b2,
    __wbg_set_3f1d0b984ed272ed,
    __wbg_set_907fb406c34a251d,
    __wbg_set_c213c871859d6500,
    __wbg_set_message_82ae475bb413aa5c,
    __wbg_set_wasm,
    __wbindgen_cast_2241b6af4c4b2941,
    __wbindgen_cast_4625c577ab2ec9ee,
    __wbindgen_cast_9ae0607507abb057,
    __wbindgen_cast_d6cd19b81560fd6e,
    __wbindgen_init_externref_table
});
}),
"[project]/generated/prisma/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError, getPrismaClient, sqltag, empty, join, raw, skip, Decimal, Debug, DbNull, JsonNull, AnyNull, NullTypes, makeStrictEnum, Extensions, warnOnce, defineDmmfProperty, Public, getRuntime, createParam } = __turbopack_context__.r("[project]/generated/prisma/runtime/client.js [app-route] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 7.3.0
 * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
 */ Prisma.prismaVersion = {
    client: "7.3.0",
    engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = DbNull;
Prisma.JsonNull = JsonNull;
Prisma.AnyNull = AnyNull;
Prisma.NullTypes = NullTypes;
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.AccountScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
};
exports.Prisma.AnalyticsEventScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    problemId: 'problemId',
    correct: 'correct',
    responseMs: 'responseMs'
};
exports.Prisma.ArchetypeScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    stream: 'stream',
    order: 'order',
    summary: 'summary',
    eloMax: 'eloMax',
    eloMin: 'eloMin',
    domainId: 'domainId'
};
exports.Prisma.AttemptScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    userId: 'userId',
    problemId: 'problemId',
    chosen: 'chosen',
    correct: 'correct',
    timeMs: 'timeMs',
    deltaUser: 'deltaUser',
    deltaProblem: 'deltaProblem',
    guestId: 'guestId',
    freeResponse: 'freeResponse',
    normalized: 'normalized',
    score: 'score'
};
exports.Prisma.DomainScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    order: 'order',
    summary: 'summary',
    subjectId: 'subjectId'
};
exports.Prisma.GenerationLogScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    prompt: 'prompt',
    outcome: 'outcome',
    attempts: 'attempts',
    latencyMs: 'latencyMs',
    errors: 'errors',
    problemsParsed: 'problemsParsed',
    model: 'model',
    tokensUsed: 'tokensUsed'
};
exports.Prisma.LessonScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    archetypeId: 'archetypeId',
    kind: 'kind',
    title: 'title',
    bodyMarkdown: 'bodyMarkdown',
    order: 'order',
    published: 'published'
};
exports.Prisma.ProblemScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    promptLatex: 'promptLatex',
    choices: 'choices',
    correctChoice: 'correctChoice',
    seedRating: 'seedRating',
    rating: 'rating',
    topic: 'topic',
    tags: 'tags',
    solutions: 'solutions',
    attemptCount: 'attemptCount',
    correctExpr: 'correctExpr',
    correctNumeric: 'correctNumeric',
    openRubric: 'openRubric',
    type: 'type',
    requireForm: 'requireForm',
    archetypeId: 'archetypeId',
    generationMetadata: 'generationMetadata',
    promptSegments: 'promptSegments'
};
exports.Prisma.RatingEventScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    userId: 'userId',
    problemId: 'problemId',
    before: 'before',
    after: 'after',
    delta: 'delta',
    reason: 'reason'
};
exports.Prisma.SessionScalarFieldEnum = {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
};
exports.Prisma.SubjectScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    order: 'order',
    summary: 'summary',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    createdAt: 'createdAt',
    displayName: 'displayName',
    rating: 'rating',
    passwordHash: 'passwordHash',
    attemptCount: 'attemptCount',
    gold: 'gold',
    lessonsEntered: 'lessonsEntered',
    xp: 'xp'
};
exports.Prisma.UserArchetypeScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    archetypeId: 'archetypeId',
    rating: 'rating',
    attemptCount: 'attemptCount',
    streak: 'streak',
    lastPlayedAt: 'lastPlayedAt'
};
exports.Prisma.UserMetaDomainScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    domainId: 'domainId',
    rating: 'rating',
    attemptCount: 'attemptCount',
    streak: 'streak',
    lastPlayedAt: 'lastPlayedAt'
};
exports.Prisma.VerificationTokenScalarFieldEnum = {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.NullableJsonNullValueInput = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.JsonNullValueFilter = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull,
    AnyNull: Prisma.AnyNull
};
exports.LessonKind = exports.$Enums.LessonKind = {
    HEURISTIC: 'HEURISTIC',
    WORKED_EXAMPLE: 'WORKED_EXAMPLE',
    PRACTICE_GUIDE: 'PRACTICE_GUIDE'
};
exports.ProblemType = exports.$Enums.ProblemType = {
    MCQ: 'MCQ',
    NUMERIC: 'NUMERIC',
    EXPRESSION: 'EXPRESSION',
    OPEN: 'OPEN'
};
exports.Stream = exports.$Enums.Stream = {
    VC: 'VC',
    CA: 'CA'
};
exports.Prisma.ModelName = {
    Account: 'Account',
    AnalyticsEvent: 'AnalyticsEvent',
    Archetype: 'Archetype',
    Attempt: 'Attempt',
    Domain: 'Domain',
    GenerationLog: 'GenerationLog',
    Lesson: 'Lesson',
    Problem: 'Problem',
    RatingEvent: 'RatingEvent',
    Session: 'Session',
    Subject: 'Subject',
    User: 'User',
    UserArchetype: 'UserArchetype',
    UserMetaDomain: 'UserMetaDomain',
    VerificationToken: 'VerificationToken'
};
/**
 * Create the Client
 */ const config = {
    "previewFeatures": [],
    "clientVersion": "7.3.0",
    "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Account {\n  id                String  @id\n  userId            String\n  type              String\n  provider          String\n  providerAccountId String\n  refresh_token     String?\n  access_token      String?\n  expires_at        Int?\n  token_type        String?\n  scope             String?\n  id_token          String?\n  session_state     String?\n  User              User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerAccountId])\n}\n\nmodel AnalyticsEvent {\n  id         String   @id\n  createdAt  DateTime @default(now())\n  problemId  String\n  correct    Boolean\n  responseMs Int\n}\n\nmodel Archetype {\n  id            String          @id\n  slug          String          @unique\n  title         String\n  stream        Stream?\n  order         Int\n  summary       String?\n  eloMax        Int             @default(1900)\n  eloMin        Int             @default(200)\n  domainId      String?\n  Domain        Domain?         @relation(fields: [domainId], references: [id])\n  Lesson        Lesson[]\n  Problem       Problem[]\n  UserArchetype UserArchetype[]\n\n  @@unique([stream, order])\n  @@index([domainId])\n}\n\nmodel Attempt {\n  id           String   @id\n  createdAt    DateTime @default(now())\n  userId       String?\n  problemId    String\n  chosen       String?\n  correct      Boolean\n  timeMs       Int\n  deltaUser    Int\n  deltaProblem Int\n  guestId      String?\n  freeResponse String?\n  normalized   String?\n  score        Decimal? @db.Decimal(4, 3)\n  Problem      Problem  @relation(fields: [problemId], references: [id], onDelete: Cascade)\n  User         User?    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([guestId])\n  @@index([problemId])\n  @@index([userId])\n}\n\nmodel Domain {\n  id             String           @id\n  slug           String           @unique\n  title          String\n  order          Int              @default(1)\n  summary        String?\n  subjectId      String\n  Archetype      Archetype[]\n  Subject        Subject          @relation(fields: [subjectId], references: [id], onDelete: Cascade)\n  UserMetaDomain UserMetaDomain[]\n\n  @@index([subjectId])\n}\n\nmodel GenerationLog {\n  id             String   @id\n  createdAt      DateTime @default(now())\n  prompt         String\n  outcome        String\n  attempts       Int\n  latencyMs      Int?\n  errors         Json?\n  problemsParsed Int      @default(0)\n  model          String?\n  tokensUsed     Int?\n}\n\nmodel Lesson {\n  id           String     @id\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime\n  archetypeId  String\n  kind         LessonKind\n  title        String\n  bodyMarkdown String\n  order        Int\n  published    Boolean    @default(false)\n  Archetype    Archetype  @relation(fields: [archetypeId], references: [id], onDelete: Cascade)\n\n  @@unique([archetypeId, order])\n  @@index([archetypeId])\n}\n\nmodel Problem {\n  id                 String        @id\n  createdAt          DateTime      @default(now())\n  promptLatex        String        @unique\n  choices            Json?\n  correctChoice      String?\n  seedRating         Int\n  rating             Int\n  topic              String\n  tags               String[]\n  solutions          String?\n  attemptCount       Int           @default(0)\n  correctExpr        Json?\n  correctNumeric     Json?\n  openRubric         Json?\n  type               ProblemType   @default(MCQ)\n  requireForm        String[]      @default([])\n  archetypeId        String?\n  generationMetadata Json?\n  promptSegments     Json?\n  Attempt            Attempt[]\n  Archetype          Archetype?    @relation(fields: [archetypeId], references: [id])\n  RatingEvent        RatingEvent[]\n\n  @@index([archetypeId])\n  @@index([rating])\n}\n\nmodel RatingEvent {\n  id        String   @id\n  createdAt DateTime @default(now())\n  userId    String?\n  problemId String?\n  before    Int\n  after     Int\n  delta     Int\n  reason    String\n  Problem   Problem? @relation(fields: [problemId], references: [id], onDelete: Cascade)\n  User      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Session {\n  id           String   @id\n  sessionToken String   @unique\n  userId       String\n  expires      DateTime\n  User         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Subject {\n  id        String   @id\n  slug      String   @unique\n  title     String\n  order     Int      @default(1)\n  summary   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime\n  Domain    Domain[]\n}\n\nmodel User {\n  id             String           @id\n  email          String?          @unique\n  createdAt      DateTime         @default(now())\n  displayName    String?\n  rating         Int              @default(600)\n  passwordHash   String?\n  attemptCount   Int              @default(0)\n  gold           Int              @default(0)\n  lessonsEntered Int              @default(0)\n  xp             Int              @default(0)\n  Account        Account[]\n  Attempt        Attempt[]\n  RatingEvent    RatingEvent[]\n  Session        Session[]\n  UserArchetype  UserArchetype[]\n  UserMetaDomain UserMetaDomain[]\n}\n\nmodel UserArchetype {\n  id           String    @id\n  createdAt    DateTime  @default(now())\n  updatedAt    DateTime\n  userId       String\n  archetypeId  String\n  rating       Int       @default(200)\n  attemptCount Int       @default(0)\n  streak       Int       @default(0)\n  lastPlayedAt DateTime  @default(now())\n  Archetype    Archetype @relation(fields: [archetypeId], references: [id], onDelete: Cascade)\n  User         User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, archetypeId])\n  @@index([archetypeId])\n  @@index([userId])\n}\n\nmodel UserMetaDomain {\n  id           String   @id\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime\n  userId       String\n  domainId     String\n  rating       Int      @default(400)\n  attemptCount Int      @default(0)\n  streak       Int      @default(0)\n  lastPlayedAt DateTime @default(now())\n  Domain       Domain   @relation(fields: [domainId], references: [id], onDelete: Cascade)\n  User         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, domainId])\n  @@index([domainId])\n  @@index([userId])\n}\n\nmodel VerificationToken {\n  identifier String\n  token      String   @unique\n  expires    DateTime\n\n  @@unique([identifier, token])\n}\n\nenum LessonKind {\n  HEURISTIC\n  WORKED_EXAMPLE\n  PRACTICE_GUIDE\n}\n\nenum ProblemType {\n  MCQ\n  NUMERIC\n  EXPRESSION\n  OPEN\n}\n\nenum Stream {\n  VC\n  CA\n}\n"
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Account\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerAccountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refresh_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"access_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires_at\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"token_type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"scope\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"id_token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"session_state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AccountToUser\"}],\"dbName\":null},\"AnalyticsEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"problemId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"correct\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"responseMs\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Archetype\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stream\",\"kind\":\"enum\",\"type\":\"Stream\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"summary\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"eloMax\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"eloMin\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"domainId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"Domain\",\"kind\":\"object\",\"type\":\"Domain\",\"relationName\":\"ArchetypeToDomain\"},{\"name\":\"Lesson\",\"kind\":\"object\",\"type\":\"Lesson\",\"relationName\":\"ArchetypeToLesson\"},{\"name\":\"Problem\",\"kind\":\"object\",\"type\":\"Problem\",\"relationName\":\"ArchetypeToProblem\"},{\"name\":\"UserArchetype\",\"kind\":\"object\",\"type\":\"UserArchetype\",\"relationName\":\"ArchetypeToUserArchetype\"}],\"dbName\":null},\"Attempt\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"problemId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"chosen\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"correct\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"timeMs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"deltaUser\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"deltaProblem\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guestId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"freeResponse\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"normalized\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"score\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"Problem\",\"kind\":\"object\",\"type\":\"Problem\",\"relationName\":\"AttemptToProblem\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AttemptToUser\"}],\"dbName\":null},\"Domain\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"summary\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subjectId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"Archetype\",\"kind\":\"object\",\"type\":\"Archetype\",\"relationName\":\"ArchetypeToDomain\"},{\"name\":\"Subject\",\"kind\":\"object\",\"type\":\"Subject\",\"relationName\":\"DomainToSubject\"},{\"name\":\"UserMetaDomain\",\"kind\":\"object\",\"type\":\"UserMetaDomain\",\"relationName\":\"DomainToUserMetaDomain\"}],\"dbName\":null},\"GenerationLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"prompt\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outcome\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"attempts\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"latencyMs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"errors\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"problemsParsed\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"model\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Lesson\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"archetypeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"kind\",\"kind\":\"enum\",\"type\":\"LessonKind\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bodyMarkdown\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"published\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"Archetype\",\"kind\":\"object\",\"type\":\"Archetype\",\"relationName\":\"ArchetypeToLesson\"}],\"dbName\":null},\"Problem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"promptLatex\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"choices\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"correctChoice\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"seedRating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"topic\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"solutions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"attemptCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"correctExpr\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"correctNumeric\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"openRubric\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"ProblemType\"},{\"name\":\"requireForm\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"archetypeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"generationMetadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"promptSegments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"Attempt\",\"kind\":\"object\",\"type\":\"Attempt\",\"relationName\":\"AttemptToProblem\"},{\"name\":\"Archetype\",\"kind\":\"object\",\"type\":\"Archetype\",\"relationName\":\"ArchetypeToProblem\"},{\"name\":\"RatingEvent\",\"kind\":\"object\",\"type\":\"RatingEvent\",\"relationName\":\"ProblemToRatingEvent\"}],\"dbName\":null},\"RatingEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"problemId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"before\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"after\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"delta\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"Problem\",\"kind\":\"object\",\"type\":\"Problem\",\"relationName\":\"ProblemToRatingEvent\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"RatingEventToUser\"}],\"dbName\":null},\"Session\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"Subject\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"summary\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"Domain\",\"kind\":\"object\",\"type\":\"Domain\",\"relationName\":\"DomainToSubject\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"displayName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"attemptCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"gold\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"lessonsEntered\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"xp\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"Account\",\"kind\":\"object\",\"type\":\"Account\",\"relationName\":\"AccountToUser\"},{\"name\":\"Attempt\",\"kind\":\"object\",\"type\":\"Attempt\",\"relationName\":\"AttemptToUser\"},{\"name\":\"RatingEvent\",\"kind\":\"object\",\"type\":\"RatingEvent\",\"relationName\":\"RatingEventToUser\"},{\"name\":\"Session\",\"kind\":\"object\",\"type\":\"Session\",\"relationName\":\"SessionToUser\"},{\"name\":\"UserArchetype\",\"kind\":\"object\",\"type\":\"UserArchetype\",\"relationName\":\"UserToUserArchetype\"},{\"name\":\"UserMetaDomain\",\"kind\":\"object\",\"type\":\"UserMetaDomain\",\"relationName\":\"UserToUserMetaDomain\"}],\"dbName\":null},\"UserArchetype\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"archetypeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"attemptCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"streak\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"lastPlayedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"Archetype\",\"kind\":\"object\",\"type\":\"Archetype\",\"relationName\":\"ArchetypeToUserArchetype\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserArchetype\"}],\"dbName\":null},\"UserMetaDomain\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"domainId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"attemptCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"streak\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"lastPlayedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"Domain\",\"kind\":\"object\",\"type\":\"Domain\",\"relationName\":\"DomainToUserMetaDomain\"},{\"name\":\"User\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserMetaDomain\"}],\"dbName\":null},\"VerificationToken\":{\"fields\":[{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expires\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.compilerWasm = {
    getRuntime: async ()=>__turbopack_context__.r("[project]/generated/prisma/query_compiler_fast_bg.js [app-route] (ecmascript)"),
    getQueryCompilerWasmModule: async ()=>{
        const { Buffer } = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
        const { wasm } = __turbopack_context__.r("[project]/generated/prisma/query_compiler_fast_bg.wasm-base64.js [app-route] (ecmascript)");
        const queryCompilerWasmFileBytes = Buffer.from(wasm, 'base64');
        return new WebAssembly.Module(queryCompilerWasmFileBytes);
    },
    importName: './query_compiler_fast_bg.js'
};
const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
];

//# sourceMappingURL=generated_prisma_d09f9bb1._.js.map