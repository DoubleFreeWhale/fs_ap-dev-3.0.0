(function () {
    function a(d, c) {
        let e = new B(d, c);
        return e.beautify()
    }
    function B(g, F) {
        let e, J, t, ac, Z, C, an;
        let v, G, h;
        let O, af, j, r, A, am;
        let W;
        let aa, n, k, ao, z;
        let B;
        let d, L, w;
        let aq = "";
        O = "\n\r\t ".split("");
        af = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split("");
        am = "0123456789".split("");
        j = "+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::";
        j += " <%= <% %> <?= <? ?>";
        j = j.split(" ");
        A = "continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(",");
        L = {
            BlockStatement: "BlockStatement",
            Statement: "Statement",
            ObjectLiteral: "ObjectLiteral",
            ArrayLiteral: "ArrayLiteral",
            ForInitializer: "ForInitializer",
            Conditional: "Conditional",
            Expression: "Expression"
        };
        d = {
            TK_START_EXPR: aj,
            TK_END_EXPR: N,
            TK_START_BLOCK: X,
            TK_END_BLOCK: Y,
            TK_WORD: y,
            TK_SEMICOLON: M,
            TK_STRING: x,
            TK_EQUALS: R,
            TK_OPERATOR: ad,
            TK_COMMA: ah,
            TK_BLOCK_COMMENT: ag,
            TK_INLINE_COMMENT: V,
            TK_COMMENT: o,
            TK_DOT: ai,
            TK_UNKNOWN: ab
        };

        function l(at, au) {
            return {
                mode: au,
                last_text: at ? at.last_text : "",
                last_word: at ? at.last_word : "",
                var_line: false,
                var_line_tainted: false,
                var_line_reindented: false,
                in_html_comment: false,
                multiline_array: false,
                if_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false,
                in_case: false,
                case_body: false,
                indentation_level: (at ? at.indentation_level + ((at.var_line && at.var_line_reindented) ? 1 : 0) : 0),
                ternary_depth: 0
            }
        }

        F = F ? F : {};
        w = {};
        if (F.space_after_anon_function !== undefined && F.jslint_happy === undefined) {
            F.jslint_happy = F.space_after_anon_function
        }
        if (F.braces_on_own_line !== undefined) {
            w.brace_style = F.braces_on_own_line ? "expand" : "collapse"
        }
        w.brace_style = F.brace_style ? F.brace_style : (w.brace_style ? w.brace_style : "collapse");
        w.indent_size = F.indent_size ? parseInt(F.indent_size, 10) : 4;
        w.indent_char = F.indent_char ? F.indent_char : " ";
        w.preserve_newlines = (F.preserve_newlines === undefined) ? true : F.preserve_newlines;
        w.break_chained_methods = (F.break_chained_methods === undefined) ? false : F.break_chained_methods;
        w.max_preserve_newlines = (F.max_preserve_newlines === undefined) ? 0 : parseInt(F.max_preserve_newlines, 10);
        w.jslint_happy = (F.jslint_happy === undefined) ? false : F.jslint_happy;
        w.keep_array_indentation = (F.keep_array_indentation === undefined) ? false : F.keep_array_indentation;
        w.space_before_conditional = (F.space_before_conditional === undefined) ? true : F.space_before_conditional;
        w.unescape_strings = (F.unescape_strings === undefined) ? false : F.unescape_strings;
        w.wrap_line_length = (F.wrap_line_length === undefined) ? 0 : parseInt(F.wrap_line_length, 10);
        an = "";
        while (w.indent_size > 0) {
            an += w.indent_char;
            w.indent_size -= 1
        }
        while (g && (g.charAt(0) === " " || g.charAt(0) === "\t")) {
            aq += g.charAt(0);
            g = g.substring(1)
        }
        e = g;
        B = g.length;
        Z = "TK_START_BLOCK";
        C = "";
        J = [];
        k = false;
        ao = false;
        z = [];
        h = [];
        q(L.BlockStatement);
        r = 0;
        this.beautify = function () {
            let av, au, at, aw;
            while (true) {
                av = ae();
                t = av[0];
                ac = av[1];
                if (ac === "TK_EOF") {
                    break
                }
                at = w.keep_array_indentation && T(v.mode);
                if (at) {
                    for (au = 0; au < n; au += 1) {
                        I(true)
                    }
                } else {
                    aa = n > 0;
                    if (w.max_preserve_newlines && n > w.max_preserve_newlines) {
                        n = w.max_preserve_newlines
                    }
                    if (w.preserve_newlines) {
                        if (n > 1) {
                            I();
                            for (au = 1; au < n; au += 1) {
                                I(true)
                            }
                        }
                    }
                }
                d[ac]();
                if (ac !== "TK_INLINE_COMMENT" && ac !== "TK_COMMENT" && ac !== "TK_UNKNOWN") {
                    C = v.last_text;
                    Z = ac;
                    v.last_text = t
                }
            }
            aw = aq + J.join("").replace(/[\r\n ]+$/, "");
            return aw
        }
        ;

        function u(at) {
            at = (at === undefined) ? false : at;
            while (J.length && (J[J.length - 1] === " " || J[J.length - 1] === an || J[J.length - 1] === aq || (at && (J[J.length - 1] === "\n" || J[J.length - 1] === "\r")))) {
                J.pop()
            }
        }

        function c(at) {
            return at.replace(/^\s\s*|\s\s*$/, "")
        }

        function al(av) {
            av = av.replace(/\x0d/g, "");
            let au = []
                , at = av.indexOf("\n");
            while (at !== -1) {
                au.push(av.substring(0, at));
                av = av.substring(at + 1);
                at = av.indexOf("\n")
            }
            if (av.length) {
                au.push(av)
            }
            return au
        }

        function ar() {
            return J.length && J[J.length - 1] === "\n"
        }

        function E(at, av) {
            let au = at.length - 1;
            if (au < 0) {
                au += at.length
            }
            if (au > at.length - 1) {
                au = at.length - 1
            }
            for (au++; au-- > 0;) {
                if (au in at && at[au] === av) {
                    return au
                }
            }
            return -1
        }

        function p(av) {
            av = (av === undefined) ? false : av;
            if (w.wrap_line_length && !av) {
                let at = "";
                let au = 0;
                let aw = E(J, "\n") + 1;
                if (aw < J.length) {
                    at = J.slice(aw).join("");
                    au = at.length + t.length + (ao ? 1 : 0);
                    if (au >= w.wrap_line_length) {
                        av = true
                    }
                }
            }
            if (((w.preserve_newlines && aa) || av) && !ar()) {
                I(false, true);
                k = true;
                aa = false
            }
        }

        function I(at, au) {
            k = false;
            ao = false;
            if (!au) {
                if (v.last_text !== ";") {
                    while (v.mode === L.Statement && !v.if_block) {
                        i()
                    }
                }
            }
            if (v.mode === L.ArrayLiteral) {
                v.multiline_array = true
            }
            if (!J.length) {
                return
            }
            if (at || !ar()) {
                J.push("\n")
            }
        }

        function D() {
            if (ar()) {
                if (w.keep_array_indentation && T(v.mode) && z.length) {
                    J.push(z.join("") + "")
                } else {
                    if (aq) {
                        J.push(aq)
                    }
                    m(v.indentation_level);
                    m(v.var_line && v.var_line_reindented);
                    m(k)
                }
            }
        }

        function m(au) {
            if (au === undefined) {
                au = 1
            } else {
                if (typeof au !== "number") {
                    au = au ? 1 : 0
                }
            }
            if (v.last_text !== "") {
                for (let at = 0; at < au; at += 1) {
                    J.push(an)
                }
            }
        }

        function ak() {
            if (ao && J.length) {
                let at = J[J.length - 1];
                if (!ar() && at !== " " && at !== an) {
                    J.push(" ")
                }
            }
        }

        function P(at) {
            at = at || t;
            D();
            k = false;
            ak();
            ao = false;
            J.push(at)
        }

        function s() {
            v.indentation_level += 1
        }

        function q(at) {
            if (v) {
                h.push(v);
                G = v
            } else {
                G = l(null, at)
            }
            v = l(G, at)
        }

        function T(at) {
            return at === L.ArrayLiteral
        }

        function K(at) {
            return Q(at, [L.ArrayLiteral, L.Expression, L.ForInitializer, L.Conditional])
        }

        function i() {
            if (h.length > 0) {
                G = v;
                v = h.pop()
            }
        }

        function H() {
            if ((v.last_text === "do" || (v.last_text === "else" && t !== "if") || (Z === "TK_END_EXPR" && (G.mode === L.ForInitializer || G.mode === L.Conditional)))) {
                p();
                q(L.Statement);
                s();
                k = false;
                return true
            }
            return false
        }

        function ap(au, aw) {
            for (let av = 0; av < au.length; av++) {
                let at = c(au[av]);
                if (at.charAt(0) !== aw) {
                    return false
                }
            }
            return true
        }

        function S(at) {
            return Q(at, ["case", "return", "do", "if", "throw", "else"])
        }

        function Q(av, at) {
            for (let au = 0; au < at.length; au += 1) {
                if (at[au] === av) {
                    return true
                }
            }
            return false
        }

        function f(aw) {
            let at = false, au = "", az = 0, av = "", ax = 0, ay;
            while (at || az < aw.length) {
                ay = aw.charAt(az);
                az++;
                if (at) {
                    at = false;
                    if (ay === "x") {
                        av = aw.substr(az, 2);
                        az += 2
                    } else {
                        if (ay === "u") {
                            av = aw.substr(az, 4);
                            az += 4
                        } else {
                            au += "\\" + ay;
                            continue
                        }
                    }
                    if (!av.match(/^[0123456789abcdefABCDEF]+$/)) {
                        return aw
                    }
                    ax = parseInt(av, 16);
                    if (ax >= 0 && ax < 32) {
                        if (ay === "x") {
                            au += "\\x" + av
                        } else {
                            au += "\\u" + av
                        }
                        continue
                    } else {
                        if (ax === 34 || ax === 39 || ax === 92) {
                            au += "\\" + String.fromCharCode(ax)
                        } else {
                            if (ay === "x" && ax > 126 && ax <= 255) {
                                return aw
                            } else {
                                au += String.fromCharCode(ax)
                            }
                        }
                    }
                } else {
                    if (ay === "\\") {
                        at = true
                    } else {
                        au += ay
                    }
                }
            }
            return au
        }

        function U(au) {
            let at = r;
            let av = e.charAt(at);
            while (Q(av, O) && av !== au) {
                at++;
                if (at >= B) {
                    return false
                }
                av = e.charAt(at)
            }
            return av === au
        }

        function ae() {
            let aw, at;
            n = 0;
            if (r >= B) {
                return ["", "TK_EOF"]
            }
            aa = false;
            z = [];
            let aB = e.charAt(r);
            r += 1;
            while (Q(aB, O)) {
                if (aB === "\n") {
                    n += 1;
                    z = []
                } else {
                    if (n) {
                        if (aB === an) {
                            z.push(an)
                        } else {
                            if (aB !== "\r") {
                                z.push(" ")
                            }
                        }
                    }
                }
                if (r >= B) {
                    return ["", "TK_EOF"]
                }
                aB = e.charAt(r);
                r += 1
            }
            if (Q(aB, af)) {
                if (r < B) {
                    while (Q(e.charAt(r), af)) {
                        aB += e.charAt(r);
                        r += 1;
                        if (r === B) {
                            break
                        }
                    }
                }
                if (r !== B && aB.match(/^[0-9]+[Ee]$/) && (e.charAt(r) === "-" || e.charAt(r) === "+")) {
                    let au = e.charAt(r);
                    r += 1;
                    let aD = ae();
                    aB += au + aD[0];
                    return [aB, "TK_WORD"]
                }
                if (aB === "in") {
                    return [aB, "TK_OPERATOR"]
                }
                return [aB, "TK_WORD"]
            }
            if (aB === "(" || aB === "[") {
                return [aB, "TK_START_EXPR"]
            }
            if (aB === ")" || aB === "]") {
                return [aB, "TK_END_EXPR"]
            }
            if (aB === "{") {
                return [aB, "TK_START_BLOCK"]
            }
            if (aB === "}") {
                return [aB, "TK_END_BLOCK"]
            }
            if (aB === ";") {
                return [aB, "TK_SEMICOLON"]
            }
            if (aB === "/") {
                let ax = "";
                let aC = true;
                if (e.charAt(r) === "*") {
                    r += 1;
                    if (r < B) {
                        while (r < B && !(e.charAt(r) === "*" && e.charAt(r + 1) && e.charAt(r + 1) === "/")) {
                            aB = e.charAt(r);
                            ax += aB;
                            if (aB === "\n" || aB === "\r") {
                                aC = false
                            }
                            r += 1;
                            if (r >= B) {
                                break
                            }
                        }
                    }
                    r += 2;
                    if (aC && n === 0) {
                        return ["/*" + ax + "*/", "TK_INLINE_COMMENT"]
                    } else {
                        return ["/*" + ax + "*/", "TK_BLOCK_COMMENT"]
                    }
                }
                if (e.charAt(r) === "/") {
                    ax = aB;
                    while (e.charAt(r) !== "\r" && e.charAt(r) !== "\n") {
                        ax += e.charAt(r);
                        r += 1;
                        if (r >= B) {
                            break
                        }
                    }
                    return [ax, "TK_COMMENT"]
                }
            }
            if (aB === "'" || aB === '"' || (aB === "/" && ((Z === "TK_WORD" && S(v.last_text)) || (Z === "TK_END_EXPR" && Q(G.mode, [L.Conditional, L.ForInitializer])) || (Q(Z, ["TK_COMMENT", "TK_START_EXPR", "TK_START_BLOCK", "TK_END_BLOCK", "TK_OPERATOR", "TK_EQUALS", "TK_EOF", "TK_SEMICOLON", "TK_COMMA"]))))) {
                let aE = aB
                    , aA = false
                    , az = false;
                at = aB;
                if (r < B) {
                    if (aE === "/") {
                        let ay = false;
                        while (aA || ay || e.charAt(r) !== aE) {
                            at += e.charAt(r);
                            if (!aA) {
                                aA = e.charAt(r) === "\\";
                                if (e.charAt(r) === "[") {
                                    ay = true
                                } else {
                                    if (e.charAt(r) === "]") {
                                        ay = false
                                    }
                                }
                            } else {
                                aA = false
                            }
                            r += 1;
                            if (r >= B) {
                                return [at, "TK_STRING"]
                            }
                        }
                    } else {
                        while (aA || e.charAt(r) !== aE) {
                            at += e.charAt(r);
                            if (aA) {
                                if (e.charAt(r) === "x" || e.charAt(r) === "u") {
                                    az = true
                                }
                                aA = false
                            } else {
                                aA = e.charAt(r) === "\\"
                            }
                            r += 1;
                            if (r >= B) {
                                return [at, "TK_STRING"]
                            }
                        }
                    }
                }
                r += 1;
                at += aE;
                if (az && w.unescape_strings) {
                    at = f(at)
                }
                if (aE === "/") {
                    while (r < B && Q(e.charAt(r), af)) {
                        at += e.charAt(r);
                        r += 1
                    }
                }
                return [at, "TK_STRING"]
            }
            if (aB === "#") {
                if (J.length === 0 && e.charAt(r) === "!") {
                    at = aB;
                    while (r < B && aB !== "\n") {
                        aB = e.charAt(r);
                        at += aB;
                        r += 1
                    }
                    return [c(at) + "\n", "TK_UNKNOWN"]
                }
                let av = "#";
                if (r < B && Q(e.charAt(r), am)) {
                    do {
                        aB = e.charAt(r);
                        av += aB;
                        r += 1
                    } while (r < B && aB !== "#" && aB !== "=");
                    if (aB === "#") {
                    } else {
                        if (e.charAt(r) === "[" && e.charAt(r + 1) === "]") {
                            av += "[]";
                            r += 2
                        } else {
                            if (e.charAt(r) === "{" && e.charAt(r + 1) === "}") {
                                av += "{}";
                                r += 2
                            }
                        }
                    }
                    return [av, "TK_WORD"]
                }
            }
            if (aB === "<" && e.substring(r - 1, r + 3) === "<!--") {
                r += 3;
                aB = "<!--";
                while (e.charAt(r) !== "\n" && r < B) {
                    aB += e.charAt(r);
                    r++
                }
                v.in_html_comment = true;
                return [aB, "TK_COMMENT"]
            }
            if (aB === "-" && v.in_html_comment && e.substring(r - 1, r + 2) === "-->") {
                v.in_html_comment = false;
                r += 2;
                return ["-->", "TK_COMMENT"]
            }
            if (aB === ".") {
                return [aB, "TK_DOT"]
            }
            if (Q(aB, j)) {
                while (r < B && Q(aB + e.charAt(r), j)) {
                    aB += e.charAt(r);
                    r += 1;
                    if (r >= B) {
                        break
                    }
                }
                if (aB === ",") {
                    return [aB, "TK_COMMA"]
                } else {
                    if (aB === "=") {
                        return [aB, "TK_EQUALS"]
                    } else {
                        return [aB, "TK_OPERATOR"]
                    }
                }
            }
            return [aB, "TK_UNKNOWN"]
        }

        function aj() {
            if (H()) {
            }
            if (t === "[") {
                if (Z === "TK_WORD" || v.last_text === ")") {
                    if (Q(v.last_text, A)) {
                        ao = true
                    }
                    q(L.Expression);
                    P();
                    return
                }
                if (T(v.mode)) {
                    if ((v.last_text === "[") || (C === "]" && v.last_text === ",")) {
                        if (!w.keep_array_indentation) {
                            I()
                        }
                    }
                }
            } else {
                if (v.last_text === "for") {
                    q(L.ForInitializer)
                } else {
                    if (Q(v.last_text, ["if", "while"])) {
                        q(L.Conditional)
                    } else {
                        q(L.Expression)
                    }
                }
            }
            if (v.last_text === ";" || Z === "TK_START_BLOCK") {
                I()
            } else {
                if (Z === "TK_END_EXPR" || Z === "TK_START_EXPR" || Z === "TK_END_BLOCK" || v.last_text === ".") {
                    if (aa) {
                        I()
                    }
                } else {
                    if (Z !== "TK_WORD" && Z !== "TK_OPERATOR") {
                        ao = true
                    } else {
                        if (v.last_word === "function" || v.last_word === "typeof") {
                            if (w.jslint_happy) {
                                ao = true
                            }
                        } else {
                            if (Q(v.last_text, A) || v.last_text === "catch") {
                                if (w.space_before_conditional) {
                                    ao = true
                                }
                            }
                        }
                    }
                }
            }
            if (t === "(") {
                if (Z === "TK_EQUALS" || Z === "TK_OPERATOR") {
                    if (v.mode !== L.ObjectLiteral) {
                        p()
                    }
                }
            }
            P();
            if (t === "[") {
                q(L.ArrayLiteral);
                s()
            }
        }

        function N() {
            while (v.mode === L.Statement) {
                i()
            }
            if (t === "]" && T(v.mode) && v.multiline_array && !w.keep_array_indentation) {
                I()
            }
            i();
            P();
            if (v.do_while && G.mode === L.Conditional) {
                G.mode = L.Expression;
                v.do_block = false;
                v.do_while = false
            }
        }

        function X() {
            q(L.BlockStatement);
            let at = U("}");
            if (w.brace_style === "expand-strict") {
                if (!at) {
                    I()
                }
            } else {
                if (w.brace_style === "expand") {
                    if (Z !== "TK_OPERATOR") {
                        if (Z === "TK_EQUALS" || (S(v.last_text) && v.last_text !== "else")) {
                            ao = true
                        } else {
                            I()
                        }
                    }
                } else {
                    if (Z !== "TK_OPERATOR" && Z !== "TK_START_EXPR") {
                        if (Z === "TK_START_BLOCK") {
                            I()
                        } else {
                            ao = true
                        }
                    } else {
                        if (T(G.mode) && v.last_text === ",") {
                            if (C === "}") {
                                ao = true
                            } else {
                                I()
                            }
                        }
                    }
                }
            }
            P();
            s()
        }

        function Y() {
            while (v.mode === L.Statement) {
                i()
            }
            i();
            if (w.brace_style === "expand" || w.brace_style === "expand-strict") {
                if (Z !== "TK_START_BLOCK") {
                    I()
                }
            } else {
                if (Z !== "TK_START_BLOCK") {
                    if (T(v.mode) && w.keep_array_indentation) {
                        w.keep_array_indentation = false;
                        I();
                        w.keep_array_indentation = true
                    } else {
                        I()
                    }
                }
            }
            P()
        }

        function y() {
            if (H()) {
            } else {
                if (aa && !K(v.mode) && (Z !== "TK_OPERATOR" || (v.last_text === "--" || v.last_text === "++")) && Z !== "TK_EQUALS" && (w.preserve_newlines || v.last_text !== "var")) {
                    I()
                }
            }
            if (v.do_block && !v.do_while) {
                if (t === "while") {
                    ao = true;
                    P();
                    ao = true;
                    v.do_while = true;
                    return
                } else {
                    I();
                    v.do_block = false
                }
            }
            if (v.if_block) {
                if (t !== "else") {
                    while (v.mode === L.Statement) {
                        i()
                    }
                    v.if_block = false
                }
            }
            if (t === "function") {
                if (v.var_line && Z !== "TK_EQUALS") {
                    v.var_line_reindented = true
                }
                if ((ar() || v.last_text === ";") && v.last_text !== "{" && Z !== "TK_BLOCK_COMMENT" && Z !== "TK_COMMENT") {
                    n = ar() ? n : 0;
                    if (!w.preserve_newlines) {
                        n = 1
                    }
                    for (let at = 0; at < 2 - n; at++) {
                        I(true)
                    }
                }
                if (Z === "TK_WORD") {
                    if (v.last_text === "get" || v.last_text === "set" || v.last_text === "new" || v.last_text === "return") {
                        ao = true
                    } else {
                        I()
                    }
                } else {
                    if (Z === "TK_OPERATOR" || v.last_text === "=") {
                        ao = true
                    } else {
                        if (K(v.mode)) {
                        } else {
                            I()
                        }
                    }
                }
                P();
                v.last_word = t;
                return
            }
            if (t === "case" || (t === "default" && v.in_case_statement)) {
                I();
                if (v.case_body || w.jslint_happy) {
                    v.indentation_level--;
                    v.case_body = false
                }
                P();
                v.in_case = true;
                v.in_case_statement = true;
                return
            }
            W = "NONE";
            if (Z === "TK_END_BLOCK") {
                if (!Q(t, ["else", "catch", "finally"])) {
                    W = "NEWLINE"
                } else {
                    if (w.brace_style === "expand" || w.brace_style === "end-expand" || w.brace_style === "expand-strict") {
                        W = "NEWLINE"
                    } else {
                        W = "SPACE";
                        ao = true
                    }
                }
            } else {
                if (Z === "TK_SEMICOLON" && v.mode === L.BlockStatement) {
                    W = "NEWLINE"
                } else {
                    if (Z === "TK_SEMICOLON" && K(v.mode)) {
                        W = "SPACE"
                    } else {
                        if (Z === "TK_STRING") {
                            W = "NEWLINE"
                        } else {
                            if (Z === "TK_WORD") {
                                W = "SPACE"
                            } else {
                                if (Z === "TK_START_BLOCK") {
                                    W = "NEWLINE"
                                } else {
                                    if (Z === "TK_END_EXPR") {
                                        ao = true;
                                        W = "NEWLINE"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (Q(t, A) && v.last_text !== ")") {
                if (v.last_text === "else") {
                    W = "SPACE"
                } else {
                    W = "NEWLINE"
                }
            }
            if (Z === "TK_COMMA" || Z === "TK_START_EXPR" || Z === "TK_EQUALS" || Z === "TK_OPERATOR") {
                if (v.mode !== L.ObjectLiteral) {
                    p()
                }
            }
            if (Q(t, ["else", "catch", "finally"])) {
                if (Z !== "TK_END_BLOCK" || w.brace_style === "expand" || w.brace_style === "end-expand" || w.brace_style === "expand-strict") {
                    I()
                } else {
                    u(true);
                    if (J[J.length - 1] !== "}") {
                        I()
                    }
                    ao = true
                }
            } else {
                if (W === "NEWLINE") {
                    if (S(v.last_text)) {
                        ao = true
                    } else {
                        if (Z !== "TK_END_EXPR") {
                            if ((Z !== "TK_START_EXPR" || t !== "var") && v.last_text !== ":") {
                                if (t === "if" && v.last_word === "else" && v.last_text !== "{") {
                                    ao = true
                                } else {
                                    v.var_line = false;
                                    v.var_line_reindented = false;
                                    I()
                                }
                            }
                        } else {
                            if (Q(t, A) && v.last_text !== ")") {
                                v.var_line = false;
                                v.var_line_reindented = false;
                                I()
                            }
                        }
                    }
                } else {
                    if (T(v.mode) && v.last_text === "," && C === "}") {
                        I()
                    } else {
                        if (W === "SPACE") {
                            ao = true
                        }
                    }
                }
            }
            P();
            v.last_word = t;
            if (t === "var") {
                v.var_line = true;
                v.var_line_reindented = false;
                v.var_line_tainted = false
            }
            if (t === "do") {
                v.do_block = true
            }
            if (t === "if") {
                v.if_block = true
            }
        }

        function M() {
            while (v.mode === L.Statement && !v.if_block) {
                i()
            }
            P();
            v.var_line = false;
            v.var_line_reindented = false;
            if (v.mode === L.ObjectLiteral) {
                v.mode = L.BlockStatement
            }
        }

        function x() {
            if (H()) {
                ao = true
            } else {
                if (Z === "TK_WORD") {
                    ao = true
                } else {
                    if (Z === "TK_COMMA" || Z === "TK_START_EXPR" || Z === "TK_EQUALS" || Z === "TK_OPERATOR") {
                        if (v.mode !== L.ObjectLiteral) {
                            p()
                        }
                    } else {
                        I()
                    }
                }
            }
            P()
        }

        function R() {
            if (v.var_line) {
                v.var_line_tainted = true
            }
            ao = true;
            P();
            ao = true
        }

        function ah() {
            if (v.var_line) {
                if (K(v.mode) || Z === "TK_END_BLOCK") {
                    v.var_line_tainted = false
                }
                if (v.var_line) {
                    v.var_line_reindented = true
                }
                P();
                if (v.var_line_tainted) {
                    v.var_line_tainted = false;
                    I()
                } else {
                    ao = true
                }
                return
            }
            if (Z === "TK_END_BLOCK" && v.mode !== L.Expression) {
                P();
                if (v.mode === L.ObjectLiteral && v.last_text === "}") {
                    I()
                } else {
                    ao = true
                }
            } else {
                if (v.mode === L.ObjectLiteral) {
                    P();
                    I()
                } else {
                    P();
                    ao = true
                }
            }
        }

        function ad() {
            let au = true;
            let at = true;
            if (S(v.last_text)) {
                ao = true;
                P();
                return
            }
            if (t === "*" && Z === "TK_DOT" && !C.match(/^\d+$/)) {
                P();
                return
            }
            if (t === ":" && v.in_case) {
                v.case_body = true;
                s();
                P();
                I();
                v.in_case = false;
                return
            }
            if (t === "::") {
                P();
                return
            }
            if (aa && (t === "--" || t === "++")) {
                I()
            }
            if (Q(t, ["--", "++", "!"]) || (Q(t, ["-", "+"]) && (Q(Z, ["TK_START_BLOCK", "TK_START_EXPR", "TK_EQUALS", "TK_OPERATOR"]) || Q(v.last_text, A) || v.last_text === ","))) {
                au = false;
                at = false;
                if (v.last_text === ";" && K(v.mode)) {
                    au = true
                }
                if (Z === "TK_WORD" && Q(v.last_text, A)) {
                    au = true
                }
                if ((v.mode === L.BlockStatement || v.mode === L.Statement) && (v.last_text === "{" || v.last_text === ";")) {
                    I()
                }
            } else {
                if (t === ":") {
                    if (v.ternary_depth === 0) {
                        if (v.mode === L.BlockStatement) {
                            v.mode = L.ObjectLiteral
                        }
                        au = false
                    } else {
                        v.ternary_depth -= 1
                    }
                } else {
                    if (t === "?") {
                        v.ternary_depth += 1
                    }
                }
            }
            ao = ao || au;
            P();
            ao = at
        }

        function ag() {
            let at = al(t);
            let au;
            if (ap(at.slice(1), "*")) {
                I(false, true);
                P(at[0]);
                for (au = 1; au < at.length; au++) {
                    I(false, true);
                    P(" " + c(at[au]))
                }
            } else {
                if (at.length > 1) {
                    I(false, true)
                } else {
                    if (Z === "TK_END_BLOCK") {
                        I(false, true)
                    } else {
                        ao = true
                    }
                }
                P(at[0]);
                J.push("\n");
                for (au = 1; au < at.length; au++) {
                    J.push(at[au]);
                    J.push("\n")
                }
            }
            if (!U("\n")) {
                I(false, true)
            }
        }

        function V() {
            ao = true;
            P();
            ao = true
        }

        function o() {
            if (aa) {
                I(false, true)
            }
            if (v.last_text === "," && !aa) {
                u(true)
            }
            ao = true;
            P();
            I(false, true)
        }

        function ai() {
            if (S(v.last_text)) {
                ao = true
            } else {
                p(v.last_text === ")" && w.break_chained_methods)
            }
            P()
        }

        function ab() {
            P();
            if (t[t.length - 1] === "\n") {
                I()
            }
        }
    }
    window.js_beautify = a
}());
(function () {
        function a(f) {
            let g = "    ";
            if (isNaN(parseInt(f))) {
                g = f
            } else {
                switch (f) {
                    case 1:
                        g = " ";
                        break;
                    case 2:
                        g = "  ";
                        break;
                    case 3:
                        g = "   ";
                        break;
                    case 4:
                        g = "    ";
                        break;
                    case 5:
                        g = "     ";
                        break;
                    case 6:
                        g = "      ";
                        break;
                    case 7:
                        g = "       ";
                        break;
                    case 8:
                        g = "        ";
                        break;
                    case 9:
                        g = "         ";
                        break;
                    case 10:
                        g = "          ";
                        break;
                    case 11:
                        g = "           ";
                        break;
                    case 12:
                        g = "            ";
                        break
                }
            }
            let e = ["\n"];
            for (ix = 0; ix < 100; ix++) {
                e.push(e[ix] + g)
            }
            return e
        }

        function b() {
            this.step = "\t";
            this.shift = a(this.step)
        }

        b.prototype.xml = function (l, f) {
            let h = l.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").replace(/\s*xmlns\=/g, "~::~xmlns=").split("~::~")
                , i = h.length
                , m = false
                , k = 0
                , j = ""
                , g = 0
                , e = f ? a(f) : this.shift;
            for (g = 0; g < i; g++) {
                if (h[g].search(/<!/) > -1) {
                    j += e[k] + h[g];
                    m = true;
                    if (h[g].search(/-->/) > -1 || h[g].search(/\]>/) > -1 || h[g].search(/!DOCTYPE/) > -1) {
                        m = false
                    }
                } else {
                    if (h[g].search(/-->/) > -1 || h[g].search(/\]>/) > -1) {
                        j += h[g];
                        m = false
                    } else {
                        if (/^<\w/.exec(h[g - 1]) && /^<\/\w/.exec(h[g]) && /^<[\w:\-\.\,]+/.exec(h[g - 1]) == /^<\/[\w:\-\.\,]+/.exec(h[g])[0].replace("/", "")) {
                            j += h[g];
                            if (!m) {
                                k--
                            }
                        } else {
                            if (h[g].search(/<\w/) > -1 && h[g].search(/<\//) == -1 && h[g].search(/\/>/) == -1) {
                                j = !m ? j += e[k++] + h[g] : j += h[g]
                            } else {
                                if (h[g].search(/<\w/) > -1 && h[g].search(/<\//) > -1) {
                                    j = !m ? j += e[k] + h[g] : j += h[g]
                                } else {
                                    if (h[g].search(/<\//) > -1) {
                                        j = !m ? j += e[--k] + h[g] : j += h[g]
                                    } else {
                                        if (h[g].search(/\/>/) > -1) {
                                            j = !m ? j += e[k] + h[g] : j += h[g]
                                        } else {
                                            if (h[g].search(/<\?/) > -1) {
                                                j += e[k] + h[g]
                                            } else {
                                                if (h[g].search(/xmlns\:/) > -1 || h[g].search(/xmlns\=/) > -1) {
                                                    j += e[k] + h[g]
                                                } else {
                                                    j += h[g]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return (j[0] == "\n") ? j.slice(1) : j
        }
        ;
        b.prototype.json = function (f, e) {
             e = e ? e : this.step;
            if (typeof JSON === "undefined") {
                return f
            }
            if (typeof f === "string") {
                return JSON.stringify(JSON.parse(f), null, e)
            }
            if (typeof f === "object") {
                return JSON.stringify(f, null, e)
            }
            return f
        }
        ;
        b.prototype.css = function (l, j) {
            let i = l.replace(/\s{1,}/g, " ").replace(/\{/g, "{~::~").replace(/\}/g, "~::~}~::~").replace(/\;/g, ";~::~").replace(/\/\*/g, "~::~/*").replace(/\*\//g, "*/~::~").replace(/~::~\s{0,}~::~/g, "~::~").split("~::~")
                , e = i.length
                , h = 0
                , k = ""
                , g = 0
                , f = j ? a(j) : this.shift;
            for (g = 0; g < e; g++) {
                if (/\{/.exec(i[g])) {
                    k += f[h++] + i[g]
                } else {
                    if (/\}/.exec(i[g])) {
                        k += f[--h] + i[g]
                    } else {
                        if (/\*\\/.exec(i[g])) {
                            k += f[h] + i[g]
                        } else {
                            k += f[h] + i[g]
                        }
                    }
                }
            }
            return k.replace(/^\n{1,}/, "")
        }
        ;

        function d(f, e) {
            return e - (f.replace(/\(/g, "").length - f.replace(/\)/g, "").length)
        }

        function c(f, e) {
            return f.replace(/\s{1,}/g, " ").replace(/ AND /ig, "~::~" + e + e + "AND ").replace(/ BETWEEN /ig, "~::~" + e + "BETWEEN ").replace(/ CASE /ig, "~::~" + e + "CASE ").replace(/ ELSE /ig, "~::~" + e + "ELSE ").replace(/ END /ig, "~::~" + e + "END ").replace(/ FROM /ig, "~::~FROM ").replace(/ GROUP\s{1,}BY/ig, "~::~GROUP BY ").replace(/ HAVING /ig, "~::~HAVING ").replace(/ IN /ig, " IN ").replace(/ JOIN /ig, "~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig, "~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig, "~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig, "~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig, "~::~RIGHT JOIN ").replace(/ ON /ig, "~::~" + e + "ON ").replace(/ OR /ig, "~::~" + e + e + "OR ").replace(/ ORDER\s{1,}BY/ig, "~::~ORDER BY ").replace(/ OVER /ig, "~::~" + e + "OVER ").replace(/\(\s{0,}SELECT /ig, "~::~(SELECT ").replace(/\)\s{0,}SELECT /ig, ")~::~SELECT ").replace(/ THEN /ig, " THEN~::~" + e + "").replace(/ UNION /ig, "~::~UNION~::~").replace(/ USING /ig, "~::~USING ").replace(/ WHEN /ig, "~::~" + e + "WHEN ").replace(/ WHERE /ig, "~::~WHERE ").replace(/ WITH /ig, "~::~WITH ").replace(/ ALL /ig, " ALL ").replace(/ AS /ig, " AS ").replace(/ ASC /ig, " ASC ").replace(/ DESC /ig, " DESC ").replace(/ DISTINCT /ig, " DISTINCT ").replace(/ EXISTS /ig, " EXISTS ").replace(/ NOT /ig, " NOT ").replace(/ NULL /ig, " NULL ").replace(/ LIKE /ig, " LIKE ").replace(/\s{0,}SELECT /ig, "SELECT ").replace(/\s{0,}UPDATE /ig, "UPDATE ").replace(/ SET /ig, " SET ").replace(/~::~{1,}/g, "~::~").split("~::~")
        }

        b.prototype.sql = function (q, g) {
            let n = q.replace(/\s{1,}/g, " ").replace(/\'/ig, "~::~'").split("~::~")
                , l = n.length
                , j = []
                , p = 0
                , h = this.step
                , r = true
                , k = false
                , f = 0
                , m = ""
                , i = 0
                , e = g ? a(g) : this.shift;
            for (i = 0; i < l; i++) {
                if (i % 2) {
                    j = j.concat(n[i])
                } else {
                    j = j.concat(c(n[i], h))
                }
            }
            l = j.length;
            for (i = 0; i < l; i++) {
                f = d(j[i], f);
                if (/\s{0,}\s{0,}SELECT\s{0,}/.exec(j[i])) {
                    j[i] = j[i].replace(/\,/g, ",\n" + h + h + "")
                }
                if (/\s{0,}\s{0,}SET\s{0,}/.exec(j[i])) {
                    j[i] = j[i].replace(/\,/g, ",\n" + h + h + "")
                }
                if (/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(j[i])) {
                    p++;
                    m += e[p] + j[i]
                } else {
                    if (/\'/.exec(j[i])) {
                        if (f < 1 && p) {
                            p--
                        }
                        m += j[i]
                    } else {
                        m += e[p] + j[i];
                        if (f < 1 && p) {
                            p--
                        }
                    }
                }
                let o = 0
            }
            m = m.replace(/^\n{1,}/, "").replace(/\n{1,}/g, "\n");
            return m
        }
        ;
        b.prototype.xmlmin = function (g, e) {
            let f = e ? g : g.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g, "").replace(/[ \r\n\t]{1,}xmlns/g, " xmlns");
            return f.replace(/>\s{0,}</g, "><")
        }
        ;
        b.prototype.jsonmin = function (e) {
            if (typeof JSON === "undefined") {
                return e
            }
            return JSON.stringify(JSON.parse(e), null, 0)
        }
        ;
        b.prototype.cssmin = function (g, e) {
            let f = e ? g : g.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
            return f.replace(/\s{1,}/g, " ").replace(/\{\s{1,}/g, "{").replace(/\}\s{1,}/g, "}").replace(/\;\s{1,}/g, ";").replace(/\/\*\s{1,}/g, "/*").replace(/\*\/\s{1,}/g, "*/")
        }
        ;
        b.prototype.sqlmin = function (e) {
            return e.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")")
        }
        ;
        window.vkbeautify = new b()
    }
)();
(function () {
    function a(v, e) {
        e = e || {};
        let t = e.indent_size || 4;
        let c = e.indent_char || " ";
        if (typeof t === "string") {
            t = parseInt(t, 10)
        }
        let h = /^\s+$/;
        let f = /[\w$\-_]/;
        let j = -1, n;

        function r() {
            n = v.charAt(++j);
            return n
        }

        function s() {
            return v.charAt(j + 1)
        }

        function x(z) {
            let A = j;
            while (r()) {
                if (n === "\\") {
                    r();
                    r()
                } else {
                    if (n === z) {
                        break
                    } else {
                        if (n === "\n") {
                            break
                        }
                    }
                }
            }
            return v.substring(A, j + 1)
        }

        function b() {
            let z = j;
            while (h.test(s())) {
                j++
            }
            return j !== z
        }

        function y() {
            let z = j;
            do {
            } while (h.test(r()));
            return j !== z + 1
        }

        function q() {
            let z = j;
            r();
            while (r()) {
                if (n === "*" && s() === "/") {
                    j++;
                    break
                }
            }
            return v.substring(z, j + 1)
        }

        function k(z) {
            return v.substring(j - z.length, j).toLowerCase() === z
        }

        let p = v.match(/^[\r\n]*[\t ]*/)[0];
        let i = Array(t + 1).join(c);
        let u = 0;

        function m() {
            u++;
            p += i
        }

        function o() {
            u--;
            p = p.slice(0, -t)
        }

        let d = {};
        d["{"] = function (z) {
            d.singleSpace();
            l.push(z);
            d.newLine()
        }
        ;
        d["}"] = function (z) {
            d.newLine();
            l.push(z);
            d.newLine()
        }
        ;
        d.newLine = function (z) {
            if (!z) {
                while (h.test(l[l.length - 1])) {
                    l.pop()
                }
            }
            if (l.length) {
                l.push("\n")
            }
            if (p) {
                l.push(p)
            }
        }
        ;
        d.singleSpace = function () {
            if (l.length && !h.test(l[l.length - 1])) {
                l.push(" ")
            }
        }
        ;
        let l = [];
        if (p) {
            l.push(p)
        }
        while (true) {
            let g = y();
            if (!n) {
                break
            }
            if (n === "{") {
                m();
                d["{"](n)
            } else {
                if (n === "}") {
                    o();
                    d["}"](n)
                } else {
                    if (n === '"' || n === "'") {
                        l.push(x(n))
                    } else {
                        if (n === ";") {
                            l.push(n, "\n", p)
                        } else {
                            if (n === "/" && s() === "*") {
                                d.newLine();
                                l.push(q(), "\n", p)
                            } else {
                                if (n === "(") {
                                    if (k("url")) {
                                        l.push(n);
                                        b();
                                        if (r()) {
                                            if (n !== ")" && n !== '"' && n !== "'") {
                                                l.push(x(")"))
                                            } else {
                                                j--
                                            }
                                        }
                                    } else {
                                        if (g) {
                                            d.singleSpace()
                                        }
                                        l.push(n);
                                        b()
                                    }
                                } else {
                                    if (n === ")") {
                                        l.push(n)
                                    } else {
                                        if (n === ",") {
                                            b();
                                            l.push(n);
                                            d.singleSpace()
                                        } else {
                                            if (n === "]") {
                                                l.push(n)
                                            } else {
                                                if (n === "[" || n === "=") {
                                                    b();
                                                    l.push(n)
                                                } else {
                                                    if (g) {
                                                        d.singleSpace()
                                                    }
                                                    l.push(n)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        let w = l.join("").replace(/[\n ]+$/, "");
        return w
    }

    // if (typeof define === "function") {
    //     define(function(c, b, d) {
    //         b.css_beautify = a
    //     })
    // } else {
    //     if (typeof exports !== "undefined") {
    //         exports.css_beautify = a
    //     } else {
    //         if (typeof window !== "undefined") {
    window.css_beautify = a
    //         }
    //     }
    // }
}());
(function () {
    function b(v, g, p, h) {
        let z, s, q, j, k, y;
        g = g || {};
        s = g.indent_size || 4;
        q = g.indent_char || " ";
        k = g.brace_style || "collapse";
        j = g.max_char === 0 ? Infinity : g.max_char || 250;
        y = g.unformatted || ["a", "span", "bdo", "em", "strong", "dfn", "code", "samp", "kbd", "var", "cite", "abbr", "acronym", "q", "sub", "sup", "tt", "i", "b", "big", "small", "u", "s", "strike", "font", "ins", "del", "pre", "address", "dt", "h1", "h2", "h3", "h4", "h5", "h6"];

        function f() {
            this.pos = 0;
            this.token = "";
            this.current_mode = "CONTENT";
            this.tags = {
                parent: "parent1",
                parentcount: 1,
                parent1: ""
            };
            this.tag_type = "";
            this.token_text = this.last_token = this.last_text = this.token_type = "";
            this.Utils = {
                whitespace: "\n\r\t ".split(""),
                single_token: "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?=".split(","),
                extra_liners: "head,body,/html".split(","),
                in_array: function (B, t) {
                    for (let A = 0; A < t.length; A++) {
                        if (B === t[A]) {
                            return true
                        }
                    }
                    return false
                }
            };
            this.get_content = function () {
                let t = ""
                    , B = []
                    , C = false;
                while (this.input.charAt(this.pos) !== "<") {
                    if (this.pos >= this.input.length) {
                        return B.length ? B.join("") : ["", "TK_EOF"]
                    }
                    t = this.input.charAt(this.pos);
                    this.pos++;
                    this.line_char_count++;
                    if (this.Utils.in_array(t, this.Utils.whitespace)) {
                        if (B.length) {
                            C = true
                        }
                        this.line_char_count--;
                        continue
                    } else {
                        if (C) {
                            if (this.line_char_count >= this.max_char) {
                                B.push("\n");
                                for (let A = 0; A < this.indent_level; A++) {
                                    B.push(this.indent_string)
                                }
                                this.line_char_count = 0
                            } else {
                                B.push(" ");
                                this.line_char_count++
                            }
                            C = false
                        }
                    }
                    B.push(t)
                }
                return B.length ? B.join("") : ""
            }
            ;
            this.get_contents_to = function (B) {
                if (this.pos === this.input.length) {
                    return ["", "TK_EOF"]
                }
                let t = "";
                let C = "";
                let D = new RegExp("</" + B + "\\s*>", "igm");
                D.lastIndex = this.pos;
                let A = D.exec(this.input);
                let E = A ? A.index : this.input.length;
                if (this.pos < E) {
                    C = this.input.substring(this.pos, E);
                    this.pos = E
                }
                return C
            }
            ;
            this.record_tag = function (t) {
                if (this.tags[t + "count"]) {
                    this.tags[t + "count"]++;
                    this.tags[t + this.tags[t + "count"]] = this.indent_level
                } else {
                    this.tags[t + "count"] = 1;
                    this.tags[t + this.tags[t + "count"]] = this.indent_level
                }
                this.tags[t + this.tags[t + "count"] + "parent"] = this.tags.parent;
                this.tags.parent = t + this.tags[t + "count"]
            }
            ;
            this.retrieve_tag = function (t) {
                if (this.tags[t + "count"]) {
                    let A = this.tags.parent;
                    while (A) {
                        if (t + this.tags[t + "count"] === A) {
                            break
                        }
                        A = this.tags[A + "parent"]
                    }
                    if (A) {
                        this.indent_level = this.tags[t + this.tags[t + "count"]];
                        this.tags.parent = this.tags[A + "parent"]
                    }
                    delete this.tags[t + this.tags[t + "count"] + "parent"];
                    delete this.tags[t + this.tags[t + "count"]];
                    if (this.tags[t + "count"] === 1) {
                        delete this.tags[t + "count"]
                    } else {
                        this.tags[t + "count"]--
                    }
                }
            }
            ;
            this.get_tag = function (J) {
                let E = "", G = [], F = "", A = false, I, D, B = this.pos, t = this.line_char_count;
                J = J !== undefined ? J : false;
                do {
                    if (this.pos >= this.input.length) {
                        if (J) {
                            this.pos = B;
                            this.line_char_count = t
                        }
                        return G.length ? G.join("") : ["", "TK_EOF"]
                    }
                    E = this.input.charAt(this.pos);
                    this.pos++;
                    this.line_char_count++;
                    if (this.Utils.in_array(E, this.Utils.whitespace)) {
                        A = true;
                        this.line_char_count--;
                        continue
                    }
                    if (E === "'" || E === '"') {
                        if (!G[1] || G[1] !== "!") {
                            E += this.get_unformatted(E);
                            A = true
                        }
                    }
                    if (E === "=") {
                        A = false
                    }
                    if (G.length && G[G.length - 1] !== "=" && E !== ">" && A) {
                        if (this.line_char_count >= this.max_char) {
                            this.print_newline(false, G);
                            this.line_char_count = 0
                        } else {
                            G.push(" ");
                            this.line_char_count++
                        }
                        A = false
                    }
                    if (E === "<") {
                        I = this.pos - 1
                    }
                    G.push(E)
                } while (E !== ">");
                let K = G.join("");
                let C;
                if (K.indexOf(" ") !== -1) {
                    C = K.indexOf(" ")
                } else {
                    C = K.indexOf(">")
                }
                let H = K.substring(1, C).toLowerCase();
                if (K.charAt(K.length - 2) === "/" || this.Utils.in_array(H, this.Utils.single_token)) {
                    if (!J) {
                        this.tag_type = "SINGLE"
                    }
                } else {
                    if (H === "script") {
                        if (!J) {
                            this.record_tag(H);
                            this.tag_type = "SCRIPT"
                        }
                    } else {
                        if (H === "style") {
                            if (!J) {
                                this.record_tag(H);
                                this.tag_type = "STYLE"
                            }
                        } else {
                            if (this.is_unformatted(H, y)) {
                                F = this.get_unformatted("</" + H + ">", K);
                                G.push(F);
                                if (I > 0 && this.Utils.in_array(this.input.charAt(I - 1), this.Utils.whitespace)) {
                                    G.splice(0, 0, this.input.charAt(I - 1))
                                }
                                D = this.pos - 1;
                                if (this.Utils.in_array(this.input.charAt(D + 1), this.Utils.whitespace)) {
                                    G.push(this.input.charAt(D + 1))
                                }
                                this.tag_type = "SINGLE"
                            } else {
                                if (H.charAt(0) === "!") {
                                    if (H.indexOf("[if") !== -1) {
                                        if (K.indexOf("!IE") !== -1) {
                                            F = this.get_unformatted("-->", K);
                                            G.push(F)
                                        }
                                        if (!J) {
                                            this.tag_type = "START"
                                        }
                                    } else {
                                        if (H.indexOf("[endif") !== -1) {
                                            this.tag_type = "END";
                                            this.unindent()
                                        } else {
                                            if (H.indexOf("[cdata[") !== -1) {
                                                F = this.get_unformatted("]]>", K);
                                                G.push(F);
                                                if (!J) {
                                                    this.tag_type = "SINGLE"
                                                }
                                            } else {
                                                F = this.get_unformatted("-->", K);
                                                G.push(F);
                                                this.tag_type = "SINGLE"
                                            }
                                        }
                                    }
                                } else {
                                    if (!J) {
                                        if (H.charAt(0) === "/") {
                                            this.retrieve_tag(H.substring(1));
                                            this.tag_type = "END"
                                        } else {
                                            this.record_tag(H);
                                            this.tag_type = "START"
                                        }
                                        if (this.Utils.in_array(H, this.Utils.extra_liners)) {
                                            this.print_newline(true, this.output)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (J) {
                    this.pos = B;
                    this.line_char_count = t
                }
                return G.join("")
            }
            ;
            this.get_unformatted = function (A, B) {
                if (B && B.toLowerCase().indexOf(A) !== -1) {
                    return ""
                }
                let t = "";
                let C = "";
                let D = true;
                do {
                    if (this.pos >= this.input.length) {
                        return C
                    }
                    t = this.input.charAt(this.pos);
                    this.pos++;
                    if (this.Utils.in_array(t, this.Utils.whitespace)) {
                        if (!D) {
                            this.line_char_count--;
                            continue
                        }
                        if (t === "\n" || t === "\r") {
                            C += "\n";
                            this.line_char_count = 0;
                            continue
                        }
                    }
                    C += t;
                    this.line_char_count++;
                    D = true
                } while (C.toLowerCase().indexOf(A) === -1);
                return C
            }
            ;
            this.get_token = function () {
                let t;
                if (this.last_token === "TK_TAG_SCRIPT" || this.last_token === "TK_TAG_STYLE") {
                    let A = this.last_token.substr(7);
                    t = this.get_contents_to(A);
                    if (typeof t !== "string") {
                        return t
                    }
                    return [t, "TK_" + A]
                }
                if (this.current_mode === "CONTENT") {
                    t = this.get_content();
                    if (typeof t !== "string") {
                        return t
                    } else {
                        return [t, "TK_CONTENT"]
                    }
                }
                if (this.current_mode === "TAG") {
                    t = this.get_tag();
                    if (typeof t !== "string") {
                        return t
                    } else {
                        let B = "TK_TAG_" + this.tag_type;
                        return [t, B]
                    }
                }
            }
            ;
            this.get_full_indent = function (t) {
                t = this.indent_level + t || 0;
                if (t < 1) {
                    return ""
                }
                return Array(t + 1).join(this.indent_string)
            }
            ;
            this.is_unformatted = function (B, A) {
                if (!this.Utils.in_array(B, A)) {
                    return false
                }
                if (B.toLowerCase() !== "a" || !this.Utils.in_array("a", A)) {
                    return true
                }
                let C = this.get_tag(true);
                let t = (C || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);
                if (!t || this.Utils.in_array(t, A)) {
                    return true
                } else {
                    return false
                }
            }
            ;
            this.printer = function (C, B, t, E, D) {
                this.input = C || "";
                this.output = [];
                this.indent_character = B;
                this.indent_string = "";
                this.indent_size = t;
                this.brace_style = D;
                this.indent_level = 0;
                this.max_char = E;
                this.line_char_count = 0;
                for (let A = 0; A < this.indent_size; A++) {
                    this.indent_string += this.indent_character
                }
                this.print_newline = function (H, F) {
                    this.line_char_count = 0;
                    if (!F || !F.length) {
                        return
                    }
                    if (!H) {
                        while (this.Utils.in_array(F[F.length - 1], this.Utils.whitespace)) {
                            F.pop()
                        }
                    }
                    F.push("\n");
                    for (let G = 0; G < this.indent_level; G++) {
                        F.push(this.indent_string)
                    }
                }
                ;
                this.print_token = function (F) {
                    this.output.push(F)
                }
                ;
                this.indent = function () {
                    this.indent_level++
                }
                ;
                this.unindent = function () {
                    if (this.indent_level > 0) {
                        this.indent_level--
                    }
                }
            }
            ;
            return this
        }

        z = new f();
        z.printer(v, q, s, j, k);
        while (true) {
            let m = z.get_token();
            z.token_text = m[0];
            z.token_type = m[1];
            if (z.token_type === "TK_EOF") {
                break
            }
            switch (z.token_type) {
                case "TK_TAG_START":
                    z.print_newline(false, z.output);
                    z.print_token(z.token_text);
                    z.indent();
                    z.current_mode = "CONTENT";
                    break;
                case "TK_TAG_STYLE":
                case "TK_TAG_SCRIPT":
                    z.print_newline(false, z.output);
                    z.print_token(z.token_text);
                    z.current_mode = "CONTENT";
                    break;
                case "TK_TAG_END":
                    if (z.last_token === "TK_CONTENT" && z.last_text === "") {
                        let x = z.token_text.match(/\w+/)[0];
                        let o = z.output[z.output.length - 1].match(/<\s*(\w+)/);
                        if (o === null || o[1] !== x) {
                            z.print_newline(true, z.output)
                        }
                    }
                    z.print_token(z.token_text);
                    z.current_mode = "CONTENT";
                    break;
                case "TK_TAG_SINGLE":
                    let e = z.token_text.match(/^\s*<([a-z]+)/i);
                    if (!e || !z.Utils.in_array(e[1], y)) {
                        z.print_newline(false, z.output)
                    }
                    z.print_token(z.token_text);
                    z.current_mode = "CONTENT";
                    break;
                case "TK_CONTENT":
                    if (z.token_text !== "") {
                        z.print_token(z.token_text)
                    }
                    z.current_mode = "TAG";
                    break;
                case "TK_STYLE":
                case "TK_SCRIPT":
                    if (z.token_text !== "") {
                        z.output.push("\n");
                        let n = z.token_text, u, l = 1;
                        if (z.token_type === "TK_SCRIPT") {
                            u = typeof p === "function" && p
                        } else {
                            if (z.token_type === "TK_STYLE") {
                                u = typeof h === "function" && h
                            }
                        }
                        if (g.indent_scripts === "keep") {
                            l = 0
                        } else {
                            if (g.indent_scripts === "separate") {
                                l = -z.indent_level
                            }
                        }
                        let d = z.get_full_indent(l);
                        if (u) {
                            n = u(n.replace(/^\s*/, d), g)
                        } else {
                            let i = n.match(/^\s*/)[0];
                            let r = i.match(/[^\n\r]*$/)[0].split(z.indent_string).length - 1;
                            let w = z.get_full_indent(l - r);
                            n = n.replace(/^\s*/, d).replace(/\r\n|\r|\n/g, "\n" + w).replace(/\s*$/, "")
                        }
                        if (n) {
                            z.print_token(n);
                            z.print_newline(true, z.output)
                        }
                    }
                    z.current_mode = "TAG";
                    break
            }
            z.last_token = z.token_type;
            z.last_text = z.token_text
        }
        return z.output.join("")
    }

    if (typeof window !== "undefined") {
        window.html_beautify = function (e, d) {
            return b(e, d, window.js_beautify, window.css_beautify)
        }
    }
}());
const MSG_TYPE = {
    BROWSER_CLICKED: "browser-clicked",
    GET_CSS: "get-css",
    GET_JS: "get-js",
    GET_HTML: "get-html",
    GET_COOKIE: "get-cookie",
    REMOVE_COOKIE: "remove-cookie",
    SET_COOKIE: "set-cookie",
    GET_OPTIONS: "get_options",
    SET_OPTIONS: "set_options",
    FCP_HELPER_INIT: "fcp_helper_init",
    CSS_READY: "css-ready",
    JS_READY: "js-ready",
    HTML_READY: "html-ready",
    ALL_READY: "all-ready",
    START_OPTION: "start-option",
    OPT_START_FCP: "opt-item-fcp",
    OPT_START_GRID: "opt-item-grid",
    CALC_PAGE_LOAD_TIME: "calc-page-load-time",
    GET_PAGE_WPO_INFO: "get_page_wpo_info",
    SHOW_PAGE_LOAD_TIME: "show-page-load-time",
    FCP_HELPER_DETECT: "fcp-helper-detect",
    GRID_DETECT: "grid-detect",
    JS_TRACKER: "js_tracker",
    CODE_COMPRESS: "code_compress",
    FROM_POPUP: "from_popup_action",
    TAB_CREATED_OR_UPDATED: "tab_created_or_updated",
    REGEXP_TOOL: "regexp",
    EN_DECODE: "endecode",
    JSON_FORMAT: "jsonformat",
    QR_CODE: "qrcode",
    CODE_BEAUTIFY: "codebeautify",
    TIME_STAMP: "timestamp",
    IMAGE_BASE64: "imagebase64",
    AUTO_FORMART_PAGE_JSON: "opt_item_autojson",
    COLOR_PICKER: "color-picker:newImage",
    AJAX_DEBUGGER: "ajax-debugger",
    AJAX_DEBUGGER_CONSOLE: "ajax-debugger-console",
    AJAX_DEBUGGER_SWITCH: "ajax-debugger-switch"
};
const FILE = {
    STYLE: "style",
    LINK: "link",
    SCRIPT: "script-block"
};
const PUBLIC_ID_WHITE_LIST = {
    "": {
        systemIds: {
            "": true
        }
    },
    "-//W3C//DTD HTML 3.2 Final//EN": {
        systemIds: {
            "": true
        }
    },
    "-//W3C//DTD HTML 4.0//EN": {
        systemIds: {
            "": true,
            "http://www.w3.org/TR/html4/strict.dtd": true
        }
    },
    "-//W3C//DTD HTML 4.01//EN": {
        systemIds: {
            "": true,
            "http://www.w3.org/TR/html4/strict.dtd": true
        }
    },
    "-//W3C//DTD HTML 4.0 Transitional//EN": {
        systemIds: {
            "": true,
            "http://www.w3.org/TR/html4/loose.dtd": true
        }
    },
    "-//W3C//DTD HTML 4.01 Transitional//EN": {
        systemIds: {
            "": true,
            "http://www.w3.org/TR/html4/loose.dtd": true,
            "http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd": true
        }
    },
    "-//W3C//DTD XHTML 1.1//EN": {
        systemIds: {
            "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd": true
        }
    },
    "-//W3C//DTD XHTML Basic 1.0//EN": {
        systemIds: {
            "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd": true
        }
    },
    "-//W3C//DTD XHTML 1.0 Strict//EN": {
        systemIds: {
            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd": true
        }
    },
    "-//W3C//DTD XHTML 1.0 Transitional//EN": {
        systemIds: {
            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd": true
        }
    },
    "ISO/IEC 15445:1999//DTD HyperText Markup Language//EN": {
        systemIds: {
            "": true
        }
    },
    "ISO/IEC 15445:2000//DTD HTML//EN": {
        systemIds: {
            "": true
        }
    },
    "ISO/IEC 15445:1999//DTD HTML//EN": {
        systemIds: {
            "": true
        }
    }
};
const COMPAT_MODE_DIFF_PUBLIC_ID_MAP = {
    "-//W3C//DTD HTML 4.0 Transitional//EN": {
        systemIds: {
            "http://www.w3.org/TR/html4/loose.dtd": {
                IE: "S",
                WebKit: "Q"
            }
        }
    },
    "ISO/IEC 15445:2000//DTD HTML//EN": {
        systemIds: {
            "": {
                IE: "Q",
                WebKit: "S"
            }
        }
    },
    "ISO/IEC 15445:1999//DTD HTML//EN": {
        systemIds: {
            "": {
                IE: "Q",
                WebKit: "S"
            }
        }
    }
};
const HTML_DEPRECATED_TAGS = {
    acronym: "定义首字母缩写",
    applet: "定义Java Applet",
    basefont: "定义Font定义",
    big: "定义大号文本",
    center: "定义居中的文本",
    dir: "定义目录列表",
    font: "定义文字相关",
    frame: "定义框架",
    frameset: "定义框架集",
    isindex: "定义单行的输入域",
    noframes: "定义noframe 部分",
    s: "定义加删除线的文本",
    strike: "定义加删除线的文本",
    tt: "定义打字机文本",
    u: "定义下划线文本",
    xmp: "定义预格式文本",
    layer: "定义层"
};
const HTML_DEPRECATED_ATTRIBUTES = {
    align: {
        iframe: true,
        img: true,
        object: true,
        table: true
    },
    color: {
        font: true
    },
    height: {
        td: true,
        th: true
    },
    language: {
        script: true
    },
    noshade: {
        hr: true
    },
    nowrap: {
        td: true,
        th: true
    },
    size: {
        hr: true,
        font: true,
        basefont: true
    }
};
const BLOCK_HTML_ELEMENT = ["address", "blockquote", "center", "dir", "div", "dl", "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "isindex", "menu", "noframes", "noscript", "ol", "p", "pre", "table", "ul"];
const INLINE_HTML_ELEMENT = ["a", "acronym", "b", "bdo", "big", "br", "cite", "code", "dfn", "em", "font", "i", "img", "input", "kbd", "label", "q", "s", "samp", "select", "small", "span", "strike", "strong", "sub", "sup", "textarea", "tt", "u", "var"];
const CHANGE_ABLE_HTML_ELEMENT = ["applet", "button", "del", "iframe", "ins", "map", "object", "script"];
const CONDITIONAL_COMMENT_REGEXP = /\[\s*if\s+[^\]][\s\w]*\]/i;
const NOT_IE_REVEALED_OPENING_CONDITIONAL_COMMENT_REGEXP = /^\[if\s+(!IE|false)\]$/i;
const REVEALED_CLOSING_CONDITIONAL_COMMENT_REGEXP = /^\[endif\s*\]$/i;
const NOT_IE_HIDDEN_CONDITIONAL_COMMENT_REGEXP = /^\[if\s+(!IE|false)\]>.*<!\[endif\]$/i;
const REG = {
    SCRIPT: /<script[^>]*>[\s\S]*?<\/[^>]*script>/gi,
    COMMENT: /<!--[\s\S]*?--\>/g,
    CSS_EXPRESSION: /expression[\s\r\n ]?\(/gi,
    TEXTAREA: /<textarea[^>]*>[\s\S]*?<\/[^>]*textarea>/gi,
    INVALID_TAG: /<\W+>/gi
};
const SELF_CLOSING_TAGS = ["meta", "link", "area", "base", "col", "input", "img", "br", "hr", "param", "embed"];
let baidu = function () {
    this.version = "1.3.5"
};
baidu.namespace = new Object();
baidu.namespace.register = function (e) {
    let c = /^[_$a-z]+[_$a-z0-9]*/i;
    let d = e.split(".");
    let g = "";
    let f = "";
    let a = [window];
    for (let b = 0; b < d.length; b++) {
        if (!c.test(d[b])) {
            throw new Error("Invalid namespace:" + d[b] + "");
            return
        }
        a[b + 1] = a[b][d[b]];
        if (typeof a[b + 1] == "undefined") {
            a[b + 1] = new Object()
        }
    }
}
;
String.prototype.trim = function () {
    return this.replace(/^\s*|\s*$/g, "")
}
;
String.prototype.format = function () {
    let b = arguments.length
        , a = this;
    while (b--) {
        a = a.replace(new RegExp("\\{" + b + "\\}", "g"), arguments[b])
    }
    return a
}
;
Date.prototype.format = function (e) {
    let a = function (m, l) {
        let n = ""
            , k = (m < 0)
            , j = String(Math.abs(m));
        if (j.length < l) {
            n = (new Array(l - j.length + 1)).join("0")
        }
        return (k ? "-" : "") + n + j
    };
    if ("string" != typeof e) {
        return this.toString()
    }
    let b = function (k, j) {
        e = e.replace(k, j)
    };
    let f = this.getFullYear()
        , d = this.getMonth() + 1
        , i = this.getDate()
        , g = this.getHours()
        , c = this.getMinutes()
        , h = this.getSeconds();
    b(/yyyy/g, a(f, 4));
    b(/yy/g, a(parseInt(f.toString().slice(2), 10), 2));
    b(/MM/g, a(d, 2));
    b(/M/g, d);
    b(/dd/g, a(i, 2));
    b(/d/g, i);
    b(/HH/g, a(g, 2));
    b(/H/g, g);
    b(/hh/g, a(g % 12, 2));
    b(/h/g, g % 12);
    b(/mm/g, a(c, 2));
    b(/m/g, c);
    b(/ss/g, a(h, 2));
    b(/s/g, h);
    return e
}
;
String.prototype.getBytes = function () {
    let b = this.replace(/\n/g, "xx").replace(/\t/g, "x");
    let a = encodeURIComponent(b);
    return a.replace(/%[A-Z0-9][A-Z0-9]/g, "x").length
}
;
let getOuterHtmlEllipsis = function (d) {
    let b = /(<[^>]+>)/g;
    let a = b.exec(d.outerHTML);
    let c = a ? a[1] : d.outerHTML;
    c = c.length > 40 ? c.substr(0, 40) + "..." : c;
    return c.replace(/</g, "&lt;").replace(/>/g, "&gt;")
};
let getOuterAndInnerHtmlEllipsis = function (b) {
    let a = jQuery("<div></div>").append(b).html()
};
(function () {
        baidu.i18n = {};
        baidu.i18n.getMessage = function (d, b) {
            if (b) {
                for (let c = 0, a = b.length; c < a; c++) {
                    b[c] = "" + b[c]
                }
                return chrome.i18n.getMessage(d, b)
            } else {
                return chrome.i18n.getMessage(d)
            }
        }
    }
)();


