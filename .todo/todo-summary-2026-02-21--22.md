# Codebase TODO Audit

Generated at: 2026-02-21 22:13:25

### \functions\gemini-proxy\src\main.js
- Line 93: const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

### \functions\stripe-checkout\src\main.js
- Line 122: success_url: process.env.SUCCESS_URL || 'https://sigil.app.cultofthefork.tech?payment=success',
- Line 123: cancel_url: process.env.CANCEL_URL || 'https://sigil.app.cultofthefork.tech?payment=cancelled',
- Line 162: amount: session.amount_total != null ? session.amount_total / 100 : null, // Convert from cents when available

### \scripts\audit_todos.py
- Line 10: # Also looks for specific keywords: TODO, FIXME, HACK, QUESTION, NOTE, [ ], !, ?, *
- Line 54: f.write("# Codebase TODO Audit\n\n")

### \scripts\generate_tarot.py
- Line 71: url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=768&model=flux&nologo=true&seed=42"

### \scripts\parse_comments.js
- Line 22: '[': 'TASK' // Handles [ ]
- Line 37: if (trimmed.startsWith('//') || trimmed.startsWith('*')) {
- Line 51: // Special case for [ ] tasks

### \server\main.py
- Line 33: allow_origins=["*"], # In production, restrict this to the DigitalOcean frontend URL

### \server\api\birth_profile.py
- Line 45: # * NOTE: Progressed Moon for the "Hero's Arc" module

### \server\api\stripe_routes.py
- Line 18: SUCCESS_URL = os.getenv("SUCCESS_URL", "http://localhost:5173?payment=success")
- Line 19: CANCEL_URL = os.getenv("CANCEL_URL", "http://localhost:5173?payment=cancelled")

### \server\core\astrology_engine.py
- Line 56: # * NOTE: Build rich planetary data with Sabian Symbols and Decan-Tarot
- Line 80: "sixthHouse": float(houses[5]),  # ! For Medical Astrology / Bio-Resonance
- Line 81: "secondHouse": float(houses[1]), # ! For Prosperity Map
- Line 82: "tenthHouse": float(houses[9]),  # ! For Career / Prosperity Map

### \server\core\progressed_moon.py
- Line 116: # * NOTE: Day-for-a-year progression

### \server\core\sabian_symbols.py
- Line 437: # ! Important: Sabian convention rounds UP to the next whole degree

### \server\core\security.py
- Line 16: ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days for convenience

### \server\core\synthesis_engine.py
- Line 117: # * NOTE: Solfeggio frequency for this Life Path
- Line 208: timeout=60  # ! Increased timeout for richer responses
- Line 246: # * NOTE: Give the teaser LLM a taste of the data to make the preview more specific

### \server\venv\Lib\site-packages\six.py
- Line 59: # It's possible to have sizeof(long) != sizeof(Py_ssize_t).

### \server\venv\Lib\site-packages\typing_extensions.py
- Line 276: # Note that inheriting from this class means that the object will be
- Line 667: # NOTE: DO NOT call super() in any methods in this class
- Line 750: # Hack so that typing.Generic.__class_getitem__
- Line 759: # if we define only __eq__!
- Line 842: # break if we *don't* execute this block, because *they* assume that all
- Line 980: """Write *data* to the output stream and return the number of items written."""  # noqa: E501
- Line 1563: # Compare if values differ. Note that even if equal
- Line 1928: # Hack to get typing._type_check to pass.
- Line 1971: # Hack to get typing._type_check to pass in Generic.
- Line 2104: # Hack: Arguments must be types, replace it with one.
- Line 2262: # 3.14+?
- Line 2312: query("SELECT * FROM table")  # ok
- Line 2313: query(f"SELECT * FROM {input()}")  # not ok
- Line 2468: # This function expects two keyword arguments - *name* of type `str` and
- Line 2469: # *year* of type `int`.
- Line 3045: # - We want it to *not* be treated as a TypeVar for the purposes of
- Line 3252: # `[T, int]`, or `[int, *Ts]`, etc.
- Line 3319: # TODO: Use inspect.VALUE here, and make the annotations lazily evaluated
- Line 3363: # BaseException.add_note() existed on py311,
- Line 3365: # using add_note() until py312.
- Line 3733: # Note in <= 3.9 _ConcatenateGenericAlias inherits from list
- Line 4028: # (unless they are shadowed by assignments *in* the local namespace),
- Line 4092: # (unless they are shadowed by assignments *in* the local namespace),

### \server\venv\Lib\site-packages\aiohttp\client.py
- Line 524: # NOTE: timeout clamps existing connect and read timeouts.  We cannot
- Line 632: # NOTE: Bail early, otherwise, causes `InvalidURL` through
- Line 633: # NOTE: `self._request_class()` below.

### \server\venv\Lib\site-packages\aiohttp\client_exceptions.py
- Line 382: class ClientConnectorSSLError(*ssl_error_bases):  # type: ignore[misc]
- Line 386: class ClientConnectorCertificateError(*cert_errors_bases):  # type: ignore[misc]

### \server\venv\Lib\site-packages\aiohttp\client_proto.py
- Line 138: with suppress(Exception):  # FIXME: log this somehow?
- Line 207: # TODO: actual types are:

### \server\venv\Lib\site-packages\aiohttp\client_reqrep.py
- Line 101: _CONTAINS_CONTROL_CHAR_RE = re.compile(r"[^-!#$%&'*+.^_`|~0-9a-zA-Z]")
- Line 350: # TODO: Fix session=None in tests (see ClientRequest.__init__).
- Line 867: # FIXME: session is None in tests only, need to fix tests
- Line 1003: # NOTE: In the future, when we remove sync close support,
- Line 1258: # request.body = b"new request data"  # This will leak resources!

### \server\venv\Lib\site-packages\aiohttp\compression_utils.py
- Line 28: else:  # TODO(PY314): Remove mentions of backports.zstd across codebase
- Line 37: DEFAULT_MAX_DECOMPRESS_SIZE = 2**25  # 32MiB

### \server\venv\Lib\site-packages\aiohttp\connector.py
- Line 440: # recreate it ever!
- Line 1373: "* https://bugs.python.org/issue37179\n"
- Line 1374: "* https://github.com/python/cpython/pull/28073\n"
- Line 1375: "* https://docs.aiohttp.org/en/stable/"
- Line 1377: "* https://github.com/aio-libs/aiohttp/discussions/6044\n",
- Line 1419: "* https://bugs.python.org/issue37179\n"
- Line 1420: "* https://github.com/python/cpython/pull/28073\n\n"
- Line 1422: "* https://docs.aiohttp.org/en/stable/client_advanced.html#proxy-support\n"
- Line 1423: "* https://github.com/aio-libs/aiohttp/discussions/6044\n",
- Line 1426: # Why `4`? At least 3 of the calls in the stack originate

### \server\venv\Lib\site-packages\aiohttp\formdata.py
- Line 165: # FIXME cgi.FieldStorage doesn't likes body parts with

### \server\venv\Lib\site-packages\aiohttp\helpers.py
- Line 260: # TODO(PY311): username = login or account
- Line 266: # TODO(PY311): Remove this, as password will be empty string
- Line 501: # always English!
- Line 502: # Tuples are constants stored in codeobject!

### \server\venv\Lib\site-packages\aiohttp\http_parser.py
- Line 79: #     tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." /
- Line 81: #     token = 1*tchar
- Line 82: _TCHAR_SPECIALS: Final[str] = re.escape("!#$%&'*+-.^_`|~")
- Line 150: # note: "raw" does not mean inclusion of OWS before/after the field value
- Line 622: # NOTE: `yarl.URL.build()` is used to mimic what the Cython-based
- Line 623: # NOTE: parser does, otherwise it results into the same
- Line 624: # NOTE: HTTP Request-Line input producing different
- Line 625: # NOTE: `yarl.URL()` objects

### \server\venv\Lib\site-packages\aiohttp\multipart.py
- Line 611: #: Multipart reader class, used to handle multipart/* body parts.
- Line 614: #: Body part reader class for non multipart/* content types.
- Line 857: _valid_tchar_regex = re.compile(rb"\A[!#$%&'*+\-.^_`|~\w]+\Z")
- Line 869: # token          = 1*tchar
- Line 870: # quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
- Line 874: # tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"

### \server\venv\Lib\site-packages\aiohttp\payload.py
- Line 57: TOO_LARGE_BYTES_BODY: Final[int] = 2**20  # 1 MB
- Line 58: READ_SIZE: Final[int] = 2**16  # 64 KB

### \server\venv\Lib\site-packages\aiohttp\pytest_plugin.py
- Line 112: def wrapper(*args, **kwargs):  # type: ignore[no-untyped-def]

### \server\venv\Lib\site-packages\aiohttp\streams.py
- Line 178: if self._low_water != 2**16:  # default limit
- Line 287: # TODO: size is ignored, remove the param later
- Line 331: # Note, when chunked + gzip is used, we can receive a chunk
- Line 448: # TODO: should be `if` instead of `while`
- Line 460: # TODO: should be `if` instead of `while`
- Line 631: # TODO add async def readuntil

### \server\venv\Lib\site-packages\aiohttp\web.py
- Line 317: **kwargs: Any,  # TODO(PY311): Use Unpack

### \server\venv\Lib\site-packages\aiohttp\web_app.py
- Line 519: f'old-style middleware "{m!r}" deprecated, see #2252',

### \server\venv\Lib\site-packages\aiohttp\web_exceptions.py
- Line 211: # FIXME: this should include a date or etag header

### \server\venv\Lib\site-packages\aiohttp\web_request.py
- Line 85: _TCHAR: Final[str] = string.digits + string.ascii_letters + r"!#$%&'*+.^_`|~-"
- Line 732: # Note that according to RFC 7578, the Content-Type header
- Line 833: # NOTE: Release file descriptors for the
- Line 834: # NOTE: `tempfile.Temporaryfile`-created `_io.BufferedRandom`
- Line 835: # NOTE: instances of files sent within multipart request body
- Line 836: # NOTE: via HTTP POST request.

### \server\venv\Lib\site-packages\aiohttp\web_response.py
- Line 58: # TODO(py311): Convert to StrEnum for wider use
- Line 290: # TODO: do we need domain/path here?
- Line 727: # Note: When _body is a Payload (e.g. FilePayload), this may do blocking I/O

### \server\venv\Lib\site-packages\aiohttp\web_urldispatcher.py
- Line 91: r"^[0-9A-Za-z!#\$%&'\*\+\-\.\^_`\|~]+$"
- Line 407: # TODO: implement all abstract methods
- Line 548: # TODO: impl missing abstract methods
- Line 622: # TODO cache file content
- Line 633: m = hashlib.sha256()  # todo sha256 can be configurable param
- Line 703: # if path is a directory, return the contents if permitted. Note the
- Line 1139: # For example if the canonical path is `/core/locations{tail:.*}`

### \server\venv\Lib\site-packages\aiohttp\worker.py
- Line 43: def __init__(self, *args: Any, **kw: Any) -> None:  # pragma: no cover

### \server\venv\Lib\site-packages\aiohttp\_cookie_helpers.py
- Line 27: _COOKIE_NAME_RE = re.compile(r"^[!#$%&\'()*+\-./0-9:<=>?@A-Z\[\]^_`a-z{|}~]+$")
- Line 51: \s*                            # Optional whitespace at start of cookie
- Line 52: (?P<key>                       # Start of group 'key'
- Line 54: [\w\d!#%&'~_`><@,:/\$\*\+\-\.\^\|\)\(\?\}\{\[\]]+   # Any word of at least one letter
- Line 57: \s*=\s*                          # Equal Sign
- Line 58: (?P<val>                         # Start of group 'val'
- Line 59: "(?:[^\\"]|\\.)*"                  # Any double-quoted string (properly closed)
- Line 61: "[^";]*                            # Unmatched opening quote (differs from SimpleCookie - issue #7993)
- Line 67: # NOTE: RFC 2822 timezone support is an aiohttp extension
- Line 71: # NOTE: This is an aiohttp extension for issue #4327 - SimpleCookie does NOT support this format
- Line 74: [\w\d!#%&'~_`><@,:/\$\*\+\-\.\^\|\)\(\?\}\{\=\[\]]*      # Any word or empty string
- Line 76: )?                             # End of optional value group
- Line 77: \s*                            # Any number of spaces.

### \server\venv\Lib\site-packages\aiohttp\_websocket\reader_c.py
- Line 246: # do this, maybe others too?) will return max_length bytes,

### \server\venv\Lib\site-packages\aiohttp\_websocket\reader_py.py
- Line 246: # do this, maybe others too?) will return max_length bytes,

### \server\venv\Lib\site-packages\anyio\_backends\_asyncio.py
- Line 1052: # * on stdlib, drain() raises ConnectionResetError or BrokenPipeError
- Line 1053: # * on uvloop and Winloop, write() eventually starts raising RuntimeError

### \server\venv\Lib\site-packages\anyio\_core\_fileio.py
- Line 416: def info(self) -> Any:  # TODO: add return type annotation when Typeshed gets it

### \server\venv\Lib\site-packages\anyio\_core\_sockets.py
- Line 361: # https://sourceware.org/bugzilla/show_bug.cgi?id=14969

### \server\venv\Lib\site-packages\argon2\profiles.py
- Line 70: # Only for testing!

### \server\venv\Lib\site-packages\argon2\_utils.py
- Line 61: return length // 4 * 3 + last_group_len

### \server\venv\Lib\site-packages\attr\setters.py
- Line 76: # Sentinel for disabling class-wide *on_setattr* hooks for certain attributes.

### \server\venv\Lib\site-packages\attr\_funcs.py
- Line 371: # No attrs, maybe it's a specialized generic (A[str])?

### \server\venv\Lib\site-packages\attr\_make.py
- Line 491: # Create AttrsClass *after* applying the field_transformer since it may
- Line 492: # add or remove attributes!
- Line 1171: # We need to write a __setattr__ but there already is one!
- Line 1664: method_lines.append(tab * 2 + ")")  # close __setattr__
- Line 2110: # Note _inst_dict will be used again below if cache_hash is True
- Line 2168: # assignment. Note _setattr will be used again below if
- Line 2511: # Despite the big red warning, people *do* instantiate `Attribute`

### \server\venv\Lib\site-packages\attr\_next_gen.py
- Line 246: <https://docs.python.org/3/howto/mro.html>`_. If False, *attrs*

### \server\venv\Lib\site-packages\attrs\converters.py
- Line 3: from attr.converters import *  # noqa: F403

### \server\venv\Lib\site-packages\attrs\exceptions.py
- Line 3: from attr.exceptions import *  # noqa: F403

### \server\venv\Lib\site-packages\attrs\filters.py
- Line 3: from attr.filters import *  # noqa: F403

### \server\venv\Lib\site-packages\attrs\setters.py
- Line 3: from attr.setters import *  # noqa: F403

### \server\venv\Lib\site-packages\attrs\validators.py
- Line 3: from attr.validators import *  # noqa: F403

### \server\venv\Lib\site-packages\cffi\api.py
- Line 51: # bad version!  Try to be as explicit as possible.
- Line 63: # rely on it!  It's probably not going to work well.)
- Line 163: # call me with the lock!
- Line 348: #    note that 'buffer' is a type, set on this instance by __init__
- Line 435: # call me with the lock!
- Line 812: # on Python 2 (backward compatibility hack only)
- Line 955: # a hack to make at least ffi.typeof(builtin_function) work,

### \server\venv\Lib\site-packages\cffi\backend_ctypes.py
- Line 889: # The only pointers callbacks can return are void*s:

### \server\venv\Lib\site-packages\cffi\cparser.py
- Line 27: _r_comment = re.compile(r"/\*.*?\*/|//([^\n\\]|\\.)*?$",
- Line 29: _r_define  = re.compile(r"^\s*#\s*define\s+([A-Za-z_][A-Za-z_0-9]*)"
- Line 32: _r_line_directive = re.compile(r"^[ \t]*#[ \t]*(?:line|\d+)\b.*$", re.MULTILINE)
- Line 44: _r_star_const_space = re.compile(       # matches "* const "
- Line 58: # 2.14): "char*const***" gives us a wrong syntax tree, the same as
- Line 59: # for "char***(*const)".  This means we can't tell the difference
- Line 60: # afterwards.  But "char(*const(***))" gives us the right syntax
- Line 64: # time we see "* const" or "* const *", we add an opening
- Line 75: parts.append(match.group())   # e.g. "* const "
- Line 193: # Remove comments.  NOTE: this only work because the cdef() section
- Line 194: # should not contain any string literals (except in line directives)!
- Line 209: # BIG HACK: replace WINAPI or __stdcall with "volatile const".
- Line 212: # Hack number 2 is that "int(volatile *fptr)();" is not valid C
- Line 440: "of CFFI if #pragma support gets added. Note that "
- Line 545: # hack: `extern "Python"` in the C source is replaced
- Line 624: # a hack: in 'typedef int foo_t[...][...];', don't use '...' as
- Line 652: if names != ['signed', 'char']:    # keep this unmodified
- Line 737: # the 'quals' on the result type are ignored.  HACK: we absure them
- Line 757: # such as "typedef struct { } foo_t, *foo_p" and we end up with
- Line 768: # Note that this must handle parsing "struct foo" any number of
- Line 823: # is there a 'type.decls'?  If yes, then this is the place in the
- Line 1003: # note: not for 'long double' so far

### \server\venv\Lib\site-packages\cffi\lock.py
- Line 26: ##    def __exit__(self, *args):
- Line 27: ##        return self._real.__exit__(*args)

### \server\venv\Lib\site-packages\cffi\model.py
- Line 530: # XXX!  The goal is to ensure that the warnings.warn()
- Line 601: # note that setdefault() on WeakValueDictionary is not atomic

### \server\venv\Lib\site-packages\cffi\recompiler.py
- Line 309: # if we have ffi._embedding != None, we give it here as a macro
- Line 418: prnt('#  pragma GCC visibility push(default)  /* for -fvisibility= */')
- Line 531: # a KeyError here is a bug.  please report it! :-)
- Line 887: # is interpreted as a '*' and so will match any array length.
- Line 888: # (It would also match '*', but that's harder to detect...)
- Line 897: prnt('  /* %s */' % str(e))   # cannot verify it, ignore
- Line 998: # not partial (we can't complete or verify them!) and emit them
- Line 1198: # This code assumes that casts from "tp *" to "void *" is a
- Line 1199: # no-op, i.e. a function that returns a "tp *" can be called
- Line 1200: # as if it returned a "void *".  This should be generally true
- Line 1205: # **" to "void *" are again no-ops, as far as I can tell.)
- Line 1321: s = b'# -*- encoding: utf8 -*-\n' + s
- Line 1477: # DLLs that are not extension modules.  Here are some hacks to work
- Line 1478: # around that, in the _patch_for_*() functions...
- Line 1492: # we must not remove the manifest when building for embedding!
- Line 1515: # if 'target' is different from '*', we need to patch some internal

### \server\venv\Lib\site-packages\cffi\setuptools_ext.py
- Line 203: # Then we need to hack more in get_source_files(); see above.

### \server\venv\Lib\site-packages\cffi\vengine_cpy.py
- Line 30: # Note that after a setuptools installation, there are both .py
- Line 45: # a KeyError here is a bug.  please report it! :-)
- Line 150: # XXX review all usages of 'self' here!
- Line 505: prnt('  /* %s */' % str(e))   # cannot verify it, ignore
- Line 794: # 'value' is a <cdata 'type *'> which we have to replace with
- Line 801: # remove ptr=<cdata 'int *'> from the library instance, and replace
- Line 825: /* this block of #ifs should be kept exactly identical between
- Line 829: # include <malloc.h>   /* for alloca() */
- Line 830: # if _MSC_VER < 1600   /* MSVC < 2010 */
- Line 860: # if _MSC_VER < 1800   /* MSVC < 2013 */
- Line 865: # define _cffi_float_complex_t   _Fcomplex    /* include <complex.h> for it */
- Line 866: # define _cffi_double_complex_t  _Dcomplex    /* include <complex.h> for it */
- Line 1084: #define _cffi_type(num) ((CTypeDescrObject *)PyList_GET_ITEM(_cffi_types, num))

### \server\venv\Lib\site-packages\cffi\vengine_gen.py
- Line 22: # add 'export_symbols' to the dictionary.  Note that we add the
- Line 286: prnt('  /* %s */' % str(e))   # cannot verify it, ignore
- Line 601: # 'value' is a <cdata 'type *'> which we have to replace with
- Line 609: # remove ptr=<cdata 'int *'> from the library instance, and replace
- Line 627: #include <sys/types.h>   /* XXX for ssize_t on some platforms */
- Line 629: /* this block of #ifs should be kept exactly identical between
- Line 633: # include <malloc.h>   /* for alloca() */
- Line 634: # if _MSC_VER < 1600   /* MSVC < 2010 */
- Line 664: # if _MSC_VER < 1800   /* MSVC < 2013 */
- Line 669: # define _cffi_float_complex_t   _Fcomplex    /* include <complex.h> for it */
- Line 670: # define _cffi_double_complex_t  _Dcomplex    /* include <complex.h> for it */

### \server\venv\Lib\site-packages\cffi\_imp_emulation.py
- Line 8: # Note that this is used only for tests or for the old ffi.verify().

### \server\venv\Lib\site-packages\charset_normalizer\api.py
- Line 460: # If md says nothing to worry about, then... stop immediately!

### \server\venv\Lib\site-packages\charset_normalizer\legacy.py
- Line 9: # TODO: remove this check when dropping Python 3.7 support
- Line 68: # Note: CharsetNormalizer does not return 'UTF-8-SIG' as the sig get stripped in the detection/normalization process

### \server\venv\Lib\site-packages\charset_normalizer\models.py
- Line 64: # preserve RAM usage!

### \server\venv\Lib\site-packages\charset_normalizer\utils.py
- Line 31: except ValueError:  # Defensive: unicode database outdated?
- Line 74: except ValueError:  # Defensive: unicode database outdated?
- Line 138: except ValueError:  # Defensive: unicode database outdated?
- Line 148: except ValueError:  # Defensive: unicode database outdated?
- Line 158: except ValueError:  # Defensive: unicode database outdated?
- Line 168: except ValueError:  # Defensive: unicode database outdated?
- Line 178: except ValueError:  # Defensive: unicode database outdated?
- Line 188: except ValueError:  # Defensive: unicode database outdated?
- Line 198: except ValueError:  # Defensive: unicode database outdated?
- Line 219: and character != "\x1a"  # Why? Its the ASCII substitute character.
- Line 220: and character != "\ufeff"  # bug discovered in Python,

### \server\venv\Lib\site-packages\charset_normalizer\cli\__main__.py
- Line 27: Credit goes to (c) https://stackoverflow.com/questions/3041986/apt-command-line-interface-like-yes-no-input

### \server\venv\Lib\site-packages\click\core.py
- Line 335: #: If chaining is enabled this will be set to ``'*'`` in case
- Line 1409: # it's not safe to `ctx.exit(rv)` here!
- Line 1410: # note that `rv` may actually contain data like "1" which
- Line 1437: # note that this is only reached if `self.invoke` above raises
- Line 1878: # set to ``*`` to inform the command that subcommands are executed
- Line 2815: # for flags whose default is explicitly set to True. Note that as long as we

### \server\venv\Lib\site-packages\click\parser.py
- Line 344: # Then rargs is [arg(i), ..., arg(N-1)] and largs is a *subset* of
- Line 356: # *empty* -- still a subset of [arg0, ..., arg(i-1)], but
- Line 357: # not a very interesting subset!
- Line 406: # Any characters left in arg?  Pretend they're the
- Line 481: # the long option matching code.  Note that this allows options

### \server\venv\Lib\site-packages\click\_compat.py
- Line 511: # NOTE: double check is needed so mypy does not analyze this on Linux

### \server\venv\Lib\site-packages\click\_termui_impl.py
- Line 535: # TODO: This never terminates if the passed generator never terminates.

### \server\venv\Lib\site-packages\colorama\ansitowin32.py
- Line 33: # https://stackoverflow.com/questions/12632894/why-doesnt-getattr-work-with-exit
- Line 78: ANSI_CSI_RE = re.compile('\001?\033\\[((?:\\d|;)*)([a-zA-Z])\002?')   # Control Sequence Introducer
- Line 79: ANSI_OSC_RE = re.compile('\001?\033\\]([^\a]*)(\a)\002?')             # Operating System Command
- Line 105: # should we strip ANSI sequences from our output?
- Line 110: # should we should convert ANSI sequences into win32 calls?
- Line 118: # are we wrapping stderr?

### \server\venv\Lib\site-packages\colorama\win32.py
- Line 152: # Note that this is hard-coded for ANSI (vs wide) bytes.
- Line 163: # Note that this is hard-coded for ANSI (vs wide) bytes.

### \server\venv\Lib\site-packages\colorama\tests\ansitowin32_test.py
- Line 242: '\033]' + ';' * 64 + '\x08',       # see issue #247

### \server\venv\Lib\site-packages\cryptography\hazmat\backends\openssl\backend.py
- Line 42: # within the various *_supported methods.

### \server\venv\Lib\site-packages\cryptography\hazmat\primitives\keywrap.py
- Line 133: # 2) Check that 8*(n-1) < LSB(32,A) <= 8*n.  If so, let
- Line 135: # 3) Let b = (8*n)-MLI, and then check that the rightmost b octets of

### \server\venv\Lib\site-packages\cryptography\hazmat\primitives\asymmetric\rsa.py
- Line 222: # here: phi_n = (p - 1) * (q - 1)
- Line 227: # TODO: Replace with lcm(p - 1, q - 1) once the minimum
- Line 231: lambda_n = (p - 1) * (q - 1) // gcd(p - 1, q - 1)
- Line 252: # The quantity d*e-1 is a multiple of phi(n), even,
- Line 253: # and can be represented as t*2^s.
- Line 268: # Cycle through all values a^{t*2^i}=a^k
- Line 281: # Found !

### \server\venv\Lib\site-packages\cryptography\hazmat\primitives\ciphers\modes.py
- Line 218: _MAX_ENCRYPTED_BYTES = (2**39 - 256) // 8
- Line 219: _MAX_AAD_BYTES = (2**64) // 8

### \server\venv\Lib\site-packages\cryptography\hazmat\primitives\serialization\ssh.py
- Line 731: # see https://bugzilla.mindrot.org/show_bug.cgi?id=3553 for
- Line 780: # yes, SSH does padding check *after* all other parsing is done.
- Line 1445: # This is O(n**2)
- Line 1467: # This is O(n**2)

### \server\venv\Lib\site-packages\cryptography\hazmat\primitives\twofactor\hotp.py
- Line 42: return f"otpauth://{type_name}/{label}?{urlencode(parameters)}"

### \server\venv\Lib\site-packages\cryptography\x509\name.py
- Line 170: # to that. Otherwise, UTF8!
- Line 356: # TODO: this is relatively expensive, if this looks like a bottleneck
- Line 357: # for you, consider optimizing!

### \server\venv\Lib\site-packages\distro\distro.py
- Line 1: #!/usr/bin/env python
- Line 82: #: * Key: Value as defined in the os-release file, translated to lower case,
- Line 85: #: * Value: Normalized value.
- Line 94: #: * Key: Value as returned by the lsb_release command, translated to lower
- Line 97: #: * Value: Normalized value.
- Line 109: #: * Key: Value as derived from the file name of a distro release file,
- Line 112: #: * Value: Normalized value.
- Line 773: # NOTE: The idea is to respect order **and** have it set
- Line 1127: # * variable assignments: var=value
- Line 1128: # * commands or their arguments (not allowed in os-release)
- Line 1143: # preference to anything else Note that some distros purposefully
- Line 1284: # sure about the *-release files. Check common entries of

### \server\venv\Lib\site-packages\dns\asyncquery.py
- Line 752: # note that send_h3() does not need await

### \server\venv\Lib\site-packages\dns\asyncresolver.py
- Line 79: # Note we need to say "if answer is not None" and not just
- Line 84: # cache hit!
- Line 106: # Note we need to say "if answer is not None" and not just
- Line 188: # Note that setting name ensures we query the same name

### \server\venv\Lib\site-packages\dns\btree.py
- Line 304: # Note we use "is" here as we meant "exactly this object".
- Line 309: # Note we need to ensure exact is None going forward as we've
- Line 661: # Note that we don't use insert() and delete() but rather insert_element() and

### \server\venv\Lib\site-packages\dns\entropy.py
- Line 107: return first + size * rand() // (max + 1)

### \server\venv\Lib\site-packages\dns\exception.py
- Line 59: self.kwargs = self._check_kwargs(**kwargs)  # lgtm[py/init-calls-subclass]
- Line 111: # print *args directly in the same way as old DNSException

### \server\venv\Lib\site-packages\dns\inet.py
- Line 28: # is!).
- Line 155: # no scope, shortcut!

### \server\venv\Lib\site-packages\dns\ipv4.py
- Line 74: # Note that inet_aton() only accepts canonial form, but we still run through

### \server\venv\Lib\site-packages\dns\message.py
- Line 298: # We don't check the question section in these cases if
- Line 299: # the other question section is empty, even though they
- Line 300: # still really ought to have a question section.

### \server\venv\Lib\site-packages\dns\name.py
- Line 936: return Name([b""])  # no Unicode "u" on this constant!
- Line 1009: # domain name.  Note that "all ASCII" is about the input text,
- Line 1157: # Note we're already maximal in the needed == 1 case as while we'd like
- Line 1170: # Shouldn't happen!

### \server\venv\Lib\site-packages\dns\namedict.py
- Line 30: # pylint seems to be confused about this one!

### \server\venv\Lib\site-packages\dns\node.py
- Line 38: dns.rdatatype.NSEC3,  # This is not likely to happen, but not impossible!
- Line 109: s.write(rds.to_text(name, **kw))  # type: ignore[arg-type]

### \server\venv\Lib\site-packages\dns\query.py
- Line 297: # We know the destination af, so source had better agree!
- Line 874: # set, and very likely the question section, so we'll re-raise if the

### \server\venv\Lib\site-packages\dns\rdata.py
- Line 504: # Note that proper name conversion (e.g. with origin and IDNA
- Line 600: # Otherwise, check each element of the iterable *value*
- Line 601: # against *as_value*.
- Line 638: return rf"\# {len(self.data)} " + _hexify(self.data, **kw)  # pyright: ignore
- Line 645: if not token.is_identifier() or token.value != r"\#":

### \server\venv\Lib\site-packages\dns\rdataset.py
- Line 247: # Empty rdatasets are used for the question section, and in

### \server\venv\Lib\site-packages\dns\renderer.py
- Line 32: # Note we can't import dns.message for cicularity reasons

### \server\venv\Lib\site-packages\dns\resolver.py
- Line 700: # Do we know the answer?
- Line 771: # Out of things to try!
- Line 810: # Truncation with TCP is no good!
- Line 815: # We got an answer!
- Line 1315: # Note we need to say "if answer is not None" and not just
- Line 1320: # cache hit!
- Line 1341: # Note we need to say "if answer is not None" and not just
- Line 1441: elif family != socket.AF_UNSPEC:  # pragma: no cover
- Line 1454: # Note that setting name ensures we query the same name
- Line 1732: # it in the answer section!  We are ignoring the
- Line 1847: # because dns.query.* needs to call getaddrinfo() for IPv6 scoping
- Line 1867: # Is host None or an address literal?  If so, use the system's
- Line 1879: # Something needs resolution!
- Line 1894: # Is it a port literal?

### \server\venv\Lib\site-packages\dns\rrset.py
- Line 96: def match(self, *args: Any, **kwargs: Any) -> bool:  # type: ignore[override]
- Line 109: return self.full_match(*args, **kwargs)  # type: ignore[arg-type]
- Line 111: return super().match(*args, **kwargs)  # type: ignore[arg-type]
- Line 155: self.name, origin, relativize, self.deleting, **kw  # type: ignore
- Line 174: self.name, file, compress, origin, self.deleting, **kw  # type:ignore

### \server\venv\Lib\site-packages\dns\tokenizer.py
- Line 187: # Note that as mentioned above, if c is a Unicode
- Line 318: # this should never happen!

### \server\venv\Lib\site-packages\dns\transaction.py
- Line 125: # Note that we currently use non-immutable types in the return type signature to

### \server\venv\Lib\site-packages\dns\tsig.py
- Line 93: GSS_TSIG: 128,  # This is what we assume to be the worst case!
- Line 124: # note the usage of a bare exception

### \server\venv\Lib\site-packages\dns\ttl.py
- Line 22: # Technically TTLs are supposed to be between 0 and 2**31 - 1, with values
- Line 24: # as values > 2**31 - 1 occur in real world data.

### \server\venv\Lib\site-packages\dns\versioned.py
- Line 146: # wait (note we gave up the lock!)
- Line 188: # Note our definition of least_kept also ensures we do not try to

### \server\venv\Lib\site-packages\dns\win32util.py
- Line 153: # (Code contributed by Paul Marks, thanks!)
- Line 373: elif ret_val != 0x6F:  # ERROR_BUFFER_OVERFLOW

### \server\venv\Lib\site-packages\dns\wire.py
- Line 70: # Note that seeking to the end is OK!  (If you try to read

### \server\venv\Lib\site-packages\dns\xfr.py
- Line 116: # We don't require a question section, but if it is present is
- Line 147: # It went backwards!
- Line 157: # Note we're expecting another SOA so we can detect
- Line 191: # We got an empty IXFR sequence!
- Line 232: # Note we are falling through into the code below

### \server\venv\Lib\site-packages\dns\zone.py
- Line 96: # we check just in case!
- Line 195: # Note that any changes in this method should have corresponding changes
- Line 1038: # code used new_node.id != self.id for the "do we need to CoW?"
- Line 1045: # moo!  copy on write!
- Line 1091: # set the right id!

### \server\venv\Lib\site-packages\dns\zonefile.py
- Line 132: # Note that if directives are explicitly specified, then allow_include
- Line 267: # if we didn't have a TTL on the SOA, set it!
- Line 366: # somehow!
- Line 494: # Note that we only run directive processing code if at least

### \server\venv\Lib\site-packages\dns\_asyncio_backend.py
- Line 43: # EOF we triggered.  Is there a better way to do this?

### \server\venv\Lib\site-packages\dns\_immutable_ctx.py
- Line 59: # We have to do the __slots__ declaration here too!

### \server\venv\Lib\site-packages\dns\_no_ssl.py
- Line 33: def wrap_socket(self, *args, **kwargs) -> "SSLSocket":  # type: ignore
- Line 36: def set_alpn_protocols(self, *args, **kwargs):  # type: ignore
- Line 60: def create_default_context(*args, **kwargs) -> SSLContext:  # type: ignore

### \server\venv\Lib\site-packages\dns\quic\_asyncio.py
- Line 108: # Note that peer is a low-level address tuple, but make_socket() wants

### \server\venv\Lib\site-packages\dns\quic\__init__.py
- Line 22: *args,  # pylint: disable=unused-argument
- Line 23: **kwargs,  # pylint: disable=unused-argument
- Line 28: context, *args, **kwargs  # pylint: disable=unused-argument

### \server\venv\Lib\site-packages\dns\rdtypes\dnskeybase.py
- Line 51: key = dns.rdata._base64ify(self.key, **kw)  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\dsbase.py
- Line 59: self.digest, chunksize=chunksize, **kw  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\euibase.py
- Line 35: # text_len = byte_len * 3 - 1  # 01-23-45-67-89-ab

### \server\venv\Lib\site-packages\dns\rdtypes\svcbbase.py
- Line 483: # Note we have to say "not in" as we have None as a value
- Line 557: # Note that we're still writing a length of zero if the value is None

### \server\venv\Lib\site-packages\dns\rdtypes\tlsabase.py
- Line 45: self.cert, chunksize=chunksize, **kw  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\CERT.py
- Line 88: certificate = dns.rdata._base64ify(self.certificate, **kw)  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\EUI48.py
- Line 30: text_len = byte_len * 3 - 1  # 01-23-45-67-89-ab

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\EUI64.py
- Line 30: text_len = byte_len * 3 - 1  # 01-23-45-67-89-ab-cd-ef

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\LOC.py
- Line 258: altitude = float(t) * 100.0  # m -> cm
- Line 265: size = float(value) * 100.0  # m -> cm
- Line 270: hprec = float(value) * 100.0  # m -> cm
- Line 275: vprec = float(value) * 100.0  # m -> cm

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\NSEC.py
- Line 58: # Note that NSEC downcasing, originally mandated by RFC 4034

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\OPENPGPKEY.py
- Line 37: return dns.rdata._base64ify(self.key, chunksize=None, **kw)  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\RRSIG.py
- Line 104: f"{dns.rdata._base64ify(self.signature, **kw)}"  # pyright: ignore
- Line 155: return cls(rdclass, rdtype, *header, signer, signature)  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\SSHFP.py
- Line 44: self.fingerprint, chunksize=chunksize, **kw  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\ANY\ZONEMD.py
- Line 40: self.digest, chunksize=chunksize, **kw  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\IN\DHCID.py
- Line 38: return dns.rdata._base64ify(self.data, **kw)  # pyright: ignore

### \server\venv\Lib\site-packages\dns\rdtypes\IN\IPSECKEY.py
- Line 52: key = dns.rdata._base64ify(self.key, **kw)  # pyright: ignore

### \server\venv\Lib\site-packages\dotenv\main.py
- Line 312: # Should work without __file__, e.g. in REPL or IPython notebook.

### \server\venv\Lib\site-packages\dotenv\parser.py
- Line 28: _comment = make_regex(r"(?:[^\S\r\n]*#[^\r\n]*)?")
- Line 125: return re.sub(r"\s+#.*", "", part).rstrip()

### \server\venv\Lib\site-packages\ecdsa\ecdh.py
- Line 93: # shared secret = PUBKEYtheirs * PRIVATEKEYours

### \server\venv\Lib\site-packages\ecdsa\ecdsa.py
- Line 1: #! /usr/bin/env python

### \server\venv\Lib\site-packages\ecdsa\ellipticcurve.py
- Line 1: #! /usr/bin/env python
- Line 2: # -*- coding: utf-8 -*-
- Line 10: # Notes from X9.62-1998 (draft):
- Line 747: # please note that all the methods that use the equations from
- Line 751: # (`xx = x * x; xxxx = xx * xx % p` is faster than `xxxx = x**4 % p` and
- Line 956: # order*2 as a protection for Minerva
- Line 1473: # NOTE: there are more efficient formulas for Z1 or Z2 == 1
- Line 1519: # NOTE: there are more efficient formulas for Z1 == 1
- Line 1585: # order*2 as a "protection" for Minerva

### \server\venv\Lib\site-packages\ecdsa\keys.py
- Line 1079: # TODO parse attributes or validate publickey
- Line 1140: # if tag != 1:
- Line 1144: # if empty != "":
- Line 1204: # TODO: "BEGIN ECPARAMETERS"

### \server\venv\Lib\site-packages\ecdsa\numbertheory.py
- Line 1: #! /usr/bin/env python
- Line 219: return (2 * a * pow(4 * a, (p - 5) // 8, p)) % p
- Line 322: return (a * b) // gcd(a, b)
- Line 376: if q < d:  # n < d*d means we're done, n = 1 or prime.
- Line 378: if r == 0:  # d divides n. How many times?
- Line 567: # 2310 = 2 * 3 * 5 * 7 * 11
- Line 572: # probability of accepting a composite below 2**-80

### \server\venv\Lib\site-packages\ecdsa\test_ecdsa.py
- Line 157: # we need a curve with cofactor != 1

### \server\venv\Lib\site-packages\ecdsa\test_eddsa.py
- Line 228: # generator * (order-1)
- Line 422: # generator * (order - 1)

### \server\venv\Lib\site-packages\ecdsa\test_malformed_sigs.py
- Line 227: def st_der_integer(*args, **kwargs):  # pragma: no cover
- Line 239: def st_der_bit_string(draw, *args, **kwargs):  # pragma: no cover
- Line 255: def st_der_octet_string(*args, **kwargs):  # pragma: no cover

### \server\venv\Lib\site-packages\ecdsa\test_pyecdsa.py
- Line 793: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 808: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 828: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 839: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 857: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 869: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 897: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 908: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 918: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 928: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 949: b"z\x8a#\xb5\x97\xecO\xb6\xa0HQ\x89*"
- Line 1048: # test interoperability with OpenSSL tools. Note that openssl's ECDSA
- Line 1060: # openssl dgst -ecdsa-with-SHA1 -prverify privkey.pem -signature data.sig data.txt ; echo $?
- Line 1843: for n in (0, 1, 2, 127, 128, 3 * 128 + 7, 840, 10045):  # , 155):
- Line 1895: # this trytryagain *does* provide long-term stability
- Line 1925: # that oddball 2**16+1 takes half our runtime
- Line 1941: print("%3d: %s" % (i, "*" * (counts[i] // 100)))

### \server\venv\Lib\site-packages\ecdsa\util.py
- Line 104: # return N pseudorandom bytes. Note: this is a short-term PRNG, meant
- Line 200: # order=2**k-1) to 2.0 (when order=2**k+1).

### \server\venv\Lib\site-packages\email_validator\deliverability.py
- Line 138: # with local nameservers, maybe? We'll allow the domain to go through.

### \server\venv\Lib\site-packages\email_validator\rfc_constants.py
- Line 7: ATEXT = r'a-zA-Z0-9_!#\$%&\'\*\+\-/=\?\^`\{\|\}~'
- Line 35: # QUOTED_LOCAL_PART_ADDR = re.compile(r"^\"((?:[\u0020-\u0021\u0023-\u005B\u005D-\u007E]|\\[\u0020-\u007E])*)\"@(.*)")
- Line 40: # RFC 3696 + errata 1003 + errata 1690 (https://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690)
- Line 53: # imposes a length limit (255 octets). But per https://stackoverflow.com/questions/32290167/what-is-the-maximum-length-of-a-dns-name,

### \server\venv\Lib\site-packages\email_validator\syntax.py
- Line 41: # be allowed? Unclear.) Optional space (RFC 5322 3.4 CFWS) and then the
- Line 97: # See https://news.ycombinator.com/item?id=42235268.
- Line 311: # (RFC 5321 4.1.2. RFC 5322 lists additional permitted *obsolete*
- Line 312: # characters which are *not* allowed here. RFC 6531 section 3.3
- Line 532: # Since several characters *are* normalized to a dot, this has to come before
- Line 640: # See the note near the definition of SPECIAL_USE_DOMAIN_NAMES.
- Line 712: #    it is checked last. Note that ascii_email will only be set if the

### \server\venv\Lib\site-packages\email_validator\validate_email.py
- Line 19: *,  # subsequent arguments are keyword-only
- Line 120: # this library. (UTS #39 seems to require that the *input* be NKFC normalized

### \server\venv\Lib\site-packages\email_validator\__init__.py
- Line 98: # this library, so we reject "@test" and "@*.test" addresses, unless

### \server\venv\Lib\site-packages\fastapi\applications.py
- Line 604: * `identifier`: (`str`) An [SPDX](https://spdx.dev/) license expression
- Line 908: # TODO: remove when discarding the openapi_prefix parameter

### \server\venv\Lib\site-packages\fastapi\encoders.py
- Line 42: # TODO: pv2 should this return strings instead?

### \server\venv\Lib\site-packages\fastapi\routing.py
- Line 976: # TODO: deprecate this once the lifespan (or alternative) interface is improved
- Line 4542: # TODO: remove this once the lifespan (or alternative) interface is improved
- Line 4558: # TODO: remove this once the lifespan (or alternative) interface is improved
- Line 4574: # TODO: remove this once the lifespan (or alternative) interface is improved

### \server\venv\Lib\site-packages\fastapi\dependencies\utils.py
- Line 574: # TODO: remove this parameter later, no longer used, not removing it yet as some

### \server\venv\Lib\site-packages\fastapi\openapi\docs.py
- Line 261: <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

### \server\venv\Lib\site-packages\fastapi\openapi\utils.py
- Line 348: # TODO: probably make status_code a default class attribute for all
- Line 571: return jsonable_encoder(OpenAPI(**output), by_alias=True, exclude_none=True)  # type: ignore

### \server\venv\Lib\site-packages\fastapi\_compat\shared.py
- Line 179: # TODO: remove this function once the required version of Pydantic fully
- Line 191: # TODO: remove this function once the required version of Pydantic fully

### \server\venv\Lib\site-packages\fastapi\_compat\v2.py
- Line 43: # TODO: remove when dropping support for Pydantic < v2.12.3
- Line 69: # TODO: remove when dropping support for Pydantic < v2.12.3
- Line 123: # TODO: remove after setting the min Pydantic to v2.12.3
- Line 221: # TODO remove when deprecating Pydantic v1
- Line 335: BodyModel: type[BaseModel] = create_model(model_name, **field_params)  # type: ignore[call-overload]

### \server\venv\Lib\site-packages\geographiclib\geodesic.py
- Line 99: nC3x_ = (nC3_ * (nC3_ - 1)) // 2
- Line 101: nC4x_ = (nC4_ * (nC4_ + 1)) // 2
- Line 127: # y = sinp ? sum(c[i] * sin( 2*i    * x), i, 1, n) :
- Line 128: #            sum(c[i] * cos((2*i+1) * x), i, 0, n-1)
- Line 130: # Approx operation count = (n + 5) mult and (2 * n + 2) add
- Line 133: ar = 2 * (cosx - sinx) * (cosx + sinx) # 2 * cos(2 * x)
- Line 146: return ( 2 * sinx * cosx * y0 if sinp # sin(2 * x) * y0
- Line 147: else cosx * (y0 - y1) )      # cos(x) * (y0 - y1)
- Line 152: # Solve k^4+2*k^3-(x^2+y^2-1)*k^2-2*y^2*k-y^2 = 0 for positive root k.
- Line 160: S = p * q / 4            # S = r^3 * s
- Line 172: T3 += -math.sqrt(disc) if T3 < 0 else math.sqrt(disc) # T3 = (r * t)^3
- Line 174: T = Math.cbrt(T3)       # T = r * t
- Line 181: # avoids cancellation.  Note that disc < 0 implies that r < 0.
- Line 186: w = (uv - q) / (2 * v)               # positive?
- Line 304: # the azimuth consistency check is sig12^2 * abs(f) * min(1, 1-f/2) / 2.
- Line 473: # Add parens around (csig1 * ssig2) and (ssig1 * csig2) to ensure
- Line 635: # sin(alp1) * cos(bet1) = sin(alp0)
- Line 637: calp0 = math.hypot(calp1, salp1 * sbet1) # calp0 > 0
- Line 640: # tan(bet1) = tan(sig1) * cos(alp1)
- Line 641: # tan(omg1) = sin(alp0) * tan(sig1) = tan(omg1)=tan(alp1)*sin(bet1)
- Line 645: # Math.norm(somg1, comg1); -- don't need to normalize!
- Line 650: # sin(alp2) * cos(bet2) = sin(alp0)
- Line 660: # tan(bet2) = tan(sig2) * cos(alp2)
- Line 661: # tan(omg2) = sin(alp0) * tan(sig2).
- Line 665: # Math.norm(somg2, comg2); -- don't need to normalize!
- Line 788: # tan(bet) = tan(sig) * cos(alp)
- Line 950: # From Lambda12: sin(alp1) * cos(bet1) = sin(alp0)
- Line 952: calp0 = math.hypot(calp1, salp1 * sbet1) # calp0 > 0
- Line 955: # From Lambda12: tan(bet) = tan(sig) * cos(alp)
- Line 960: # Multiplier = a^2 * e^2 * cos(alpha0) * sin(alpha0).
- Line 977: # omg12 < 3/4 * pi
- Line 981: # * (tan(bet1/2)+tan(bet2/2))/(1+tan(bet1/2)*tan(bet2/2))

### \server\venv\Lib\site-packages\geographiclib\geodesicline.py
- Line 120: # Evaluate alp0 from sin(alp1) * cos(bet1) = sin(alp0),
- Line 121: self._salp0 = self.salp1 * cbet1 # alp0 in [0, pi/2 - |bet1|]
- Line 122: # Alt: calp0 = hypot(sbet1, calp1 * cbet1).  The following
- Line 125: # Evaluate sig with tan(bet1) = tan(sig1) * cos(alp1).
- Line 130: # Evaluate omg1 with tan(omg1) = sin(alp0) * tan(sig1).
- Line 179: # Multiplier = a^2 * e^2 * cos(alpha0) * sin(alpha0)
- Line 259: # sin(bet2) = cos(alp0) * sin(sig2)
- Line 261: # Alt: cbet2 = hypot(csig2, salp0 * ssig2)
- Line 266: # tan(alp0) = cos(sig2)*tan(alp2)
- Line 267: salp2 = self._salp0; calp2 = self._calp0 * csig2 # No need to normalize
- Line 273: # tan(omg2) = sin(alp0) * tan(sig2)
- Line 274: somg2 = self._salp0 * ssig2; comg2 = csig2 # No need to normalize
- Line 275: E = math.copysign(1, self._salp0)          # East or west going?
- Line 304: # Add parens around (_csig1 * ssig2) and (_ssig1 * csig2) to ensure
- Line 323: # tan(alp) = tan(alp0) * sec(sig)
- Line 324: # tan(alp2-alp1) = (tan(alp2) -tan(alp1)) / (tan(alp2)*tan(alp1)+1)
- Line 325: # = calp0 * salp0 * (csig1-csig2) / (salp0^2 + calp0^2 * csig1*csig2)
- Line 327: #   csig1 - csig2 = ssig12 * (csig1 * ssig12 / (1 + csig12) + ssig1)
- Line 329: #   csig1 - csig2 = csig1 * (1 - csig12) + ssig12 * ssig1

### \server\venv\Lib\site-packages\geographiclib\geomath.py
- Line 51: # Error free transformation of a sum.  Note that t can be the same as one

### \server\venv\Lib\site-packages\geographiclib\polygonarea.py
- Line 83: # area is with the clockwise sense.  If !reverse convert to
- Line 106: # area is with the clockwise sense.  If !reverse convert to
- Line 305: if self.num == 0:           # we don't have a starting point!

### \server\venv\Lib\site-packages\geopy\distance.py
- Line 185: # Note: non-zero equal altitudes are fine: assuming that

### \server\venv\Lib\site-packages\geopy\__init__.py
- Line 12: from geopy.geocoders import *  # noqa

### \server\venv\Lib\site-packages\geopy\extra\rate_limiter.py
- Line 102: # Note that actual requests might take longer time than

### \server\venv\Lib\site-packages\geopy\geocoders\arcgis.py
- Line 122: self.token_lifetime = token_lifetime * 60  # store in seconds

### \server\venv\Lib\site-packages\geopy\geocoders\baidu.py
- Line 22: http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
- Line 73: (http://lbsyun.baidu.com/index.php?title=lbscloud/api/appendix).
- Line 269: # http://lbsyun.baidu.com/index.php?title=lbscloud/api/appendix
- Line 279: http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding

### \server\venv\Lib\site-packages\geopy\geocoders\base.py
- Line 180: # [1]: http://www.sphinx-doc.org/en/master/ext/autodoc.html#directive-autoattribute
- Line 304: # Geocoding services (almost?) always consider only lat and lon
- Line 417: # def geocode(self, query, *, exactly_one=True, timeout=DEFAULT_SENTINEL):
- Line 420: # def reverse(self, query, *, exactly_one=True, timeout=DEFAULT_SENTINEL):

### \server\venv\Lib\site-packages\geopy\geocoders\dot_us.py
- Line 116: if None in result: # todo

### \server\venv\Lib\site-packages\geopy\geocoders\google.py
- Line 421: #   When the geocoder returns a status code other than OK, there *may*

### \server\venv\Lib\site-packages\geopy\geocoders\mapzen.py
- Line 182: # TODO make this a private API

### \server\venv\Lib\site-packages\geopy\geocoders\placefinder.py
- Line 205: query = query.replace(" ", "") # oauth signature failure; todo

### \server\venv\Lib\site-packages\google\auth\aws.py
- Line 70: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15"
- Line 641: "regional_cred_verification_url": "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15",

### \server\venv\Lib\site-packages\google\auth\iam.py
- Line 44: # Note: We only support automatic mTLS on the default googleapis.com universe.

### \server\venv\Lib\site-packages\google\auth\pluggable.py
- Line 52: EXECUTABLE_TIMEOUT_MILLIS_DEFAULT = 30 * 1000  # 30 seconds
- Line 53: EXECUTABLE_TIMEOUT_MILLIS_LOWER_BOUND = 5 * 1000  # 5 seconds
- Line 54: EXECUTABLE_TIMEOUT_MILLIS_UPPER_BOUND = 120 * 1000  # 2 minutes
- Line 56: EXECUTABLE_INTERACTIVE_TIMEOUT_MILLIS_LOWER_BOUND = 30 * 1000  # 30 seconds
- Line 57: EXECUTABLE_INTERACTIVE_TIMEOUT_MILLIS_UPPER_BOUND = 30 * 60 * 1000  # 30 minutes

### \server\venv\Lib\site-packages\google\auth\_helpers.py
- Line 44: # TODO(https://github.com/googleapis/google-auth-library-python/issues/1684): Audit and update the list below.
- Line 221: >>> url = 'http://example.com?a=1'
- Line 223: http://example.com?a=2
- Line 225: http://example.com?a=1&b=3
- Line 227: http://example.com?b=3
- Line 390: # TODO(https://github.com/googleapis/google-auth-library-python/issues/1701):
- Line 431: # NOTE: Log propagation to the root logger is disabled unless
- Line 542: # TODO(https://github.com/googleapis/google-auth-library-python/issues/1744):

### \server\venv\Lib\site-packages\google\auth\aio\credentials.py
- Line 111: # Note: before_request should never try to refresh access tokens.

### \server\venv\Lib\site-packages\google\auth\aio\_helpers.py
- Line 42: # TODO(https://github.com/googleapis/google-auth-library-python/issues/1745):
- Line 56: # TODO(https://github.com/googleapis/google-auth-library-python/issues/1755):

### \server\venv\Lib\site-packages\google\auth\aio\transport\sessions.py
- Line 179: # Note: before_request will attempt to refresh credentials if expired.

### \server\venv\Lib\site-packages\google\auth\compute_engine\_metadata.py
- Line 139: # TODO: implement GCE residency detection on Windows
- Line 206: # NOTE: The explicit ``timeout`` is a workaround. The underlying

### \server\venv\Lib\site-packages\google\auth\compute_engine\_mtls.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\google\auth\transport\requests.py
- Line 152: # NOTE: For certain Python binary built, the queue.Empty exception

### \server\venv\Lib\site-packages\google\auth\transport\_aiohttp_requests.py
- Line 146: # TODO: Use auto_decompress property for aiohttp 3.7+

### \server\venv\Lib\site-packages\google\auth\transport\_custom_tls_signer.py
- Line 33: #     using SignFunc = int (*)(unsigned char *sig, size_t *sig_len,
- Line 34: #             const unsigned char *tbs, size_t tbs_len)
- Line 48: # Cast SSL_CTX* to void*
- Line 53: # Cast SSL_CTX* to void*
- Line 72: # int ConfigureSslContext(SignFunc sign_func, const char *cert, SSL_CTX *ctx)
- Line 96: # func GetCertPemForPython(configFilePath *C.char, certHolder *byte, certHolderLen int)
- Line 102: # func SignForPython(configFilePath *C.char, digest *byte, digestLen int,
- Line 103: #     sigHolder *byte, sigHolderLen int)

### \server\venv\Lib\site-packages\google\auth\transport\_requests_base.py
- Line 16: # NOTE: The coverage for this file is temporarily disabled in `.coveragerc`

### \server\venv\Lib\site-packages\google\genai\batches.py
- Line 1542: # TODO: remove the hack that pops config.
- Line 1605: # TODO: remove the hack that pops config.
- Line 1684: # TODO: remove the hack that pops config.
- Line 1765: # TODO: remove the hack that pops config.
- Line 1808: # TODO: remove the hack that pops config.
- Line 1891: # TODO: remove the hack that pops config.
- Line 2004: stacklevel=2,  # This is crucial!
- Line 2087: # TODO: remove the hack that pops config.
- Line 2150: # TODO: remove the hack that pops config.
- Line 2229: # TODO: remove the hack that pops config.
- Line 2312: # TODO: remove the hack that pops config.
- Line 2355: # TODO: remove the hack that pops config.
- Line 2440: # TODO: remove the hack that pops config.
- Line 2552: stacklevel=2,  # This is crucial!

### \server\venv\Lib\site-packages\google\genai\caches.py
- Line 889: # TODO: remove the hack that pops config.
- Line 956: # TODO: remove the hack that pops config.
- Line 1023: # TODO: remove the hack that pops config.
- Line 1103: # TODO: remove the hack that pops config.
- Line 1155: # TODO: remove the hack that pops config.
- Line 1271: # TODO: remove the hack that pops config.
- Line 1339: # TODO: remove the hack that pops config.
- Line 1409: # TODO: remove the hack that pops config.
- Line 1489: # TODO: remove the hack that pops config.
- Line 1541: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\documents.py
- Line 167: # TODO: remove the hack that pops config.
- Line 229: # TODO: remove the hack that pops config.
- Line 273: # TODO: remove the hack that pops config.
- Line 367: # TODO: remove the hack that pops config.
- Line 431: # TODO: remove the hack that pops config.
- Line 475: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\files.py
- Line 207: # TODO: remove the hack that pops config.
- Line 263: # TODO: remove the hack that pops config.
- Line 340: # TODO: remove the hack that pops config.
- Line 404: # TODO: remove the hack that pops config.
- Line 462: # TODO: remove the hack that pops config.
- Line 742: # TODO: remove the hack that pops config.
- Line 800: # TODO: remove the hack that pops config.
- Line 877: # TODO: remove the hack that pops config.
- Line 943: # TODO: remove the hack that pops config.
- Line 1001: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\file_search_stores.py
- Line 354: # TODO: remove the hack that pops config.
- Line 419: # TODO: remove the hack that pops config.
- Line 482: # TODO: remove the hack that pops config.
- Line 522: # TODO: remove the hack that pops config.
- Line 581: # TODO: remove the hack that pops config.
- Line 669: # TODO: remove the hack that pops config.
- Line 844: # TODO: remove the hack that pops config.
- Line 909: # TODO: remove the hack that pops config.
- Line 974: # TODO: remove the hack that pops config.
- Line 1014: # TODO: remove the hack that pops config.
- Line 1075: # TODO: remove the hack that pops config.
- Line 1163: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\live.py
- Line 453: # TODO(b/365983264) Handle intermittent issues for the user.
- Line 727: # TODO(b/365983264) Add validation checks for content_update input_dict.
- Line 936: # TODO(b/404946570): Support per request http options.

### \server\venv\Lib\site-packages\google\genai\live_music.py
- Line 118: # TODO(b/365983264) Handle intermittent issues for the user.

### \server\venv\Lib\site-packages\google\genai\local_tokenizer.py
- Line 365: # tokens_info=[TokensInfo(token_ids=[279, 329, 1313, 2508, 13], tokens=[b' What', b' is', b' your', b' name', b'?'], role='user')]

### \server\venv\Lib\site-packages\google\genai\models.py
- Line 4270: # TODO: remove the hack that pops config.
- Line 4355: # TODO: remove the hack that pops config.
- Line 4469: # TODO: remove the hack that pops config.
- Line 4545: # TODO: remove the hack that pops config.
- Line 4616: # TODO: remove the hack that pops config.
- Line 4682: # TODO: remove the hack that pops config.
- Line 4792: # TODO: remove the hack that pops config.
- Line 4877: # TODO: remove the hack that pops config.
- Line 4939: # TODO: remove the hack that pops config.
- Line 5004: # TODO: remove the hack that pops config.
- Line 5074: # TODO: remove the hack that pops config.
- Line 5140: # TODO: remove the hack that pops config.
- Line 5235: # TODO: remove the hack that pops config.
- Line 5300: # tokens=[b'What', b' is', b' your', b' name', b'?'])]
- Line 5325: # TODO: remove the hack that pops config.
- Line 5402: # TODO: remove the hack that pops config.
- Line 5554: # **Elegant & Classic:**
- Line 5555: # * The Dried Bloom
- Line 5556: # * Everlasting Florals
- Line 5557: # * Timeless Petals
- Line 5715: # **Elegant & Classic:**
- Line 5716: # * The Dried Bloom
- Line 5717: # * Everlasting Florals
- Line 5718: # * Timeless Petals
- Line 6229: # TODO: remove the hack that pops config.
- Line 6314: # TODO: remove the hack that pops config.
- Line 6433: # TODO: remove the hack that pops config.
- Line 6509: # TODO: remove the hack that pops config.
- Line 6580: # TODO: remove the hack that pops config.
- Line 6646: # TODO: remove the hack that pops config.
- Line 6756: # TODO: remove the hack that pops config.
- Line 6844: # TODO: remove the hack that pops config.
- Line 6906: # TODO: remove the hack that pops config.
- Line 6973: # TODO: remove the hack that pops config.
- Line 7045: # TODO: remove the hack that pops config.
- Line 7111: # TODO: remove the hack that pops config.
- Line 7206: # TODO: remove the hack that pops config.
- Line 7270: # tokens=[b'What', b' is', b' your', b' name', b'?'])]
- Line 7295: # TODO: remove the hack that pops config.
- Line 7372: # TODO: remove the hack that pops config.
- Line 7584: # **Elegant & Classic:**
- Line 7585: # * The Dried Bloom
- Line 7586: # * Everlasting Florals
- Line 7587: # * Timeless Petals
- Line 7667: # TODO: b/453739108 - make AFC logic more robust like the other 3 methods.

### \server\venv\Lib\site-packages\google\genai\operations.py
- Line 126: # TODO: remove the hack that pops config.
- Line 174: # TODO: remove the hack that pops config.
- Line 220: # TODO: remove the hack that pops config.
- Line 281: # TODO(b/398040607): Support short form names
- Line 286: # TODO(b/398233524): Cast operation types
- Line 360: # TODO: remove the hack that pops config.
- Line 410: # TODO: remove the hack that pops config.
- Line 456: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\tokens.py
- Line 34: # 2nd layer, recursively get field masks see TODO(b/418290100)
- Line 237: # TODO: remove the hack that pops config.
- Line 332: # TODO: remove the hack that pops config.

### \server\venv\Lib\site-packages\google\genai\tunings.py
- Line 1371: # TODO: remove the hack that pops config.
- Line 1437: # TODO: remove the hack that pops config.
- Line 1513: # TODO: remove the hack that pops config.
- Line 1593: # TODO: remove the hack that pops config.
- Line 1670: # TODO: remove the hack that pops config.
- Line 1877: # TODO: remove the hack that pops config.
- Line 1945: # TODO: remove the hack that pops config.
- Line 2023: # TODO: remove the hack that pops config.
- Line 2103: # TODO: remove the hack that pops config.
- Line 2180: # TODO: remove the hack that pops config.
- Line 2359: <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

### \server\venv\Lib\site-packages\google\genai\types.py
- Line 3011: description="""Optional. The parameter name of the API key. E.g. If the API request is "https://example.com/act?api_key=", "api_key" would be the parameter name.""",
- Line 3031: """Optional. The parameter name of the API key. E.g. If the API request is "https://example.com/act?api_key=", "api_key" would be the parameter name."""
- Line 3946: # TODO: b/421991354 - Remove this check once the bug is fixed.

### \server\venv\Lib\site-packages\google\genai\_api_client.py
- Line 82: CHUNK_SIZE = 8 * 1024 * 1024  # 8 MB chunk size

### \server\venv\Lib\site-packages\google\genai\_base_transformers.py
- Line 22: # TODO(b/389133914,b/390320301): Remove the hack after backend fix the issue.

### \server\venv\Lib\site-packages\google\genai\_common.py
- Line 183: # Example: source=['requests[]', '*'], dest=['requests[]', 'request', '*']

### \server\venv\Lib\site-packages\google\genai\_local_tokenizer_loader.py
- Line 57: # TODO: update gemma3 tokenizer

### \server\venv\Lib\site-packages\google\genai\_test_api_client.py
- Line 122: # TODO: fix the above

### \server\venv\Lib\site-packages\google\genai\_transformers.py
- Line 1152: # TODO(b/374433890): Replace with LRO module once it's available.

### \server\venv\Lib\site-packages\google\genai\tests\live\test_live.py
- Line 247: # Note that our test environment does have project/location set. So we

### \server\venv\Lib\site-packages\google\genai\tests\models\test_count_tokens.py
- Line 59: # TODO(b/378952792): MLDev count_tokens needs to merge contents and model

### \server\venv\Lib\site-packages\google\genai\tests\models\test_generate_content.py
- Line 2207: # Note that the stack trace is truncated in replay file, therefore this is

### \server\venv\Lib\site-packages\google\genai\tests\models\test_generate_content_from_apikey.py
- Line 12: # TODO(b/388917450): Add Vertex AI in Express mode test suite
- Line 29: # TODO(b/388917450): Add Vertex AI in Express mode test suite

### \server\venv\Lib\site-packages\google\genai\tests\models\test_generate_content_tools.py
- Line 392: # TODO(b/382547236) add the test back in api mode when the code
- Line 544: #   them?
- Line 1045: # TODO(b/397404656): modify this test to pass in api mode

### \server\venv\Lib\site-packages\google\genai\tests\types\test_future.py
- Line 16: # !Please DO NOT combine the test in this file with other tests. This file is

### \server\venv\Lib\site-packages\google\genai\_interactions\_base_client.py
- Line 108: # TODO: make base page type vars covariant
- Line 211: # TODO: do we have to preprocess params here?
- Line 591: # TODO: report this error to httpx
- Line 607: # TODO: type ignore is required as stringify_items is well typed but we can't be
- Line 625: # Note: 2d arrays should never result in the same key at both
- Line 757: # note: the spec indicates that this should only ever be an integer
- Line 796: # Note: this is not a standard header
- Line 885: # note: there is an edge case here where the user passes in a client
- Line 1441: # TODO(someday): support non asyncio runtimes here
- Line 1467: # note: there is an edge case here where the user passes in a client
- Line 2125: # TODO: untested
- Line 2132: # TODO: untested

### \server\venv\Lib\site-packages\google\genai\_interactions\_compat.py
- Line 88: # TODO: provide an error message here?

### \server\venv\Lib\site-packages\google\genai\_interactions\_exceptions.py
- Line 54: def __init__(self, message: str, request: httpx.Request, *, body: object | None) -> None:  # noqa: ARG002

### \server\venv\Lib\site-packages\google\genai\_interactions\_models.py
- Line 432: # TODO
- Line 583: return type_.construct(**value)  # type: ignore[arg-type]
- Line 693: # Note: if one variant defines an alias then they all should
- Line 705: # Note: if one variant defines an alias then they all should
- Line 787: elif not TYPE_CHECKING:  # TODO: condition is weird
- Line 839: # It should be noted that we cannot use `json` here as that would override
- Line 869: # type ignore required because we're adding explicit types to `**values`
- Line 883: return cast(FinalRequestOptions, super().construct(_fields_set, **kwargs))  # pyright: ignore[reportDeprecated]

### \server\venv\Lib\site-packages\google\genai\_interactions\_qs.py
- Line 52: # Note: custom format syntax is not supported yet
- Line 96: # TODO: error if unknown format

### \server\venv\Lib\site-packages\google\genai\_interactions\_streaming.py
- Line 16: # Note: initially copied from https://github.com/florimondmanca/httpx-sse/blob/master/src/httpx_sse/_decoders.py
- Line 280: # NOTE: as per the SSE spec, do not reset last_event_id.

### \server\venv\Lib\site-packages\google\genai\_interactions\_types.py
- Line 237: # Note: copied from Pydantic
- Line 271: # Note: index() and count() methods are intentionally omitted to allow pyright to properly

### \server\venv\Lib\site-packages\google\genai\_interactions\_utils\_datetime_parse.py
- Line 44: # slightly more than datetime.max in ns - (datetime.max - EPOCH).total_seconds() * 1e9
- Line 118: return datetime(**kw_)  # type: ignore

### \server\venv\Lib\site-packages\google\genai\_interactions\_utils\_proxy.py
- Line 31: # Note: we have to special case proxies that themselves return proxies

### \server\venv\Lib\site-packages\google\genai\_interactions\_utils\_transform.py
- Line 52: # TODO: support for drilling globals() and locals()
- Line 53: # TODO: ensure works correctly with forward references in all cases
- Line 229: # TODO: there may be edge cases where the same normalized field name will transform to two different names
- Line 395: # TODO: there may be edge cases where the same normalized field name will transform to two different names

### \server\venv\Lib\site-packages\google\genai\_interactions\_utils\_typing.py
- Line 165: # Note: if there is more than 1 type argument, the subclass could

### \server\venv\Lib\site-packages\google\genai\_interactions\_utils\_utils.py
- Line 54: # TODO: this needs to take Dict but variance issues.....
- Line 55: # create protocol type ?
- Line 154: # There are two separate functions defined, `is_*` and `is_*_t` for different use cases.
- Line 155: # `is_*` is for when you're dealing with an unknown input
- Line 156: # `is_*_t` is for when you're narrowing a known union type to a specific subset
- Line 291: # TODO: this error message is not deterministic

### \server\venv\Lib\site-packages\google\oauth2\_id_token_async.py
- Line 36: if id_info['iss'] != 'https://accounts.google.com':

### \server\venv\Lib\site-packages\greenlet\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\greenlet\tests\fail_clearing_run_switches.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\greenlet\tests\fail_cpp_exception.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\greenlet\tests\fail_slp_switch.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\greenlet\tests\fail_switch_three_greenlets.py
- Line 39: # This switch didn't actually finish!

### \server\venv\Lib\site-packages\greenlet\tests\leakcheck.py
- Line 40: # with that. These are GC'able objects, and doing almost *anything*
- Line 57: # To avoid this, we *could* filter this type of object out early. In
- Line 105: # trace *all* the objects, not just those that are tracked by the
- Line 329: def wrapper(self, *args, **kwargs): # pylint:disable=too-many-branches

### \server\venv\Lib\site-packages\greenlet\tests\test_generator_nested.py
- Line 14: # Note the function is packed in a tuple

### \server\venv\Lib\site-packages\greenlet\tests\test_greenlet.py
- Line 24: # TODO: Refactor into separate test files. For example,
- Line 44: # note: send_exception(g, exc)  can be now done with  g.throw(exc).
- Line 161: #    p("***Switching back")
- Line 166: # form!
- Line 230: # Probably due to funky timing interactions?
- Line 231: # TODO: FIXME Make that work.
- Line 466: # deallocator may not actually have run yet! So we can't be
- Line 690: break # yes! gc called in green_new
- Line 743: # XXX: FIXME: Is there a better way?
- Line 935: self.assertEqual(gr.switch(10), 1200)  # 1200 = 5! * 10
- Line 1176: # and clean it up. Note that we don't use
- Line 1306: # on non-debug versions, it ran fine (which it should not do!).

### \server\venv\Lib\site-packages\greenlet\tests\test_greenlet_trash.py
- Line 1: # -*- coding: utf-8 -*-
- Line 58: # deallocations have occurred. TODO: I wish we had a better way to do
- Line 60: # we can use that API to do better?
- Line 74: #: Has our deallocation actually run and switched greenlets?
- Line 79: #: Has the background greenlet run?

### \server\venv\Lib\site-packages\greenlet\tests\test_leaks.py
- Line 1: # -*- coding: utf-8 -*-
- Line 113: # main and additional *finished* greenlets
- Line 247: # TODO: Figure out how to make this work!
- Line 256: # versions!)), but not on other platforms (the linux and
- Line 286: # clear where that leak is? For some reason the thread-local
- Line 291: # the C stack somewhere and can't be reached? That doesn't
- Line 295: # Note that this test sometimes spuriously passes on Linux,
- Line 366: # unfinished greenlets in a thread that dies?
- Line 367: # Does it matter if we deallocate in the thread or not?

### \server\venv\Lib\site-packages\greenlet\tests\test_version.py
- Line 1: #! /usr/bin/env python

### \server\venv\Lib\site-packages\greenlet\tests\__init__.py
- Line 1: # -*- coding: utf-8 -*-
- Line 40: # Is the current interpreter free-threaded?) Note that this
- Line 80: # NOTE: This is racy! A Python-level thread object may be dead
- Line 91: # TODO: We could add an API that calls us back when a particular main greenlet is deleted?
- Line 180: # https://devblogs.microsoft.com/oldnewthing/20110519-00/?p=10623
- Line 182: # https://docs.microsoft.com/en-us/previous-versions/k089yyh0(v=vs.140)?redirectedfrom=MSDN
- Line 184: # https://devblogs.microsoft.com/oldnewthing/20190108-00/?p=100655

### \server\venv\Lib\site-packages\gunicorn\arbiter.py
- Line 525: # do we need to change listener ?

### \server\venv\Lib\site-packages\gunicorn\config.py
- Line 111: # are we using a threaded worker?
- Line 122: # are we using a threaded worker?
- Line 385: # Booleans are ints!
- Line 1621: * macOS: ``'unix:///var/run/syslog'``
- Line 1622: * FreeBSD/DragonFly: ``'unix:///var/run/log'``
- Line 1623: * OpenBSD: ``'unix:///dev/log'``
- Line 1624: * Linux/other: ``'udp://localhost:514'``
- Line 1632: * ``unix://PATH#TYPE`` : for unix domain socket. ``TYPE`` can be ``stream``
- Line 1635: * ``udp://HOST:PORT`` : for UDP sockets
- Line 1636: * ``tcp://HOST:PORT`` : for TCP sockets
- Line 1714: * ``unix://PATH`` : for a unix domain socket.
- Line 2714: # FIXME: refactor all of this subclassing stdlib argparse

### \server\venv\Lib\site-packages\gunicorn\util.py
- Line 192: # Note we are only testing for the existence of the file(s) in
- Line 234: if re.match(r'unix:(//)?', netloc):
- Line 235: return re.split(r'unix:(//)?', netloc)[-1]
- Line 543: # Note that if using --error-log option, the log

### \server\venv\Lib\site-packages\gunicorn\__main__.py
- Line 9: # todo: let runpy.run_module take care of argv[0] rewriting

### \server\venv\Lib\site-packages\gunicorn\asgi\message.py
- Line 36: RFC9110_5_6_2_TOKEN_SPECIALS = r"!#$%&'*+-.^_`|~"

### \server\venv\Lib\site-packages\gunicorn\dirty\tlv.py
- Line 38: MAX_STRING_SIZE = 64 * 1024 * 1024  # 64 MB
- Line 39: MAX_BYTES_SIZE = 64 * 1024 * 1024   # 64 MB
- Line 40: MAX_LIST_SIZE = 1024 * 1024         # 1 million items
- Line 41: MAX_DICT_SIZE = 1024 * 1024         # 1 million items

### \server\venv\Lib\site-packages\gunicorn\dirty\worker.py
- Line 492: # Note: The thread continues running - we just stop waiting

### \server\venv\Lib\site-packages\gunicorn\http\message.py
- Line 54: RFC9110_5_6_2_TOKEN_SPECIALS = r"!#$%&'*+-.^_`|~"
- Line 214: # Only modify after fixing *ALL* header transformations; network to wsgi env
- Line 618: # There are *four* `request-target` forms in rfc9112, none of them can be empty:

### \server\venv\Lib\site-packages\gunicorn\http\wsgi.py
- Line 199: # set the REMOTE_* keys in environ
- Line 211: # handle the SERVER_*
- Line 214: # viable SERVER_* if possible.

### \server\venv\Lib\site-packages\gunicorn\http2\async_connection.py
- Line 1: # -*- coding: utf-8 -
- Line 152: # Note: Specific exceptions must come before ProtocolError (their parent class)

### \server\venv\Lib\site-packages\gunicorn\http2\connection.py
- Line 1: # -*- coding: utf-8 -
- Line 146: # Note: Specific exceptions must come before ProtocolError (their parent class)

### \server\venv\Lib\site-packages\gunicorn\http2\errors.py
- Line 1: # -*- coding: utf-8 -

### \server\venv\Lib\site-packages\gunicorn\http2\request.py
- Line 1: # -*- coding: utf-8 -

### \server\venv\Lib\site-packages\gunicorn\http2\stream.py
- Line 1: # -*- coding: utf-8 -

### \server\venv\Lib\site-packages\gunicorn\http2\__init__.py
- Line 1: # -*- coding: utf-8 -

### \server\venv\Lib\site-packages\gunicorn\workers\geventlet.py
- Line 20: # NOTE: eventlet import and monkey_patch() must happen before any other imports
- Line 33: # NOTE: hubs.use_hub() must NOT be called here - it creates OS resources
- Line 151: # NOTE: eventlet.monkey_patch() is called at module import time to

### \server\venv\Lib\site-packages\h11\_abnf.py
- Line 6: #  OWS            = *( SP / HTAB )
- Line 11: #   token          = 1*tchar
- Line 13: #   tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
- Line 17: token = r"[-!#$%&'*+.^_`|~0-9a-zA-Z]+"
- Line 25: #  field-value    = *( field-content / obs-fold )
- Line 26: #  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
- Line 28: #  obs-fold       = CRLF 1*( SP / HTAB )
- Line 40: # However, the standard definition of field-content is WRONG! It disallows
- Line 44: # See: https://www.rfc-editor.org/errata_search.php?rfc=7230&eid=4189
- Line 50: # \x01 in them!):
- Line 60: # already grows to swallow the whole value, so ? instead of *
- Line 80: # URL, host+port (for connect), or even "*", but in any case we are guaranteed
- Line 97: #   reason-phrase  = *( HTAB / SP / VCHAR / obs-text )
- Line 108: # so make it optional. ?: is a non-capturing group.
- Line 115: #      chunk-size     = 1*HEXDIG
- Line 117: # but we impose an upper-limit to avoid ridiculosity. len(str(2**64)) == 20
- Line 121: #     chunk-ext      = *( ";" chunk-ext-name [ "=" chunk-ext-val ] )

### \server\venv\Lib\site-packages\h11\_connection.py
- Line 65: # - node.js: 80 * 1024
- Line 66: # - tomcat: 8 * 1024
- Line 67: # - IIS: 16 * 1024
- Line 107: # which are (lookup key, *args) for constructing body reader/writer
- Line 192: # closed *after* the end of whatever's in self._receive_buffer:
- Line 334: return io_dict[SEND_BODY][framing_type](*args)  # type: ignore[index]
- Line 599: # This function's *only* responsibility is making sure headers are set up

### \server\venv\Lib\site-packages\h11\_events.py
- Line 310: # XX FIXME: "A recipient MUST ignore (or consider as an error) any fields that

### \server\venv\Lib\site-packages\h11\_headers.py
- Line 70: # Maybe a dict-of-lists would be better?
- Line 217: # Content-Length: technically is just a single value (1*DIGIT), but the
- Line 259: # Note that when we store the header we use title casing for the header

### \server\venv\Lib\site-packages\h11\_readers.py
- Line 186: # XX FIXME: we discard chunk extensions. Does anyone care?

### \server\venv\Lib\site-packages\h11\_receivebuffer.py
- Line 23: # Note that starting in Python 3.4, deleting the initial n bytes from a

### \server\venv\Lib\site-packages\h11\_state.py
- Line 53: #    And sometimes, server events are annotated with a _SWITCH_* event. For
- Line 62: # 4&5) The _SWITCH_* machines transition from False->True when we get a
- Line 65: #    get a Response that has no _SWITCH_* annotation.
- Line 70: # the machines together. The way this works is, when certain *joint*
- Line 72: # new *joint* state. So, for example, if we're ever in a joint state with
- Line 88: # time?  In practice there's only one case where this arises (client DONE ->
- Line 103: # *too* terrible, but I feel like it could probably be better.
- Line 112: # script to keep it in sync!

### \server\venv\Lib\site-packages\h11\_util.py
- Line 99: # - Have a *bonus property*: type(sentinel) is sentinel

### \server\venv\Lib\site-packages\h11\_version.py
- Line 13: # want. (Contrast with the special suffix 1.0.0.dev, which sorts *before*

### \server\venv\Lib\site-packages\h11\_writers.py
- Line 54: # XX FIXME: could at least make an effort to pull out the status message

### \server\venv\Lib\site-packages\httpcore\_models.py
- Line 97: # * https://tools.ietf.org/html/rfc3986#section-3.2.3
- Line 98: # * https://url.spec.whatwg.org/#url-miscellaneous
- Line 99: # * https://url.spec.whatwg.org/#scheme-state
- Line 229: # Constructs an 'OPTIONS *' HTTP request:
- Line 230: # OPTIONS * HTTP/1.1

### \server\venv\Lib\site-packages\httpcore\_utils.py
- Line 14: # NOTE: we want check for readability without actually attempting to read, because

### \server\venv\Lib\site-packages\httpcore\__init__.py
- Line 55: def __init__(self, *args, **kwargs):  # type: ignore
- Line 68: def __init__(self, *args, **kwargs):  # type: ignore

### \server\venv\Lib\site-packages\httpcore\_async\connection_pool.py
- Line 258: # Return the response. Note that in this case we still have to manage

### \server\venv\Lib\site-packages\httpcore\_async\http11.py
- Line 255: # Note that this method unilaterally closes the connection, and does
- Line 268: # Note that HTTP/1.1 connections in the "NEW" state are not treated as

### \server\venv\Lib\site-packages\httpcore\_async\http2.py
- Line 201: # with them for now.  Maybe when we support caching?
- Line 209: # Some websites (*cough* Yahoo *cough*) balk at this setting being
- Line 359: # check *within* the atomic read lock. Though it also need to be optional,
- Line 360: # because when we call it from `_wait_for_outgoing_flow` we *do* want to
- Line 425: # Note that this method unilaterally closes the connection, and does

### \server\venv\Lib\site-packages\httpcore\_async\__init__.py
- Line 12: def __init__(self, *args, **kwargs) -> None:  # type: ignore
- Line 24: def __init__(self, *args, **kwargs) -> None:  # type: ignore

### \server\venv\Lib\site-packages\httpcore\_backends\anyio.py
- Line 122: stream._raw_socket.setsockopt(*option)  # type: ignore[attr-defined] # pragma: no cover
- Line 142: stream._raw_socket.setsockopt(*option)  # type: ignore[attr-defined] # pragma: no cover

### \server\venv\Lib\site-packages\httpcore\_backends\sync.py
- Line 196: # Note that we automatically include `TCP_NODELAY`
- Line 214: sock.setsockopt(*option)  # pragma: no cover

### \server\venv\Lib\site-packages\httpcore\_backends\trio.py
- Line 134: stream.setsockopt(*option)  # type: ignore[attr-defined] # pragma: no cover
- Line 155: stream.setsockopt(*option)  # type: ignore[attr-defined] # pragma: no cover

### \server\venv\Lib\site-packages\httpcore\_sync\connection_pool.py
- Line 258: # Return the response. Note that in this case we still have to manage

### \server\venv\Lib\site-packages\httpcore\_sync\http11.py
- Line 255: # Note that this method unilaterally closes the connection, and does
- Line 268: # Note that HTTP/1.1 connections in the "NEW" state are not treated as

### \server\venv\Lib\site-packages\httpcore\_sync\http2.py
- Line 201: # with them for now.  Maybe when we support caching?
- Line 209: # Some websites (*cough* Yahoo *cough*) balk at this setting being
- Line 359: # check *within* the atomic read lock. Though it also need to be optional,
- Line 360: # because when we call it from `_wait_for_outgoing_flow` we *do* want to
- Line 425: # Note that this method unilaterally closes the connection, and does

### \server\venv\Lib\site-packages\httpcore\_sync\__init__.py
- Line 12: def __init__(self, *args, **kwargs) -> None:  # type: ignore
- Line 24: def __init__(self, *args, **kwargs) -> None:  # type: ignore

### \server\venv\Lib\site-packages\httpx\_auth.py
- Line 267: # TODO: implement auth-int

### \server\venv\Lib\site-packages\httpx\_content.py
- Line 202: # However for compat with requests, we *do* still support

### \server\venv\Lib\site-packages\httpx\_decoders.py
- Line 60: See: https://stackoverflow.com/questions/1838699
- Line 89: See: https://stackoverflow.com/questions/1838699
- Line 197: ret = self.decompressor.flush()  # note: this is a no-op
- Line 213: # Note that we reverse the order for decoding.
- Line 346: # NOTE: the edge case input of empty text doesn't occur in practice,

### \server\venv\Lib\site-packages\httpx\_models.py
- Line 431: # Using `stream=...` will not automatically include *any*
- Line 437: # * Preserving the request stream when copying requests, eg for redirects.
- Line 438: # * Creating request instances on the *server-side* of the transport API.
- Line 1140: cookie = Cookie(**kwargs)  # type: ignore
- Line 1273: # Note that setting `info[key]` here is an "append" operation,

### \server\venv\Lib\site-packages\httpx\_multipart.py
- Line 153: # note that unlike requests, we ignore the content_type provided in the 3rd

### \server\venv\Lib\site-packages\httpx\_urlparse.py
- Line 54: # and U+003F (?), U+0060 (`), U+007B ({), and U+007D (}).
- Line 86: # Note... The terminology 'userinfo' percent-encode set in the WHATWG document
- Line 104: # ?{query}       (optional)
- Line 109: r"(?://(?P<authority>{authority}))?"
- Line 112: r"(?:#(?P<fragment>{fragment}))?"
- Line 115: authority="[^/?#]*",
- Line 116: path="[^?#]*",
- Line 117: query="[^#]*",
- Line 129: userinfo=".*",  # Any character sequence.
- Line 130: host="(\\[.*\\]|[^:@]*)",  # Either any character sequence excluding ':' or '@',
- Line 132: port=".*",  # Any character sequence.
- Line 139: # Note that we're duplicating the same strings as above. Shock! Horror!!
- Line 142: "authority": re.compile("[^/?#]*"),
- Line 143: "path": re.compile("[^?#]*"),
- Line 144: "query": re.compile("[^#]*"),
- Line 293: # * 'scheme', 'authority', and 'path' may be empty strings.
- Line 294: # * 'query' may be 'None', indicating no trailing "?" portion.
- Line 295: #   Any string including the empty string, indicates a trailing "?".
- Line 296: # * 'fragment' may be 'None', indicating no trailing "#" portion.
- Line 309: # * 'userinfo' and 'host' may be empty strings.
- Line 310: # * 'port' may be 'None'.
- Line 384: # reg-name    = *( unreserved / pct-encoded / sub-delims )

### \server\venv\Lib\site-packages\httpx\_urls.py
- Line 17: url = httpx.URL("HTTPS://jo%40email.com:a%20secret@müller.de:1234/pa%20th?search=ab#anchorlink")
- Line 34: https://jo%40email.com:a%20secret@müller.de:1234/pa%20th?search=ab#anchorlink
- Line 112: # include an empty trailing "?".
- Line 268: url = httpx.URL("https://example.com/?filter=some%20search%20terms")

### \server\venv\Lib\site-packages\httpx\_utils.py
- Line 52: # If NO_PROXY=* is used or if "*" occurs as any one of the comma
- Line 58: # NO_PROXY=.google.com is marked as "all://*.google.com,
- Line 60: # NO_PROXY=google.com is marked as "all://*google.com,
- Line 74: mounts[f"all://*{hostname}"] = None
- Line 101: # Is it an actual file?
- Line 106: # No... Maybe it's something that supports random access, like `io.BytesIO`?
- Line 114: # Not even that? Sorry, we're doomed...
- Line 180: # *.example.com should match "www.example.com", but not "example.com"
- Line 184: # *example.com should match "www.example.com" and "example.com"

### \server\venv\Lib\site-packages\httpx\_transports\default.py
- Line 15: "all://*example.org": httpx.HTTPTransport()

### \server\venv\Lib\site-packages\httpx\_transports\mock.py
- Line 36: # Allow handler to *optionally* be an `async` function.

### \server\venv\Lib\site-packages\idna\intranges.py
- Line 5: in the original list?" in time O(log(# runs)).

### \server\venv\Lib\site-packages\iniconfig\__init__.py
- Line 64: # TODO: investigate possible mypy bug wrt matching the passed over data

### \server\venv\Lib\site-packages\jose\jwe.py
- Line 120: # the content encryption algorithm.  Note that when there are

### \server\venv\Lib\site-packages\jose\backends\rsa_backend.py
- Line 62: # The quantity d*e-1 is a multiple of phi(n), even,
- Line 63: # and can be represented as t*2^s.
- Line 76: # Cycle through all values a^{t*2^i}=a^k
- Line 87: # This value was not any good... let's try another!
- Line 91: # Found !

### \server\venv\Lib\site-packages\multidict\_compat.py
- Line 14: # FIXME: Refactor for coverage. See #837.

### \server\venv\Lib\site-packages\multidict\_multidict_py.py
- Line 459: return (((n * 3 + 1) // 2) | 7).bit_length()
- Line 871: elif e.hash != -1:  # pragma: no branch

### \server\venv\Lib\site-packages\packaging\markers.py
- Line 294: # Note: We create a Marker object without calling this constructor in

### \server\venv\Lib\site-packages\packaging\metadata.py
- Line 65: # formats offer some very basic primitives in *some* way then we can support
- Line 196: # *something* reasonable with malformed data.
- Line 201: # later on (if the caller is validating) so it doesn't *really*
- Line 213: # TODO: The spec doesn't say anything about if the keys should be
- Line 457: # the value, since email *only* has strings, and our get_all() call
- Line 560: # To make the _process_* methods easier, we'll check if the value is None
- Line 883: description: _Validator[str | None] = _Validator()  # TODO 2.1: can be in body

### \server\venv\Lib\site-packages\packaging\requirements.py
- Line 29: # TODO: Can we test whether something is contained within a requirement?
- Line 30: #       If so how do we do that? Do we need to test against the _name_ of
- Line 31: #       the thing as well as the version? What about the markers?
- Line 32: # TODO: Can we normalize the name and extra name?

### \server\venv\Lib\site-packages\packaging\specifiers.py
- Line 141: (?<====)  # Only match for the identity operator
- Line 143: [^\s;)]*  # The arbitrary version can be just about anything,
- Line 153: (?<===|!=)            # Only match for equals and not equals
- Line 157: (?:[0-9]+!)?          # epoch
- Line 158: [0-9]+(?:\.[0-9]+)*   # release
- Line 163: \.\*  # Wild card syntax of .*
- Line 165: (?:                                  # pre release
- Line 171: (?:                                  # post release
- Line 174: (?:[-_\.]?dev[-_\.]?[0-9]*)?         # dev release
- Line 175: (?:\+[a-z0-9]+(?:[-_\.][a-z0-9]+)*)? # local
- Line 182: (?<=~=)               # Only match for the compatible operator
- Line 186: (?:[0-9]+!)?          # epoch
- Line 187: [0-9]+(?:\.[0-9]+)+   # release  (We have a + instead of a *)
- Line 188: (?:                   # pre release
- Line 194: (?:                                   # post release
- Line 197: (?:[-_\.]?dev[-_\.]?[0-9]*)?          # dev release
- Line 205: (?<!==|!=|~=)         # We have special cases for these
- Line 211: (?:[0-9]+!)?          # epoch
- Line 212: [0-9]+(?:\.[0-9]+)*   # release
- Line 213: (?:                   # pre release
- Line 219: (?:                                   # post release
- Line 222: (?:[-_\.]?dev[-_\.]?[0-9]*)?          # dev release
- Line 300: # Only the "!=" operator does not imply prereleases when
- Line 304: # The == specifier with trailing .* cannot include prereleases
- Line 305: # e.g. "==1.0a1.*" is not valid.
- Line 426: # is that ~=2.2 is equivalent to >=2.2,==2.*. This allows us to
- Line 451: # Get the normalized version string ignoring the trailing .*
- Line 522: # less than the spec version *and* it's not a pre-release of the same
- Line 556: # greater than the spec version *and* it's not a pre-release of the

### \server\venv\Lib\site-packages\packaging\tags.py
- Line 282: # pyston, ironpython, others?
- Line 380: # TODO: Need to care about 32-bit PPC for ppc64 through 10.2?
- Line 489: # if iOS is the current platform, ios_ver *must* be defined. However,

### \server\venv\Lib\site-packages\packaging\version.py
- Line 173: # Note that ++ doesn't behave identically on CPython and PyPy, so not using it here
- Line 175: v?+                                                   # optional leading v
- Line 177: (?:(?P<epoch>[0-9]+)!)?+                          # epoch
- Line 178: (?P<release>[0-9]+(?:\.[0-9]+)*+)                 # release segment
- Line 179: (?P<pre>                                          # pre-release
- Line 185: (?P<post>                                         # post release
- Line 195: (?P<dev>                                          # dev release
- Line 203: (?P<local>                                        # local version
- Line 756: # Versions without a pre-release (except as noted above) should sort after

### \server\venv\Lib\site-packages\packaging\_elffile.py
- Line 104: if data[self._p_idx[0]] != 3:  # Not PT_INTERP.

### \server\venv\Lib\site-packages\packaging\_manylinux.py
- Line 240: # https://sourceware.org/bugzilla/show_bug.cgi?id=24636

### \server\venv\Lib\site-packages\passlib\apache.py
- Line 2: # XXX: relocate this to passlib.ext.apache?
- Line 53: # whether users() and other public methods should return unicode or bytes?
- Line 155: # NOTE: ``path`` is a property so that ``_mtime`` is wiped when it's set.
- Line 233: # NOTE: per htpasswd source (https://github.com/apache/httpd/blob/trunk/support/htpasswd.c),
- Line 244: # NOTE: if multiple entries for a key, we use the first one,
- Line 264: # NOTE: not replacing ._records until parsing succeeds, so loading is atomic.
- Line 322: # NOTE: this relies on <records> being an OrderedDict so that it outputs
- Line 336: # NOTE: doing it lazily like this so deleting & re-adding user
- Line 408: # FIXME: htpasswd doc says passwords limited to 255 chars under Windows & MPE,
- Line 425: # to *verify* any scheme using that method, but can only generate "des_crypt" hashes.
- Line 445: # XXX: would like to not spam this unless the user *requests* apache 24
- Line 467: # XXX: could check for apache install, and pick correct host 22/24 default?
- Line 483: # (https://bz.apache.org/bugzilla/show_bug.cgi?id=49288)
- Line 495: # NOTE: apache says ONLY intended for transitioning htpasswd <-> ldap
- Line 498: # NOTE: apache says ONLY supported on Windows, Netware, TPF
- Line 507: # hack to remove dups and sort into preferred order
- Line 515: # NOTE: default will change to "portable" in passlib 2.0
- Line 518: # NOTE: bcrypt "2y" is required, "2b" isn't recognized by libapr (issue 95)
- Line 708: # NOTE: _records map stores <user> for the key, and <hash> for the value,
- Line 733: # NOTE: should return (user, hash) tuple
- Line 823: # XXX: rename to something more explicit, like delete_user()?
- Line 858: # NOTE: encoding password to match file, making the assumption
- Line 1018: # NOTE: _records map stores (<user>,<realm>) for the key,
- Line 1021: # NOTE: unlike htpasswd, this class doesn't use a CryptContext,
- Line 1181: # XXX: rename to something more explicit, like delete_user()?

### \server\venv\Lib\site-packages\passlib\apps.py
- Line 226: # TODO: support the drupal phpass variants (see phpass homepage)
- Line 235: # NOTE: 'roundup15' really applies to roundup 1.4.17+

### \server\venv\Lib\site-packages\passlib\context.py
- Line 45: # XXX: deprecate this in favor of raw float?
- Line 57: # NOTE: this isn't really needed any longer, since Handler.using() handles the actual parsing.
- Line 497: # hacked code that renders keys & values in manner that approximates
- Line 778: # XXX: have any statements been made about when this is default?
- Line 856: # NOTE: this is only used by _get_record_options_with_flag()...
- Line 977: # NOTE: this step handles final validation of settings,
- Line 993: # NOTE: if handler has no category-specific opts, get_record()
- Line 995: # NOTE: default records for specific category stored under the
- Line 1009: # XXX: push this down to GenericHandler.using() implementation?
- Line 1051: # NOTE: this is part of the critical path shared by
- Line 1112: # NOTE: this is part of the critical path shared by
- Line 1115: # FIXME: if multiple hashes could match (e.g. lmhash vs nthash)
- Line 1215: # FIXME: altering the configuration of this object isn't threadsafe,
- Line 1222: # XXX: add wrap/unwrap callback hooks so app can mutate hash format?
- Line 1225: #      which don't have any good distinguishing marks?
- Line 1226: #      or greedy ones (unix_disabled, plaintext) which are not listed at the end?
- Line 1384: #      e.g. the builtin passlib ones?
- Line 1385: # XXX: add a name or import path for the contexts, to help out repr?
- Line 1406: # XXX: would this be useful?
- Line 1428: # NOTE: making a copy of the context so the policy acts like a snapshot,
- Line 1453: # NOTE: this expects a unicode stream under py3,
- Line 1575: # XXX: add support for other iterable types, e.g. sequence of pairs?
- Line 1662: # XXX: make this public? even just as flag to load?
- Line 1663: # FIXME: this function suffered some bitrot in 1.6.1,
- Line 1692: ##    # TODO: this should work w/ 'auto', but needs closer inspection
- Line 1703: ##    # XXX: anything else?
- Line 1725: # XXX: should resolv return records rather than handlers?
- Line 1726: #      or deprecate resolve keyword completely?
- Line 1728: # NOTE: supporting 'category' and 'unconfigured' kwds as of 1.7
- Line 1764: # XXX: deprecate this in favor of .handler() or whatever it's replaced with?
- Line 1765: # NOTE: supporting 'unconfigured' kwds as of 1.7
- Line 1920: # based on presence of unregistered handlers?
- Line 1968: "# NOTE: the %s handler(s) are not registered with Passlib,\n"
- Line 1976: # XXX: is this useful enough to enable?
- Line 1991: # NOTE: this entire feature has been disabled.
- Line 2010: # NOTE: all the following methods do is look up the appropriate
- Line 2109: # TODO: offer replacement alternative.
- Line 2248: # TODO: offer replacement alternative.
- Line 2330: # XXX: what about supporting a setter() callback ala django 1.4 ?
- Line 2332: # TODO: offer replacement alternative.
- Line 2436: # NOTE: we re-hash with default scheme, not current one.
- Line 2536: # XXX: should we throw error if result can't be identified by context?
- Line 2599: # NOTE: the way this class works changed in 1.6.

### \server\venv\Lib\site-packages\passlib\exc.py
- Line 19: # XXX: add a PasslibRuntimeError as base for Missing/Internal/Security runtime errors?
- Line 283: # note: these functions are used by the hashes in Passlib to raise common
- Line 287: # ValueError will do?
- Line 308: # NOTE: value is never displayed, since it may sometimes be a password.
- Line 353: # TODO: if handler.use_defaults is set, this came from app-provided value,
- Line 384: def CryptBackendError(handler, config, hash,  # *

### \server\venv\Lib\site-packages\passlib\hash.py
- Line 30: # HACK: the following bit of code is unreachable, but it's presence seems to
- Line 36: # begin autocomplete hack (autogenerated 2016-11-10)
- Line 63: # end autocomplete hack

### \server\venv\Lib\site-packages\passlib\hosts.py
- Line 61: # XXX: include darwin in this list? it's got a BSD crypt variant,
- Line 68: # NOTE: this is basically mimicing the output of os crypt(),

### \server\venv\Lib\site-packages\passlib\ifc.py
- Line 32: # TODO: make this actually use abstractproperty(),
- Line 35: # XXX: rename to PasswordHasher?
- Line 65: #: NOTE: calls may treat as boolean, since value will never be 0.
- Line 67: #: .. TODO: passlib 1.8: deprecate/rename this attr to "max_secret_size"?
- Line 70: # NOTE: these next two default to the optimistic "ideal",
- Line 80: #: .. TODO: passlib 1.8: deprecate/rename this attr to "truncate_hash_error"?
- Line 116: def hash(cls, secret,  # *
- Line 117: **setting_and_context_kwds):  # pragma: no cover -- abstract method
- Line 139: # FIXME:  need stub for classes that define .encrypt() instead ...
- Line 161: def verify(cls, secret, hash, **context_kwds): # pragma: no cover -- abstract method
- Line 225: def genconfig(cls, **setting_kwds): # pragma: no cover -- abstract method
- Line 238: # NOTE: this fallback runs full hash alg, w/ whatever cost param is passed along.
- Line 266: # but are documented here so there's a list of them *somewhere*.
- Line 274: #: Note the context will only set this on objects it owns (and generated by .using()),
- Line 277: #: TODO: document this, or at least the use of testing for
- Line 315: ##def bitsize(cls, **kwds):

### \server\venv\Lib\site-packages\passlib\pwd.py
- Line 34: # XXX: rename / publically document this map?
- Line 93: # NOTE: the following performs ``- sum(value / size * logf(value / size, 2) for value in values)``,
- Line 101: #     (the average entropy per symbol * size of sequence)
- Line 103: #     return _self_info_rate(source) * len(source)
- Line 158: #      but trying to add unhashable it to a set *does*.
- Line 332: ascii_72='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*?/',
- Line 518: # NOTE: works but not used
- Line 591: # NOTE: speeds things up, and prevents contains from lazy-loading
- Line 792: # NOTE:
- Line 797: #    * NIST 800-63 has simple alg
- Line 798: #    * zxcvbn (https://tech.dropbox.com/2012/04/zxcvbn-realistic-password-strength-estimation/)
- Line 801: #    * passfault (https://github.com/c-a-m/passfault) looks thorough,
- Line 803: #    * give a look at running things through zlib - might be able to cheaply

### \server\venv\Lib\site-packages\passlib\registry.py
- Line 84: #     * import path should be "module.path" or "module.path:attr"
- Line 85: #     * if attr omitted, "name" used as default.
- Line 87: # NOTE: this is a hardcoded list of the handlers built into passlib,
- Line 358: # XXX: issue deprecation warning here?
- Line 367: # fail!
- Line 384: # TODO: make _handlers a separate list, so we don't have module namespace mixed in.
- Line 387: # NOTE: these two functions mainly exist just for the unittests...
- Line 431: # TODO: needs UTs
- Line 449: # TODO: needs UTs
- Line 507: # TODO: move unix_crypt_schemes list to here.
- Line 511: # TODO: needs UTs
- Line 531: # TODO: needs UTs

### \server\venv\Lib\site-packages\passlib\totp.py
- Line 63: # HACK: python < 2.7.4's urlparse() won't parse query strings unless the url scheme
- Line 138: # XXX: add base64 support?
- Line 249: #: NOTE: this is relatively low, since the majority of the security
- Line 265: # TODO: allow a lot more things to be customized from here,
- Line 415: # NOTE: this requires 2 sha256 blocks to be calculated.
- Line 455: # XXX: switch to base64?
- Line 616: #: [private] secret key as raw :class:`!bytes`
- Line 642: #: *(TOTP uses an internal time-derived counter which
- Line 643: #: increments by 1 every* :attr:`!period` *seconds)*.
- Line 721: # NOTE: this creates *subclass* instance,
- Line 738: # XXX: add default size as configurable parameter?
- Line 796: # maybe just warn about this?
- Line 803: # NOTE: this handles decrypting & setting '.key'
- Line 1006: # NOTE: utctimetuple() assumes naive datetimes are in UTC
- Line 1007: # NOTE: we explicitly *don't* want microseconds.
- Line 1128: # NOTE: the 10'th digit is not as secure, as it can only take on values 0-2, not 0-9,
- Line 1255: # NOTE: By returning match tied to <time>, not <client_time>, we're
- Line 1306: # TODO: resync(self, tokens, time=None, min_tokens=10, window=100)
- Line 1309: # NOTE: need to make sure this function is constant time
- Line 1347: # NOTE: letting to_unicode() raise TypeError in this case
- Line 1421: # NOTE: KeyURI spec says there may be leading spaces
- Line 1460: # malicious uri, deviation from spec, or newer revision of spec?
- Line 1520: 'otpauth://totp/user@example.org?secret=S3JDVB7QD2R7JPXX&issuer=myservice.another-example.org'
- Line 1533: # NOTE: reference examples in spec seem to indicate the '@' in a label
- Line 1535: # XXX: is '/' ok to leave unencoded?
- Line 1544: # NOTE: per KeyURI spec, including issuer as part of label is deprecated,
- Line 1550: # NOTE: not using urllib.urlencode() because it encodes ' ' as '+';
- Line 1557: return u("otpauth://totp/%s?%s") % (label, param_str)
- Line 1644: # XXX: just pass all this through to _from_json / constructor?
- Line 1690: # NOTE: 'type' may seem redundant, but using it so code can try to
- Line 1691: #       detect that this *is* a TOTP json string / dict.
- Line 1699: # XXX: should we include label as part of json format?
- Line 1713: # NOTE: in the future, may add a "history" parameter

### \server\venv\Lib\site-packages\passlib\win32.py
- Line 49: LM_MAGIC = b"KGS!@#$%"
- Line 55: # NOTE: various references say LMHASH uses the OEM codepage of the host

### \server\venv\Lib\site-packages\passlib\crypto\des.py
- Line 37: http://fxr.googlebit.com/source/lib/libcrypt/crypt.c?v=NETBSD-CURRENT
- Line 40: # TODO: could use an accelerated C version of this module to speed up lmhash,
- Line 89: # NOTE: this was reordered from original table to make perm3264 logic simpler
- Line 160: # NOTE: this was reordered from original table to make perm3264 logic simpler
- Line 228: # NOTE: this was reordered from original table to make perm3264 logic simpler
- Line 307: # NOTE: modified PCXROT to contain entrys broken into pairs,
- Line 320: # NOTE: this was reordered from original table to make perm3264 logic simpler
- Line 494: # NOTE: this was reordered from original table to make perm6464 logic simpler
- Line 572: # NOTE: only difference between 32 & 64 bit permutations
- Line 583: # FIXME: more properly named _uint8_struct...
- Line 605: ##    # http://graphics.stanford.edu/~seander/bithacks.html#ParityParallel
- Line 623: # NOTE: the following would insert correctly-valued parity bits in each key,
- Line 773: # NOTE: parity bits are ignored completely
- Line 777: # NOTE: generation was modified to output two elements at a time,

### \server\venv\Lib\site-packages\passlib\crypto\digest.py
- Line 75: ("md2", "md2"),  # NOTE: openssl dropped md2 support in v1.0.0
- Line 83: # TODO: add sha3 to this table.
- Line 93: # NOTE: there was an older "ripemd" and "ripemd-128",
- Line 230: # XXX: is there a faster way to wrap this?
- Line 244: # XXX: any other modules / registries we should check?
- Line 245: # TODO: add pysha3 support.
- Line 250: def lookup_hash(digest,  # *,
- Line 292: # NOTE: TypeError is to catch 'TypeError: unhashable type' (e.g. HashInfo)
- Line 315: # NOTE: may return None, which is handled by HashInfo constructor
- Line 457: def __init__(self,  # *,
- Line 498: # TODO: load in preset digest size info for known hashes.
- Line 680: # NOTE: this is slightly slower than the single-shot version,
- Line 801: * `fastpbk2 <https://pypi.python.org/pypi/fastpbkdf2>`_
- Line 831: # find smallest block count s.t. keylen <= block_count * digest_size;
- Line 833: # this corresponds to throwing error if keylen > digest_size * MAX_UINT32
- Line 834: # NOTE: stdlib will throw error at lower bound (keylen > MAX_SINT32)
- Line 835: # NOTE: have do this before other backends checked, since fastpbkdf2 raises wrong error
- Line 846: # NOTE: have to do this after above guards since fastpbkdf2 lacks bounds checks.
- Line 851: # NOTE: have to do this after fastpbkdf2 since hashlib-ssl is slower,
- Line 874: # TODO: consider some alternatives, such as C-accelerated xor_bytes helper if available
- Line 876: # NOTE: this env var is only present to support the admin/benchmark_pbkdf2 script
- Line 1046: # *very* rough estimate of relative speed (compared to sha256 using 'unpack' backend on 64bit arch)
- Line 1052: # remaining backends have *some* difference in performance, but not enough to matter

### \server\venv\Lib\site-packages\passlib\crypto\_md4.py
- Line 67: # FIXME: make this follow hash object PEP better.
- Line 68: # FIXME: this isn't threadsafe
- Line 212: # NOTE: backing up state so we can restore it after _process is called,

### \server\venv\Lib\site-packages\passlib\crypto\scrypt\_builtin.py
- Line 63: self.smix_bytes = r << 7  # num bytes in smix input - 2*r*16*4
- Line 65: self.bmix_len = bmix_len = r << 5  # length of bmix block list - 32*r integers
- Line 77: # the first 32 bytes if n < 2**32 - which due to the current
- Line 111: # XXX: *could* use threading here, if really high p values encountered,
- Line 144: # parse input into 32*r integers ('X' in scrypt source)
- Line 152: # time cost -- O(n * r) -- n loops, bmix is O(r)
- Line 153: # mem cost -- O(n * r) -- V is n-element array of r-element tuples
- Line 154: # NOTE: could do time / memory tradeoff to shrink size of V
- Line 166: # time cost -- O(n * r) -- loops n times, calls bmix() which has O(r) time cost
- Line 177: # # NOTE: we could easily support arbitrary values of ``n``, not just powers of 2,
- Line 221: # B' <-- (Y_0, Y_2 ... Y_{2r-2}, Y_1, Y_3 ... Y_{2r-1}) */
- Line 222: half = self.bmix_half_len # 16*r out of 32*r - start of Y_1

### \server\venv\Lib\site-packages\passlib\crypto\scrypt\_gen_files.py
- Line 18: ##/* Operate on columns. */
- Line 48: ##/* Operate on rows. */

### \server\venv\Lib\site-packages\passlib\crypto\scrypt\__init__.py
- Line 30: #: TODO: standardize this across backends, and expose support via scrypt hash config;
- Line 37: #: max ``r * p`` limit
- Line 40: # TODO: unittests for this function
- Line 58: # pbkdf2-hmac-sha256 limitation - it will be requested to generate ``p*(2*r)*64`` bytes,
- Line 59: # but pbkdf2 can do max of (2**31-1) blocks, and sha-256 has 32 byte block size...
- Line 60: # so ``(2**31-1)*32 >= p*r*128`` -> ``r*p < 2**30``
- Line 82: # XXX: expand to provide upper bound for diff backends, or max across all of them?
- Line 83: # NOTE: openssl's scrypt() enforces it's maxmem parameter based on calc located at
- Line 86: #     Blen = p * 128 * r
- Line 87: #     Vlen = 32 * r * (N + 2) * sizeof(uint32_t)
- Line 95: # TODO: configuration picker (may need psutil for full effect)
- Line 209: # TODO: would like to enforce a single "maxmem" policy across all backends;
- Line 216: # as hack, this can be overriden via SCRYPT_MAXMEM above,
- Line 233: scrypt=_load_cffi_backend,  # XXX: rename backend constant to "cffi"?

### \server\venv\Lib\site-packages\passlib\crypto\_blowfish\base.py
- Line 22: # NOTE: blowfish's spec states these numbers are the hex representation
- Line 331: # repeat data until it fills up 4*size bytes
- Line 354: # NOTE: decipher is same as above, just with reversed(P) instead.
- Line 382: # NOTE: this is the same as expand(), except for the addition
- Line 383: #       of the operations involving *salt_words*.

### \server\venv\Lib\site-packages\passlib\ext\django\utils.py
- Line 75: # TODO: add preset which includes HASHERS + PREFERRED_HASHERS,
- Line 360: # XXX: bother caching these lists / mapping?
- Line 365: # TODO: should make iteration via registry easier
- Line 380: # NOTE: this should only happen for custom django hashers that we don't
- Line 481: from django.utils.lru_cache import lru_cache  # py2 compat, removed in django 3 (or earlier?)
- Line 553: # NOTE: relying on hasher coming from context, and thus having
- Line 576: # XXX: honor "none_causes_check_password_error" quirk for django 2.2+?
- Line 602: # TODO: Solve redundancy that verify() call
- Line 679: # NOTE: could leave defaults alone, but want to have user available
- Line 733: # since we're installing it in a class *as* a method
- Line 734: # XXX: make this a flag for .patch()?
- Line 741: # done!
- Line 809: # TODO: would like to add support for inheriting config from a preset
- Line 813: # TODO: wrap and import any custom hashers as passlib handlers,
- Line 901: # NOTE: 'rounds' attr will store variable rounds, IF handler supports it.
- Line 916: # XXX: could this be implemented?
- Line 967: # NOTE: passlib's handler.hash() should generate new salt each time,
- Line 1010: # TODO: would like access CryptContext, would need caller to pass it to get_passlib_hasher().
- Line 1015: # TODO: always call subcls/handler.needs_update() in case there's other things to check
- Line 1028: # TODO: this code probably halfway works, mainly just needs
- Line 1038: ##    # FIXME: this generic wrapper doesn't handle custom settings
- Line 1039: ##    # FIXME: genconfig / genhash not supported.
- Line 1060: ##        #      maybe by renaming this to django compatible aliases?
- Line 1079: ##    def hash(self, secret, salt=None, **kwds):
- Line 1080: ##        # NOTE: from how make_password() is coded, all hashers
- Line 1092: ##        return to_native_str(self.django_hasher(secret, salt, **opts))
- Line 1115: # NOTE: this could easily use a dict interface,
- Line 1132: # NOTE: this behavior is deprecated in favor of .isactive
- Line 1223: ##def patch_many(self, **kwds):

### \server\venv\Lib\site-packages\passlib\handlers\argon2.py
- Line 44: # NOTE: when adding a new argon2 hash type, need to do the following:
- Line 45: # * add TYPE_XXX constant, and add to ALL_TYPES
- Line 46: # * make sure "_backend_type_map" constructors handle it correctly for all backends
- Line 47: # * make sure _hash_regex & _ident_regex (below) support type string.
- Line 48: # * add reference vectors for testing.
- Line 65: # NOTE: we try to do this even if caller is going to use argon2pure,
- Line 106: # NOTE: "type" attribute added in argon2_cffi v18.2; but currently not reading it
- Line 147: # TODO: could support the optional 'data' parameter,
- Line 156: # NOTE: ident -- all argon2 hashes start with "$argon2<type>$"
- Line 178: # TODO: once rounds limit logic is factored out,
- Line 196: #: NOTE: this is dependant on the backend, and initialized/modified by set_backend()
- Line 215: #: XXX: could expose keys as class-level .supported_types property?
- Line 240: #: NOTE: this is modified by set_backend()
- Line 298: # NOTE: this isn't *really* digest size minimum, but want to enforce secure minimum.
- Line 324: # NOTE: this is used by class & instance, hence passing in via arguments.
- Line 357: # NOTE: as of 2016-6-17, the official source (above) lists the "keyid" param in the comments,
- Line 397: # NOTE: assuming hash will be unicode, or use ascii-compatible encoding.
- Line 398: # TODO: switch to working w/ str or unicode
- Line 435: # NOTE: 'keyid' param currently not supported
- Line 459: # TODO: factor out variable checksum size support into a mixin.
- Line 518: # failure!
- Line 547: # NOTE: _calc_checksum implemented by backend subclass
- Line 558: # XXX: pick better error class?
- Line 610: # NOTE: class will just throw "unsupported argon2 hash" error if they try to use it...
- Line 682: # NOTE: since argon2_cffi takes care of rendering hash,
- Line 685: # NOTE: have to use super() here so that we don't recursively
- Line 738: # TODO: add in 'encoding' support once that's finalized in 1.8 / 1.9.
- Line 761: # TODO: add in 'encoding' support once that's finalized in 1.8 / 1.9.
- Line 767: # NOTE: don't care about malformed strings, lowlevel will throw error for us
- Line 781: # NOTE: deprecated, will be removed in 2.0
- Line 784: # TODO: add in 'encoding' support once that's finalized in 1.8 / 1.9.
- Line 873: # NOTE: this backend uses default .hash() & .verify() implementations.
- Line 879: # TODO: add in 'encoding' support once that's finalized in 1.8 / 1.9.
- Line 898: # NOTE: should return raw bytes
- Line 899: # NOTE: this may raise _argon2pure.Argon2ParameterError,
- Line 985: # NOTE: the brunt of the argon2 class is implemented in _Argon2Common.

### \server\venv\Lib\site-packages\passlib\handlers\bcrypt.py
- Line 72: # NOTE: this is also used by the unittests.
- Line 134: # NOTE: 22nd salt char must be in restricted set of ``final_salt_chars``, not full set above.
- Line 155: # NOTE: these are only set on the backend mixin classes
- Line 190: # NOTE: this should be kept separate from to_string()
- Line 203: # NOTE: can't convert this to use _calc_needs_update() helper,
- Line 211: # TODO: try to detect incorrect 8bit/wraparound hashes using kwds.get("secret")
- Line 241: # FIXME: if salt was provided by user, this message won't be
- Line 263: # NOTE: backends are defined in terms of mixin classes,
- Line 270: # NOTE: backend config is located down in <bcrypt> class
- Line 272: # NOTE: set_backend() will execute the ._load_backend_mixin()
- Line 329: test cases from <http://cvsweb.openwall.com/cgi/cvsweb.cgi/Owl/packages/glibc/crypt_blowfish/wrapper.c.diff?r1=1.9;r2=1.10>
- Line 332: # NOTE: passlib 1.7.2 and earlier used the commented-out LATIN-1 test vector to detect
- Line 351: # NOTE: this only EVER be observed in (broken) 2a and (backward-compat) 2x hashes
- Line 359: # it doesn't have wraparound bug, but make sure it *does* verify against the correct
- Line 360: # hash, or we're in some weird third case!
- Line 383: # if it doesn't have wraparound bug, make sure it *does* handle things
- Line 395: # * 2y implementations should have been free of it
- Line 396: # * 2b was what (supposedly) fixed it
- Line 448: # NOTE: Not using this as fallback candidate,
- Line 454: # TODO: check for 2x support
- Line 512: # NOTE: especially important to forbid NULLs for bcrypt, since many
- Line 514: # silently truncate the password at first NULL they encounter!
- Line 518: # TODO: figure out way to skip these tests when not needed...
- Line 522: # NOTE: not needed for 2y/2b, but might use 2a as fallback for them.
- Line 527: # NOTE: this only works because bcrypt will ignore everything past
- Line 560: # NOTE: this only works because bcrypt will ignore everything past
- Line 570: # NOTE: shouldn't get here.
- Line 592: # NOTE: have to use super() here so that we don't recursively
- Line 628: # # TODO: would like to implementing verify() directly,
- Line 639: #     if eff_ident != ident:
- Line 718: # XXX: should we raise AssertionError here? (if get here, _detect_pybcrypt() is broken)
- Line 809: #      and then catch it above? maybe have safe_crypt ALWAYS throw error
- Line 810: #      instead of returning None? (would save re-detecting what went wrong)
- Line 811: # XXX: isn't secret ALWAYS bytes at this point?
- Line 825: # NOTE: getting here should be considered a bug in passlib --
- Line 832: # XXX: throw something more specific, like an "InternalBackendError"?
- Line 833: # NOTE: if do change this error, need to update test_81_crypt_fallback() expectations
- Line 940: # NOTE: the brunt of the bcrypt class is implemented in _BcryptCommon.
- Line 983: # def hash(cls, secret, **kwds):
- Line 985: #     # XXX: would wrapping bcrypt make this easier than subclassing it?
- Line 986: #     return super(_BcryptCommon, cls).hash(secret, **kwds)
- Line 1190: # NOTE: can't use digest directly, since bcrypt stops at first NULL.
- Line 1191: # NOTE: bcrypt doesn't fully mix entropy for bytes 55-72 of password
- Line 1210: # NOTE: salt in this case is the "bcrypt64"-encoded value, not the raw salt bytes,
- Line 1221: # NOTE: output of b64encode() uses "+/" altchars, "=" padding chars,

### \server\venv\Lib\site-packages\passlib\handlers\cisco.py
- Line 82: # NOTE: these are the default policy for PasswordHash,
- Line 124: # been observed when trying to actually *set* a non-ascii password
- Line 148: # NOTE: assuming PIX has same behavior, but at 16 char limit.
- Line 171: # * Nothing appended for enable password (user = "")
- Line 173: # * ASA: If user present, but secret is >= 28 chars, nothing appended.
- Line 175: # * 1-2 byte users not allowed.
- Line 180: # * 3 byte user has first char repeated, to pad to 4.
- Line 183: # * 4 byte users are used directly.
- Line 185: # * 5+ byte users are truncated to 4 bytes.
- Line 218: # NOTE: guessing this was done because it makes output exactly
- Line 229: # NOTE: works, but needs UTs.
- Line 345: # NOTE: encoding could handle max_salt_value=99, but since key is only 52

### \server\venv\Lib\site-packages\passlib\handlers\des_crypt.py
- Line 36: # NOTE: this would set the parity bits correctly,
- Line 38: ##return sum(expand_7bit(byte_elem_value(c) & 0x7f) << (56-i*8)
- Line 47: # NOTE: some OSes will accept non-HASH64 characters in the salt,
- Line 217: # NOTE: we let safe_crypt() encode unicode secret -> utf8;
- Line 294: # NOTE: OpenBSD login.conf reports 7250 as minimum allowed rounds,
- Line 330: # NOTE: keeping this flag for admin/choose_rounds.py script.
- Line 347: # NOTE: doing this even for default_rounds so needs_update() doesn't get
- Line 349: # FIXME: this technically might generate a rounds value 1 larger
- Line 436: # NOTE: checksum chars must be multiple of 11

### \server\venv\Lib\site-packages\passlib\handlers\digests.py
- Line 90: # NOTE: some digests below are marked as "required=False", because these may not be present on
- Line 116: # NOTE: this was deliberately written so that raw bytes are passed through
- Line 161: # NOTE: 'config' is ignored, as this hash has no salting / other configuration.

### \server\venv\Lib\site-packages\passlib\handlers\django.py
- Line 56: # NOTE: django 1.0-1.3 would accept empty salt strings.
- Line 74: # NOTE: only used by PBKDF2
- Line 170: # NOTE: this docstring is duplicated in the docs, since sphinx
- Line 288: default_rounds = pbkdf2_sha256.default_rounds # NOTE: django 1.6 uses 12000
- Line 292: # NOTE: secret & salt will be encoded using UTF-8 by pbkdf2_hmac()
- Line 336: default_rounds = pbkdf2_sha1.default_rounds # NOTE: django 1.6 uses 12000
- Line 343: # NOTE: as of 2019-11-11, Django's Argon2PasswordHasher only supports Type I;
- Line 351: # NOTE: this docstring is duplicated in the docs, since sphinx
- Line 411: # NOTE: regarding duplicate salt field:
- Line 456: # NOTE: we lazily import des_crypt,
- Line 493: # XXX: move this to StaticHandler, or wherever _hash_prefix is being used?

### \server\venv\Lib\site-packages\passlib\handlers\fshp.py
- Line 78: # FIXME: should probably use different default rounds
- Line 118: # NOTE: variant must be set first, since it controls checksum size, etc.
- Line 197: # NOTE: for some reason, FSHP uses pbkdf1 with password & salt reversed.

### \server\venv\Lib\site-packages\passlib\handlers\ldap_digests.py
- Line 71: # NOTE: openldap implementation uses 4 byte salt,
- Line 203: # NOTE: 32 = ceil((20 + 4) * 4/3)
- Line 244: # NOTE: 48 = ceil((32 + 4) * 4/3)
- Line 284: # NOTE: 91 = ceil((64 + 4) * 4/3)
- Line 308: # NOTE: this subclasses plaintext, since all it does differently
- Line 323: # NOTE: identifies all strings EXCEPT those with {XXX} prefix
- Line 335: # NOTE: I don't like to implicitly modify globals() like this,

### \server\venv\Lib\site-packages\passlib\handlers\md5_crypt.py
- Line 27: # pre-calculated offsets used to speed up C digest stage (see notes below).
- Line 58: # NOTE: regarding 'apr' format:
- Line 59: # really, apache? you had to invent a whole new "$apr1$" format,
- Line 60: # when all you did was change the ident incorporated into the hash?
- Line 62: # implementation of $1$ wasn't sufficient. *nothing else* was changed.
- Line 81: # NOTE: spec says salts larger than 8 bytes should be truncated,
- Line 107: # NOTE: this may have historically been a bug,
- Line 125: # NOTE: the original MD5-Crypt implementation performs the C digest
- Line 153: # * calculates the round-specific combination of salt & pwd for each round 0-41
- Line 154: # * runs through as many 42-round blocks as possible (23)
- Line 155: # * runs through as many pairs of rounds as needed for remaining rounds (17)
- Line 156: # * this results in the required 42*23+2*17=1000 rounds required by md5_crypt.
- Line 263: # FIXME: can't find definitive policy on how md5-crypt handles non-ascii.

### \server\venv\Lib\site-packages\passlib\handlers\misc.py
- Line 63: # NOTE: hash will generally be "!", but we want to preserve
- Line 64: # it in case it's something else, like "*".
- Line 111: # TODO: rename attr to 'marker'...
- Line 131: # NOTE: technically, anything in the /etc/shadow password field
- Line 135: #       so to be on the safe side, we only match things *known*
- Line 137: #       as they are found. things beginning w/ "$" should *never* match.
- Line 140: #       * linux uses "!"
- Line 141: #       * bsd uses "*"
- Line 142: #       * linux may use "!" + hash to disable but preserve original hash
- Line 143: #       * linux counts empty string as "any password";
- Line 144: #         this code recognizes it, but treats it the same as "!"
- Line 176: # preserve the existing str,since it might contain a disabled password hash ("!" + hash)
- Line 224: # NOTE: this is subclassed by ldap_plaintext
- Line 262: # NOTE: 'config' is ignored, as this hash has no salting / etc

### \server\venv\Lib\site-packages\passlib\handlers\mssql.py
- Line 29: https://blogs.msdn.com/b/lcris/archive/2007/04/30/sql-server-2005-about-login-password-hashes.aspx?Redirected=true
- Line 164: # NOTE: we only compare against the upper-case hash
- Line 165: # XXX: add 'full' just to verify both checksums?

### \server\venv\Lib\site-packages\passlib\handlers\mysql.py
- Line 67: # FIXME: no idea if mysql has a policy about handling unicode passwords
- Line 117: # FIXME: no idea if mysql has a policy about handling unicode passwords

### \server\venv\Lib\site-packages\passlib\handlers\oracle.py
- Line 42: value += pad * (-len(value) % 8) # null pad to multiple of 8
- Line 78: # FIXME: not sure how oracle handles unicode.

### \server\venv\Lib\site-packages\passlib\handlers\pbkdf2.py
- Line 52: # NOTE: max_salt_size and max_rounds are arbitrarily chosen to provide sanity check.
- Line 55: # NOTE: defaults chosen to be at least as large as pbkdf2 rfc recommends...
- Line 77: # NOTE: pbkdf2_hmac() will encode secret & salt using UTF8
- Line 93: encoded_checksum_size=(digest_size*4+2)//3,
- Line 189: # NOTE: max_salt_size and max_rounds are arbitrarily chosen to provide a
- Line 212: # NOTE: rounds in hex
- Line 216: # NOTE: passlib deviation - forbidding zero-padded rounds
- Line 232: # NOTE: pbkdf2_hmac() will encode secret & salt using utf-8
- Line 285: # NOTE: max_salt_size and max_rounds are arbitrarily chosen to provide a
- Line 295: # NOTE: for security, the default here is set to match pbkdf2_sha1,
- Line 335: # NOTE: pbkdf2_hmac() will encode secret & salt using utf-8
- Line 395: # TODO: find out what crowd's policy is re: unicode
- Line 397: # NOTE: pbkdf2_hmac() will encode secret & salt using utf-8
- Line 442: # NOTE: max_salt_size and max_rounds are arbitrarily chosen to provide a
- Line 469: # TODO: find out what grub's policy is re: unicode
- Line 470: # NOTE: pbkdf2_hmac() will encode secret & salt using utf-8

### \server\venv\Lib\site-packages\passlib\handlers\phpass.py
- Line 118: # FIXME: can't find definitive policy on how phpass handles non-ascii.

### \server\venv\Lib\site-packages\passlib\handlers\roundup.py
- Line 23: # NOTE: these are here because they're currently only known to be used by roundup

### \server\venv\Lib\site-packages\passlib\handlers\scram.py
- Line 55: use :mod:`!hashlib` or `IANA <http://www.iana.org/assignments/hash-function-text-names>`_
- Line 80: # NOTE: unlike most GenericHandler classes, the 'checksum' attr of
- Line 84: # NOTE: max_salt_size and max_rounds are arbitrarily chosen to provide
- Line 213: # NOTE: pbkdf2_hmac() will encode secret & salt using utf-8,
- Line 233: if rounds_str != str(rounds): # forbid zero padding, etc.
- Line 330: # TODO: verify digest size (if digest is known)
- Line 332: # NOTE: required because of SCRAM spec.
- Line 345: # NOTE: required because of SCRAM spec (rfc 5802)
- Line 355: #      to permit removing legacy hashes?
- Line 388: # NOTE: to make the verify method efficient, we just calculate hash
- Line 395: # NOTE: could do this length check in norm_algs(),
- Line 412: # XXX: should this just always use sha1 hash? would be faster.
- Line 430: ##    "quick hack testing scram reference vectors"
- Line 431: ##    # NOTE: "n,," is GS2 header - see https://tools.ietf.org/html/rfc5801
- Line 471: ##        return cls(alg, *scram.extract_digest_info(hash, alg))
- Line 480: ##            if digest and data != digest:
- Line 557: ##    # hacks for calculated attributes

### \server\venv\Lib\site-packages\passlib\handlers\scrypt.py
- Line 112: # NOTE: scrypt supports arbitrary output sizes. since it's output runs through
- Line 115: # XXX: make checksum size configurable? could merge w/ argon2 code that does this.
- Line 133: # TODO: would like to dynamically pick this based on system
- Line 139: # TODO: make default block size configurable via using(), and deprecatable via .needs_update()
- Line 247: # XXX: annoyingly, official spec embeds salt *raw*, yet doesn't specify a hash encoding.
- Line 315: # NOTE: if hash contains invalid complex constraint, relying on error
- Line 332: # NOTE: this following HasManyBackends' API, but provides it's own implementation,

### \server\venv\Lib\site-packages\passlib\handlers\sha1_crypt.py
- Line 134: # NOTE: this seed value is NOT the same as the config string
- Line 136: # NOTE: this algorithm is essentially PBKDF1, modified to use HMAC.

### \server\venv\Lib\site-packages\passlib\handlers\sha2_crypt.py
- Line 28: # pre-calculated offsets used to speed up C digest stage (see notes below).
- Line 75: # NOTE: the setup portion of this algorithm scales ~linearly in time
- Line 78: #       which would make things even worse, using O(pwd_len**2) memory
- Line 99: # NOTE: spec says out-of-range rounds should be clipped, instead of
- Line 108: # NOTE: spec says salts larger than 16 bytes should be truncated,
- Line 149: # this method is faster under python, but uses O(pwd_len**2) memory;
- Line 174: # NOTE: the original SHA256/512-Crypt specification performs the C digest
- Line 202: # * calculates the round-specific combination of ds & dp for each round 0-41
- Line 203: # * runs through as many 42-round blocks as possible
- Line 204: # * runs through as many pairs of rounds as possible for remaining rounds
- Line 205: # * performs once last round if the total rounds should be odd.
- Line 300: # TODO: this *could* use uh.parse_mc3(), except that the rounds
- Line 376: # NOTE: avoiding full parsing routine via from_string().checksum,
- Line 449: # NOTE: using 25/75 weighting of builtin & os_crypt backends
- Line 517: # NOTE: using 25/75 weighting of builtin & os_crypt backends

### \server\venv\Lib\site-packages\passlib\handlers\sun_md5_crypt.py
- Line 75: # NOTE: these sequences are pre-calculated iteration ranges used by X & Y loops w/in rounds function below
- Line 95: # NOTE: spec seems to imply max 'rounds' is 2**32-1
- Line 98: # NOTE: algorithm 'salt' includes full config string w/ trailing "$"
- Line 102: # NOTE: many things in this function have been inlined (to speed up the loop
- Line 106: #       * all accesses to a given bit have been inlined using the formula
- Line 109: #       * the calculation of coinflip value R has been inlined
- Line 111: #       * the conditional division of coinflip value V has been inlined as
- Line 114: #       * the i, i+3, etc iterations are precalculated in lists.
- Line 116: #       * the round-based conditional division of x & y is now performed
- Line 122: # NOTE: % appears to be *slightly* slower than &, so we prefer & if possible
- Line 162: # NOTE: same offsets as md5_crypt
- Line 225: # NOTE: docs say max password length is 255.
- Line 228: # NOTE: not sure if original crypt has a salt size limit,
- Line 236: max_rounds = 4294963199 ##2**32-1-4096
- Line 237: # XXX: ^ not sure what it does if past this bound... does 32 int roll over?
- Line 286: # NOTE: not sure if this is forbidden by spec or not;
- Line 345: # TODO: if we're on solaris, check for native crypt() support.
- Line 351: # NOTE: no reference for how sun_md5_crypt handles unicode

### \server\venv\Lib\site-packages\passlib\handlers\windows.py
- Line 97: _magic = b"KGS!@#$%"
- Line 117: # http://www.freerainbowtables.com/phpBB3/viewtopic.php?t=387&p=12163
- Line 126: # FIXME: just trusting ascii upper will work?
- Line 127: # and if not, how to do codepage specific case conversion?
- Line 129: # but *that* might not always be right.
- Line 209: ##    _hash_regex = re.compile(u"^(?P<lm>[0-9a-f]{32}):(?P<nt>[0-9][a-f]{32})$",
- Line 230: ##        # NOTE: verify against both in case encoding issue

### \server\venv\Lib\site-packages\passlib\tests\backports.py
- Line 18: # TODO: deprecate these exports in favor of "unittest.XXX"

### \server\venv\Lib\site-packages\passlib\tests\test_apache.py
- Line 29: # NOTE: this is used so we can test code which detects mtime changes,
- Line 30: #       without having to actually *pause* for that long.
- Line 72: # TODO: under py3, could trap the more specific FileNotFoundError
- Line 157: # NOTE: "default_scheme" option checked via set_password() test, among others
- Line 319: # NOTE: load_string() tested via from_string(), which is used all over this file
- Line 403: # lines that match "^\s*(#.*)?$" should be ignored
- Line 553: # NOTE: default_realm option checked via other tests.
- Line 610: # TODO: test set_password autosave

### \server\venv\Lib\site-packages\passlib\tests\test_apps.py
- Line 19: # NOTE: these tests are not really comprehensive,

### \server\venv\Lib\site-packages\passlib\tests\test_context.py
- Line 52: # TODO: these unittests could really use a good cleanup
- Line 302: # NOTE: "0x-1234" format used by Pyston 0.5.1 (support deprecated 2019-11)
- Line 310: # NOTE: load() is the workhorse that handles all policy parsing,
- Line 333: # NOTE: load_path() tested by from_path()
- Line 334: # NOTE: additional string tests done by from_string()
- Line 366: # FIXME: this isn't failing even in broken case, need to figure out
- Line 540: # XXX: allow handlers in deprecated list? not for now.
- Line 628: # XXX: sure we want to allow this ? maybe deprecate in future.
- Line 678: # NOTE: also checked under test_21
- Line 698: # NOTE: also checked under test_23
- Line 780: # NOTE: 'truncate_error' shouldn't be passed along...
- Line 802: # NOTE: vary_rounds shouldn't be passed along...
- Line 837: # NOTE: this is tested all throughout this test case.
- Line 850: # NOTE: ConfigParser for PY26 doesn't use OrderedDict,
- Line 868: self.assertRegex(dump, r"# NOTE: the 'unsalted_test_hash' handler\(s\)"
- Line 929: '$P$6........22zGEuacuPOqEpYPDeR0R/',  # NOTE: config string generated w/ rounds=1
- Line 949: self.assertRaises(KeyError, cc.genconfig, scheme="fake") # XXX: should this be ValueError?
- Line 974: # NOTE: as of 1.7, genhash is just wrapper for hash(),
- Line 987: self.assertRaises(KeyError, cc.genhash, 'secret', hash, scheme="fake") # XXX: should this be ValueError?
- Line 996: #      or handled under another test (e.g. context kwds?)
- Line 1006: # XXX: move this to copy() test?
- Line 1025: # TODO: should migrate these tests elsewhere, or remove them.
- Line 1028: #       def wrapper(secret, scheme=None, category=None, **kwds):
- Line 1031: #             handler = handler.using(**kwds)
- Line 1050: # NOTE: more thorough job of rounds limits done below.
- Line 1064: # NOTE: max rounds, etc tested in genconfig()
- Line 1067: self.assertRaises(KeyError, cc.hash, 'secret', scheme="fake") # XXX: should this be ValueError?
- Line 1141: self.assertRaises(KeyError, cc.verify, 'secret', refhash, scheme="fake") # XXX: should this be ValueError?
- Line 1212: self.assertRaises(KeyError, cc.needs_update, refhash, scheme="fake") # XXX: should this be ValueError?
- Line 1270: self.assertRaises(KeyError, cc.verify_and_update, 'secret', refhash, scheme="fake") # XXX: should this be ValueError?
- Line 1280: # NOTE: postgres_md5 hash supports 'user' context kwd, which is used for this test.
- Line 1352: # TODO: now that rounds generation has moved out of _CryptRecord to HasRounds,
- Line 1357: # NOTE: the follow tests check how _CryptRecord handles
- Line 1392: # NOTE: formerly issued a warning in passlib 1.6, now just a wrapper for .replace()
- Line 1417: # NOTE: formerly issued a warning in passlib 1.6, now just a wrapper for .using()
- Line 1446: # TODO: test default falls back to mx / mn if handler has no default.
- Line 1460: # NOTE: as of v1.7, these are clipped w/ a warning instead...
- Line 1566: # NOTE: this runs enough times the min and max *should* be hit,
- Line 1607: # TODO: test dummy_verify() invoked by .verify() when hash is None,

### \server\venv\Lib\site-packages\passlib\tests\test_context_deprecated.py
- Line 40: # TODO: need to test user categories w/in all this
- Line 51: # NOTE: copy of this is stored in file passlib/tests/sample_config_1s.cfg
- Line 75: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 86: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 96: default = "md5_crypt", # NOTE: passlib <= 1.5 was handler obj.
- Line 97: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 128: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 147: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 170: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 173: # NOTE: not maintaining backwards compat for rendering to "5%"
- Line 200: # XXX: should deprecated return the actual handlers in this case?
- Line 260: # NOTE: this is separate so it can also run under GAE
- Line 325: # pass it a dict (NOTE: make a copy to detect in-place modifications)
- Line 435: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 443: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 451: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 457: # NOTE: not maintaining backwards compat for rendering to "10%"
- Line 463: # NOTE: not maintaining backwards compat for rendering to "5%"
- Line 530: s = pa.to_string() # NOTE: can't compare string directly, ordering etc may not match
- Line 598: # NOTE: was not able to maintain backward compatibility with this...
- Line 603: # NOTE: was not able to maintain backward compatibility with this...
- Line 673: # NOTE: 'scheme' kwd is deprecated...

### \server\venv\Lib\site-packages\passlib\tests\test_crypto_builtin_md4.py
- Line 123: # NOTE: we trust ssl got md4 implementation right,

### \server\venv\Lib\site-packages\passlib\tests\test_crypto_des.py
- Line 69: # NOTE: this assumes expand_des_key() sets parity bits to 0

### \server\venv\Lib\site-packages\passlib\tests\test_crypto_digest.py
- Line 35: # NOTE: there was an older "RIPEMD" & "RIPEMD-128", but python treates "RIPEMD"
- Line 194: # TODO: write full test of compile_hmac() -- currently relying on pbkdf2_hmac() tests
- Line 221: if not JYTHON: # FIXME: find out why not jython, or reenable this.
- Line 263: # NOTE: relying on tox to verify this works under all the various backends.
- Line 522: # NOTE: hashlib actually throws error for keylen>=MAX_SINT32,
- Line 523: #       but pbkdf2 forbids anything > MAX_UINT32 * digest_size

### \server\venv\Lib\site-packages\passlib\tests\test_crypto_scrypt.py
- Line 93: # NOTE: p value should be ignored, so testing w/ random inputs.
- Line 102: # NOTE: bmix() call signature currently takes in list of 32*r uint32 elements,
- Line 107: # NOTE: * n & p values should be ignored, so testing w/ rng inputs.
- Line 108: #       * target buffer contents should be ignored, so testing w/ random inputs.
- Line 127: # NOTE: this pair corresponds to the first input & output pair
- Line 129: # NOTE: original reference lists input & output as two separate 64 byte blocks.
- Line 130: #       current internal representation used by bmix() uses single 2*r*16 array of uint32,
- Line 252: # NOTE: salsa2() currently operates on lists of 16 uint32 elements,
- Line 260: # NOTE: this pair corresponds to the first input & output pair
- Line 345: # NOTE: the following are skipped for all backends unless TEST_MODE="full"
- Line 354: # NOTE: the following are always skipped for the builtin backend,
- Line 387: # maybe this means it should go somewhere else?
- Line 407: # NOTE: keeping values low due to builtin test
- Line 520: # reject r*p >= 2**30
- Line 536: # reject r*p >= 2**30
- Line 554: self.assertEqual(len(run_scrypt(ksize)), 2*ksize) # 2 hex chars per output
- Line 593: # NOTE: builtin version runs VERY slow (except under PyPy, where it's only 11x slower),

### \server\venv\Lib\site-packages\passlib\tests\test_ext_django.py
- Line 40: # NOTE: we don't want to set up entirety of django, so not using django.setup() directly.
- Line 61: # NOTE: required for django >= 1.9
- Line 67: # NOTE: this is mainly here as place to mark what version it was run against before release.
- Line 92: # NOTE: this mainly just overrides .save() to test commit behavior.
- Line 94: # NOTE: .Meta.app_label required for django >= 1.9
- Line 109: # NOTE: ignoring update_fields for test purposes
- Line 158: # TODO: push this to passlib.apps django contexts
- Line 181: # XXX: replace this with code that interrogates default django config directly?
- Line 184: #      or maybe add a "get_django_context(django_version)" helper to passlib.apps?
- Line 336: # XXX: rename to ExtensionFixture?
- Line 337: # NOTE: would roll this into _ExtensionSupport class;
- Line 401: # NOTE: if this test fails, it means we're not accounting for
- Line 457: # XXX: this take a while to run. what could be trimmed?
- Line 459: # TODO: add get_hasher() checks where appropriate in tests below.
- Line 486: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 509: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 528: # XXX: test make_password() ?
- Line 530: # TODO: is_password_usable()
- Line 541: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 583: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 605: # TODO: is_password_usable()
- Line 622: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 645: # TODO: is_password_usable()
- Line 667: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 690: # TODO: is_password_usable()
- Line 719: # NOTE: import has to be done w/in method, in case monkeypatching is applied by setUp()
- Line 782: # NOTE: needs_update kept separate in case we need to test rounds.
- Line 818: # TODO: get_hasher()
- Line 899: # NOTE: this sets things up, and spot checks two methods,
- Line 901: # TODO: test unpatch behavior honors flag.
- Line 941: # NOTE: present but not enabled by default in django as of 2.1
- Line 969: # XXX: should this throw ValueError instead, to match django?

### \server\venv\Lib\site-packages\passlib\tests\test_ext_django_source.py
- Line 27: # hack up the some of the real django tests to run w/ extension loaded,
- Line 41: # or note why we failed.
- Line 166: # HACK: to fix this, inserting wrapper around a bunch of context
- Line 213: # NOTE: could rely on addCleanup() instead, but need py26 compat
- Line 219: # *want to minimize these as much as possible*
- Line 226: #      that anyways? get_hashers_by_algorithm() should throw KeyError, right?
- Line 229: # TODO: support wrapping django's harden-runtime feature?

### \server\venv\Lib\site-packages\passlib\tests\test_handlers.py
- Line 120: # TODO: find an authoritative source of test vectors
- Line 224: # *do* signal as needing updates
- Line 242: # TODO: find an authortative source of test vectors
- Line 288: ('4lpHa N|_|M3r1K W/ Cur5Es: #$%(*)(*%#', 'sNYqfOyauIyic'),
- Line 432: # HACK: have to recreate hasher, since underlying HashInfo has changed.
- Line 641: # TODO: integrate EncodingHandlerMixin
- Line 651: # NOTE: this hash currently rejects the empty string.
- Line 662: # NOTE: this hash currently rejects the empty string.
- Line 669: # NOTE: since the ldap_{crypt} handlers are all wrappers, don't need
- Line 681: ('4lpHa N|_|M3r1K W/ Cur5Es: #$%(*)(*%#', '{CRYPT}$1$jQS7o98J$V6iTcr71CGgwW2laf17pi1'),
- Line 698: # NOTE: this isn't for testing the hash (see ldap_md5_crypt note)
- Line 788: # NOTE: would need to patch HandlerCase to coerce hashes
- Line 795: ('4lpHa N|_|M3r1K W/ Cur5Es: #$%(*)(*%#', '$1$jQS7o98J$V6iTcr71CGgwW2laf17pi1'),
- Line 856: (("1234qwer!@#$", "Administrator"), "7b69d06ef494621e3f47b9802fe7776d"),
- Line 925: # FIXME: fix UT framework - this hash is sensitive to password case, but verify() is not
- Line 940: # http://stackoverflow.com/questions/173329/how-to-decrypt-a-password-from-sql-server
- Line 957: # (????, '0x0100813F782D66EF15E40B1A3FDF7AB88B322F51401A87D8D3E3A8483C4351A3D96FC38499E6CDD2B6F?????????'),
- Line 1028: # (???, '0x01004086CEB6301EEC0A994E49E30DA235880057410264030797'),
- Line 1212: # TODO: get more test vectors (especially ones which properly test unicode)
- Line 1250: # TODO: find more test vectors (especially ones which properly test unicode)
- Line 1256: ("SyStEm123!@#", "S:450F957ECBE075D2FA009BA822A9E28709FBC3DA82B44D284DDABEC14C42"),
- Line 1262: # source?
- Line 1316: # TODO: integrate EncodingHandlerMixin
- Line 1399: # NOTE: all roundup hashes use PrefixWrapper,
- Line 1458: ('4lpHa N|_|M3r1K W/ Cur5Es: #$%(*)(*%#', '$5$rounds=11944$9dhlu07dQMRWvTId$LyUI5VWkGFwASlzntk1RLurxX54LUhgAcJZIt0pYGT7'),
- Line 1465: # 1004..1012 (42*24=1008 +/- 4) to ensure no mistakes were made.
- Line 1556: ('4lpHa N|_|M3r1K W/ Cur5Es: #$%(*)(*%#', '$6$rounds=11065$5KXQoE1bztkY5IZr$Jf6krQSUKKOlKca4hSW07MSerFFzVIZt/N3rOTsUgKqp7cUdHrwV8MoIVNCk9q9WL3ZRMsdbwNXpVk0gVxKtz1'),
- Line 1621: # TODO: this scheme needs some real test vectors, especially due to
- Line 1625: # http://forums.halcyoninc.com/showthread.php?t=258
- Line 1635: # http://www.cuddletech.com/blog/pivot/entry.php?id=778
- Line 1646: # FIXME: password unknown
- Line 1651: # XXX: this has 9 salt chars unlike all other hashes. is that valid?
- Line 1652: # FIXME: password unknown
- Line 1684: # NOTE: this is just a guess re: config w/ no suffix,
- Line 1712: # NOTE: not sure what correct behavior is, so forbidding format for now.
- Line 1716: # NOTE: not sure what correct behavior is, so forbidding format for now.
- Line 1737: #    accepts_all_hashes = True # TODO: turn this off.
- Line 1740: # everything should hash to "!" (or "*" on BSD),
- Line 1787: # *everything* should hash to "!", and nothing should verify

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_argon2.py
- Line 192: # constraint violation: m < 8 * p
- Line 223: # NOTE: keyid parameter currently not supported by official argon2 hash parser,
- Line 232: # NOTE: argon2 c library doesn't support passing in a data parameter to argon2_hash();
- Line 233: #       but argon2_verify() appears to parse that info... but then discards it (!?).
- Line 299: #      maybe switch argon2 class to use that mixin instead of "type" kwd?
- Line 322: # XXX: this is policy "ident" uses, maybe switch to it?
- Line 324: # self.assertRaises(TypeError, handler, **kwds)
- Line 337: #      maybe switch argon2 class to use that mixin instead of "type" kwd?
- Line 359: # check subcls actually *generates* default type,
- Line 398: # TODO: make this fatal, and add refs for other version.
- Line 433: # TODO: fuzz parallelism, digest_size
- Line 488: # XXX: make this controlled by env var?

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_bcrypt.py
- Line 41: # note that this omits any hashes that depend on crypt_blowfish's
- Line 74: # NOTE: see assert_lacks_8bit_bug() for origins of this test vector.
- Line 81: # NOTE: if backend is vulnerable, password will hash the same as '0'*72
- Line 83: #       rather than same as ("0123456789"*8)[:72]
- Line 99: ('~!@#$%^&*()      ~!@#$%^&*()PNBFRD',
- Line 149: "$2a$12$EXRkfkdmXn!gzds2SSitu.MW9.gAVqa9eLS1//RYtYCmB1eLHg.9q",
- Line 157: # NOTE: salts with padding bits set are technically malformed,
- Line 354: # prevents reccurrence of issue 25 (https://code.google.com/p/passlib/issues/detail?id=25)
- Line 410: # NOTE: see padding test above for details about issue this detects
- Line 478: # NOTE: test_60_truncate_size() handles this already, this is just for overkill :)
- Line 488: # TODO: convert to v2 format
- Line 506: # NOTE: test_60_truncate_size() handles this already, this is just for overkill :)

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_cisco.py
- Line 38: # http://www.perlmonks.org/index.pl?node_id=797623
- Line 48: # www.freerainbowtables.com/phpBB3/viewtopic.php?f=2&t=1441
- Line 103: # and the exact version is noted next to each hash.
- Line 106: # Those without a note are generally an extrapolation,
- Line 110: # * One such case is usernames w/ 1 & 2 digits --
- Line 145: # NOTE: remaining reference vectors for 13+ char passwords
- Line 152: # * ssh cli stripping non-ascii chars entirely
- Line 153: # * ASDM web iface double-encoding utf-8 strings
- Line 203: # NOTE: See 'pix_asa_shared_hashes' for general PIX+ASA vectors,
- Line 204: #       and general notes about the 'passlib reference vectors' test set.
- Line 209: # TODO: these need confirming w/ an actual PIX system.
- Line 271: # NOTE: See 'pix_asa_shared_hashes' for general PIX+ASA vectors,
- Line 272: #       and general notes about the 'passlib reference vectors' test set.
- Line 276: # NOTE: past this point, ASA pads to 32 bytes instead of 16
- Line 326: # NOTE: past this point, ASA pads to 32 bytes instead of 16
- Line 349: # NOTE: past this point, ASA stops appending the username AT ALL,
- Line 358: # NOTE: this is max size that ASA allows, and throws error for larger
- Line 377: # http://mccltd.net/blog/?p=1034
- Line 404: # source ?

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_django.py
- Line 42: #: TODO: for a bunch of the tests below, this is just max version where
- Line 45: #: XXX: change this to "disabled_in_django_version" instead?
- Line 86: #      should verify it's *NOT* recognized
- Line 101: #      should verify it's *NOT* recognized
- Line 104: name = self.handler.django_name # set for all the django_* handlers
- Line 124: # *everything* should hash to "!", and nothing should verify
- Line 296: # NOTE: the following have been cloned from _bcrypt_test()
- Line 311: # XXX: enable this to check 2a / 2b?
- Line 346: # NOTE: the following have been cloned from _bcrypt_test()
- Line 361: # XXX: enable this to check 2a / 2b?
- Line 371: # NOTE: most of this adapted from _base_argon2_test & argon2pure test
- Line 404: # override default since django only uses type I (see note in class)

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_pbkdf2.py
- Line 20: # NOTE: since these are all wrappers for the pbkdf2_{digest} hasehs,
- Line 182: # TODO: need a bunch more reference vectors from some real
- Line 296: # XXX: anything else that's not tested by the other code already?
- Line 336: # NOTE: this just does a light test, since derive_digest
- Line 361: # NOTE: this just does a light test that saslprep() is being
- Line 408: # *currently* shouldn't need update, has superset of algs required by handler2

### \server\venv\Lib\site-packages\passlib\tests\test_handlers_scrypt.py
- Line 84: # r*p too large

### \server\venv\Lib\site-packages\passlib\tests\test_hosts.py
- Line 20: # NOTE: these tests are not really comprehensive,

### \server\venv\Lib\site-packages\passlib\tests\test_pwd.py
- Line 46: #     self.assertEqual(_total_self_info("a" * 8), 0)
- Line 49: #     self.assertEqual(_total_self_info("ab" * 8), 16)
- Line 52: #     self.assertEqual(_total_self_info("abcd" * 8), 64)
- Line 116: # there are 3**3=27 possible combinations
- Line 123: # TODO: test rng option

### \server\venv\Lib\site-packages\passlib\tests\test_registry.py
- Line 23: # NOTE: these are defined outside of test case
- Line 90: # NOTE: this messes w/ internals of registry, shouldn't be used publically.
- Line 127: # TODO: check lazy load which calls register_crypt_handler (warning should be issued)

### \server\venv\Lib\site-packages\passlib\tests\test_totp.py
- Line 47: # NOTE: for randtime() below,
- Line 48: #       * want at least 7 bits on fractional side, to test fractional times to at least 0.01s precision
- Line 49: #       * want at least 32 bits on integer side, to test for 32-bit epoch issues.
- Line 50: #       most systems *should* have 53 bit mantissa, leaving plenty of room on both ends,
- Line 69: # * year out of range for datetime:
- Line 73: # * int out of range for host's gmtime/localtime:
- Line 76: # * int out of range for host's time_t:
- Line 102: #: This is frequently ~2**37 on 64 bit, and ~2**31 on 32 bit systems.
- Line 106: return (raw_size * 8 + 4) // 5
- Line 203: # TODO: test secrets_path
- Line 232: # TODO: test 'cost' param
- Line 302: # XXX: should this check salt_size?
- Line 371: # this should take (2**3=8) times as long
- Line 375: # TODO: rework timing test here to inject mock pbkdf2_hmac() function instead;
- Line 392: # TODO: this class is separate from TotpTest due to historical issue,
- Line 449: # NOTE: has (1/5)**10 odds of failure
- Line 457: # NOTE: has (1/3)**10 odds of failure
- Line 508: # NOTE: while appendix B states same key used for all tests, the reference
- Line 510: #       and uses *that* as the secret... so that's what we're doing here.
- Line 573: # NOTE: not re-using otp between calls so that stateful methods
- Line 693: # TODO: test using() w/ 'digits', 'alg', 'issue', 'wallet', **wallet_kwds
- Line 715: # NOTE: reading time w/ normalize_time() to make sure custom .now actually has effect.
- Line 728: # NOTE: TOTP() constructor invokes this as part of test, using up counter values 124 & 125
- Line 990: def assertVerifyMatches(self, expect_skipped, token, time,  # *
- Line 993: # NOTE: TotpMatch return type tested more throughly above ^^^
- Line 1004: def assertVerifyRaises(self, exc_class, token, time,  # *
- Line 1008: # NOTE: TotpMatch return type tested more throughly above ^^^
- Line 1048: # TODO: test window values that aren't multiples of period
- Line 1083: # TODO: test skew + larger window
- Line 1167: # NOTE: since this is thin wrapper around .from_source() and .match(),
- Line 1194: source1uri = 'otpauth://totp/Label?secret=otxl2f5cctbprpzx'
- Line 1207: otp = from_source(u("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1212: otp = from_source(b"otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1258: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1273: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=jbswy3dpehpk3pxp&"
- Line 1278: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?digits=6")
- Line 1281: self.assertRaises(Base32DecodeError, from_uri, "otpauth://totp/Example:alice@google.com?"
- Line 1289: otp = from_uri("otpauth://totp/Provider1:Alice%20Smith?secret=JBSWY3DPEHPK3PXP&"
- Line 1295: # (note url has leading space before 'alice') -- taken from KeyURI spec
- Line 1296: otp = from_uri("otpauth://totp/Big%20Corporation%3A%20alice@bigco.com?"
- Line 1306: otp = from_uri("otpauth://totp/alice@bigco.com?secret=JBSWY3DPEHPK3PXP&issuer=Big%20Corporation")
- Line 1312: "otpauth://totp/Provider1:alice?secret=JBSWY3DPEHPK3PXP&issuer=Provider2")
- Line 1319: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256")
- Line 1323: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?"
- Line 1331: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&digits=8")
- Line 1335: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&digits=A")
- Line 1336: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&digits=%20")
- Line 1337: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&digits=15")
- Line 1344: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&period=63")
- Line 1348: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?"
- Line 1351: self.assertRaises(ValueError, from_uri, "otpauth://totp/Example:alice@google.com?"
- Line 1362: otp = from_uri("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1377: "otpauth://totp/Example%20Org:alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1385: "otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP")
- Line 1390: "otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP")
- Line 1395: "otpauth://totp/Example%20Org:alice@google.com?secret=JBSWY3DPEHPK3PXP"
- Line 1408: "otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1415: "otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1422: "otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP&"
- Line 1559: # don't serialize default issuer *even if explicitly set*
- Line 1581: # TODO: to_dict()
- Line 1595: # TODO: from_json() / to_json().

### \server\venv\Lib\site-packages\passlib\tests\test_utils.py
- Line 22: # NOTE: could test xor_bytes(), but it's exercised well enough by pbkdf2 test
- Line 51: # NOTE: not comprehensive, just tests the basic behavior
- Line 119: # NOTE: the following parts are non-deterministic,
- Line 138: # NOTE: decoding this due to py3 bytes
- Line 184: # NOTE: failures here should be investigated.  usually means one of:
- Line 191: # NOTE: trusting hasher class works properly (should have been verified using it's own UTs)
- Line 257: # NOTE: this test is kind of over the top, but that's only because
- Line 326: # TODO: add some tests to ensure we take THETA(strlen) time.
- Line 328: # NOTE: below code was used to generate stats for analysis
- Line 332: ##correct =   u"abcdefgh"*(1<<4)
- Line 340: ##        supplied = incorrect * m
- Line 523: # * \xaa byte is too many continuation byte after \xff start byte
- Line 524: # * \xab byte doesn't have preceding start byte
- Line 697: # NOTE: most Base64Engine testing done via _Base64Test subclasses below.
- Line 913: enc_size = (4*size+2)//3
- Line 931: raw_size = 3*size//4
- Line 947: # NOTE: this test relies on encode_bytes() always returning clear
- Line 981: # NOTE: these tests assume normal encode/decode has been tested elsewhere.
- Line 1090: # NOTE: this isn't multiple of 6, it has 2 padding bits appended
- Line 1115: # NOTE: testing H64 & H64Big should be sufficient to verify

### \server\venv\Lib\site-packages\passlib\tests\test_utils_handlers.py
- Line 118: # NOTE: have to support hash=None since this is test of legacy 1.5 api
- Line 207: # NOTE: this could be turned back on if we test _norm_checksum() directly...
- Line 230: # NOTE: this could be turned back on if we test _norm_checksum() directly...
- Line 307: # TODO: test HasRawSalt mixin
- Line 319: # NOTE: really is testing _init_rounds(), could dup to test _norm_rounds() via .replace
- Line 532: # NOTE: this just tests some existing GenericHandler classes
- Line 588: # NOTE: this just tests some existing GenericHandler classes
- Line 600: # NOTE: +3 comes from int(math.log(.1,2)),
- Line 611: # TODO: handle fshp correctly, and other glitches noted in code.
- Line 766: self.assertEqual(h.ident_values, None) # TODO: should output (u("?P$"), u("?H$")))
- Line 838: # TODO: provide data samples for algorithms

### \server\venv\Lib\site-packages\passlib\tests\test_utils_pbkdf2.py
- Line 39: # NOTE: there was an older "RIPEMD" & "RIPEMD-128", but python treates "RIPEMD"

### \server\venv\Lib\site-packages\passlib\tests\utils.py
- Line 51: # XXX: is there better way to do this?
- Line 61: # NOTE: this is hack to deal w/ filesystems whose mtime resolution is >= 1s,
- Line 114: # FIXME: I've been lazy, should probably just add 'relaxed' kwd
- Line 172: #      for now just hacking in the cases we encounter in testing.
- Line 196: # XXX: also require GenericHandler for this branch?
- Line 331: # hack things so nose and ut2 both skip subclasses who have
- Line 336: # NOTE: this attr is technically a unittest2 internal detail.
- Line 346: # flag to skip *this* class
- Line 370: # TODO: may want to filter out a few of this, but not blanket filter...
- Line 374: # TODO: should be cleaned in 2.0, when support will be dropped.
- Line 399: # FIXME: this ignores 'msg'
- Line 455: # FIXME: should use a stdlib call to resolve this back
- Line 489: # TODO: make this display better diff of *which* warnings did not match
- Line 610: # NOTE: checking PYTHONHASHSEED, because if that's set,
- Line 616: # XXX: would it be better to print() this?
- Line 643: # * TestCase.subTest() wasn't added until Py34; so for older python versions,
- Line 647: # * as 2020-10-08, .subTest() doesn't play nicely w/ .skipTest();
- Line 656: # NOTE: this hack will miss parent params if called from nested .subTest()
- Line 687: # XXX: check for "failed" state in ``self._outcome`` before writing this?
- Line 737: # NOTE: conditional on qualname for PY2 compat
- Line 854: # flag/hack to filter PasslibHashWarning issued by test_72_configs()
- Line 954: # TODO: rename to do_hash() to match new API
- Line 1071: # NOTE: skipping this if create_backend_case() signalled we're skipping backend
- Line 1123: # XXX: any more checks needed?
- Line 1133: # NOTE: prior to 1.7 could return None, but that's no longer allowed.
- Line 1149: # NOTE: changed as of 1.7 -- previously, .verify() should have
- Line 1160: # NOTE: changed as of 1.7 -- genconfig() previously might return None,
- Line 1172: # NOTE: other info attrs should match as well, just testing basic behavior.
- Line 1173: # NOTE: mixin-specific args like using(min_rounds=xxx) tested later.
- Line 1346: # NOTE: skipping warning if default salt size is already maxed out
- Line 1366: # XXX: replace this with bitsize() method?
- Line 1370: # FIXME: this may be off for case-insensitive hashes, but that accounts
- Line 1378: # odds of picking 'n' identical salts at random is '(.5**salt_bits)**n'.
- Line 1379: # we want to pick the smallest N needed s.t. odds are <1/10**d, just
- Line 1430: # NOTE: skipping this for hashes like argon2 since max_salt_size takes WAY too much memory
- Line 1515: # NOTE: cisco_type7 uses 'int'
- Line 1639: # TODO: check relaxed mode clips min-1
- Line 1658: # TODO: check relaxed mode clips max+1
- Line 1671: # hack to bypass bsdi-crypt's "odd rounds only" behavior, messes up this test
- Line 1687: # hack to avoid even numbered rounds
- Line 1771: # NOTE: formerly issued a warning in passlib 1.6, now just a wrapper for .using()
- Line 1831: # NOTE: formerly issued a warning in passlib 1.6, now just a wrapper for .using()
- Line 1856: # XXX: are there any other cases that need testing?
- Line 1867: # XXX: make this a warning if min is implicit?
- Line 1871: # XXX: make this a warning if max is implicit?
- Line 2029: "cls.ident_aliases keys must be unicode:") # XXX: allow ints?
- Line 2053: # TODO: check various supported idents
- Line 2082: # check subcls actually *generates* default ident,
- Line 2120: # because resulting hashes wouldn't verify!
- Line 2150: # NOTE: this doesn't do an exhaustive search to verify algorithm
- Line 2198: # NOTE: this mode is currently an error in test_truncate_error_setting()
- Line 2308: # XXX: 2.0: what about 'verify-only' hashes once genhash() is removed?
- Line 2333: # xxx: move to password size limits section, above?
- Line 2454: # XXX: make this a requirement?
- Line 2529: # NOTE: most tests use default list of foreign hashes,
- Line 2568: # NOTE: changed in 1.7 -- previously 'None' would be accepted when config strings not supported.
- Line 2618: # TODO: would like to enhance what this test covers
- Line 2627: # TODO: figure out what invariants we can reliably parse,
- Line 2628: #       or maybe make subclasses specify that?
- Line 2675: # XXX: expand to test w/ checksum=False and/or sanitize=True?
- Line 2676: #      or read "_unsafe_settings"?
- Line 2889: # NOTE: skipping this under threading test,
- Line 2932: password_alphabet = u('qwertyASDF1234<>.@*#! \u00E1\u0259\u0411\u2113')
- Line 3211: # XXX: currently, any tests that use this are skipped entirely! (see issue 120)
- Line 3224: # hack to prevent recursion issue when .has_backend() is called
- Line 3287: # TODO: turn into decorator, and use mock library.
- Line 3364: # XXX: append "/" + platform.release() to string?
- Line 3366: #      instead of hack where we add major # as part of platform regex.
- Line 3415: # XXX: any reason not to use safe_crypt() here?  or just want to test against bare metal?
- Line 3493: # TODO: user size? kinda dicey, depends on algorithm.
- Line 3553: password_alphabet = u('qwerty1234<>.@*#! \u00AC')

### \server\venv\Lib\site-packages\passlib\tests\_test_bad_register.py
- Line 11: # NOTE: if passlib.tests is being run from symlink (e.g. via gaeunit),

### \server\venv\Lib\site-packages\passlib\utils\binary.py
- Line 95: #: NOTE: for efficiency, this is treated as singleton by some of the code
- Line 183: #      have it start outputing b64s_encode() instead? can use a64_decode() to retain backwards compat.
- Line 218: # NOTE: using upper case by default here, since 'I & L' are less
- Line 361: # TODO: support padding character
- Line 367: ##    if len(padding) != 1:
- Line 397: ##        out += padding * (3-tail)
- Line 428: # note: 4 msb of last byte are padding
- Line 433: # note: 2 msb of last byte are padding
- Line 467: # note: 4 lsb of last byte are padding
- Line 472: # note: 2 lsb of last byte are padding
- Line 492: ##    # TODO: add padding size check?
- Line 496: # only 6 bits left, can't encode a whole byte!
- Line 533: # NOTE: if tail == 2, 4 msb of v2 are ignored (should be 0)
- Line 535: # NOTE: 2 msb of v3 are ignored (should be 0)
- Line 568: # NOTE: if tail == 2, 4 lsb of v2 are ignored (should be 0)
- Line 570: # NOTE: 2 lsb of v3 are ignored (should be 0)
- Line 634: # NOTE: this assumes ascii-compat encoding, and that
- Line 669: # NOTE: if transposition does not use all bytes of source,

### \server\venv\Lib\site-packages\passlib\utils\decor.py
- Line 177: # NOTE: PY26 doesn't support "classmethod().__func__" directly...

### \server\venv\Lib\site-packages\passlib\utils\handlers.py
- Line 56: # TODO: a bunch of other things are commonly assumed in this namespace
- Line 362: def norm_integer(handler, value, min=1, max=None, # *
- Line 419: # NOTE: this provides the base implementation, which takes care of
- Line 422: # NOTE: 'relaxed' keyword is ignored here, but parsed so that subclasses
- Line 426: # TODO: straighten out class naming, repr, and .name attr
- Line 623: # XXX: do we need to set .relaxed for checksum coercion?
- Line 626: # NOTE: would like to make this classmethod, but fshp checksum size
- Line 632: # NOTE: by default this code assumes checksum should be unicode.
- Line 639: # NOTE: no clear route to reasonably convert unicode -> raw bytes,
- Line 669: # NOTE: subclasses may wish to use faster / simpler identify,
- Line 676: # does class specify a known unique prefix to look for?
- Line 681: # does class provide a regexp to use?
- Line 695: def from_string(cls, hash, **context): # pragma: no cover
- Line 725: # NOTE: this is only used by genconfig(), and will be removed in passlib 2.0
- Line 738: # hack to minimize cost of calculating real checksum
- Line 776: # NOTE: at this point, 'kwds' should just contain context_kwds subset
- Line 784: # NOTE: classes with multiple checksum encodings should either
- Line 801: # NOTE: 'kwds' should generally always be settings, so after this completes, *should* be empty.
- Line 805: # NOTE: this uses optional stub checksum to bypass potentially expensive digest generation,
- Line 827: # NOTE: subclasses should generally just wrap _calc_needs_update()
- Line 837: # NOTE: this just provides a stub, subclasses & mixins
- Line 882: # FIXME: this may not work for hashes with non-standard settings.
- Line 883: # XXX: how should this handle checksum/salt encoding?
- Line 889: #      only for whitelisted attrs? or make this whole method obsolete by reworking
- Line 890: #      so "hasher" object & it's attrs are public?
- Line 914: # FIXME: this may overestimate size due to padding bits (e.g. bcrypt)
- Line 915: # FIXME: this will be off by 1 for case-insensitive hashes.
- Line 938: # TODO: document _norm_hash()
- Line 978: # NOTE: prior to 1.6, StaticHandler required classes implement genhash
- Line 994: # NOTE: passing 'config=None' here even though not currently allowed by ifc,
- Line 995: #       since it *is* allowed under the old 1.5 ifc we're checking for here.
- Line 1047: # XXX: how to guess the entropy of a username?
- Line 1049: #      which has a few *very common* names and thus really low entropy;
- Line 1053: ##def bitsize(cls, **kwds):
- Line 1054: ##    info = super(HasUserContext, cls).bitsize(**kwds)
- Line 1068: # NOTE: GenericHandler.checksum_chars is ignored by this implementation.
- Line 1070: # NOTE: all HasRawChecksum code is currently part of GenericHandler,
- Line 1103: # NOTE: any aliases provided to norm_ident() as bytes
- Line 1107: # NOTE: relying on test_06_HasManyIdents() to verify
- Line 1140: # (NOTE: creates instance to run value through _norm_ident())
- Line 1187: # failure!
- Line 1188: # XXX: give this it's own error type?
- Line 1208: # XXX: implement a needs_update() helper that marks everything but default_ident as deprecated?
- Line 1287: # TODO: document _truncate_salt()
- Line 1288: # XXX: allow providing raw salt to this class, and encoding it?
- Line 1312: # TODO: could support using(min/max_desired_salt_size) via using() and needs_update()
- Line 1348: # NOTE: this is mainly useful for testing / debugging.
- Line 1419: # NOTE: split out mainly so sha256_crypt can subclass this
- Line 1450: # NOTE: allowing bytes under py2 so salt can be native str.
- Line 1483: # NOTE: some hashes (e.g. bcrypt) has structure within their
- Line 1501: # FIXME: this may overestimate size due to padding bits
- Line 1502: # FIXME: this will be off by 1 for case-insensitive hashes.
- Line 1522: # NOTE: all HasRawSalt code is currently part of HasSalt, using private
- Line 1597: #      to clarify role compared to min_desired_rounds / max_desired_rounds?
- Line 1602: # hack to pass info to _CryptRecord (will be removed in passlib 2.0)
- Line 1643: #      aliases, and have a separate 'require_rounds' parameter for this behavior?
- Line 1717: # TODO: deprecate / disallow vary_rounds=1.0
- Line 1737: # NOTE: min/max_desired_rounds are None if unset.
- Line 1768: assert 0 <= vary_rounds <= 1 # TODO: deprecate vary_rounds==1
- Line 1804: # NOTE: split out mainly so sha256_crypt & bsdi_crypt can subclass this
- Line 1885: # NOTE: this essentially estimates how many bits of "salt"
- Line 1889: #     rounds*(1-vary_rounds) ... rounds*(1+vary_rounds)
- Line 1891: #     log2(rounds*(1+vary_rounds)-rounds*(1-vary_rounds))
- Line 1893: #     1+log2(rounds*vary_rounds)
- Line 1918: # NOTE: subclasses should add "parallelism" to their settings_kwds
- Line 2284: #: should only be set to True in *one* subclass in hierarchy.
- Line 2340: # XXX: rename to ChecksumBackendMixin?
- Line 2391: # NOTE: not overwriting _calc_checksum() directly, so that classes can provide
- Line 2464: # XXX: should this inherit from PasswordHash?
- Line 2516: # XXX: what if ident includes parts of wrapped hash's ident?
- Line 2527: # TODO: look into way to fix the issues.
- Line 2551: # XXX: how will this interact with orig_prefix ?
- Line 2568: # XXX: how will this interact with orig_prefix ?
- Line 2583: # XXX: change this to proxy everything that doesn't start with "_"?
- Line 2625: # and we own it, modify *it* instead.
- Line 2626: # TODO: needs UTs
- Line 2627: # TODO: any other cases where wrapped is "owned"?
- Line 2638: # NOTE: assumes hash has been validated as unicode already
- Line 2642: # NOTE: always passing to handler as unicode, to save reconversion
- Line 2647: # NOTE: should usually be native string.
- Line 2691: # TODO: under 2.0, throw TypeError if config is None, rather than passing it through

### \server\venv\Lib\site-packages\passlib\utils\__init__.py
- Line 119: # XXX: move to .registry for passlib 2.0?
- Line 313: # XXX: should this be moved to passlib.crypto, or compat backports?
- Line 327: # NOTE:
- Line 348: # NOTE: the double-if construction below is done deliberately, to ensure
- Line 364: # TODO: use izip instead (but first verify it's faster than zip for this case)
- Line 385: # TODO: could check for cryptography package's version,
- Line 443: # XXX: support bytes (e.g. run through want_unicode)?
- Line 513: # XXX: should these have been caught by normalize?
- Line 567: # XXX: can any of these be sped up?
- Line 625: # * UTF8 bytes will have high two bits (0xC0) as one of:
- Line 632: # * UTF8 characters SHOULD always be 1 to 4 bytes, though they may be unbounded.
- Line 681: _ASCII_TEST_BYTES = b"\x00\n aA:#!\x7f"
- Line 867: # XXX: replace this with lazy-evaluated bug detection?
- Line 870: #: WARNING: if non-passlib code invokes crypt(), this lock won't be enough!
- Line 883: # returning NULL / None. examples include ":", ":0", "*0", etc.
- Line 890: # * pypy3 (as of v7.3.1) has a crypt which accepts bytes, or ASCII-only unicode.
- Line 891: # * whereas CPython3 (as of v3.9) has a crypt which doesn't take bytes,
- Line 925: # otherwise when crypt() does it's encoding, it'll hash the wrong bytes!
- Line 940: # NOTE: per issue 113, crypt() may return bytes in some odd cases.
- Line 1034: # NOTE:
- Line 1063: # NOTE: not available in some environments, e.g. GAE
- Line 1083: # NOTE: to reseed use ``rng.seed(genseed(rng))``
- Line 1092: # NOTE: would be nice if this was present in stdlib Random class
- Line 1102: # XXX: break into chunks for large number of bits?
- Line 1113: # NOTE: tests determined this is 4x faster than rng.sample(),
- Line 1127: # XXX: break into chunks for large number of letters?
- Line 1177: # XXX: change to use isinstance(obj, PasswordHash) under py26+?
- Line 1188: # XXX: change to use isinstance(obj, CryptContext)?
- Line 1193: ##    # NOTE: should also provide get_backend(), .has_backend(), and .backends attr

### \server\venv\Lib\site-packages\passlib\utils\compat\__init__.py
- Line 30: # NOTE: deprecated support 2019-11
- Line 100: # TODO: once we drop python 3.2 support, can use u'' again!
- Line 165: # FIXME: there has to be a better way to do this
- Line 237: ##def lrange(*a,**k):
- Line 238: ##    return list(range(*a,**k))
- Line 294: def error_from(exc,  # *,
- Line 342: # use unicode or bytes ?

### \server\venv\Lib\site-packages\pip\__main__.py
- Line 12: # This allows the usage python pip-*.whl/pip install pip-*.whl
- Line 14: # __file__ is pip-*.whl/pip/__main__.py

### \server\venv\Lib\site-packages\pip\__pip-runner__.py
- Line 7: # /!\ This version compatibility check section must be Python 2 compatible. /!\

### \server\venv\Lib\site-packages\pip\_internal\build_env.py
- Line 370: # FIXME: Consider direct URL?

### \server\venv\Lib\site-packages\pip\_internal\cache.py
- Line 280: # TODO: use DirectUrl.equivalent when

### \server\venv\Lib\site-packages\pip\_internal\configuration.py
- Line 52: # NOTE: Maybe use the optionx attribute to normalize keynames.
- Line 246: # NOTE: Dictionaries are not populated if not loaded. So, conditionals

### \server\venv\Lib\site-packages\pip\_internal\pyproject.py
- Line 112: # make a note to check that this requirement is present once

### \server\venv\Lib\site-packages\pip\_internal\cli\base_command.py
- Line 209: # TODO: Try to get these passing down from the command?

### \server\venv\Lib\site-packages\pip\_internal\cli\main.py
- Line 20: # Do not import and use main() directly! Using it directly is actively
- Line 42: # Note that this will exit the process after running, unlike a direct
- Line 52: # Note - we use a module of .*pkg_resources to cover

### \server\venv\Lib\site-packages\pip\_internal\cli\main_parser.py
- Line 72: # Note: parser calls disable_interspersed_args(), so the result of this

### \server\venv\Lib\site-packages\pip\_internal\cli\req_command.py
- Line 291: # NOTE: options.require_hashes may be set if --require-hashes is True

### \server\venv\Lib\site-packages\pip\_internal\commands\cache.py
- Line 214: #     {distribution}-{version}(-{build})?-{python}-{abi}-{platform}.whl
- Line 222: #   providing at least the version. Thus, we can just append `*.whl`
- Line 225: #   user is only providing the name. Thus, we append `-*.whl` to

### \server\venv\Lib\site-packages\pip\_internal\commands\inspect.py
- Line 60: # TODO tags? scheme?
- Line 70: # direct_url. Note that we don't have download_info (as in the installation

### \server\venv\Lib\site-packages\pip\_internal\commands\install.py
- Line 17: # this module would be imported *after* pip was replaced, resulting
- Line 615: # NOTE: There is some duplication here, with commands/check.py

### \server\venv\Lib\site-packages\pip\_internal\index\collector.py
- Line 339: # TODO: In the future, it would be nice if pip supported PEP 691

### \server\venv\Lib\site-packages\pip\_internal\index\package_finder.py
- Line 540: yank_value = -1 * int(link.is_yanked)  # -1 for yanked.

### \server\venv\Lib\site-packages\pip\_internal\locations\base.py
- Line 16: # FIXME doesn't account for venv linked to global site-packages
- Line 60: # FIXME: keep src in cwd for now (it is not a temporary folder)

### \server\venv\Lib\site-packages\pip\_internal\locations\_distutils.py
- Line 69: # NOTE: setting user or home has the side-effect of creating the home dir
- Line 86: # install_lib specified in setup.cfg should install *everything*
- Line 88: # platlib).  Note, i.install_lib is *always* set after
- Line 157: # buildout uses 'bin' on Windows too?

### \server\venv\Lib\site-packages\pip\_internal\locations\_sysconfig.py
- Line 17: # Notes on _infer_* functions.

### \server\venv\Lib\site-packages\pip\_internal\metadata\base.py
- Line 32: from pip._internal.utils.compat import stdlib_pkgs  # TODO: Move definition here.
- Line 162: # TODO: this property is relatively costly to compute, memoize it ?
- Line 172: # TODO: get project location from second line of egg_link file
- Line 483: if not info_rel.parts:  # info *is* root.

### \server\venv\Lib\site-packages\pip\_internal\models\index.py
- Line 16: # This is part of a temporary hack used to block installs of PyPI

### \server\venv\Lib\site-packages\pip\_internal\models\installation_report.py
- Line 51: # TODO: currently, the resolver uses the default environment to evaluate
- Line 54: # --platform, perhaps under the form of an environment_override field?

### \server\venv\Lib\site-packages\pip\_internal\models\link.py
- Line 55: # NB: we do not validate that the second group (.*) is a valid hex
- Line 60: r"[#&]({choices})=([^&]*)".format(
- Line 174: # `scheme://netloc/path?query#fragment`.
- Line 461: _egg_fragment_re = re.compile(r"[#&]egg=([^&]*)")
- Line 486: _subdirectory_fragment_re = re.compile(r"[#&]subdirectory=([^&]*)")
- Line 517: return posixpath.basename(self._url.split("#", 1)[0].split("?", 1)[0])

### \server\venv\Lib\site-packages\pip\_internal\models\selection_prefs.py
- Line 6: # TODO: This needs Python 3.10's improved slots support for dataclasses

### \server\venv\Lib\site-packages\pip\_internal\network\auth.py
- Line 530: # keyring. (Note that if the user responded "no" above, this member

### \server\venv\Lib\site-packages\pip\_internal\network\lazy_wheel.py
- Line 179: # TODO: Get range requests to be correctly cached

### \server\venv\Lib\site-packages\pip\_internal\network\session.py
- Line 292: return super().proxy_manager_for(proxy, **proxy_kwargs)  # type: ignore[misc]

### \server\venv\Lib\site-packages\pip\_internal\operations\freeze.py
- Line 223: comments=["## !! Could not determine repository location"],

### \server\venv\Lib\site-packages\pip\_internal\operations\prepare.py
- Line 111: # If a download dir is specified, is the file already downloaded there?
- Line 132: # If a download dir is specified, is the file already there and valid?
- Line 209: # If already downloaded, does its hash match?
- Line 261: # Is build isolation allowed?
- Line 265: # Should check build dependencies?
- Line 268: # Should hash-checking be required?
- Line 271: # Should install in user site-packages?
- Line 274: # Should wheels be downloaded lazily?
- Line 277: # How verbose should underlying tooling be?
- Line 280: # Are we using the legacy resolver?
- Line 423: #     the Name: field is not present, but it's noted in the raw_name docstring
- Line 568: # TODO: separate this part out from RequirementPreparer when the v1
- Line 569: # resolver can be removed!
- Line 642: # FIXME: https://github.com/pypa/pip/issues/11943

### \server\venv\Lib\site-packages\pip\_internal\operations\build\metadata.py
- Line 28: # Note that BuildBackendHookCaller implements a fallback for

### \server\venv\Lib\site-packages\pip\_internal\operations\build\metadata_editable.py
- Line 28: # Note that BuildBackendHookCaller implements a fallback for

### \server\venv\Lib\site-packages\pip\_internal\operations\install\wheel.py
- Line 87: """Replace #!python with #!/path/to/python
- Line 95: if not firstline.startswith(b"#!python"):
- Line 98: firstline = b"#!" + exename + os.linesep.encode("ascii")
- Line 178: # Add a note if any directory starts with ~
- Line 281: # a *different* version of Python the entry points will be wrong. The
- Line 293: # To add the level of hack in this section of code, in order to support
- Line 300: #   - pipX.Y, pipX, easy_install-X.Y will be generated and installed. Note
- Line 461: #   changed = files changed while installing (scripts #! line typically)

### \server\venv\Lib\site-packages\pip\_internal\req\constructors.py
- Line 309: # TODO: The is_installable_dir test here might not be necessary

### \server\venv\Lib\site-packages\pip\_internal\req\req_file.py
- Line 41: COMMENT_RE = re.compile(r"(^|\s+)#.*$")
- Line 103: # TODO: replace this with slots=True when dropping Python 3.9 support.
- Line 255: # FIXME: it would be nice to keep track of the source
- Line 487: # NOTE: mypy disallows assigning to a method
- Line 522: # TODO: handle space after '\'.
- Line 566: Respects # -*- coding: declarations on the retrieved files.
- Line 613: "PEP-263 style comment, e.g. '# -*- coding: %s -*-'",

### \server\venv\Lib\site-packages\pip\_internal\req\req_install.py
- Line 94: # populating source_dir is done by the RequirementPreparer. Note this
- Line 222: # Things that are valid for all kinds of requirements?
- Line 350: # FIXME: Is there a better place to create the build_dir? (hg and bzr

### \server\venv\Lib\site-packages\pip\_internal\req\req_uninstall.py
- Line 483: # FIXME: need a test for this elif block

### \server\venv\Lib\site-packages\pip\_internal\resolution\legacy\resolver.py
- Line 375: # Why don't we just raise here?
- Line 461: # NOTE

### \server\venv\Lib\site-packages\pip\_internal\resolution\resolvelib\candidates.py
- Line 229: # TODO performance: this means we iterate the dependencies at least twice,
- Line 374: # TODO: Supply reason based on force_reinstall and upgrade_strategy.
- Line 520: # (See note 2b in the class docstring)

### \server\venv\Lib\site-packages\pip\_internal\resolution\resolvelib\factory.py
- Line 194: # TODO: Check already installed candidate, and use it if the link and
- Line 613: # TODO: Are there more cases this needs to return True? Editable?
- Line 754: # The simplest case is when we have *one* cause that can't be

### \server\venv\Lib\site-packages\pip\_internal\resolution\resolvelib\provider.py
- Line 30: # Notes on the relationship between the provider, the factory, and the
- Line 67: # HACK: Theoretically we should check whether this identifier is a valid

### \server\venv\Lib\site-packages\pip\_internal\resolution\resolvelib\requirements.py
- Line 98: # risking a change in meaning. (Hopefully! Not all edge cases have

### \server\venv\Lib\site-packages\pip\_internal\resolution\resolvelib\resolver.py
- Line 265: # Time to visit the children!

### \server\venv\Lib\site-packages\pip\_internal\utils\compatibility_tags.py
- Line 43: # arch pattern didn't match (?!)
- Line 63: # arch pattern didn't match (?!)
- Line 74: # arch pattern didn't match (?!)

### \server\venv\Lib\site-packages\pip\_internal\utils\deprecation.py
- Line 13: from pip import __version__ as current_version  # NOTE: tests patch this name.

### \server\venv\Lib\site-packages\pip\_internal\utils\logging.py
- Line 268: # The "root" logger should match the "console" level *unless* we also need

### \server\venv\Lib\site-packages\pip\_internal\utils\misc.py
- Line 101: # Windows can raise spurious ENOTEMPTY errors. See #6426.

### \server\venv\Lib\site-packages\pip\_internal\utils\unpacking.py
- Line 105: # user/group/world?
- Line 238: # See PEP 706 note above.
- Line 272: # NOTE: This function can be removed once pip requires CPython ≥ 3.12.​
- Line 329: # member have any execute permissions for user/group/world?
- Line 353: # FIXME: handle?
- Line 354: # FIXME: magic signatures?

### \server\venv\Lib\site-packages\pip\_internal\vcs\git.py
- Line 36: r"(?:\.(\d+))?"  # Optional dot, patch.
- Line 37: r".*$"  # Suffix, including any pre- and post-release segments we don't care about.
- Line 162: # NOTE: We do not use splitlines here since that would split on other

### \server\venv\Lib\site-packages\pip\_internal\vcs\subversion.py
- Line 50: # Note: taken from setuptools.command.egg_info
- Line 60: # FIXME: should we warn?
- Line 157: # Note that using get_remote_call_options is not necessary here

### \server\venv\Lib\site-packages\pip\_vendor\__init__.py
- Line 39: # just mean we get a regular import error whenever pip *actually*

### \server\venv\Lib\site-packages\pip\_vendor\cachecontrol\controller.py
- Line 34: URI = re.compile(r"^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?")
- Line 227: # TODO: There is an assumption that the result will be a
- Line 251: # request. Note, this overrides what was in the response.
- Line 400: # A Vary header field-value of "*" always fails to match.

### \server\venv\Lib\site-packages\pip\_vendor\cachecontrol\filewrapper.py
- Line 67: # TODO: Add some logging here...

### \server\venv\Lib\site-packages\pip\_vendor\cachecontrol\heuristics.py
- Line 73: date=datetime(*date[:6], tzinfo=timezone.utc),  # type: ignore[index,misc]

### \server\venv\Lib\site-packages\pip\_vendor\cachecontrol\serialize.py
- Line 92: # Special case the '*' Vary value as it means we cannot actually

### \server\venv\Lib\site-packages\pip\_vendor\cachecontrol\caches\file_cache.py
- Line 59: # NOTE: This method should not change as some may depend on it.

### \server\venv\Lib\site-packages\pip\_vendor\distlib\compat.py
- Line 1: # -*- coding: utf-8 -*-
- Line 57: # _userprog = re.compile('^(.*)@(.*)$')
- Line 125: # When '*' is a fragment by itself, it matches a non-empty dotless
- Line 135: # Otherwise, '*' matches any dotless string, e.g. www*
- Line 562: *self.maps))  # reuses stored hash values if possible
- Line 1009: CONVERT_PATTERN = re.compile(r'^(?P<prefix>[a-z]+)://(?P<suffix>.*)$')

### \server\venv\Lib\site-packages\pip\_vendor\distlib\resources.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\pip\_vendor\distlib\scripts.py
- Line 1: # -*- coding: utf-8 -*-
- Line 41: FIRST_LINE_RE = re.compile(b'^#!.*pythonw?[0-9.]*([ \t].*)?$')
- Line 42: SCRIPT_TEMPLATE = r'''# -*- coding: utf-8 -*-
- Line 54: # new version. If we try to fetch a wrapper *after* that rename, the finder
- Line 87: # Keep the old name around (for now), as there is at least one project using it!
- Line 126: (contains a #! line)
- Line 130: return fp.read(2) == '#!'
- Line 162: # script; this *must* be invoked with the "safe" version of the
- Line 167: # Add 3 for '#!' prefix and newline suffix.
- Line 176: result = b'#!' + executable + post_interp + b'\n'
- Line 178: result = b'#!/bin/sh\n'

### \server\venv\Lib\site-packages\pip\_vendor\distlib\util.py
- Line 51: STRING_CHUNK = re.compile(r'([\s\w\.{}()*+#:;,/?!~`@$%^&=|<>\[\]-]+)')
- Line 258: if remaining and remaining[0] != '#':
- Line 401: # TODO check k, v for valid values
- Line 606: py_compile.compile(path, dpath, diagpath, True, **compile_kwargs)  # raise error
- Line 1922: # XXX what about the architecture? NT is Intel or Alpha,
- Line 1938: # XXX what about Alpha, SPARC, etc?

### \server\venv\Lib\site-packages\pip\_vendor\distlib\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\pip\_vendor\distro\distro.py
- Line 1: #!/usr/bin/env python
- Line 82: #: * Key: Value as defined in the os-release file, translated to lower case,
- Line 85: #: * Value: Normalized value.
- Line 94: #: * Key: Value as returned by the lsb_release command, translated to lower
- Line 97: #: * Value: Normalized value.
- Line 109: #: * Key: Value as derived from the file name of a distro release file,
- Line 112: #: * Value: Normalized value.
- Line 773: # NOTE: The idea is to respect order **and** have it set
- Line 1127: # * variable assignments: var=value
- Line 1128: # * commands or their arguments (not allowed in os-release)
- Line 1143: # preference to anything else Note that some distros purposefully
- Line 1284: # sure about the *-release files. Check common entries of

### \server\venv\Lib\site-packages\pip\_vendor\idna\intranges.py
- Line 5: in the original list?" in time O(log(# runs)).

### \server\venv\Lib\site-packages\pip\_vendor\msgpack\ext.py
- Line 108: # nanoseconds is zero and seconds < 2**32, so timestamp 32

### \server\venv\Lib\site-packages\pip\_vendor\msgpack\fallback.py
- Line 499: # TODO should we eliminate the recursion?
- Line 503: # TODO check whether we need to call `list_hook`
- Line 511: # TODO is the interaction between `list_hook` and `use_list` ok?
- Line 516: # TODO check whether we need to call hooks

### \server\venv\Lib\site-packages\pip\_vendor\msgpack\__init__.py
- Line 4: from .exceptions import *  # noqa: F403

### \server\venv\Lib\site-packages\pip\_vendor\packaging\markers.py
- Line 276: # Note: We create a Marker object without calling this constructor in

### \server\venv\Lib\site-packages\pip\_vendor\packaging\metadata.py
- Line 62: # formats offer some very basic primitives in *some* way then we can support
- Line 185: # *something* reasonable with malformed data.
- Line 190: # later on (if the caller is validating) so it doesn't *really*
- Line 202: parts.extend([""] * (max(0, 2 - len(parts))))  # Ensure 2 items
- Line 204: # TODO: The spec doesn't say anything about if the keys should be
- Line 401: # the value, since email *only* has strings, and our get_all() call
- Line 504: # To make the _process_* methods easier, we'll check if the value is None
- Line 805: description: _Validator[str | None] = _Validator()  # TODO 2.1: can be in body

### \server\venv\Lib\site-packages\pip\_vendor\packaging\requirements.py
- Line 29: # TODO: Can we test whether something is contained within a requirement?
- Line 30: #       If so how do we do that? Do we need to test against the _name_ of
- Line 31: #       the thing as well as the version? What about the markers?
- Line 32: # TODO: Can we normalize the name and extra name?

### \server\venv\Lib\site-packages\pip\_vendor\packaging\specifiers.py
- Line 120: (?<====)  # Only match for the identity operator
- Line 122: [^\s;)]*  # The arbitrary version can be just about anything,
- Line 132: (?<===|!=)            # Only match for equals and not equals
- Line 136: (?:[0-9]+!)?          # epoch
- Line 137: [0-9]+(?:\.[0-9]+)*   # release
- Line 142: \.\*  # Wild card syntax of .*
- Line 144: (?:                                  # pre release
- Line 150: (?:                                  # post release
- Line 153: (?:[-_\.]?dev[-_\.]?[0-9]*)?         # dev release
- Line 154: (?:\+[a-z0-9]+(?:[-_\.][a-z0-9]+)*)? # local
- Line 161: (?<=~=)               # Only match for the compatible operator
- Line 165: (?:[0-9]+!)?          # epoch
- Line 166: [0-9]+(?:\.[0-9]+)+   # release  (We have a + instead of a *)
- Line 167: (?:                   # pre release
- Line 173: (?:                                   # post release
- Line 176: (?:[-_\.]?dev[-_\.]?[0-9]*)?          # dev release
- Line 184: (?<!==|!=|~=)         # We have special cases for these
- Line 190: (?:[0-9]+!)?          # epoch
- Line 191: [0-9]+(?:\.[0-9]+)*   # release
- Line 192: (?:                   # pre release
- Line 198: (?:                                   # post release
- Line 201: (?:[-_\.]?dev[-_\.]?[0-9]*)?          # dev release
- Line 260: # The == specifier can include a trailing .*, if it does we
- Line 370: # is that ~=2.2 is equivalent to >=2.2,==2.*. This allows us to
- Line 395: # Get the normalized version string ignoring the trailing .*
- Line 463: # less than the spec version *and* it's not a pre-release of the same
- Line 493: # greater than the spec version *and* it's not a pre-release of the
- Line 928: # Note: This means that 1.0.dev1 would not be contained in something
- Line 938: # Note: This use of all() here means that an empty set of specifiers

### \server\venv\Lib\site-packages\pip\_vendor\packaging\tags.py
- Line 277: # pyston, ironpython, others?
- Line 378: # TODO: Need to care about 32-bit PPC for ppc64 through 10.2?
- Line 490: # if iOS is the current platform, ios_ver *must* be defined. However,

### \server\venv\Lib\site-packages\pip\_vendor\packaging\version.py
- Line 120: (?:(?P<epoch>[0-9]+)!)?                           # epoch
- Line 121: (?P<release>[0-9]+(?:\.[0-9]+)*)                  # release segment
- Line 122: (?P<pre>                                          # pre-release
- Line 128: (?P<post>                                         # post release
- Line 138: (?P<dev>                                          # dev release
- Line 145: (?:\+(?P<local>[a-z0-9]+(?:[-_\.][a-z0-9]+)*))?       # local version
- Line 546: # Versions without a pre-release (except as noted above) should sort after

### \server\venv\Lib\site-packages\pip\_vendor\packaging\_elffile.py
- Line 105: if data[self._p_idx[0]] != 3:  # Not PT_INTERP.

### \server\venv\Lib\site-packages\pip\_vendor\packaging\_manylinux.py
- Line 238: # https://sourceware.org/bugzilla/show_bug.cgi?id=24636

### \server\venv\Lib\site-packages\pip\_vendor\pkg_resources\__init__.py
- Line 1: # TODO: Add Generic type annotations to initialized collections.
- Line 122: _ResourceStream = Any  # TODO / Incomplete: A readable file-like object
- Line 498: # is this a Mac package?
- Line 517: # are they the same major version and machine type?
- Line 521: # is the required OS major update >= the provided one?
- Line 2031: # FIXME: 'ZipProvider._extract_resource' is too complex (12)
- Line 2743: # but keeping `*args` and `**kwargs` for backwards compatibility
- Line 2744: self.require(*args, **kwargs)  # type: ignore
- Line 2901: **kw: int,  # We could set `precedence` explicitly, but keeping this as `**kw` for full backwards and subclassing compatibility
- Line 2981: ex.add_note(info)  # PEP 678
- Line 2994: notes = "\n".join(getattr(ex, "__notes__", []))  # PEP 678
- Line 3161: **kw: int,  # We could set `precedence` explicitly, but keeping this as `**kw` for full backwards and subclassing compatibility
- Line 3201: # FIXME: 'Distribution.insert_on' is too complex (13)
- Line 3270: # ha!
- Line 3308: # TODO: remove this except clause when python/cpython#103632 is fixed.
- Line 3318: # Unsafely unpacking. But keeping **kw for backwards and subclassing compatibility
- Line 3319: return self.__class__(**kw)  # type:ignore[arg-type]
- Line 3409: # find the first stack frame that is *not* code in
- Line 3598: # TODO: Add a deadline?

### \server\venv\Lib\site-packages\pip\_vendor\platformdirs\api.py
- Line 87: path = os.path.join(base[0], *params)  # noqa: PTH118

### \server\venv\Lib\site-packages\pip\_vendor\platformdirs\windows.py
- Line 49: path = os.path.join(path, *params)  # noqa: PTH118
- Line 204: if sys.platform != "win32":  # only needed for mypy type checker to know that this code runs only on Windows

### \server\venv\Lib\site-packages\pip\_vendor\pygments\lexer.py
- Line 125: #: ``\*.html`` in this list.
- Line 214: # pip vendoring note: this code is not reachable by pip,
- Line 241: # text now *is* a unicode string
- Line 556: assert state[0] != '#', f"invalid state name {state!r}"
- Line 693: #: again. Note that if you push while in a combined state, the combined
- Line 808: # altered the state stack?
- Line 810: # CAUTION: callback must set ctx.pos!

### \server\venv\Lib\site-packages\pip\_vendor\pygments\regexopt.py
- Line 42: # multiple one-char strings? make a charset
- Line 50: if len(oneletter) > 1:  # do we have more than one oneletter string?
- Line 65: # is there a suffix?

### \server\venv\Lib\site-packages\pip\_vendor\pygments\unistring.py
- Line 56: Po = "!-#%-'*,.-/:-;?-@\\\\\xa1\xa7\xb6-\xb7\xbf\u037e\u0387\u055a-\u055f\u0589\u05c0\u05c3\u05c6\u05f3-\u05f4\u0609-\u060a\u060c-\u060d\u061b\u061e-\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964-\u0965\u0970\u09fd\u0a76\u0af0\u0c84\u0df4\u0e4f\u0e5a-\u0e5b\u0f04-\u0f12\u0f14\u0f85\u0fd0-\u0fd4\u0fd9-\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u166d-\u166e\u16eb-\u16ed\u1735-\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u1805\u1807-\u180a\u1944-\u1945\u1a1e-\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e-\u1c7f\u1cc0-\u1cc7\u1cd3\u2016-\u2017\u2020-\u2027\u2030-\u2038\u203b-\u203e\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205e\u2cf9-\u2cfc\u2cfe-\u2cff\u2d70\u2e00-\u2e01\u2e06-\u2e08\u2e0b\u2e0e-\u2e16\u2e18-\u2e19\u2e1b\u2e1e-\u2e1f\u2e2a-\u2e2e\u2e30-\u2e39\u2e3c-\u2e3f\u2e41\u2e43-\u2e4e\u3001-\u3003\u303d\u30fb\ua4fe-\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce-\ua8cf\ua8f8-\ua8fa\ua8fc\ua92e-\ua92f\ua95f\ua9c1-\ua9cd\ua9de-\ua9df\uaa5c-\uaa5f\uaade-\uaadf\uaaf0-\uaaf1\uabeb\ufe10-\ufe16\ufe19\ufe30\ufe45-\ufe46\ufe49-\ufe4c\ufe50-\ufe52\ufe54-\ufe57\ufe5f-\ufe61\ufe68\ufe6a-\ufe6b\uff01-\uff03\uff05-\uff07\uff0a\uff0c\uff0e-\uff0f\uff1a-\uff1b\uff1f-\uff20\uff3c\uff61\uff64-\uff65\U00010100-\U00010102\U0001039f\U000103d0\U0001056f\U00010857\U0001091f\U0001093f\U00010a50-\U00010a58\U00010a7f\U00010af0-\U00010af6\U00010b39-\U00010b3f\U00010b99-\U00010b9c\U00010f55-\U00010f59\U00011047-\U0001104d\U000110bb-\U000110bc\U000110be-\U000110c1\U00011140-\U00011143\U00011174-\U00011175\U000111c5-\U000111c8\U000111cd\U000111db\U000111dd-\U000111df\U00011238-\U0001123d\U000112a9\U0001144b-\U0001144f\U0001145b\U0001145d\U000114c6\U000115c1-\U000115d7\U00011641-\U00011643\U00011660-\U0001166c\U0001173c-\U0001173e\U0001183b\U00011a3f-\U00011a46\U00011a9a-\U00011a9c\U00011a9e-\U00011aa2\U00011c41-\U00011c45\U00011c70-\U00011c71\U00011ef7-\U00011ef8\U00012470-\U00012474\U00016a6e-\U00016a6f\U00016af5\U00016b37-\U00016b3b\U00016b44\U00016e97-\U00016e9a\U0001bc9f\U0001da87-\U0001da8b\U0001e95e-\U0001e95f"
- Line 125: # Hack to avoid combining this combining with the preceding high

### \server\venv\Lib\site-packages\pip\_vendor\pygments\util.py
- Line 19: (?: \s+      # optional in HTML5
- Line 144: >>> shebang_matches('#!/usr/bin/env python', r'python(2\.\d)?')
- Line 146: >>> shebang_matches('#!/usr/bin/python2.4', r'python(2\.\d)?')
- Line 148: >>> shebang_matches('#!/usr/bin/python-ruby', r'python(2\.\d)?')
- Line 150: >>> shebang_matches('#!/usr/bin/python/ruby', r'python(2\.\d)?')
- Line 152: >>> shebang_matches('#!/usr/bin/startsomethingwith python',
- Line 158: >>> shebang_matches('#!C:\\Python2.4\\Python.exe', r'python(2\.\d)?')
- Line 172: if first_line.startswith('#!'):

### \server\venv\Lib\site-packages\pip\_vendor\pygments\lexers\python.py
- Line 68: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 72: r'((\w+)((\.\w+)|(\[[^\]]+\]))*)?'  # field name
- Line 73: r'(\![sra])?'                       # conversion
- Line 74: r'(\:(.?[<>=\^])?[-+ ]?#?0?(\d+)?,?(\.\d+)?[E-GXb-gnosx%]?)?'
- Line 106: (r'\A#!.+$', Comment.Hashbang),
- Line 107: (r'#.*$', Comment.Single),
- Line 185: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 186: r'(\![sraf])?'     # conversion
- Line 190: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 191: r'(\![sraf])?'     # conversion
- Line 221: (r'(^[ \t]*)'              # at beginning of line + possible indentation
- Line 223: r'(?![ \t]*(?:'           # not followed by...
- Line 224: r'[:,;=^&|@~)\]}]|(?:' +  # characters and keywords that mean this isn't
- Line 436: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 454: (r'\A#!.+$', Comment.Hashbang),
- Line 455: (r'#.*$', Comment.Single),
- Line 582: (r'[a-zA-Z_]\w*', Name.Function, '#pop'),
- Line 586: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 669: (r'(?=>>>( |$))', Text, '#pop'),
- Line 715: # different tokens.  TODO: DelegatingLexer should support this
- Line 848: (r'#.*$', Comment),
- Line 938: (r'[a-zA-Z_]\w*', Name.Function, '#pop')
- Line 943: (r'([a-zA-Z_]\w*)(\s*)(?=[(:#=]|$)',
- Line 950: (r'(?=["\'])', Text, '#pop'),
- Line 955: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 964: (r'(\s+)(c?import)\b', bygroups(Whitespace, Keyword), '#pop'),
- Line 974: (r'%(\([a-zA-Z0-9]+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 1025: (r'#.*?$', Comment.Single),
- Line 1084: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'

### \server\venv\Lib\site-packages\pip\_vendor\pygments\lexers\_mapping.py
- Line 21: 'AntlrCSharpLexer': ('pip._vendor.pygments.lexers.parsers', 'ANTLR With C# Target', ('antlr-csharp', 'antlr-c#'), ('*.G', '*.g'), ()),
- Line 72: 'CSharpLexer': ('pip._vendor.pygments.lexers.dotnet', 'C#', ('csharp', 'c#', 'cs'), ('*.cs',), ('text/x-csharp',)),
- Line 165: 'FSharpLexer': ('pip._vendor.pygments.lexers.dotnet', 'F#', ('fsharp', 'f#'), ('*.fs', '*.fsi', '*.fsx'), ('text/x-fsharp',)),

### \server\venv\Lib\site-packages\pip\_vendor\pygments\lexers\__init__.py
- Line 295: # - is primary filename pattern?

### \server\venv\Lib\site-packages\pip\_vendor\requests\adapters.py
- Line 663: # TODO: Remove this in 3.0.0: see #2811

### \server\venv\Lib\site-packages\pip\_vendor\requests\auth.py
- Line 220: # XXX should the partial digests be encoded too?

### \server\venv\Lib\site-packages\pip\_vendor\requests\certs.py
- Line 1: #!/usr/bin/env python

### \server\venv\Lib\site-packages\pip\_vendor\requests\compat.py
- Line 44: #: Python 2.x?
- Line 47: #: Python 3.x?
- Line 50: # Note: We've patched out simplejson support in pip because it prevents

### \server\venv\Lib\site-packages\pip\_vendor\requests\hooks.py
- Line 19: # TODO: response is the only one

### \server\venv\Lib\site-packages\pip\_vendor\requests\models.py
- Line 373: # Note that prepare_auth must be last to enable authentication schemes
- Line 440: f"Perhaps you meant https://{url}?"
- Line 449: # it doesn't start with a wildcard (*), before allowing the unencoded hostname.
- Line 969: # and the server didn't bother to tell us what codec *was*

### \server\venv\Lib\site-packages\pip\_vendor\requests\packages.py
- Line 12: # preserved (requests.packages.urllib3.* is urllib3.*)

### \server\venv\Lib\site-packages\pip\_vendor\requests\utils.py
- Line 109: test = test.replace("*", r".*")  # change glob sequence
- Line 110: test = test.replace("?", r".")  # change glob char
- Line 246: # App Engine hackiness.
- Line 658: safe_with_percent = "!#$%&'()*+,/:;=?@[]~"
- Line 659: safe_without_percent = "!#$&'()*+,/:;=?@[]~"

### \server\venv\Lib\site-packages\pip\_vendor\requests\__init__.py
- Line 53: assert urllib3_version != ["dev"]  # Verify urllib3 isn't installed from git.
- Line 115: # Note: This logic prevents upgrading cryptography on Windows, if imported

### \server\venv\Lib\site-packages\pip\_vendor\resolvelib\resolvers\resolution.py
- Line 402: # It works! Let's work on this new state.
- Line 475: # All criteria are accounted for. Nothing more to pin, we are done!

### \server\venv\Lib\site-packages\pip\_vendor\rich\ansi.py
- Line 214: if sys.platform != "win32" and __name__ == "__main__":  # pragma: no cover

### \server\venv\Lib\site-packages\pip\_vendor\rich\columns.py
- Line 93: column_lengths: List[int] = [item_count // column_count] * column_count

### \server\venv\Lib\site-packages\pip\_vendor\rich\console.py
- Line 524: return True  # Jupyter notebook or qtconsole
- Line 528: return False  # Other type (?)
- Line 2020: See https://docs.python.org/3/library/signal.html#note-on-sigpipe for details.
- Line 2083: MAX_WRITE = 32 * 1024 // 4

### \server\venv\Lib\site-packages\pip\_vendor\rich\control.py
- Line 216: # console.print(Control((ControlType.SET_WINDOW_TITLE, "Hello, world!")))

### \server\venv\Lib\site-packages\pip\_vendor\rich\filesize.py
- Line 9: * `Wikipedia: Binary prefix <https://en.wikipedia.org/wiki/Binary_prefix>`_

### \server\venv\Lib\site-packages\pip\_vendor\rich\highlighter.py
- Line 101: r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#~@]*)",
- Line 221: console.print("https://example.org?foo=bar#header")

### \server\venv\Lib\site-packages\pip\_vendor\rich\markup.py
- Line 13: r"""((\\*)\[([a-z#/@][^[]*?)])""",
- Line 50: _escape: _EscapeSubMethod = re.compile(r"(\\*)(\[[a-z#/@][^[]*?])").sub,

### \server\venv\Lib\site-packages\pip\_vendor\rich\progress_bar.py
- Line 86: segments += [Segment(bar, fore_style)] * (PULSE_SIZE // 2)

### \server\venv\Lib\site-packages\pip\_vendor\rich\rule.py
- Line 83: left = Text(characters * (side_width // chars_len + 1))
- Line 86: right = Text(characters * (side_width // chars_len + 1))
- Line 106: rule_text = Text(self.characters * ((width // chars_len) + 1), self.style)

### \server\venv\Lib\site-packages\pip\_vendor\rich\text.py
- Line 562: # TODO: This is a little inefficient, it is only used by full justify

### \server\venv\Lib\site-packages\pip\_vendor\rich\traceback.py
- Line 733: # Note, this is an educated guess and not a guarantee
- Line 737: if first_line.startswith("#!") and "python" in first_line.lower():

### \server\venv\Lib\site-packages\pip\_vendor\rich\_export_format.py
- Line 22: <!-- Generated with Rich https://www.textualize.io -->

### \server\venv\Lib\site-packages\pip\_vendor\rich\_win32_console.py
- Line 605: console.print("[#1BB152 on #DA812D]#1BB152 on #DA812D!")

### \server\venv\Lib\site-packages\pip\_vendor\rich\_wrap.py
- Line 74: # line, but it *can* fit on to the next (empty) line.

### \server\venv\Lib\site-packages\pip\_vendor\tomli\_parser.py
- Line 148: def loads(__s: str, *, parse_float: ParseFloat = float) -> dict[str, Any]:  # noqa: C901
- Line 199: elif char != "#":
- Line 248: def set(self, key: Key, flag: int, *, recursive: bool) -> None:  # noqa: A003

### \server\venv\Lib\site-packages\pip\_vendor\tomli\_re.py
- Line 28: x[0-9A-Fa-f](?:_?[0-9A-Fa-f])*   # hex
- Line 30: b[01](?:_?[01])*                 # bin
- Line 32: o[0-7](?:_?[0-7])*               # oct
- Line 35: [+-]?(?:0|[1-9](?:_?[0-9])*)         # dec, integer part
- Line 37: (?:\.[0-9](?:_?[0-9])*)?         # optional fractional part
- Line 38: (?:[eE][+-]?[0-9](?:_?[0-9])*)?  # optional exponent part
- Line 50: (?:([Zz])|([+-])([01][0-9]|2[0-3]):([0-5][0-9]))?  # optional time offset
- Line 94: # 24 (hours) * 60 (minutes) * 2 (offset direction) = 2880.

### \server\venv\Lib\site-packages\pip\_vendor\truststore\_api.py
- Line 82: # Dirty hack to get around isinstance() checks

### \server\venv\Lib\site-packages\pip\_vendor\truststore\_macos.py
- Line 426: # we can finally create a SecTrust object!
- Line 489: # Note that we're not able to ignore only hostname errors
- Line 552: # Can this ever return 'None' if there's a CFError?
- Line 558: # TODO: Not sure if we need the SecTrustResultType for anything?

### \server\venv\Lib\site-packages\pip\_vendor\truststore\_windows.py
- Line 240: # Note, actually raises OSError after calling GetLastError and FormatMessage

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\connection.py
- Line 17: try:  # Compiled with SSL?
- Line 73: _CONTAINS_CONTROL_CHAR_RE = re.compile(r"[^-!#$%&'*+.^_`|~0-9a-zA-Z]")
- Line 199: # TODO: Fix tunnel so it doesn't depend on self.sock state.
- Line 539: # match DNS SANs so we do the same thing!

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\connectionpool.py
- Line 410: # conn.request() calls http.client.*.request, not the method in
- Line 522: # TODO: Add optional support for socket.gethostbyname checking.
- Line 744: # Everything went great!
- Line 769: # so we try to cover our bases here!
- Line 846: # Handle redirect?
- Line 1126: # *assert* that.  See http://bugs.python.org/issue28539

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\exceptions.py
- Line 289: # TODO(t-8ch): Stop inheriting from AssertionError in v2.0.

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\fields.py
- Line 72: # All control characters from 0x00 to 0x1F *except* 0x1B.

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\response.py
- Line 246: # Are we using the chunked-style of transfer encoding?
- Line 373: # Note: content-encoding value should be case-insensitive, per RFC 7230
- Line 441: # FIXME: Ideally we'd like to include the url in the ReadTimeoutError but
- Line 446: # FIXME: Is there a better way to differentiate between SSLErrors?
- Line 798: # FIXME: Rewrite this method and make it a class with a better structured logic.
- Line 834: # decoder. However, on Jython we *might* need to, so

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\__init__.py
- Line 22: # === NOTE TO REPACKAGERS AND VENDORS ===
- Line 85: # All warning filters *must* be appended unless you're really certain that they

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\appengine.py
- Line 193: # Handle redirect?

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\ntlmpool.py
- Line 4: Issue #10, see: http://code.google.com/p/urllib3/issues/detail?id=10

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\pyopenssl.py
- Line 371: # FIXME rethrow compatible exceptions should we ever use this

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\securetransport.py
- Line 114: # for no better reason than we need *a* limit, and this one is right there.
- Line 500: # id of self modulo 2**31 - 1. If this is already in the dictionary, we
- Line 603: # However, we can get errSSLWouldBlock in situations when we *did*
- Line 614: # well. Note that we don't actually return here because in
- Line 659: # TODO: should I do clean shutdown here? Do I have to?
- Line 693: # just to repeat something that SecureTransport can *already do*. So my
- Line 714: # Handshook? Handshaken?
- Line 819: # TODO: Well, crap.
- Line 829: # TODO: Update in line with above.
- Line 897: # So, what do we do here? Firstly, we assert some properties. This is a

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\socks.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\_securetransport\bindings.py
- Line 327: # CoreFoundation time!

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\contrib\_securetransport\low_level.py
- Line 281: # keychain already has them!
- Line 346: # Ok, we have everything. The question is: do we have an identity? If

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\packages\six.py
- Line 59: # It's possible to have sizeof(long) != sizeof(Py_ssize_t).

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\packages\backports\makefile.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\packages\backports\weakref_finalize.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\response.py
- Line 103: # FIXME: Can we do this somehow without accessing private httplib _method?

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\retry.py
- Line 31: # TODO: In v2 we can remove this sentinel and metaclass with deprecated options.
- Line 261: # TODO: Deprecated, remove in v2.0
- Line 323: # TODO: If already given in **kw we use what's given to us
- Line 454: # TODO: For now favor if the Retry implementation sets its own method_whitelist
- Line 543: # Connect retry?
- Line 550: # Read retry?
- Line 557: # Other retry?
- Line 562: # Redirect retry?
- Line 608: # TODO: Remove this deprecated alias in v2.0

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\ssl_.py
- Line 55: from ssl import HAS_SNI  # Has SNI?
- Line 111: # - NOTE: TLS 1.3 cipher suites are managed through a different interface
- Line 112: #   not exposed by CPython (yet!) and are enabled by default if they're available.
- Line 133: from ssl import SSLContext  # Modern SSL?
- Line 404: # Note: This branch of code and all the variables in it are no longer

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\ssl_match_hostname.py
- Line 3: # Note: This file is under the PSF license as the code comes from the python
- Line 35: # leftmost, *remainder = dn.split(r'.')
- Line 58: # When '*' is a fragment by itself, it matches a non-empty dotless
- Line 68: # Otherwise, '*' matches any dotless string, e.g. www*

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\url.py
- Line 21: r"(?://([^\\/?#]*))?"
- Line 22: r"([^?#]*)"
- Line 23: r"(?:\?([^#]*))?"
- Line 24: r"(?:#(.*))?$",
- Line 39: # [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
- Line 41: # [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
- Line 43: # [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
- Line 45: # [ *4( h16 ":" ) h16 ] "::"              ls32
- Line 47: # [ *5( h16 ":" ) h16 ] "::"              h16
- Line 49: # [ *6( h16 ":" ) h16 ] "::"
- Line 57: REG_NAME_PAT = r"(?:[^\[\]%:/?#]|%[a-fA-F0-9]{2})*"
- Line 58: TARGET_RE = re.compile(r"^(/[^?#]*)(?:\?([^#]*))?(?:#.*)?$")
- Line 148: 'http://username:password@host.com:80/path?query#fragment'
- Line 402: # TODO: Remove this when we break backwards compatibility.

### \server\venv\Lib\site-packages\pip\_vendor\urllib3\util\wait.py
- Line 18: # How should we wait on sockets?
- Line 28: # Now, how do we choose between select() and poll()? On traditional Unixes,

### \server\venv\Lib\site-packages\pluggy\_callers.py
- Line 155: # Note: close() may raise if generator handles GeneratorExit.

### \server\venv\Lib\site-packages\pluggy\_hooks.py
- Line 305: elif not inspect.isroutine(func):  # callable object?
- Line 402: # The hookimpls list. The caller iterates it *in reverse*. Format:
- Line 411: # TODO: Document, or make private.
- Line 417: # TODO: Document, or make private.
- Line 421: # TODO: Document, or make private.
- Line 596: # the *code* runs in the class, but it delegates all underlying *data*

### \server\venv\Lib\site-packages\psycopg2\errors.py
- Line 28: # NOTE: the exceptions are injected into this module by the C extention.

### \server\venv\Lib\site-packages\psycopg2\extensions.py
- Line 111: # this is the important line: note how every object in the

### \server\venv\Lib\site-packages\psycopg2\extras.py
- Line 819: # XXX this b'ing is painfully inefficient!
- Line 841: \s*=>\s* # hstore value
- Line 847: (?:\s*,\s*|$) # pairs separated by comma or end of string.
- Line 1037: \(? ([,)])                        # an empty token, representing NULL
- Line 1038: | \(? " ((?: [^"] | "")*) " [,)]    # or a quoted string
- Line 1039: | \(? ([^",)]+) [,)]                # or an unquoted string
- Line 1340: '[' + _re.escape(' !"#$%&\'()*+,-./:;<=>?@[\\]^`{|}~') + ']')

### \server\venv\Lib\site-packages\psycopg2\sql.py
- Line 379: # is it a connection or cursor?

### \server\venv\Lib\site-packages\psycopg2\tz.py
- Line 158: # TODO: pre-generate some interesting time zones?

### \server\venv\Lib\site-packages\psycopg2\_range.py
- Line 420: (?:                         # lower bound:
- Line 421: " ( (?: [^"] | "")* ) "   #   - a quoted string
- Line 423: )?                          #   - or empty (not catched)
- Line 425: (?:                         # upper bound:
- Line 426: " ( (?: [^"] | "")* ) "   #   - a quoted string
- Line 428: )?                          #   - or empty (not catched)
- Line 526: # TODO: probably won't work with infs, nans and other tricky cases.
- Line 531: # note: the adapter is registered more than once, but this is harmless.

### \server\venv\Lib\site-packages\psycopg2\__init__.py
- Line 58: # Note: the first internal import should be _psycopg, otherwise the real cause

### \server\venv\Lib\site-packages\pyasn1\codec\streaming.py
- Line 37: # Note that this not safe for seeking forward.
- Line 222: elif not received and size != 0:  # end-of-stream

### \server\venv\Lib\site-packages\pyasn1\codec\ber\decoder.py
- Line 52: raise error.PyAsn1Error('SingleItemDecoder not implemented for %s' % (tagSet,))  # TODO: Seems more like an NotImplementedError?
- Line 62: raise error.PyAsn1Error('Indefinite length mode decoder not implemented for %s' % (tagSet,)) # TODO: Seems more like an NotImplementedError?
- Line 192: if tagSet[0].tagFormat == tag.tagFormatSimple:  # XXX what tag to check?
- Line 312: if tagSet[0].tagFormat == tag.tagFormatSimple:  # XXX what tag to check?
- Line 673: # * 1+ components of different types -> likely SEQUENCE/SET
- Line 674: # * otherwise -> likely SEQUENCE OF/SET OF
- Line 1368: # TODO: Seems not to be tested
- Line 1417: yield chunk  # TODO: Weird
- Line 2161: #:     being decoded, *asn1Spec* may or may not be required. Most common reason for
- Line 2162: #:     it to require is that ASN.1 structure is encoded in *IMPLICIT* tagging mode.
- Line 2168: #:     and the unprocessed trailing portion of the *substrate* (may be empty)
- Line 2175: #: Notes

### \server\venv\Lib\site-packages\pyasn1\codec\ber\encoder.py
- Line 83: # untagged item?
- Line 98: # base tag?
- Line 189: # TODO: try to avoid ASN.1 schema instantiation
- Line 404: e = abs(e) // 3 * es
- Line 408: e = abs(e) // 4 * es
- Line 557: # TODO: handling three flavors of input is too much -- split over codecs
- Line 917: #:     Maximum chunk size in chunked encoding mode (0 denotes unlimited chunk size)

### \server\venv\Lib\site-packages\pyasn1\codec\cer\decoder.py
- Line 51: # TODO: prohibit non-canonical encoding
- Line 108: #:     being decoded, *asn1Spec* may or may not be required. Most common reason for
- Line 109: #:     it to require is that ASN.1 structure is encoded in *IMPLICIT* tagging mode.
- Line 115: #:     and the unprocessed trailing portion of the *substrate* (may be empty)

### \server\venv\Lib\site-packages\pyasn1\codec\der\decoder.py
- Line 23: # TODO: prohibit non-canonical encoding
- Line 79: #:     being decoded, *asn1Spec* may or may not be required. Most common reason for
- Line 80: #:     it to require is that ASN.1 structure is encoded in *IMPLICIT* tagging mode.
- Line 86: #:     and the unprocessed trailing portion of the *substrate* (may be empty)

### \server\venv\Lib\site-packages\pyasn1\codec\der\encoder.py
- Line 34: # TODO: move out of sorting key function
- Line 41: # TODO: support nested CHOICE ordering

### \server\venv\Lib\site-packages\pyasn1\type\base.py
- Line 459: # * There are five of them: Sequence, SequenceOf/SetOf, Set and Choice
- Line 460: # * ASN1 types and values are represened by Python class instances
- Line 461: # * Value initialization is made for defaulted components only
- Line 462: # * Primary method of component addressing is by-position. Data model for base
- Line 465: # * SequenceOf and SetOf types do not implement any additional methods
- Line 466: # * Sequence, Set and Choice types also implement by-identifier addressing
- Line 467: # * Sequence, Set and Choice types also implement by-asn1-type (tag) addressing
- Line 468: # * Sequence and Set types may include optional and defaulted
- Line 470: # * Constructed types hold a reference to component types used for value
- Line 472: # * Component type is a scalar type for SequenceOf/SetOf types and a list

### \server\venv\Lib\site-packages\pyasn1\type\constraint.py
- Line 85: # TODO: fix possible comparison of set vs scalars here
- Line 558: if status == 'ABSENT':  # XXX presence is not checked!
- Line 747: # TODO:

### \server\venv\Lib\site-packages\pyasn1\type\namedval.py
- Line 169: # XXX clone/subtype?

### \server\venv\Lib\site-packages\pyasn1\type\univ.py
- Line 856: # Note: ASN.1 OCTET STRING is never mean to contain text!
- Line 1724: # TODO: remove when Py2.5 support is gone
- Line 1952: # TODO: we should wrap componentType with UnnamedType to carry
- Line 3327: # coercion rules?

### \server\venv\Lib\site-packages\pyasn1_modules\rfc1902.py
- Line 122: )  # BITS misplaced?

### \server\venv\Lib\site-packages\pyasn1_modules\rfc2251.py
- Line 184: # Ugly hack to handle recursive Filter reference (up to 3-levels deep).
- Line 255: # End of Filter hack

### \server\venv\Lib\site-packages\pyasn1_modules\rfc2459.py
- Line 4: # Updated by Russ Housley to resolve the TODO regarding the Certificate
- Line 283: # hm, this should not be here!? XXX

### \server\venv\Lib\site-packages\pyasn1_modules\rfc2560.py
- Line 17: # * request and response works only for a single certificate
- Line 18: # * only some values are parsed out of the response
- Line 19: # * the request does't set a nonce nor signature
- Line 20: # * there is no signature validation of the response
- Line 21: # * dates are left as strings in GeneralizedTime format -- datetime.datetime

### \server\venv\Lib\site-packages\pyasn1_modules\rfc2985.py
- Line 86: # TODO:
- Line 269: # TODO: Once PKCS15Token can be imported, this can be included
- Line 543: # TODO: Once PKCS15Token can be imported, this can be included
- Line 568: # Note: pkcs_9_at_smimeCapabilities is not included in the map because

### \server\venv\Lib\site-packages\pyasn1_modules\rfc3739.py
- Line 131: # NOTE: This extension does not allow to mix critical and

### \server\venv\Lib\site-packages\pyasn1_modules\rfc4108.py
- Line 15: # https://www.rfc-editor.org/errata_search.php?rfc=4108

### \server\venv\Lib\site-packages\pyasn1_modules\rfc4210.py
- Line 468: # pyasn1 does not naturally handle recursive definitions, thus this hack:
- Line 521: # pyasn1 does not naturally handle recursive definitions, thus this hack:
- Line 800: # pyasn1 does not naturally handle recursive definitions, thus this hack:

### \server\venv\Lib\site-packages\pyasn1_modules\rfc5480.py
- Line 15: # What can be imported from rfc4055.py ?
- Line 98: # Note that ECDSA keys always use this OID

### \server\venv\Lib\site-packages\pyasn1_modules\rfc5990.py
- Line 222: # Note that the ones that must not have parameters are not added to the map.

### \server\venv\Lib\site-packages\pyasn1_modules\rfc7292.py
- Line 12: # https://www.rfc-editor.org/errata_search.php?rfc=7292
- Line 263: # Note: The default is for historical reasons and its use is deprecated

### \server\venv\Lib\site-packages\pyasn1_modules\rfc8226.py
- Line 99: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '*')

### \server\venv\Lib\site-packages\pycparser\c_ast.py
- Line 2: # ** ATTENTION **
- Line 7: # ** ** *** ** **

### \server\venv\Lib\site-packages\pycparser\c_generator.py
- Line 113: # Note: all binary operators are left-to-right associative
- Line 117: # e.g., `(a*b) + c` is equivalent to `a*b + c`, as well as
- Line 121: # e.g., `(a+b) * c` is NOT equivalent to `a+b * c`.
- Line 133: # e.g., `a + (b*c)` is equivalent to `a + b*c`.
- Line 136: # e.g., `a * (b+c)` is NOT equivalent to `a * b+c` and

### \server\venv\Lib\site-packages\pycparser\c_lexer.py
- Line 84: #   * Preprocessor-style directives: if we see '#', we check whether
- Line 90: #   * Newlines update lineno/line-start tracking so tokens can record
- Line 95: #   * _regex_rules: regex patterns for identifiers, literals, and other
- Line 98: #   * _fixed_tokens: exact string matches for operators and punctuation,
- Line 466: # Note: a-zA-Z and '.-~^_!=&;,' are allowed as escape chars to support #line
- Line 475: #   simple_escape = r"""([a-zA-Z._~!=&\^\-\\?'"])"""
- Line 478: #   bad_escape = r"""([\\][^a-zA-Z._~^!=&\^\-\\?'"x0-7])"""

### \server\venv\Lib\site-packages\pycparser\c_parser.py
- Line 184: # int *c[5];
- Line 246: # * The innermost TypeDecl has no type (because the basic
- Line 248: # * The declaration has no variable name, since that is saved
- Line 250: # * The typename of the declaration is a list of type
- Line 1048: # BNF: init_declarator_list : init_declarator (',' init_declarator)*
- Line 1062: # BNF: init_declarator : declarator ('=' initializer)?
- Line 1073: # BNF: struct_or_union_specifier : struct_or_union ID? '{' struct_declaration_list? '}'
- Line 1117: # BNF: struct_declaration   : specifier_qualifier_list struct_declarator_list? ';'
- Line 1153: # BNF: struct_declarator_list : struct_declarator (',' struct_declarator)*
- Line 1160: # BNF: struct_declarator : declarator? ':' constant_expression
- Line 1161: #                        | declarator (':' constant_expression)?
- Line 1178: # BNF: enum_specifier : ENUM ID? '{' enumerator_list? '}'
- Line 1196: # BNF: enumerator_list : enumerator (',' enumerator)* ','?
- Line 1207: # BNF: enumerator : ID ('=' constant_expression)?
- Line 1221: # BNF: declarator : pointer? direct_declarator
- Line 1241: # BNF: declarator_kind : pointer? direct_declarator(kind)
- Line 1288: # BNF: array_decl : '[' array_specifiers? assignment_expression? ']'
- Line 1375: # BNF: pointer : '*' type_qualifier_list? pointer?
- Line 1392: # BNF: parameter_type_list : parameter_list (',' ELLIPSIS)?
- Line 1401: # BNF: parameter_list : parameter_declaration (',' parameter_declaration)*
- Line 1410: # BNF: parameter_declaration : declaration_specifiers declarator?
- Line 1458: # BNF: identifier_list : identifier (',' identifier)*
- Line 1489: # BNF: abstract_declarator_opt : pointer? direct_abstract_declarator?
- Line 1536: # BNF: abstract_array_base : '[' array_specifiers? assignment_expression? ']'
- Line 1571: # BNF: pragmacomp_or_statement : pppragma_directive* statement
- Line 1598: # BNF: compound_statement : '{' block_item_list? '}'
- Line 1643: # BNF: selection_statement : IF '(' expression ')' statement (ELSE statement)?
- Line 1711: #                     | RETURN expression? ';'
- Line 1751: # BNF: expression : assignment_expression (',' assignment_expression)*
- Line 1778: #                            | binary_expression '?' expression ':' conditional_expression
- Line 1788: # BNF: binary_expression : cast_expression (binary_op cast_expression)*
- Line 1874: # BNF: postfix_expression   : primary_expression postfix_suffix*
- Line 1875: #                           | '(' type_name ')' '{' initializer_list ','? '}'
- Line 1962: #                                ('.' identifier_or_typeid | '[' expression ']')*
- Line 1978: # BNF: argument_expression_list : assignment_expression (',' assignment_expression)*
- Line 2061: #                 | '{' initializer_list ','? '}'
- Line 2075: # BNF: initializer_list : initializer_item (',' initializer_item)* ','?
- Line 2084: # BNF: initializer_item : designation? initializer
- Line 2126: # BNF: pppragma_directive : PPPRAGMA PPPRAGMASTR?
- Line 2152: # BNF: static_assert : _STATIC_ASSERT '(' constant_expression (',' string_literal)? ')'

### \server\venv\Lib\site-packages\pycparser\_ast_gen.py
- Line 163: # ** ATTENTION **
- Line 168: # ** ** *** ** **

### \server\venv\Lib\site-packages\pycparser\__init__.py
- Line 43: # Note the use of universal_newlines to treat all newlines

### \server\venv\Lib\site-packages\pydantic\alias_generators.py
- Line 7: # TODO: in V3, change the argument names to be more descriptive

### \server\venv\Lib\site-packages\pydantic\color.py
- Line 56: r_hex_short = r'\s*(?:#|0x)?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?\s*'
- Line 57: r_hex_long = r'\s*(?:#|0x)?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?\s*'
- Line 286: * hex short eg. `<prefix>fff` (prefix can be `#`, `0x` or nothing)
- Line 287: * hex long eg. `<prefix>ffffff` (prefix can be `#`, `0x` or nothing)
- Line 330: return ints_to_rgba(*m.groups())  # type: ignore
- Line 334: return parse_hsl(*m.groups())  # type: ignore

### \server\venv\Lib\site-packages\pydantic\config.py
- Line 74: model_config = ConfigDict(extra='ignore')  # (1)!
- Line 78: user = User(name='John Doe', age=20)  # (2)!
- Line 130: __pydantic_extra__: dict[str, int] = Field(init=False)  # (1)!
- Line 212: my_field: str = Field(alias='my_alias')  # (1)!
- Line 214: m = Model(my_alias='foo')  # (2)!
- Line 218: m = Model(my_field='foo')  # (3)!
- Line 281: user = User(name='John Doe')  # (1)!
- Line 284: user.name = 123  # (1)!
- Line 297: class User(BaseModel, validate_assignment=True):  # (1)!
- Line 300: user = User(name='John Doe')  # (2)!
- Line 304: user.name = 123  # (3)!
- Line 512: class User(BaseModel, revalidate_instances='never'):  # (1)!
- Line 521: my_user.name = 1  # (2)!
- Line 522: t = Transaction(user=my_user)  # (3)!
- Line 546: my_user.name = 1  # (1)!
- Line 547: t = Transaction(user=my_user)  # (2)!
- Line 553: print(t)  # (3)!
- Line 1088: my_field: str = Field(validation_alias='my_alias')  # (1)!
- Line 1090: m = Model(my_field='foo')  # (2)!
- Line 1124: my_field: str = Field(validation_alias='my_alias')  # (1)!
- Line 1126: m = Model(my_alias='foo')  # (2)!
- Line 1130: m = Model(my_field='foo')  # (3)!
- Line 1167: my_field: str = Field(serialization_alias='my_alias')  # (1)!
- Line 1170: print(m.model_dump())  # (2)!
- Line 1273: # However, the `@with_config` decorator can be applied *after* `@dataclass`. To avoid

### \server\venv\Lib\site-packages\pydantic\dataclasses.py
- Line 224: # `repr` that need to be understood *during* the stdlib creation. We do so in two steps:
- Line 277: # Note that we do so only if `__setstate__()` isn't already set (this is the
- Line 307: # TODO `parent_namespace` is currently None, but we could do the same thing as Pydantic models:

### \server\venv\Lib\site-packages\pydantic\errors.py
- Line 130: name = re.search(r".*'(.+?)'", str(name_error)).group(1)  # type: ignore[union-attr]

### \server\venv\Lib\site-packages\pydantic\fields.py
- Line 53: # TODO PEP 747: use TypeForm:
- Line 99: # TODO PEP 747: use TypeForm:
- Line 151: # TODO PEP 747: use TypeForm:
- Line 241: # Note: in theory, the second `pop()` arguments are not required below, as defaults are already set from `_DefaultsValues`.
- Line 361: # TODO check for classvar and error?
- Line 422: # TODO check for classvar and error?
- Line 424: # TODO infer from the default, this can be done in v3 once we treat final fields with
- Line 430: # HACK 1: the order in which the metadata is merged is inconsistent; we need to prepend
- Line 438: # HACK 2: FastAPI is subclassing `FieldInfo` and historically expected the actual
- Line 449: default_copy = default._copy()  # Copy unnecessary when we remove HACK 1.
- Line 455: prepend_metadata = from_field.metadata  # Unnecessary when we remove HACK 1.
- Line 536: # HACK: It is common for users to define "make model partial" (or similar) utilities, that
- Line 542: # each attribute is *not* enough, for instance with `Annotated[int, Field(alias='a'), Field(alias=None)]`
- Line 545: # from `model_fields`) is used in annotated metadata (or assignment). In this case, we assume *all* attributes
- Line 664: return Field(default=default, default_factory=default_factory, repr=dc_field.repr, **dc_field_metadata)  # pyright: ignore[reportCallIssue]
- Line 776: return Annotated[(self.annotation, *self.metadata)]  # type: ignore
- Line 823: # Note: we can't define a custom `__copy__()`, as `FieldInfo` is being subclassed
- Line 839: # TODO: properly make use of the protocol (https://rich.readthedocs.io/en/stable/pretty.html#rich-repr-protocol)
- Line 921: # NOTE: Actual return type is 'FieldInfo', but we want to help type checkers
- Line 925: default: ellipsis,  # noqa: F821  # TODO: use `_typing_extra.EllipsisType` when we drop Py3.9
- Line 1016: # NOTE: to get proper type checking on `exclude_if`'s argument, we could use `_T` instead of `Any`. However,
- Line 1099: # NOTE: to get proper type checking on `exclude_if`'s argument, we could use `_T` instead of `Any`. However,
- Line 1462: # NOTE: Actual return type is 'ModelPrivateAttr', but we want to help type checkers
- Line 1594: # note that we use the serialization_alias with priority over alias, as computed_field

### \server\venv\Lib\site-packages\pydantic\functional_serializers.py
- Line 106: # Note that `handler` can actually help serialize the `value` for
- Line 234: # TODO PEP 747 (grep for 'return_type' on the whole code base):

### \server\venv\Lib\site-packages\pydantic\functional_validators.py
- Line 32: [field *after* validators](../concepts/validators.md#field-after-validator)
- Line 93: [field *before* validators](../concepts/validators.md#field-before-validator)
- Line 160: [field *plain* validators](../concepts/validators.md#field-plain-validator)
- Line 188: PlainValidator(validate, json_schema_input_type=Union[str, int]),  # (1)!
- Line 209: # Note that for some valid uses of PlainValidator, it is not possible to generate a core schema for the
- Line 218: # TODO if `schema['serialization']` is one of `'include-exclude-dict/sequence',
- Line 260: [field *wrap* validators](../concepts/validators.md#field-wrap-validator)
- Line 722: # auto apply the @classmethod decorator. NOTE: in V3, do not apply the conversion for 'after' validators:
- Line 883: # TODO: make use of PEP 747

### \server\venv\Lib\site-packages\pydantic\json_schema.py
- Line 121: #       * these might look like the fully qualified path of a model, its id, or something similar
- Line 124: #       * by default, these look like "MyModel", though may change in the presence of collisions
- Line 125: #       * eventually, we may want to make it easier to modify the way these names are generated
- Line 128: #       * By default, these look like "#/$defs/MyModel", as in {"$ref": "#/$defs/MyModel"}
- Line 200: # Note: this may not really be a JsonRef; we rely on having no collisions between JsonRefs and other strings
- Line 457: # Note that this assumes that it will _never_ be the case that the same CoreRef is used
- Line 520: # TODO: I dislike that we have to wrap these basic dict updates in callables, is there any way around this?
- Line 696: r'^(?!^[-+.]*$)[+-]?0*'  # check it is not empty string and not one or sequence of ".+-" characters.
- Line 728: pattern += r'\d*\.?\d*$'  # look for arbitrary integer or decimal
- Line 768: # TODO: should we add regex flags to the pattern?
- Line 934: # Note: This is for compatibility with V1; you can override if you want different behavior.
- Line 1084: # Note that we avoid calling `self.resolve_ref_schema`, as it might not exist yet.
- Line 1183: # TODO: improvements along with https://github.com/pydantic/pydantic/issues/8208
- Line 1340: # This reflects the v1 behavior; TODO: we should make it possible to exclude OpenAPI stuff from the JSON schema
- Line 1381: # TODO: fixme - this is a workaround for the fact that we can't always resolve refs
- Line 1420: # TODO: Need to read the default value off of model config or whatever
- Line 1421: use_strict = schema.get('strict', False)  # TODO: replace this default False
- Line 1668: # FIXME: why are there type ignores here? We support two signatures for json_schema_extra callables...
- Line 1953: pass  # might want to do something else?
- Line 2056: # Note: 'multi-host-uri' is a custom/pydantic-specific format, not part of the JSON Schema spec
- Line 2749: # (e.g. `{"examples": [{"$ref": "..."}]}`). Note: checking for value
- Line 2788: a: Union[int, None] = None  # (1)!
- Line 2789: b: Union[int, SkipJsonSchema[None]] = None  # (2)!
- Line 2790: c: SkipJsonSchema[Union[int, None]] = None  # (3)!

### \server\venv\Lib\site-packages\pydantic\main.py
- Line 4: # TODO v3 fallback to `dict` when the deprecated `dict` method gets removed.
- Line 73: # NOTE: In reality, `bool` should be replaced by `Literal[True]` but mypy fails to correctly apply bidirectional
- Line 75: # NOTE: Keep this type alias in sync with the stub definition in `pydantic-core`:
- Line 151: # Note: Many of the below class vars are defined in the metaclass, but we define them here for type checking purposes.
- Line 304: def model_construct(cls, _fields_set: set[str] | None = None, **values: Any) -> Self:  # noqa: C901
- Line 378: # Note: if there are any private attributes, cls.__pydantic_post_init__ would exist
- Line 812: # *not* be called if not overridden.
- Line 938: # Note that we explicitly provide the parent ns, otherwise
- Line 1007: # Note: self.__pydantic_private__ cannot be None if self.__private_attributes__ has items
- Line 1061: # NOTE: We currently special case properties and `cached_property`, but we might need
- Line 1078: # TODO - matching error
- Line 1100: # Note: self.__pydantic_private__ cannot be None if self.__private_attributes__ has items
- Line 1151: # This prevents headaches like MyGeneric(x=1) != MyGeneric[Any](x=1).
- Line 1181: # NOTE: Contrary to standard python class and instances, when the Model class has a default value for an
- Line 1242: # below if the instance happens to be referenced in a field, and would modify the `__dict__` size *during* iteration.
- Line 1479: def construct(cls, _fields_set: set[str] | None = None, **values: Any) -> Self:  # noqa: D102
- Line 1614: def update_forward_refs(cls, **localns: Any) -> None:  # noqa: D102
- Line 1727: # TODO PEP 747: replace `Any` by the TypeForm:

### \server\venv\Lib\site-packages\pydantic\mypy.py
- Line 513: # TODO: Only do this if the first argument of the decorated function is `cls`
- Line 554: if stmt.name != 'Config':  # 'deprecated' Config-class
- Line 622: # TODO: We shouldn't be performing type operations during the main
- Line 785: # TODO this path should be removed (see https://github.com/pydantic/pydantic/issues/11119)
- Line 988: # type. Note that you can still get proper type checking via: `model_config = ConfigDict(...)`, just
- Line 1012: # * there is a positional argument that is not `...`
- Line 1013: # * there is a keyword argument named "default" that is not `...`
- Line 1014: # * there is a "default_factory" that is not `None`
- Line 1296: # `self` is positional *ONLY* here, but this can't be expressed
- Line 1327: # NOTE: we would like the plugin generated node to dominate, but we still

### \server\venv\Lib\site-packages\pydantic\networks.py
- Line 137: e.g. `https` in `https://user:pass@host:port/path?query#fragment`
- Line 145: e.g. `user` in `https://user:pass@host:port/path?query#fragment`
- Line 153: e.g. `pass` in `https://user:pass@host:port/path?query#fragment`
- Line 169: e.g. `host` in `https://user:pass@host:port/path?query#fragment`
- Line 180: e.g. `port` in `https://user:pass@host:port/path?query#fragment`
- Line 188: e.g. `/path` in `https://user:pass@host:port/path?query#fragment`
- Line 196: e.g. `query` in `https://user:pass@host:port/path?query#fragment`
- Line 203: e.g. `[('foo', 'bar')]` in `https://user:pass@host:port/path?foo=bar#fragment`
- Line 211: e.g. `fragment` in `https://user:pass@host:port/path?query#fragment`
- Line 357: e.g. `https` in `https://foo.com,bar.com/path?query#fragment`
- Line 365: e.g. `/path` in `https://foo.com,bar.com/path?query#fragment`
- Line 373: e.g. `query` in `https://foo.com,bar.com/path?query#fragment`
- Line 380: e.g. `[('foo', 'bar')]` in `https://foo.com,bar.com/path?foo=bar#fragment`
- Line 388: e.g. `fragment` in `https://foo.com,bar.com/path?query#fragment`
- Line 544: Assuming an input URL of `http://samuel:pass@example.com:8000/the/path/?query=here#fragment=is;this=bit`,
- Line 558: # Note: all single host urls inherit from `AnyUrl` to preserve compatibility with pre-v2.10 code
- Line 585: m = MyModel(url='http://www.example.com')  # (1)!
- Line 610: 1. Note: mypy would prefer `m = MyModel(url=HttpUrl('http://www.example.com'))`, but Pydantic will convert the string to an HttpUrl instance anyway.
- Line 813: * Host required (e.g., `rediss://:pass@localhost`)
- Line 836: * User info may be passed without user part (e.g., `mongodb://mongodb0.example.com:27017`).
- Line 1268: name_chars = r'[\w!#$%&\'*+\-/=?^_`{|}~]'

### \server\venv\Lib\site-packages\pydantic\root_model.py
- Line 60: def __init__(self, /, root: RootModelRootType = PydanticUndefined, **data) -> None:  # type: ignore

### \server\venv\Lib\site-packages\pydantic\types.py
- Line 968: # note: this will not work!
- Line 1590: #> {'secret_bool': Secret('**********')}
- Line 1593: #> {"secret_bool":"**********"}
- Line 1615: #> {'secret_date': SecretDate('****/**/**')}
- Line 1618: #> {"secret_date":"****/**/**"}
- Line 1641: #> {'sensitive_int': Secret('**********')}
- Line 1644: m = Model(sensitive_int=-42)  # (1)!
- Line 1659: m = Model(sensitive_int='42')  # (2)!
- Line 1817: #> username='scolvin' password=SecretStr('**********')
- Line 1821: #> (SecretStr('**********'), SecretStr(''))
- Line 1843: #> password=SecretStr('**********') password_bytes=SecretBytes(b'**********')
- Line 1845: #> **********
- Line 1883: #> username='scolvin' password=SecretBytes(b'**********')
- Line 1887: #> (SecretBytes(b'**********'), SecretBytes(b''))
- Line 2511: #> {'my_encoded_bytes': b'**encoded**: some bytes'}
- Line 2610: #> {'my_encoded_str': '**encoded**: some str'}
- Line 2813: #> base64url_bytes=b'Hw?tw>Mw'
- Line 2834: #> base64url_str='Hw?tw>Mw'
- Line 2871: # Note: we may want to consider adding a convenience staticmethod `def for_type(type_: Any) -> GetPydanticSchema:`
- Line 3147: # Handle proper subclasses; note we don't need to handle None or bool here

### \server\venv\Lib\site-packages\pydantic\type_adapter.py
- Line 220: # Special case functions, which are *not* pushed to the `NsResolver` stack and without this special case
- Line 291: # TODO: we don't go through the rebuild logic here directly because we don't want

### \server\venv\Lib\site-packages\pydantic\deprecated\class_validators.py
- Line 175: # `skip_on_failure`, in fact it is not allowed as an argument!
- Line 234: return root_validator()(*__args)  # type: ignore

### \server\venv\Lib\site-packages\pydantic\deprecated\json.py
- Line 112: # TODO: Add a suggested migration path once there is a way to use custom encoders

### \server\venv\Lib\site-packages\pydantic\experimental\pipeline.py
- Line 126: # TODO: ultimately, make this public, see https://github.com/pydantic/pydantic/pull/9459#discussion_r1628197626
- Line 151: def validate_as(self, tp: EllipsisType, *, strict: bool = ...) -> _Pipeline[_InT, Any]:  # type: ignore
- Line 154: def validate_as(self, tp: type[_NewOutT] | EllipsisType, *, strict: bool = False) -> _Pipeline[_InT, Any]:  # type: ignore

### \server\venv\Lib\site-packages\pydantic\v1\class_validators.py
- Line 356: all_attributes = ChainMap(*[cls.__dict__ for cls in type_.__mro__])  # type: ignore[arg-type,var-annotated]

### \server\venv\Lib\site-packages\pydantic\v1\color.py
- Line 46: r_hex_short = r'\s*(?:#|0x)?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?\s*'
- Line 47: r_hex_long = r'\s*(?:#|0x)?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?\s*'
- Line 226: * hex short eg. `<prefix>fff` (prefix can be `#`, `0x` or nothing)
- Line 227: * hex long eg. `<prefix>ffffff` (prefix can be `#`, `0x` or nothing)
- Line 261: return ints_to_rgba(*m.groups(), None)  # type: ignore
- Line 265: return ints_to_rgba(*m.groups())  # type: ignore

### \server\venv\Lib\site-packages\pydantic\v1\dataclasses.py
- Line 437: # It's ok to do that because they are obviously the default values!

### \server\venv\Lib\site-packages\pydantic\v1\datetime_parse.py
- Line 61: # slightly more than datetime.max in ns - (datetime.max - EPOCH).total_seconds() * 1e9
- Line 170: return time(**kw_)  # type: ignore
- Line 208: return datetime(**kw_)  # type: ignore

### \server\venv\Lib\site-packages\pydantic\v1\errors.py
- Line 10: # explicitly state exports to avoid "from pydantic.v1.errors import *" also importing Decimal, Path etc.

### \server\venv\Lib\site-packages\pydantic\v1\fields.py
- Line 206: # (except if extra already has this value!)

### \server\venv\Lib\site-packages\pydantic\v1\main.py
- Line 113: # Note `ModelMetaclass` refers to `BaseModel`, but is also used to *create* `BaseModel`, so we need to add this extra
- Line 114: # (somewhat hacky) boolean to keep track of whether we've created the `BaseModel` class yet, and therefore whether it's
- Line 115: # safe to refer to it. If it *hasn't* been created, we assume that the `__new__` call we're in the middle of is for
- Line 123: def __new__(mcs, name, bases, namespace, **kwargs):  # noqa C901

### \server\venv\Lib\site-packages\pydantic\v1\mypy.py
- Line 878: # NOTE: we would like the plugin generated node to dominate, but we still

### \server\venv\Lib\site-packages\pydantic\v1\networks.py
- Line 100: r'(?P<ipv4>(?:\d{1,3}\.){3}\d{1,3})(?=$|[/:#?])|'  # ipv4
- Line 101: r'(?P<ipv6>\[[A-F0-9]*:[A-F0-9:]+\])(?=$|[/:#?])|'  # ipv6
- Line 102: r'(?P<domain>[^\s/:?#]+)'  # domain, validation occurs later
- Line 104: r'(?::(?P<port>\d+))?'  # port
- Line 106: _scheme_regex = r'(?:(?P<scheme>[a-z][a-z0-9+\-.]+)://)?'  # scheme https://tools.ietf.org/html/rfc3986#appendix-A
- Line 108: _path_regex = r'(?P<path>/[^\s?#]*)?'
- Line 109: _query_regex = r'(?:\?(?P<query>[^\s#]*))?'
- Line 110: _fragment_regex = r'(?:#(?P<fragment>[^\s#]*))?'
- Line 134: r'(?P<hosts>([^/]*))'  # validation occurs later
- Line 237: **_kwargs,  # type: ignore[misc]
- Line 407: # https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
- Line 535: # TODO: Needed to generic "Parts" for "Replica Set", "Sharded Cluster", and other mongodb deployment modes

### \server\venv\Lib\site-packages\pydantic\v1\schema.py
- Line 1093: def constraint_func(**kw: Any) -> Type[Any]:  # noqa: F811

### \server\venv\Lib\site-packages\pydantic\v1\typing.py
- Line 223: return Annotated[(convert_generics(args[0]), *args[1:])]  # type: ignore

### \server\venv\Lib\site-packages\pydantic\v1\utils.py
- Line 101: # note: including ModuleType will differ from behaviour of deepcopy by not producing error.
- Line 270: # TODO: replace annotation with actual expected types once #1055 solved
- Line 691: # do we really dare to catch ALL errors? Seems a bit risky

### \server\venv\Lib\site-packages\pydantic\v1\validators.py
- Line 67: # is there anything else we want to add here? If you think so, create an issue.

### \server\venv\Lib\site-packages\pydantic\v1\_hypothesis_plugin.py
- Line 41: # them on-disk, and that's unsafe in general without being told *where* to do so.
- Line 67: # Note that these strategies deliberately stay away from any tricky Unicode
- Line 68: # or other encoding issues; we're just trying to generate *something* valid.
- Line 132: # Note that these patterns omit the Luhn check digit; that's added by the function above
- Line 164: # We hook into the con***() functions and the ConstrainedNumberMeta metaclass,
- Line 205: raise NotImplementedError(f'Unknown type {typ!r} has no resolver to register')  # pragma: no cover

### \server\venv\Lib\site-packages\pydantic\_internal\_config.py
- Line 201: **{  # pyright: ignore[reportArgumentType]

### \server\venv\Lib\site-packages\pydantic\_internal\_decorators_v1.py
- Line 92: # (v, **kwargs), (v, values, **kwargs), (v, *, values, **kwargs) or (v, *, values)
- Line 160: # ugly hack: to match v1 behaviour, we merge values and model_extra, then split them up based on fields

### \server\venv\Lib\site-packages\pydantic\_internal\_discriminated_union.py
- Line 88: # It must be the python name of the field, and *not* the field's alias. Note that as of now,
- Line 99: # Note: following the v1 implementation, we currently disallow the use of different aliases
- Line 203: # * We need to annotate `discriminator` as a union here to handle both branches of this conditional
- Line 204: # * We need to annotate `discriminator` as list[list[str | int]] and not list[list[str]] due to the
- Line 207: # * See the docstring of pydantic_core.core_schema.tagged_union_schema for more details about how to

### \server\venv\Lib\site-packages\pydantic\_internal\_docs_extraction.py
- Line 103: # TODO remove this implementation when we drop support for Python 3.12:

### \server\venv\Lib\site-packages\pydantic\_internal\_fields.py
- Line 268: # Note: we may need to change this logic if/when we introduce a `BareModel` class with no
- Line 337: # - present in the current model's annotations (and *not* from parent classes)
- Line 356: # Note that we only do this for method descriptors for now, we might want to
- Line 365: # Note that the assignment is always stored as the annotation might contain a type var that is later
- Line 512: # TODO: We should probably do something with this so that validate_assignment behaves properly
- Line 524: # TODO: same note as above re validate_assignment
- Line 552: # was already evaluated. TODO: is this method relevant?
- Line 553: # Can't we juste use `_generics.replace_types`?

### \server\venv\Lib\site-packages\pydantic\_internal\_generate_schema.py
- Line 162: # Note: This does not play very well with type checkers. For example,
- Line 257: # note that this won't work for any Annotated types that get wrapped by a function validator
- Line 324: # TODO: in theory we should check that the schema accepts a serialization key
- Line 419: # TODO this is an ugly hack, how do we trigger an Any schema for serialization?
- Line 592: # `Field()` is used and our only solution is to ignore them (note that this might
- Line 633: # TODO: note, this is a fairly common pattern, re lax / strict for attempted type coercion,
- Line 634: # can we use a helper function to reduce boilerplate?
- Line 841: # FIXME: should the common field metadata be used here?
- Line 929: # Note: if schema is of type `'definition-ref'`, we might want to copy it as a
- Line 1289: # note that this won't work for any Annotated types that get wrapped by a function validator
- Line 1657: # TODO: do we really need to resolve type vars here?
- Line 1664: # NOTE: subtle difference: `tuple[()]` gives `params=()`, whereas `typing.Tuple[()]` gives `params=((),)`
- Line 1676: # TODO: something like https://github.com/pydantic/pydantic/issues/5952
- Line 1680: # NOTE: This conditional can be removed when we drop support for Python 3.10.
- Line 1856: # Note that we don't apply `deepcopy` on `__pydantic_fields__` because we
- Line 1896: # Note that when kw_only is missing or None, it is treated as equivalent to kw_only=True
- Line 2244: # HACK: we don't want to emit the warning for `FieldInfo` subclasses, because FastAPI does weird manipulations
- Line 2492: # TODO V3: this function is only used for deprecated decorators. It should
- Line 2639: # Generic aliases proxy attribute access to the origin, *except* dunder attributes,
- Line 2772: # Note: this logic doesn't play well when core schemas with deferred discriminator metadata
- Line 2829: return {**definition, 'ref': ref}  # pyright: ignore[reportReturnType]

### \server\venv\Lib\site-packages\pydantic\_internal\_generics.py
- Line 31: # Note: We want to remove LimitedDict, but to do this, we'd need to improve the handling of generics caching.
- Line 234: # TODO: This could be unified with `get_standard_typevars_map` if we stored the generic metadata
- Line 275: # TODO remove parentheses when we drop support for Python 3.10:

### \server\venv\Lib\site-packages\pydantic\_internal\_known_annotated_metadata.py
- Line 83: # TODO: this is a bit redundant, we could probably avoid some of these
- Line 302: # Note: B023 is ignored because even though we iterate over `other_metadata`, it is guaranteed

### \server\venv\Lib\site-packages\pydantic\_internal\_model_construction.py
- Line 107: # Note `ModelMetaclass` refers to `BaseModel`, but is also used to *create* `BaseModel`, so we rely on the fact
- Line 269: super(cls, cls).__pydantic_init_subclass__(**kwargs)  # type: ignore[misc]
- Line 616: # Note: when coming from `ModelMetaclass.__new__()`, this results in fields being built twice.
- Line 663: # This needs to happen *after* model schema generation, as the return type
- Line 754: # Note that it will not be called when setting a value on a model instance

### \server\venv\Lib\site-packages\pydantic\_internal\_namespace_utils.py
- Line 64: # Note that this class is almost identical to `collections.ChainMap`, but need to enforce
- Line 124: # Note that the `typing._eval_type` function expects type params to be
- Line 137: # What about short-circuiting to `obj.__globals__`?
- Line 236: # TODO: should we merge the parent namespace here?
- Line 239: # locals to both parent_ns and the base_ns_tuple, but this is a bit hacky.
- Line 242: #     # Hacky workarounds, see class docstring:
- Line 245: #     return NamespacesTuple(self._base_ns_tuple.globals, LazyLocalNamespace(*locals_list))
- Line 253: # Hacky workarounds, see class docstring:
- Line 261: # Adding `__type_params__` *before* `vars(typ)`, as the latter takes priority
- Line 263: # TODO `typ.__type_params__` when we drop support for Python 3.11:
- Line 267: # PEP 695 syntax *and* using forward annotations (see the example in

### \server\venv\Lib\site-packages\pydantic\_internal\_repr.py
- Line 17: # TODO remove type error comments when we drop support for Python 3.9

### \server\venv\Lib\site-packages\pydantic\_internal\_schema_gather.py
- Line 91: # TODO When we drop 3.9, use a match statement to get better type checking and remove
- Line 170: # TODO duplicate schema types for serializers and validators, needs to be deduplicated.
- Line 176: # TODO duplicate schema types for serializers and validators, needs to be deduplicated.

### \server\venv\Lib\site-packages\pydantic\_internal\_typing_extra.py
- Line 142: # TODO implement `is_finalvar_annotation` as Final can be wrapped with other special forms:
- Line 189: # TODO In 2.12, delete this export. It is currently defined only to not break
- Line 198: # TODO: Ideally, we should avoid relying on the private `typing` constructs:
- Line 263: # note, we don't copy frame.f_locals here (or during the last return call), because we don't expect the namespace to be
- Line 471: # TODO ideally recursion errors should be checked in `eval_type` above, but `eval_type_backport`
- Line 522: # Starting in 3.14, `_eval_type()` does *not* apply `_type_convert()`
- Line 533: # does the same). Note that this would probably be unnecessary if we properly iterated over the
- Line 601: # TODO use typing.ForwardRef directly when we stop supporting 3.9:
- Line 703: # *base_globals* first rather than *base_locals*.

### \server\venv\Lib\site-packages\pydantic\_internal\_utils.py
- Line 32: # TODO remove type error comments when we drop support for Python 3.9
- Line 53: # note: including ModuleType will differ from behaviour of deepcopy by not producing error.
- Line 351: # do we really dare to catch ALL errors? Seems a bit risky
- Line 419: # Note: fget should be a classmethod:

### \server\venv\Lib\site-packages\pydantic\_internal\_validate_call.py
- Line 33: async def wrapper_function(*args, **kwargs):  # type: ignore

### \server\venv\Lib\site-packages\pydantic\_internal\_validators.py
- Line 45: # TODO: refactor sequence validation to validate with either a list or a tuple
- Line 134: # todo strict mode

### \server\venv\Lib\site-packages\pydantic_core\core_schema.py
- Line 479: # note, we never plan to use this, but include it for type checking purposes to match

### \server\venv\Lib\site-packages\pydantic_settings\main.py
- Line 647: # We're in a context with an active event loop (e.g., Jupyter Notebook).

### \server\venv\Lib\site-packages\pydantic_settings\utils.py
- Line 29: # TODO remove and replace usage by `isinstance(cls, type) and issubclass(cls, class_or_tuple)`

### \server\venv\Lib\site-packages\pydantic_settings\sources\base.py
- Line 307: # Note: If populate_by_name is True and the provided key is the field name, but

### \server\venv\Lib\site-packages\pydantic_settings\sources\providers\aws.py
- Line 68: response = self._secretsmanager_client.get_secret_value(**request)  # type: ignore

### \server\venv\Lib\site-packages\pydantic_settings\sources\providers\cli.py
- Line 1123: # Note: CLI positional args are always strictly required at the CLI. Therefore, use field_info.is_required in
- Line 1507: # Note: prepend 'no-' for boolean optional action flag if model_default value is False and flag is not a short option

### \server\venv\Lib\site-packages\pydantic_settings\sources\providers\nested_secrets.py
- Line 20: SECRETS_DIR_MAX_SIZE = 16 * 2**20  # 16 MiB seems to be a reasonable default

### \server\venv\Lib\site-packages\pygments\cmdline.py
- Line 309: # given by name?
- Line 359: # do we have to guess the lexer?
- Line 459: # output file? use lexer encoding for now (can still be None)
- Line 488: # ... and do it!

### \server\venv\Lib\site-packages\pygments\lexer.py
- Line 125: #: ``\*.html`` in this list.
- Line 239: # text now *is* a unicode string
- Line 554: assert state[0] != '#', f"invalid state name {state!r}"
- Line 691: #: again. Note that if you push while in a combined state, the combined
- Line 806: # altered the state stack?
- Line 808: # CAUTION: callback must set ctx.pos!

### \server\venv\Lib\site-packages\pygments\regexopt.py
- Line 42: # multiple one-char strings? make a charset
- Line 50: if len(oneletter) > 1:  # do we have more than one oneletter string?
- Line 65: # is there a suffix?

### \server\venv\Lib\site-packages\pygments\unistring.py
- Line 56: Po = "!-#%-'*,.-/:-;?-@\\\\\xa1\xa7\xb6-\xb7\xbf\u037e\u0387\u055a-\u055f\u0589\u05c0\u05c3\u05c6\u05f3-\u05f4\u0609-\u060a\u060c-\u060d\u061b\u061e-\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964-\u0965\u0970\u09fd\u0a76\u0af0\u0c84\u0df4\u0e4f\u0e5a-\u0e5b\u0f04-\u0f12\u0f14\u0f85\u0fd0-\u0fd4\u0fd9-\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u166d-\u166e\u16eb-\u16ed\u1735-\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u1805\u1807-\u180a\u1944-\u1945\u1a1e-\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e-\u1c7f\u1cc0-\u1cc7\u1cd3\u2016-\u2017\u2020-\u2027\u2030-\u2038\u203b-\u203e\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205e\u2cf9-\u2cfc\u2cfe-\u2cff\u2d70\u2e00-\u2e01\u2e06-\u2e08\u2e0b\u2e0e-\u2e16\u2e18-\u2e19\u2e1b\u2e1e-\u2e1f\u2e2a-\u2e2e\u2e30-\u2e39\u2e3c-\u2e3f\u2e41\u2e43-\u2e4e\u3001-\u3003\u303d\u30fb\ua4fe-\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce-\ua8cf\ua8f8-\ua8fa\ua8fc\ua92e-\ua92f\ua95f\ua9c1-\ua9cd\ua9de-\ua9df\uaa5c-\uaa5f\uaade-\uaadf\uaaf0-\uaaf1\uabeb\ufe10-\ufe16\ufe19\ufe30\ufe45-\ufe46\ufe49-\ufe4c\ufe50-\ufe52\ufe54-\ufe57\ufe5f-\ufe61\ufe68\ufe6a-\ufe6b\uff01-\uff03\uff05-\uff07\uff0a\uff0c\uff0e-\uff0f\uff1a-\uff1b\uff1f-\uff20\uff3c\uff61\uff64-\uff65\U00010100-\U00010102\U0001039f\U000103d0\U0001056f\U00010857\U0001091f\U0001093f\U00010a50-\U00010a58\U00010a7f\U00010af0-\U00010af6\U00010b39-\U00010b3f\U00010b99-\U00010b9c\U00010f55-\U00010f59\U00011047-\U0001104d\U000110bb-\U000110bc\U000110be-\U000110c1\U00011140-\U00011143\U00011174-\U00011175\U000111c5-\U000111c8\U000111cd\U000111db\U000111dd-\U000111df\U00011238-\U0001123d\U000112a9\U0001144b-\U0001144f\U0001145b\U0001145d\U000114c6\U000115c1-\U000115d7\U00011641-\U00011643\U00011660-\U0001166c\U0001173c-\U0001173e\U0001183b\U00011a3f-\U00011a46\U00011a9a-\U00011a9c\U00011a9e-\U00011aa2\U00011c41-\U00011c45\U00011c70-\U00011c71\U00011ef7-\U00011ef8\U00012470-\U00012474\U00016a6e-\U00016a6f\U00016af5\U00016b37-\U00016b3b\U00016b44\U00016e97-\U00016e9a\U0001bc9f\U0001da87-\U0001da8b\U0001e95e-\U0001e95f"
- Line 125: # Hack to avoid combining this combining with the preceding high

### \server\venv\Lib\site-packages\pygments\util.py
- Line 19: (?: \s+      # optional in HTML5
- Line 144: >>> shebang_matches('#!/usr/bin/env python', r'python(2\.\d)?')
- Line 146: >>> shebang_matches('#!/usr/bin/python2.4', r'python(2\.\d)?')
- Line 148: >>> shebang_matches('#!/usr/bin/python-ruby', r'python(2\.\d)?')
- Line 150: >>> shebang_matches('#!/usr/bin/python/ruby', r'python(2\.\d)?')
- Line 152: >>> shebang_matches('#!/usr/bin/startsomethingwith python',
- Line 158: >>> shebang_matches('#!C:\\Python2.4\\Python.exe', r'python(2\.\d)?')
- Line 172: if first_line.startswith('#!'):

### \server\venv\Lib\site-packages\pygments\formatters\html.py
- Line 80: <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
- Line 101: <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
- Line 513: # hierarchy (necessary for CSS cascading rules!)
- Line 776: # subtract 1 since we have to increment i *before* yielding

### \server\venv\Lib\site-packages\pygments\formatters\img.py
- Line 203: # * All key lookups failed. In this case lookuperror is None and we
- Line 205: # * At least one lookup failed with a FontNotFound error. In this
- Line 548: # TODO: make sure tab expansion happens earlier in the chain.  It
- Line 634: # see deprecations https://pillow.readthedocs.io/en/stable/releasenotes/9.2.0.html#font-size-and-offset-methods

### \server\venv\Lib\site-packages\pygments\formatters\irc.py
- Line 84: if '*' in color: # bold

### \server\venv\Lib\site-packages\pygments\formatters\latex.py
- Line 83: # * \PY@it, \PY@bf, etc. are unconditionally wrapped around the text
- Line 85: # * \PY@reset resets \PY@it etc. to do nothing.
- Line 86: # * \PY@toks parses the list of classes, using magic inspired by the
- Line 89: # * \PY@tok processes one class, calling the \PY@tok@classname command
- Line 91: # * \PY@tok@classname sets the \PY@it etc. to reflect the chosen style
- Line 93: # * \PY resets the style, parses the classnames and then calls \PY@do.
- Line 334: # TODO: add support for background colors

### \server\venv\Lib\site-packages\pygments\formatters\rtf.py
- Line 273: # https://bugs.documentfoundation.org/show_bug.cgi?id=144050

### \server\venv\Lib\site-packages\pygments\formatters\svg.py
- Line 129: outfile.write('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" '

### \server\venv\Lib\site-packages\pygments\formatters\terminal256.py
- Line 8: tool (http://frexx.de/xterm-256-notes/data/xterm256-conv2.tar.bz2)
- Line 17: # TODO:
- Line 111: If the used style defines foreground colors in the form ``#ansi*``, then
- Line 189: distance = 257*257*3  # "infinity" (>distance from #000000 to #ffffff)
- Line 283: # outfile.write( '!' + str(ottype) + '->' + str(ttype) + '!' )

### \server\venv\Lib\site-packages\pygments\lexers\actionscript.py
- Line 37: (r'//.*?\n', Comment.Single),
- Line 149: (r'//.*?\n', Comment.Single),
- Line 235: (r'/?\s*>', Name.Tag, '#pop'),
- Line 239: ('".*?"', String, '#pop'),
- Line 240: ("'.*?'", String, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\ada.py
- Line 116: # TODO: use Name.Namespace if appropriate.  This needs

### \server\venv\Lib\site-packages\pygments\lexers\algebra.py
- Line 33: (r'#.*$', Comment.Single),
- Line 166: "^", "&&", "||", "!", "<>", "|", "/;", "?", "@", "//", "/@", "@@",
- Line 181: (r'#\d*', Name.Variable),
- Line 209: (r'//.*?$', Comment.Single),
- Line 246: # (r'\b(?:adt|linalg|newDomain|hold)\b', Name.Builtin),
- Line 248: ((?:[a-zA-Z_#][\w#]*|`[^`]*`)
- Line 249: (?:::[a-zA-Z_#][\w#]*|`[^`]*`)*)(\s*)([(])''',
- Line 252: (?:[a-zA-Z_#][\w#]*|`[^`]*`)
- Line 253: (?:::[a-zA-Z_#][\w#]*|`[^`]*`)*''', Name.Variable),
- Line 261: (r'/\*', Comment.Multiline, '#push'),
- Line 262: (r'\*/', Comment.Multiline, '#pop'),
- Line 296: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\ambient.py
- Line 40: (r'//.*?\n', Comment.Single),
- Line 64: (r'[a-zA-Z_]\w*:', Name.Function, '#pop'),
- Line 65: (r'[a-zA-Z_]\w*(?!\.)', Name.Function, '#pop')
- Line 68: (r"(.*?)\]", Name.Class, '#pop')

### \server\venv\Lib\site-packages\pygments\lexers\amdgpu.py
- Line 37: (r'([;#]|//).*?\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\ampl.py
- Line 32: (r'#.*?\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\apdlexer.py
- Line 565: (r'!.*\n', Comment, '#pop'),
- Line 589: (r'[+-]?\d*\.\d+([efEF][-+]?\d+)?', Number.Float), # with dot
- Line 590: (r'([+-]?\d+([efEF][-+]?\d+))', Number.Float), # With scientific notation
- Line 591: (r'\b\d+(?![.ef])', Number.Integer), # integer simple

### \server\venv\Lib\site-packages\pygments\lexers\apl.py
- Line 40: (r'[⍝#].*$', Comment.Single),
- Line 45: (r'"(("")|[^"])*"', String.Double),  # supported by NGN APL
- Line 67: # (r'[A-Za-zΔ∆⍙][A-Za-zΔ∆⍙_¯0-9]*:', Name.Label),

### \server\venv\Lib\site-packages\pygments\lexers\archetype.py
- Line 153: (r'(\s*)(,)(\s*)', bygroups(Whitespace, Punctuation, Whitespace), '#pop'),
- Line 237: (r'(~|//|\\\\|\+|-|/|\*|\^|!=|=|<=|>=|<|>]?)', Operator),
- Line 277: (r'^----------*\n', Text, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\arturo.py
- Line 77: (r'^((\s#!)|(#!)).*?$', Comment.Hashbang),
- Line 85: (r'\\\w+\b\??:?', Name.Property),       # array index
- Line 89: (r'\w+\b\??:', Name.Label),             # label
- Line 90: # Note: Literals can be labeled too
- Line 91: (r'\'(?:\w+\b\??:?)', Keyword.Declaration),  # literal
- Line 93: # Note: Attributes can be labeled too
- Line 94: (r'\.\w+\??:?', Name.Attribute),        # attributes
- Line 120: '+', '-', '*', '~', '=', '^', '%', '/', '//',

### \server\venv\Lib\site-packages\pygments\lexers\asc.py
- Line 26: '*.asc',  # PGP; *.gpg, *.pgp, and *.sig too, but those can be binary
- Line 27: '*.pem',  # X.509; *.cer, *.crt, *.csr, and key etc too, but those can be binary

### \server\venv\Lib\site-packages\pygments\lexers\asm.py
- Line 41: number = r'(?:0[xX][a-fA-F0-9]+|#?-?\d+)'
- Line 60: (r'([;#]|//).*?\n', Comment.Single, '#pop'),
- Line 62: (r'/[*].*?\n[\w\W]*?[*]/', Comment.Multiline, '#pop'),
- Line 86: (r'([;#]|//).*?\n', Comment.Single, '#pop'),
- Line 88: (r'/[*].*?\n[\w\W]*?[*]/', Comment.Multiline, '#pop'),
- Line 96: (r'([;#]|//).*?\n', Comment.Single),
- Line 292: (r'//.*?\n', Comment.Single),
- Line 591: (r'(?=.)', Text, '#pop'),
- Line 596: (r'(?=.)', Text, '#pop'),
- Line 600: (r'( *)(:(?!:))', bygroups(Whitespace, Keyword), ('#pop', 'vreg_bank_or_class')),
- Line 603: (r'(?=.)', Text, '#pop'),
- Line 611: (r'(?=.)', Text, '#pop'),
- Line 618: (r'(?=.)', Text, '#pop'),
- Line 660: (r'#.*', Comment),
- Line 670: (r'(\.\.\.|(?=---))', Keyword, '#pop'),
- Line 676: (r'#.*', Comment),
- Line 678: (r'(\.\.\.|(?=---))', Keyword, '#pop'),
- Line 711: (r'(\.\.\.|(?=---))', Keyword, '#pop:2'),
- Line 736: identifier = r'[a-z$._?][\w$.?#@~]*'
- Line 785: (r';.*?\n', Comment.Single, '#pop'),
- Line 792: (r'#.*', Comment.Single)
- Line 834: identifier = r'[@a-z$._?][\w$.?#@~]*'
- Line 887: (r';.*?\n', Comment.Single, '#pop'),
- Line 1028: (r';.*?$', Comment, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\asn1.py
- Line 169: (r'/\*', Comment.Multiline, '#push'),
- Line 170: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\automation.py
- Line 37: (r'\%[a-zA-Z_#@$][\w#@$]*\%', Name.Variable),
- Line 45: (r'[a-zA-Z_#@$][\w#@$]*', Name),
- Line 51: (r'^\s*\*/', Comment.Multiline, '#pop'),
- Line 56: (r'^\s*\)', Generic, '#pop'),
- Line 65: r'#IfWinNotExist|#IncludeAgain|#Include|#InstallKeybdHook|'
- Line 318: (r'(#comments-start|#cs)(.|\n)*?(#comments-end|#ce)',
- Line 331: (r'[a-zA-Z_#@$][\w#@$]*', Name),

### \server\venv\Lib\site-packages\pygments\lexers\bare.py
- Line 60: (r'#.*?$', Comment),
- Line 79: (r'#.*?$', Comment, '#pop'),
- Line 98: (r'#.*?$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\basic.py
- Line 36: bmax_sktypes = r'@{1,2}|[!#$%]'
- Line 63: (r'(?:#[\w \t]*)', Name.Label),
- Line 105: (r'"C?', String.Double, '#pop'),
- Line 183: (r'"C?', String.Double, '#pop'),
- Line 208: # ? == Bool // % == Int // # == Float // $ == String
- Line 209: keyword_type_special = r'[?%#$]'
- Line 219: (r'(?i)^#rem\b', Comment.Multiline, 'comment'),
- Line 221: (r'(?i)^(?:#If|#ElseIf|#Else|#EndIf|#End|#Print|#Error)\b', Comment.Preproc),
- Line 267: (r'[(){}!#,.:]', Punctuation),
- Line 288: (r'\s+(?!<)', Whitespace, '#pop'),
- Line 309: (r'(?i)^#rem.*?', Comment.Multiline, "#push"),
- Line 310: (r'(?i)^#end.*?', Comment.Multiline, "#pop"),
- Line 334: r'|if|then|input#?|read|wait|load|save|verify|poke|sys|print#?'
- Line 335: r'|list|clr|cmd|open|close|get#?', Keyword.Reserved),
- Line 455: (r'[a-zA-Z_]\w*[$@#&!]', Name.Variable.Global),
- Line 457: (r'\-?\d*\.\d+[@|#]?', Number.Float),
- Line 458: (r'\-?\d+[@|#]', Number.Float),
- Line 459: (r'\-?\d+#?', Number.Integer.Long),
- Line 460: (r'\-?\d+#?', Number.Integer),
- Line 516: (r'\.[0-9]+(e[+-]?[0-9]+)?', Number.Float),  # Float variant 2, for example: .1, .1e2
- Line 517: (r'[0-9]+e[+-]?[0-9]+', Number.Float),  # Float variant 3, for example: 123e45

### \server\venv\Lib\site-packages\pygments\lexers\bdd.py
- Line 35: (r'^\s*#.*$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\berry.py
- Line 57: (r'#-(.|\n)*?-#', Comment.Multiline),
- Line 58: (r'#.*?$', Comment.Single)
- Line 90: (rf'{_name}(?=\s*\()', Name.Function, '#pop')
- Line 93: (rf'(?<=\.){_name}\b(?!\()', Name.Attribute, '#pop')
- Line 96: (r'"([^\\]|\\.)*?"', String.Double, '#pop'),
- Line 97: (r'\'([^\\]|\\.)*?\'', String.Single, '#pop')

### \server\venv\Lib\site-packages\pygments\lexers\bibtex.py
- Line 151: (r'#-?\d+', Number),

### \server\venv\Lib\site-packages\pygments\lexers\blueprint.py
- Line 52: (r"//.*?\n", Comment.Single),
- Line 56: (r"\*/", Comment.Multiline, "#pop"),

### \server\venv\Lib\site-packages\pygments\lexers\boa.py
- Line 82: (r'#.*?$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\bqn.py
- Line 42: (r'#.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\business.py
- Line 37: # Operators: **, *, +, -, /, <, >, <=, >=, =, <>
- Line 38: # Logical (?): NOT, AND, OR
- Line 206: # \"[^\"\n]*\"|\'[^\'\n]*\'
- Line 492: (r'/\*', Comment.Multiline, '#push'),
- Line 493: (r'\*/', Comment.Multiline, '#pop'),
- Line 538: (r'#.*', Comment.Single),
- Line 614: (r'#.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\capnproto.py
- Line 29: (r'#.*?$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\carbon.py
- Line 38: (r'//(.*?)\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\cddl.py
- Line 110: (rf"#(\d\.{_re_uint})?", Keyword.Type),  # type or any
- Line 116: (r"\?|\+", Operator),  # occurrence
- Line 122: (rf"~(?=\s*{_re_id})", Operator),  # unwrap op
- Line 123: (r"//|/(?!/)", Operator),  # double und single slash
- Line 143: (r"0x[0-9a-fA-F]+(\.[0-9a-fA-F]+)?p[+-]?\d+", Number.Hex),  # hexfloat

### \server\venv\Lib\site-packages\pygments\lexers\chapel.py
- Line 67: (r'//(.*?)\n', Comment.Single),
- Line 119: (r'[a-zA-Z_][\w$]*', Name.Class, '#pop'),
- Line 122: (r'([a-zA-Z_][.\w$]*|'  # regular function name, including secondary
- Line 123: r'\~[a-zA-Z_][.\w$]*|'  # support for legacy destructors
- Line 124: r'[+*/!~%<>=&^|\-:]{1,2})',  # operators
- Line 134: (r'[^()]*', Name.Other, '#pop'),
- Line 137: (r'[a-zA-Z_][.\w$]*', Name.Decorator, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\clean.py
- Line 41: funnyId = r'[~@#$%\^?!+\-*<>\\/|&=:]+'
- Line 63: (r'//.*\n', Comment.Single),
- Line 68: (r'\*\/', Comment.Multiline, '#pop'),
- Line 69: (r'/\*', Comment.Multiline, '#push'),
- Line 93: (r'(\s*)\b(as)\b', bygroups(Whitespace, Keyword), ('#pop', 'import.module.as')),
- Line 165: (r'[-~@#$%\^?!+*<>\\/|&=:.]+', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\codeql.py
- Line 36: (r'//.*?\n', Comment.Single),
- Line 69: (r'@[a-zA-Z_]\w*', Name.Variable),  # Variables with @ prefix
- Line 70: (r'[A-Z][a-zA-Z0-9_]*', Name.Class),  # Types and classes
- Line 71: (r'[a-z][a-zA-Z0-9_]*', Name.Variable),  # Variables and predicates
- Line 75: (r'/\*', Comment.Multiline, '#push'),
- Line 76: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\comal.py
- Line 41: (r'//.*\n', Comment.Single),
- Line 69: (_identifier + r"[$#]?", Name),

### \server\venv\Lib\site-packages\pygments\lexers\configs.py
- Line 45: (r'[;#].*', Comment.Single),
- Line 50: (r'(.*?)([ \t]*)([=:])([ \t]*)([^;#\n]*)(\\)(\s+)',
- Line 54: (r'(.*?)([ \t]*)([=:])([ \t]*)([^ ;#\n]*(?: +[^ ;#\n]+)*)',
- Line 62: (r'[;#].*', Comment.Single),
- Line 69: (r'.*$', String, "#pop"),
- Line 97: (r'^(#.*)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 129: (r'^([;#].*)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 140: (r'^([;#].*)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 172: (r'[;#].*', Comment.Single),
- Line 215: (r'[!#].*|/{2}.*', Comment.Single),
- Line 255: # Kconfig *always* interprets a tab as 8 spaces, so this is the default.
- Line 257: # input (tabs expanded to spaces) and the expansion tab width is != 8,
- Line 307: (r'#.*?\n', Comment.Single),
- Line 329: # Determine the first help line's indentation level heuristically(!).
- Line 366: (r'#.*?\n', Comment),
- Line 430: (r'#(.*\\\n)+.*$|(#.*?)$', Comment),
- Line 558: # XXX: /integer is a subnet mark, but what is /IP ?
- Line 578: (r'\s*TAG:.*', String.Escape, '#pop'),
- Line 613: (r'#.*\n', Comment.Single),
- Line 624: (r'/[^\s;#]*', Name),  # pathname
- Line 644: (r'#.*\n', Comment.Single),
- Line 645: (r'/\S*', Name),  # pathname
- Line 672: _lb = r'(?:\s*\\?\s*)'  # dockerfile line break regex
- Line 677: (r'#.*', Comment),
- Line 755: # match: 1 = <<[-]?, 2 = name 3 = rest of line
- Line 758: yield start, Operator, match.group(1)        # <<[-]?
- Line 785: # end of heredoc not found -- error!
- Line 810: (r'\s*(#|//).*\n', Comment.Single),
- Line 851: (r'/\*', Comment.Multiline, '#push'),
- Line 852: (r'\*/', Comment.Multiline, '#pop'),
- Line 876: # NOTE:
- Line 877: #   * multiline with trailing backslash
- Line 878: #   * separator is ':'
- Line 879: #   * to embed colon as data, we must use \072
- Line 880: #   * space after separator is not allowed (mayve)
- Line 883: (r'^#.*', Comment),
- Line 895: (r'\n[ \t]*', Whitespace, '#pop:2'),
- Line 923: # NOTE:
- Line 924: #   * multiline with leading whitespace
- Line 925: #   * separator is ','
- Line 926: #   * to embed comma as data, we can use \,
- Line 927: #   * space after separator is allowed
- Line 930: (r'^#.*$', Comment),
- Line 950: (r'(,)([ \t]*)', bygroups(Punctuation, Whitespace), '#pop'),
- Line 972: (r'#.*$', Comment.Single),
- Line 1003: (r'#.*$', Comment.Single, '#pop'),
- Line 1041: (r'#.*$', Comment.Single),
- Line 1108: (r'\(\*', Comment.Multiline, '#push'),
- Line 1109: (r'\*\)', Comment.Multiline, '#pop'),
- Line 1143: # Note that we make an effort in order to distinguish
- Line 1155: (r'#.*', Comment.Single),
- Line 1185: (r'\]\]?', Keyword, '#pop'),
- Line 1197: (r'[+-]?\d[0-9_]*[eE][+-]?\d[0-9_]*', Number.Float, '#pop'),
- Line 1202: (r'[+-]?(inf|nan)', Number.Float, '#pop'),
- Line 1205: (r'-?0b[01_]+', Number.Bin, '#pop'),
- Line 1206: (r'-?0o[0-7_]+', Number.Oct, '#pop'),
- Line 1207: (r'-?0x[0-9a-fA-F_]+', Number.Hex, '#pop'),
- Line 1208: (r'[+-]?[0-9_]+', Number.Integer, '#pop'),
- Line 1229: (r'#.*', Comment.Single),
- Line 1241: # Note that unlike inline arrays, inline tables do not
- Line 1263: (r".*?'", String.Single, '#pop'),
- Line 1300: (r'^([ ]*)(#.*)$', bygroups(Whitespace, Comment)),
- Line 1386: (r'\s*#.*?\n', Comment),
- Line 1392: (r'(.+?(?=^\s*%))|(.*)', using(BashLexer), '#pop'),
- Line 1426: (r'^#.*', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\console.py
- Line 63: (r"\[\w+\] jit-log-.*?}$", Keyword, "#pop"),
- Line 112: (r"#.*?$", Comment),

### \server\venv\Lib\site-packages\pygments\lexers\crystal.py
- Line 43: # match: 1 = <<-?, 2 = quote? 3 = name 4 = quote? 5 = rest of line
- Line 46: yield start, Operator, match.group(1)        # <<-?
- Line 82: # end of heredoc not found -- error!
- Line 150: (rbrace + '[imsx]*', String.Regex, '#pop'),
- Line 162: (r'#.*?$', Comment.Single),
- Line 237: # better ideas?)
- Line 238: # since pygments 0.7 we also eat a "?" operator after numbers
- Line 242: #   x>=0?n[x]:""
- Line 271: (r'\?(\\[MC]-)*'  # modifiers
- Line 283: # like keywords (class) or like this: ` ?!?
- Line 288: # Names can end with [!?] unless it's "!="
- Line 342: (r'/[imsx]*', String.Regex, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\csound.py
- Line 23: newline = (r'((?:(?:;|//).*)*)(\n)', bygroups(Comment.Single, Text))
- Line 33: (r'(?:;|//).*$', Comment.Single),
- Line 38: (r'#(?:e(?:nd(?:if)?|lse)\b|##)|@@?[ \t]*\d+', Comment.Preproc),
- Line 41: (r'#[ \t]*define', Comment.Preproc, 'define directive'),
- Line 42: (r'#(?:ifn?def|undef)\b', Comment.Preproc, 'macro directive')
- Line 47: (r'([^ \t]).*?\1', String, '#pop')
- Line 59: (r'[A-Z_a-z]\w*', Comment.Preproc, ('#pop', 'before macro body'))
- Line 73: (r'(?:\\(?!#)|[^#\\]|\n)+', Comment.Preproc),
- Line 75: (r'(?<!\\)#', Punctuation, '#pop')
- Line 80: (r'[A-Z_a-z]\w*', Comment.Preproc, '#pop')
- Line 89: (r'(?:[^\'#"{()]|\{(?!\{))+', Comment.Preproc),
- Line 160: # https://github.com/csound/csound/search?q=stof+path%3AEngine+filename%3Asread.c.
- Line 167: (r'[!+\-*/^%&|<>#~.]', Operator),
- Line 185: (r'[A-Z_a-z]\w*', Comment.Preproc, ('#pop', 'loop'))
- Line 260: (r'\+=|-=|\*=|/=|<<|>>|<=|>=|==|!=|&&|\|\||[~¬]|[=!+\-*/^%&|<>#?:]', Operator),
- Line 299: (r'[A-Z_a-z]\w*', opcode_name_callback, ('#pop', 'opcode type signatures')),
- Line 305: # https://github.com/csound/csound/search?q=XIDENT+path%3AEngine+filename%3Acsound_orc.lex
- Line 328: # https://github.com/csound/csound/search?q=unquote_string+path%3AEngine+filename%3Acsound_orc_compile.c
- Line 349: (r'%[#0\- +]*\d*(?:\.\d+)?[AE-GXac-giosux]', String.Interpol),
- Line 431: (r'(?:;|//).*$', Comment.Single),
- Line 443: (r'<\s*/\s*CsInstruments\s*>', Name.Tag, '#pop'),
- Line 447: (r'<\s*/\s*CsScore\s*>', Name.Tag, '#pop'),
- Line 451: (r'<\s*/\s*[Hh][Tt][Mm][Ll]\s*>', Name.Tag, '#pop'),
- Line 458: (r'/?\s*>', Name.Tag, '#pop')
- Line 462: (r'".*?"', String, '#pop'),
- Line 463: (r"'.*?'", String, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\css.py
- Line 146: # Note! Handle url(...) separately.
- Line 342: (r'//[^\n]*', Comment.Single),
- Line 373: (r'(\\.|#(?=[^\n{])|[^\n"#])+', String.Double),
- Line 379: (r"(\\.|#(?=[^\n{])|[^\n'#])+", String.Single),
- Line 385: (r'(\\#|#(?=[^\n{])|[^\n#)])+', String.Other),
- Line 467: (r'//[^\n]*', _starts_block(Comment.Single, 'single-comment'),
- Line 517: (r"(\\#|#(?=[^\n{])|\*(?=[^\n/])|[^\n#*])+", Comment.Multiline),
- Line 519: (r"\*/", Comment, '#pop'),
- Line 544: (r'//.*?\n', Comment.Single),
- Line 555: # TODO: broken, and prone to infinite loops.
- Line 556: # (r'(?=[^;{}][;}])', Name.Attribute, 'attr'),
- Line 557: # (r'(?=[^;{}:]+:[^a-z])', Name.Attribute, 'attr'),
- Line 569: (r"(\\#|#(?=[^{])|\*(?=[^/])|[^#*])+", Comment.Multiline),
- Line 571: (r"\*/", Comment, '#pop'),
- Line 599: (r'//.*\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\c_cpp.py
- Line 28: # The trailing ?, rather than *, avoids a geometric performance drop here.
- Line 29: #: only one /* */ style comment
- Line 46: # Beware not to use *? for the inner content! When these regexes
- Line 47: # are embedded in larger regexes, that can cause the stuff*? to
- Line 50: _comment_single = r'//(?:.|(?<=\\)\n)*\n'
- Line 138: (r'(' + _namespaced_ident + r'(?:[&*\s])+)'  # return arguments
- Line 142: r'(\([^;"\')]*?\))'                         # signature
- Line 151: (r'(' + _namespaced_ident + r'(?:[&*\s])+)'  # return arguments
- Line 155: r'(\([^;"\')]*?\))'                         # signature
- Line 195: (r'//.*?\n', Comment.Single, '#pop'),
- Line 201: (r'^\s*#if.*?(?<!\\)\n', Comment.Preproc, '#push'),
- Line 202: (r'^\s*#el(?:se|if).*\n', Comment.Preproc, '#pop'),
- Line 203: (r'^\s*#endif.*?(?<!\\)\n', Comment.Preproc, '#pop'),
- Line 209: (r'\s*(?=>)', Text, '#pop'),
- Line 214: (r'(?<!:)(:)(?!:)', Punctuation, '#pop'),
- Line 316: if re.search(r'^\s*#include [<"]', text, re.MULTILINE):
- Line 318: if re.search(r'^\s*#ifn?def ', text, re.MULTILINE):
- Line 378: (r'\s*(?=>)', Text, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\c_like.py
- Line 59: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),
- Line 61: (r'\s*(?=>)', Whitespace, '#pop'),
- Line 108: (r'//.*?$', Comment.Single),
- Line 192: (r'^\s*#if\s+0', Comment.Preproc, 'if0'),
- Line 196: (r'//(\n|(.|\n)*?[^\\]\n)', Comment.Single),
- Line 203: (r'(?s)""".*?"""', String),  # verbatim strings
- Line 212: # TODO: "correctly" parse complex code attributes
- Line 263: (r'^\s*#if.*?(?<!\\)\n', Comment.Preproc, '#push'),
- Line 264: (r'^\s*#el(?:se|if).*\n', Comment.Preproc, '#pop'),
- Line 265: (r'^\s*#endif.*?(?<!\\)\n', Comment.Preproc, '#pop'),
- Line 269: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 272: (r'[a-zA-Z_][\w.]*', Name.Namespace, '#pop')
- Line 347: (r'##*[a-zA-Z_]\w*', Comment.Preproc),

### \server\venv\Lib\site-packages\pygments\lexers\d.py
- Line 35: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 125: (r'(#line)(\s)(.*)(\n)', bygroups(Comment.Special, Whitespace,
- Line 203: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 238: r'|[-/.&$@|\+<>!()\[\]{}?,;:=*%^~#\\]', Punctuation),
- Line 244: (r'/\*', Comment.Multiline, '#push'),
- Line 245: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\dalvik.py
- Line 83: (r'<(?:cl)?init>', Name.Function),  # constructor
- Line 105: (r'#.*?\n', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\data.py
- Line 171: (r'[ ]+(?=#|$)', Whitespace),
- Line 175: (r'#[^\n]*', Comment.Single),
- Line 191: (r'[ ]+(?=#|$)', Whitespace),
- Line 193: (r'#[^\n]*', Comment.Single),
- Line 217: (r'[ ]*$', something(Whitespace), '#pop:2'),
- Line 223: (r'[ ]*', save_indent(Whitespace), '#pop'),
- Line 229: (r'[ ]*(?=#|$)', something(Whitespace), '#pop'),
- Line 233: (r'''([^#,?\[\]{}"'\n]+)(:)(?=[ ]|$)''',
- Line 242: (r'(?=[^\s?:,\[\]{}#&*!|>\'"%@`-]|[?:-]\S)',
- Line 250: (r'!<[\w#;/?:@&=+$,.!~*\'()\[\]%-]+>', Keyword.Type),
- Line 251: # a tag in the form '!', '!suffix' or '!handle!suffix'
- Line 253: r'[\w#;/?:@&=+$,.!~*\'()\[\]%-]*', Keyword.Type),
- Line 288: (r'#[^\n]*', Comment.Single),
- Line 296: (r'(?=[^\s?:,\[\]{}#&*!|>\'"%@`])',
- Line 390: (r'^(?=---|\.\.\.)', something(Name.Namespace), '#pop:3'),
- Line 392: (r'^[ ]*', parse_plain_scalar_indent(Whitespace), '#pop'),
- Line 398: (r'[ ]*(?=:[ ]|:$)', something(Whitespace), '#pop'),
- Line 400: (r'[ ]+(?=#)', Whitespace, '#pop'),
- Line 414: (r'[ ]*(?=[,:?\[\]{}])', something(Whitespace), '#pop'),
- Line 416: (r'[ ]+(?=#)', Whitespace, '#pop'),
- Line 440: Javascript-style comments are supported (like ``/* */`` and ``//``),
- Line 482: expecting_second_comment_opener = False  # // or /*
- Line 483: expecting_second_comment_closer = False  # */

### \server\venv\Lib\site-packages\pygments\lexers\dax.py
- Line 33: (r"--.*\n?", Comment.Single),	# Comment: Double dash comment
- Line 34: (r"//.*\n?", Comment.Single),	# Comment: Double backslash comment
- Line 104: prefix=r'(?i)', suffix=r'\b'), Name.Function), #Functions
- Line 111: prefix=r'(?i)', suffix=r'\b'), Name.Builtin), # Keyword
- Line 119: (r'(?<!\w)(\d+\.?\d*|\.\d+\b)', Number),# Number
- Line 126: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\devicetree.py
- Line 30: #: optional Whitespace or /*...*/ style comment
- Line 52: (r'//(\n|[\w\W]*?[^\\]\n)', Comment.Single),
- Line 61: (r'([^\s{}/*]*)(\s*)(:)', bygroups(Name.Label, Text, Punctuation), '#pop'),
- Line 65: (r'([~!%^&*+=|?:<>/#-])', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\dns.py
- Line 53: # TODO, $GENERATE https://bind9.readthedocs.io/en/v9.18.14/chapter3.html#soa-rr

### \server\venv\Lib\site-packages\pygments\lexers\dotnet.py
- Line 39: * ``full`` -- all Unicode characters as specified in the C# specs
- Line 79: (r'^([ \t]*)((?:' + cs_ident + r'(?:\[\])?\s+)+?)'  # return type
- Line 81: r'(\s*)(\()',                               # signature start
- Line 87: (r'//.*?\n', Comment.Single),
- Line 104: (r'(#)([ \t]*)(if|endif|else|elif|define|undef|'
- Line 160: (r'(?=\()', Text, '#pop'),  # using (resource)
- Line 190: * ``full`` -- all Unicode characters as specified in the C# specs
- Line 227: (r'^([ \t]*)((?:' + cs_ident + r'(?:\[\])?\s+)+?)'  # return type
- Line 229: r'(\s*)(\()',                               # signature start
- Line 235: (r'//.*?\n', Comment.Single),
- Line 240: (r'(\$)(\s*)(<#)', bygroups(String, Whitespace, String),
- Line 260: (r'(#)([ \t]*)(if|endif|else|elif|define|undef|'
- Line 297: (r'(?=\()', Text, '#pop'),  # using (resource)
- Line 368: (r'(#|//).*$', Comment.Single),
- Line 405: ('/[*]', Comment.Multiline, '#push'),
- Line 406: ('[*]/', Comment.Multiline, '#pop'),
- Line 411: (r'[a-zA-Z_]\w*', Name.Function, '#pop')
- Line 414: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 417: (r'[a-zA-Z_][\w.]*', Name.Namespace, '#pop')
- Line 432: mimetypes = ['text/x-vbnet', 'text/x-vba']  # (?)
- Line 447: (r'#If\s.*?\sThen|#ElseIf\s.*?\sThen|#Else|#End\s+If|#Const|'
- Line 448: r'#ExternalSource.*?\n|#End\s+ExternalSource|'
- Line 449: r'#Region.*?\n|#End\s+Region|#ExternalChecksum',
- Line 451: (r'[(){}!#,.:]', Punctuation),
- Line 494: (uni_name + '[%&@!#$]?', Name),
- Line 495: ('#.*?#', Literal.Date),
- Line 503: (r'"C?', String, '#pop'),
- Line 530: if re.search(r'^\s*(#If|Module|Namespace)', text, re.MULTILINE):
- Line 548: (r'(<%[@=#]?)(.*?)(%>)', bygroups(Name.Tag, Other, Name.Tag)),
- Line 558: # TODO support multiple languages within the same source file
- Line 575: if re.search(r'Page\s*Language="C#"', text, re.I) is not None:
- Line 636: '!=', '#', '&&', '&', r'\(', r'\)', r'\*', r'\+', ',', r'-\.',
- Line 669: (r'(///.*?)(\n)', bygroups(String.Doc, Whitespace)),
- Line 670: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 691: (r'(#)([ \t]*)(if|endif|else|line|nowarn|light|\d+)\b(.*?)(\n)',
- Line 717: (r'[A-Z][\w\']*', Name, '#pop'),
- Line 718: (r'[a-z_][\w\']*', Name, '#pop'),
- Line 724: (r'\(\*', Comment, '#push'),
- Line 725: (r'\*\)', Comment, '#pop'),
- Line 737: (r'"B?', String, '#pop'),
- Line 743: (r'"B?', String, '#pop'),
- Line 748: (r'"""B?', String, '#pop'),
- Line 829: (r'(\s*)\b(else|if)\b([^\n])', bygroups(Whitespace, Keyword, using(this))), # ensure that if is not treated like a function
- Line 830: (r'^([ \t]*)((?:' + XPP_CHARS + r'(?:\[\])?\s+)+?)'  # return type
- Line 832: r'(\s*)(\()',                               # signature start
- Line 838: (r'//[^\n]*?\n', Comment.Single),
- Line 854: (r'(\s*)(\w+)(\s+\w+(,|=)?[^\n]*;)', bygroups(Whitespace, Name.Variable.Class, using(this))), # declaration
- Line 870: (r'(?=\()', Text, '#pop'),  # using (resource)

### \server\venv\Lib\site-packages\pygments\lexers\dsls.py
- Line 70: (r'[a-zA-Z_]\w*', Name.Namespace, '#pop'),
- Line 74: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),
- Line 78: (r'[a-zA-Z_]\w*', Name, '#pop'),
- Line 105: (r'((?:(?:[^\W\d]|\$)[\w.\[\]$<>]*\s+)+?)'  # return arguments
- Line 106: r'((?:[^\W\d]|\$)[\w$]*)'                  # method name
- Line 107: r'(\s*)(\()',                              # signature start
- Line 120: (r'#.*$', Comment),
- Line 121: (r'//.*?\n', Comment),
- Line 136: (r'[a-z*](\.\w|\w)*', Name.Namespace, '#pop'),
- Line 140: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),
- Line 226: (r'#.*$', Comment),
- Line 320: # The "ternary if", which uses '?' and ':', could instead be
- Line 323: # less-prominent Punctuation is used even with '?' for consistency.
- Line 374: (r'(\s*)(#.*)$', bygroups(Whitespace, Comment)),
- Line 482: r'\.>|\+\+|-\\|<->|=>|:-|~=|\*\*|<<|>>=|\+>|!!|\|=\||#)',
- Line 542: (r'(?://|#).*?\n', Comment.Single),
- Line 571: (r'[~^*#!%&\[\]()<>|+=:;,./?-]', Operator),
- Line 623: (r'//.*?$', Comment.Single),
- Line 639: (r'!|#|&&|\+\+|<<|>>|>=|<=>|<=|\.\.|\.|->', Operator),
- Line 689: (r'#.*', Comment),
- Line 734: 'tag'), suffix=r'(?![\w#$-])')
- Line 737: 'attributes', 'utilization'), suffix=r'(?![\w#$-])')
- Line 738: acl = words(('read', 'write', 'deny'), suffix=r'(?![\w#$-])')
- Line 739: bin_rel = words(('and', 'or'), suffix=r'(?![\w#$-])')
- Line 740: un_ops = words(('defined', 'not_defined'), suffix=r'(?![\w#$-])')
- Line 741: date_exp = words(('in_range', 'date', 'spec', 'in'), suffix=r'(?![\w#$-])')
- Line 750: (r'^(#.*)(\n)?', bygroups(Comment, Whitespace)),
- Line 752: (r'([\w#$-]+)(=)("(?:""|[^"])*"|\S+)',
- Line 766: (rf'(?:{val_qual}:)?({bin_ops})(?![\w#$-])', Operator.Word),
- Line 772: (r'#[a-z]+(?![\w#$-])', Name.Builtin),
- Line 778: (rf'([\w#$-]+)(?:(:)({rsc_role_action}))?(?![\w#$-])',
- Line 825: valid_name = r'(?!#)[\w!$%*+<=>?/.#-]+'
- Line 930: (r'//.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\dylan.py
- Line 117: (r'//.*?\n', Comment.Single),
- Line 130: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 163: (r'(=>|::|#\(|#\[|##|\?\?|\?=|\?|[(){}\[\],.;])', Punctuation),
- Line 195: (r'/\*', Comment.Multiline, '#push'),
- Line 196: (r'\*/', Comment.Multiline, '#pop'),
- Line 232: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),

### \server\venv\Lib\site-packages\pygments\lexers\ecl.py
- Line 61: (r'^#.*$', Comment.Preproc),

### \server\venv\Lib\site-packages\pygments\lexers\eiffel.py
- Line 34: # Please note that keyword and operator are case insensitive.
- Line 55: (r"(//|\\\\|>=|<=|:=|/=|~|/~|[\\?!#%&@|+/\-=>*$<^\[\]])", Operator),

### \server\venv\Lib\site-packages\pygments\lexers\elm.py
- Line 110: (r'\w+(\.\w+)*', Name.Class, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\elpi.py
- Line 34: schar2_re = r"([+*^?/<>`'@#~=&!])"

### \server\venv\Lib\site-packages\pygments\lexers\email.py
- Line 52: (r"\n(?![ \t])", Text.Whitespace, "#pop"),
- Line 101: (r"(=\?)([\w-]+)(\?)([BbQq])(\?)([\[\w!\"#$%&\'()*+,-./:;<=>@[\\"

### \server\venv\Lib\site-packages\pygments\lexers\erlang.py
- Line 104: (r'[+-]?' + base_re + r'#[0-9a-zA-Z]+', Number.Integer),
- Line 112: (r'#'+atom_re+r'(:?\.'+atom_re+r')?', Name.Label),
- Line 115: (r'\A#!.+\n', Comment.Hashbang),
- Line 124: (r'~[0-9.*]*[~#+BPWXb-ginpswx]', String.Interpol),
- Line 144: (r'(?=\})', Punctuation, '#pop'),
- Line 208: (rf'{term}[a-zA-Z]*', token, '#pop'),
- Line 215: (rf'{term}[a-zA-Z]*', token, '#pop'),
- Line 315: (r'^(\s*)(' + term + ')', bygroups(Whitespace, String.Heredoc), '#pop'),
- Line 319: (r'^(\s*)(' + term +')', bygroups(Whitespace, String.Heredoc), '#pop'),
- Line 353: (r'#.*$', Comment.Single),
- Line 414: (r'^(\s*)(""")', bygroups(Whitespace, String.Heredoc), '#pop'),
- Line 418: (r"^\s*'''", String.Heredoc, '#pop'),
- Line 455: (r'(?=\})', Punctuation, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\esoteric.py
- Line 91: (r'[+*/%!`-]', Operator),             # Traditional math
- Line 92: (r'[<>^v?\[\]rxjk]', Name.Variable),  # Move, imperatives
- Line 96: (r'".*?"', String.Double),            # Strings don't appear to allow escapes
- Line 119: (r'^(\s*)(#.*)(\n)', bygroups(Whitespace, Comment.Preproc,
- Line 125: (r'//.*$', Comment),
- Line 178: at https://github.com/seL4/capdl/tree/master/capDL-tool. Note that this
- Line 193: (r'^(\s*)(#.*)(\n)',
- Line 199: (r'(//|--).*$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\ezhil.py
- Line 36: (r'#.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\factor.py
- Line 195: (r'#!.*$', Comment.Preproc),
- Line 293: (r'#!\s+.*$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\fantom.py
- Line 47: (r'(?s)/\*.*?\*/', Comment.Multiline),           # Multiline
- Line 48: (r'//.*?$', Comment.Single),                    # Single line
- Line 49: # TODO: highlight references in fandocs
- Line 50: (r'\*\*.*?$', Comment.Special),                 # Fandoc
- Line 51: (r'#.*$', Comment.Single)                       # Shell-style
- Line 54: (r'\b-?[\d_]+(ns|ms|sec|min|hr|day)', Number),   # Duration
- Line 55: (r'\b-?[\d_]*\.[\d_]+(ns|ms|sec|min|hr|day)', Number),  # Duration with dot
- Line 56: (r'\b-?(\d+)?\.\d+(f|F|d|D)?', Number.Float),    # Float/Decimal
- Line 57: (r'\b-?0x[0-9a-fA-F_]+', Number.Hex),            # Hex
- Line 58: (r'\b-?[\d_]+', Number.Integer),                 # Int
- Line 63: (r'(?:(\w+)(::))?(\w+)(<\|)(.*?)(\|>)',          # DSL
- Line 66: (r'(?:(\w+)(::))?(\w+)?(#)(\w+)?',               # Type/slot literal
- Line 81: (r'\$\{.*?\}', String.Interpol),                 # Subst expr
- Line 85: 'insideUri': [  # TODO: remove copy/paste str/uri
- Line 90: (r'\$\{.*?\}', String.Interpol),                 # Subst expr
- Line 164: r'($id)(\s*)(\()'),  # method name + open brace

### \server\venv\Lib\site-packages\pygments\lexers\felix.py
- Line 165: (r'(#)(\s*)(if)(\s+)(0)',
- Line 175: (r'//(.*?)$', Comment.Single),
- Line 180: (r'/[*]', Comment.Multiline, '#push'),
- Line 181: (r'[*]/', Comment.Multiline, '#pop'),
- Line 185: (r'^(\s*)(#if.*?(?<!\\))(\n)',
- Line 187: (r'^(\s*)(#endif.*?(?<!\\))(\n)',
- Line 200: # (r'/[*](.|\n)*?[*]/', Comment),
- Line 201: # (r'//.*?\n', Comment, '#pop'),
- Line 208: (r'[a-zA-Z_]\w*', Name.Function, '#pop'),
- Line 210: (r'(?=\()', Text, '#pop'),
- Line 214: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),
- Line 216: (r'(?=\{)', Text, '#pop'),
- Line 225: (r'([a-zA-Z_]\w*)', Name.Namespace, '#pop:2'),
- Line 241: (r'%(\([a-zA-Z0-9]+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'

### \server\venv\Lib\site-packages\pygments\lexers\fift.py
- Line 59: (r'//.*', Comment.Singleline),
- Line 64: (r'/\*', Comment.Multiline, '#push'),
- Line 65: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\floscript.py
- Line 32: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'

### \server\venv\Lib\site-packages\pygments\lexers\forth.py
- Line 46: # *** Wordset BLOCK
- Line 48: # *** Wordset BLOCK-EXT
- Line 50: # *** Wordset CORE
- Line 51: r'\#s|\*\/mod|\+loop|\/mod|0<|0=|1\+|1-|2!|'
- Line 66: r'@|!|\#|<\#|\#>|:|;|\+|-|\*|\/|,|<|>|\|1\+|1-|\.|'
- Line 67: # *** Wordset CORE-EXT
- Line 75: # *** Wordset CORE-EXT-obsolescent
- Line 78: # *** Wordset DOUBLE
- Line 82: # *** Wordset DOUBLE-EXT
- Line 84: # *** Wordset EXCEPTION
- Line 86: # *** Wordset EXCEPTION-EXT
- Line 88: # *** Wordset FACILITY
- Line 90: # *** Wordset FACILITY-EXT
- Line 92: # *** Wordset FILE
- Line 97: # *** Wordset FILE-EXT
- Line 99: # *** Wordset FLOAT
- Line 106: # *** Wordset FLOAT-EXT
- Line 114: # *** Wordset LOCAL
- Line 116: # *** Wordset LOCAL-EXT
- Line 118: # *** Wordset MEMORY
- Line 120: # *** Wordset SEARCH
- Line 124: # *** Wordset SEARCH-EXT
- Line 126: # *** Wordset STRING
- Line 129: # *** Wordset TOOLS
- Line 131: # *** Wordset TOOLS-EXT
- Line 135: # *** Wordset TOOLS-EXT-obsolescent
- Line 145: (r'(\#|%|&|\-|\+)?[0-9]+', Number.Integer),
- Line 146: (r'(\#|%|&|\-|\+)?[0-9.]+', Keyword.Type),

### \server\venv\Lib\site-packages\pygments\lexers\fortran.py
- Line 33: # Operators: **, *, +, -, /, <, >, <=, >=, ==, /=
- Line 34: # Logical (?): NOT, AND, OR, EQV, NEQV
- Line 41: (r'^#.*\n', Comment.Preproc),
- Line 196: (r'#.*\n', Comment.Preproc),

### \server\venv\Lib\site-packages\pygments\lexers\foxpro.py
- Line 38: (r';\s*\n', Punctuation),  # consume newline
- Line 346: (r'\*.*?$', Comment.Single, '#pop'),
- Line 422: (r'#\s*(IF|ELIF|ELSE|ENDIF|DEFINE|IFDEF|IFNDEF|INCLUDE)',
- Line 424: (r'(m\.)?[a-z_]\w*', Name.Variable, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\func.py
- Line 76: (r'(>=|<=|=|>|<|\^)?([0-9]+)(.[0-9]+)?(.[0-9]+)?', Number), # version

### \server\venv\Lib\site-packages\pygments\lexers\futhark.py
- Line 48: # opstart_re = '+\-\*/%=\!><\|&\^'
- Line 59: (r'#\[([a-zA-Z_\(\) ]*)\]', Comment.Preproc),
- Line 60: (rf'[#!]?({identifier_re}\.)*{identifier_re}', Name),

### \server\venv\Lib\site-packages\pygments\lexers\gdscript.py
- Line 39: (r"%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?"
- Line 58: (r"#.*$", Comment.Single),
- Line 139: "funcname": [(r"[a-zA-Z_]\w*", Name.Function, "#pop"), default("#pop")],
- Line 140: "classname": [(r"[a-zA-Z_]\w*", Name.Class, "#pop")],

### \server\venv\Lib\site-packages\pygments\lexers\gleam.py
- Line 39: (r'(///.*?)(\n)', bygroups(String.Doc, Whitespace)),
- Line 40: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 48: (r'(#|!=|!|==|\|>|\|\||\||\->|<\-|&&|<<|>>|\.\.|\.|=)', Punctuation),

### \server\venv\Lib\site-packages\pygments\lexers\go.py
- Line 34: (r'//(.*?)$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\grammar_notation.py
- Line 96: (r'%b[01]+(\.[01]+)*\b', Literal),  # concat
- Line 100: (r'%d[0-9]+(\.[0-9]+)*\b', Literal),  # concat
- Line 104: (r'%x[0-9a-fA-F]+(\.[0-9a-fA-F]+)*\b', Literal),  # concat
- Line 106: # repetition (<a>*<b>element) including nRule
- Line 116: # nonterminals (ALPHA *(ALPHA / DIGIT / "-"))
- Line 151: (r'//.*$', Comment.Single),
- Line 154: (r'\A#JSGF[^;]*', Comment.Preproc),
- Line 192: (r'\*/', Comment.Multiline, '#pop'),
- Line 237: (r'#.*$', Comment.Single),
- Line 257: (r'[^\s<←:=/|&!?*+\^↑~()\[\]"\'#]+', Name.Class),

### \server\venv\Lib\site-packages\pygments\lexers\graph.py
- Line 106: (r'//.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\graphics.py
- Line 33: (r'#(?:.*\\\n)*.*$', Comment.Preproc),
- Line 34: (r'//.*$', Comment.Single),
- Line 38: (r'[?:]', Operator),  # quick hack for ternary
- Line 41: # FIXME when e is present, no decimal point needed
- Line 164: (r'#(?:.*\\\n)*.*$', Comment.Preproc),
- Line 165: (r'//.*$', Comment.Single),
- Line 169: (r'[?:]', Operator),  # quick hack for ternary
- Line 172: # FIXME when e is present, no decimal point needed
- Line 338: (r'[0-9]+\#(\-|\+)?([0-9]+\.?|[0-9]*\.[0-9]+|[0-9]+\.[0-9]*)'
- Line 353: # trawling documentation?
- Line 411: _ws = r'(?:\s|//.*?\n|/\*.*?\*/)+'
- Line 418: (r'//(\n|(.|\n)*?[^\\]\n)', Comment),
- Line 441: # Of course it is not perfect !
- Line 453: # except yours !
- Line 465: (r'((?:[\w*\s])+?(?:\s|\*))'  # return arguments
- Line 466: r'([a-zA-Z_]\w*)'            # method name
- Line 467: r'(\s*\([^;]*?\))'           # signature
- Line 473: (r'((?:[\w*\s])+?(?:\s|\*))'  # return arguments
- Line 474: r'([a-zA-Z_]\w*)'            # method name
- Line 475: r'(\s*\([^;]*?\))'           # signature
- Line 565: (r'@[a-zA-Z_]\w*', Name.Constant),  # macros
- Line 614: (r'@[a-zA-Z_]\w*', Name.Constant),  # macros
- Line 650: ('!', Keyword, '#pop'),
- Line 700: (r'//.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\graphql.py
- Line 70: (r"#.*$", Comment),
- Line 75: (r"-?\d+(?![.eE])", Number.Integer, "#pop"),
- Line 83: (r"\$[a-zA-Z_]\w*", Name.Variable, "#pop"),
- Line 84: (r"[a-zA-Z_]\w*", Name.Constant, "#pop"),
- Line 129: (r"[a-zA-Z_]\w*", Name.Class, "#pop"),
- Line 134: (r"[a-zA-Z_]\w*", Name),  # Field
- Line 159: (r"[\]!]", Punctuation),  # For NamedType
- Line 168: (r"[a-zA-Z_]\w*", Name, "#pop"),  # Fragment name
- Line 172: (r"[a-zA-Z_]\w*", Name.Class),  # Type condition

### \server\venv\Lib\site-packages\pygments\lexers\graphviz.py
- Line 32: (r'(#|//).*?$', Comment.Single),
- Line 41: (r'\b\D\w*', Name.Tag),  # node
- Line 43: (r'"(\\"|[^"])*?"', Name.Tag),  # quoted node
- Line 47: (r'\b\D\w*', String, '#pop'),
- Line 48: (r'[-]?((\.[0-9]+)|([0-9]+(\.[0-9]*)?))', Number, '#pop'),
- Line 49: (r'"(\\"|[^"])*?"', String.Double, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\gsql.py
- Line 47: (r'\#.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\hare.py
- Line 28: _ws = r'(?:\s|//.*?\n|/[*].*?[*]/)+'
- Line 37: (r'//.*?$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\haskell.py
- Line 47: # (r'--\s*|.*$', Comment.Doc),
- Line 48: (r'--(?![!#$%&*+./<=>?@^|_~:\\]).*?$', Comment.Single),
- Line 61: (r"(')\[[^\]]*\]", Keyword.Type),  # tuples and lists get special treatment in GHC
- Line 62: (r"(')\([^)]*\)", Keyword.Type),  # ..
- Line 63: (r"(')[:!#$%&*+.\\/<=>?@^|~-]+", Keyword.Type),  # promoted type operators
- Line 65: (r'\\(?![:!#$%&*+.\\/<=>?@^|~-]+)', Name.Function),  # lambda operator
- Line 66: (r'(<-|::|->|=>|=)(?![:!#$%&*+.\\/<=>?@^|~-]+)', Operator.Word),  # specials
- Line 67: (r':[:!#$%&*+.\\/<=>?@^|~-]*', Keyword.Type),  # Constructor operators
- Line 68: (r'[:!#$%&*+.\\/<=>?@^|~-]+', Operator),  # Other operators
- Line 110: (r'[' + uni.Lu + r'][\w.]*', Name.Namespace, '#pop'),
- Line 116: (r'--(?![!#$%&*+./<=>?@^|_~:\\]).*?$', Comment.Single),
- Line 119: (r'[:!#$%&*+.\\/<=>?@^|~-]+', Operator),
- Line 120: # (HACK, but it makes sense to push two instances, believe me)
- Line 124: # NOTE: the next four states are shared in the AgdaLexer; make sure
- Line 213: (r'(\s*)(--(?![!#$%&*+./<=>?@^|_~:\\]).*?)$', bygroups(Whitespace, Comment.Single)),
- Line 226: (r'([(){}\[\]:!#$%&*+.\\/<=>?@^|~-]+)', Operator.Word),  # specials
- Line 236: (r'\s+?', Whitespace),  # Whitespace
- Line 242: (r'[A-Z][\w.]*', Name.Namespace, '#pop'),
- Line 251: (r'[:!#$%&*+.\\/<=>?@^|~-]+', Operator),
- Line 252: # (HACK, but it makes sense to push two instances, believe me)
- Line 256: # NOTE: the next four states are shared in the AgdaLexer; make sure
- Line 318: (r'--(?![!#$%&*+./<=>?@^|_~:\\]).*?$', Comment.Single),
- Line 340: (r'\s+?', Whitespace),  # Whitespace
- Line 345: (r'\{!', Comment.Directive, '#push'),
- Line 346: (r'!\}', Comment.Directive, '#pop'),
- Line 351: (r'[a-zA-Z][\w.\']*', Name, '#pop'),
- Line 385: # (r'--\s*|.*$', Comment.Doc),
- Line 386: (r'//.*$', Comment.Single),
- Line 398: (r'\\(?![:!#$%&*+.\\/<=>?@^|~-]+)', Name.Function),  # lambda operator
- Line 399: (r'(<-|::|->|=>|=)(?![:!#$%&*+.\\/<=>?@^|~-]+)', Operator.Word),  # specials
- Line 400: (r':[:!#$%&*+.\\/<=>?@^|~-]*', Keyword.Type),  # Constructor operators
- Line 401: (r'[:!#$%&*+.\\/<=>?@^|~-]+', Operator),  # Other operators
- Line 439: (r'[A-Z][\w.]*', Name.Namespace, '#pop'),
- Line 445: # TODO: these don't match the comments in docs, remove.
- Line 446: # (r'--(?![!#$%&*+./<=>?@^|_~:\\]).*?$', Comment.Single),
- Line 449: (r'[:!#$%&*+.\\/<=>?@^|~-]+', Operator),
- Line 450: # (HACK, but it makes sense to push two instances, believe me)
- Line 457: (r'/\*', Comment.Multiline, '#push'),
- Line 458: (r'\*/', Comment.Multiline, '#pop'),
- Line 728: # special sequences of tokens (we use ?: for non-capturing group as
- Line 784: (r'(?=\((?!,*\)))', Punctuation, '#pop'),
- Line 818: (r'_\w*', tokenType.Variable),  # Generic.Emph
- Line 833: (r'(\n\s*)(#.*)$', bygroups(Whitespace, Comment.Preproc)),
- Line 836: (r'//.*$', Comment.Single)
- Line 840: (r'/\*', Comment.Multiline, '#push'),
- Line 841: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\haxe.py
- Line 107: (r'//[^\n\r]*', Comment.Single),
- Line 146: (r'\*', Keyword),  # wildcard import
- Line 154: (r'\*', Keyword, '#pop'),  # wildcard import
- Line 218: (r'[0-9]+[eE][+\-]?[0-9]+', Number.Float, ('#pop', 'preproc-expr-chain')),
- Line 219: (r'[0-9]+\.[0-9]*[eE][+\-]?[0-9]+', Number.Float, ('#pop', 'preproc-expr-chain')),
- Line 221: (r'[0-9]+\.(?!' + ident + r'|\.\.)', Number.Float, ('#pop', 'preproc-expr-chain')),
- Line 413: (r'(?:default|null|never|dynamic|get|set)\b', Keyword, '#pop'),
- Line 432: (r'(?:function)\b', Keyword.Declaration, ('#pop', 'expr-chain',
- Line 435: (r'(?:true|false|null)\b', Keyword.Constant, ('#pop', 'expr-chain')),
- Line 436: (r'(?:this)\b', Keyword, ('#pop', 'expr-chain')),
- Line 437: (r'(?:cast)\b', Keyword, ('#pop', 'expr-chain', 'cast')),
- Line 438: (r'(?:try)\b', Keyword, ('#pop', 'catch', 'expr')),
- Line 439: (r'(?:var)\b', Keyword.Declaration, ('#pop', 'var')),
- Line 440: (r'(?:new)\b', Keyword, ('#pop', 'expr-chain', 'new')),
- Line 441: (r'(?:switch)\b', Keyword, ('#pop', 'switch')),
- Line 442: (r'(?:if)\b', Keyword, ('#pop', 'if')),
- Line 443: (r'(?:do)\b', Keyword, ('#pop', 'do')),
- Line 444: (r'(?:while)\b', Keyword, ('#pop', 'while')),
- Line 445: (r'(?:for)\b', Keyword, ('#pop', 'for')),
- Line 447: (r'(?:return)\b', Keyword, ('#pop', 'optional-expr')),
- Line 448: (r'(?:macro)\b', Keyword, ('#pop', 'macro')),
- Line 449: (r'(?:continue|break)\b', Keyword, '#pop'),
- Line 450: (r'(?:\$\s*[a-z]\b|\$(?!'+ident+'))', Name, ('#pop', 'dollar')),
- Line 455: (r'[0-9]+[eE][+\-]?[0-9]+', Number.Float, ('#pop', 'expr-chain')),
- Line 456: (r'[0-9]+\.[0-9]*[eE][+\-]?[0-9]+', Number.Float, ('#pop', 'expr-chain')),
- Line 458: (r'[0-9]+\.(?!' + ident + r'|\.\.)', Number.Float, ('#pop', 'expr-chain')),
- Line 469: (r'~/(\\\\|\\[^\\]|[^/\\\n])*/[gimsu]*', String.Regex, ('#pop', 'expr-chain')),
- Line 479: (r'(?:in)\b', Keyword, ('#pop', 'expr')),
- Line 480: (r'\?', Operator, ('#pop', 'expr', 'ternary', 'expr')),
- Line 494: (r'(?:abstract)\b', Keyword.Declaration, ('#pop', 'optional-semicolon', 'abstract')),
- Line 495: (r'(?:class|interface)\b', Keyword.Declaration, ('#pop', 'optional-semicolon', 'macro-class')),
- Line 496: (r'(?:enum)\b', Keyword.Declaration, ('#pop', 'optional-semicolon', 'enum')),
- Line 497: (r'(?:typedef)\b', Keyword.Declaration, ('#pop', 'optional-semicolon', 'typedef')),
- Line 538: (r'(?:while)\b', Keyword, ('#pop', 'parenthesis',
- Line 560: (r'(?:else)\b', Keyword, ('#pop', 'expr')),
- Line 589: (r'(?:if)\b', Keyword, ('#pop', 'parenthesis', 'parenthesis-open')),
- Line 710: (r'[0-9]+[eE][+\-]?[0-9]+', Number.Float, '#pop'),
- Line 711: (r'[0-9]+\.[0-9]*[eE][+\-]?[0-9]+', Number.Float, '#pop'),
- Line 713: (r'[0-9]+\.(?!' + ident + r'|\.\.)', Number.Float, '#pop'),
- Line 724: (r'~/(\\\\|\\[^\\]|[^/\\\n])*/[gim]*', String.Regex, '#pop'),
- Line 749: (r'<(?!=)', Punctuation, ('#pop', 'type-param-constraint-sep',
- Line 823: # colon as part of a ternary operator (?:)
- Line 933: (r'#.*', Comment.Single)

### \server\venv\Lib\site-packages\pygments\lexers\hdl.py
- Line 32: _ws = r'(?:\s|//.*?\n|/[*].*?[*]/)+'
- Line 122: (r'//.*?\n', Comment.Single, '#pop'),
- Line 128: (r'[\w:]+\*?', Name.Namespace, '#pop')
- Line 159: _ws = r'(?:\s|//.*?\n|/[*].*?[*]/)+'
- Line 362: (r'//.*?$', Comment.Single, '#pop'),
- Line 368: (r'[\w:]+\*?', Name.Namespace, '#pop')
- Line 459: (r'\d{1,2}#[0-9a-f_]+#?', Number.Integer),

### \server\venv\Lib\site-packages\pygments\lexers\html.py
- Line 56: # note: this allows tag names not used in HTML like <x:with-dash>,
- Line 69: (r'(/?)(\s*)(>)', bygroups(Punctuation, Text, Punctuation), '#pop'),
- Line 80: (r'.+?\n', using(JavascriptLexer), '#pop'),
- Line 92: (r'.+?\n', using(CssLexer), '#pop'),
- Line 96: ('".*?"', String, '#pop'),
- Line 97: ("'.*?'", String, '#pop'),
- Line 133: (r'(<!\[)([^\[\s]+)(\s*)(\[)',  # conditional sections
- Line 226: (r'/?\s*>', Name.Tag, '#pop'),
- Line 230: ('".*?"', String, '#pop'),
- Line 231: ("'.*?'", String, '#pop'),
- Line 248: filenames = ['*.xsl', '*.xslt', '*.xpl']  # xpl is XProc
- Line 321: (r'!!!' + _dot + r'*\n', Name.Namespace, '#pop'),
- Line 327: (r'-#' + _dot + r'*\n', _starts_block(Comment.Preproc,
- Line 342: (r'/[ \t]*\n', Punctuation, '#pop:2'),
- Line 348: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Text),
- Line 349: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 366: (r"'(\\\\|\\[^\\]|[^'\\\n])*'", String, '#pop'),
- Line 367: (r'"(\\\\|\\[^\\]|[^"\\\n])*"', String, '#pop'),
- Line 381: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Name.Decorator),
- Line 382: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 405: # _dot = r'(?: \|\n(?=.* \|)|.)'
- Line 430: (r'!!!' + _dot + r'*\n', Name.Namespace, '#pop'),
- Line 436: (r'-#' + _dot + r'*\n', _starts_block(Comment.Preproc,
- Line 454: (r'/[ \t]*\n', Punctuation, '#pop:2'),
- Line 460: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Text),
- Line 461: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 478: (r"'(\\\\|\\[^\\]|[^'\\\n])*'", String, '#pop'),
- Line 479: (r'"(\\\\|\\[^\\]|[^"\\\n])*"', String, '#pop'),
- Line 493: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Name.Decorator),
- Line 494: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 538: (r'!!!' + _dot + r'*\n', Name.Namespace, '#pop'),
- Line 544: (r'-#' + _dot + r'*\n', _starts_block(Comment.Preproc,
- Line 563: (r'/[ \t]*\n', Punctuation, '#pop:2'),
- Line 569: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Text),
- Line 570: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 587: (r"'(\\\\|\\[^\\]|[^'\\\n])*'", String, '#pop'),
- Line 588: (r'"(\\\\|\\[^\\]|[^"\\\n])*"', String, '#pop'),
- Line 602: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Name.Decorator),
- Line 603: (r'(#\{)(' + _dot + r'*?)(\})',
- Line 657: (r'(/?)(\s*)(>)', bygroups(Punctuation, Text, Punctuation), '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\idl.py
- Line 256: (r'\+=|-=|\^=|\*=|/=|#=|##=|<=|>=|=', Operator),
- Line 257: (r'\+\+|--|->|\+|-|##|#|\*|/|<|>|&&|\^|~|\|\|\?|:', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\igor.py
- Line 416: (r'//.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\inferno.py
- Line 41: (r'#(\n|(.|\n)*?[^\\]\n)', Comment.Single),
- Line 85: # TODO:

### \server\venv\Lib\site-packages\pygments\lexers\installers.py
- Line 37: (r'([;#].*)(\n)', bygroups(Comment, Whitespace)),
- Line 121: (r'\$(R?[0-9])', Name.Builtin.Pseudo),    # registers
- Line 164: (r'#.*$', Comment),
- Line 260: (r'#.*?$', Comment),
- Line 265: (r'#.*?$', Comment, '#pop'),
- Line 279: (r'#.*?$', Comment, '#pop:2'),

### \server\venv\Lib\site-packages\pygments\lexers\int_fiction.py
- Line 58: (r':|(?=;)', Punctuation, '#pop'),
- Line 66: (r'(?=sp\b)', Text, '#pop'),
- Line 67: (rf'(?=[{_dquote}{_squote}$0-9#a-zA-Z_])', Text,
- Line 70: (rf'(?=[()\[{_dash},?@{{:;])', Text, '#pop')
- Line 80: (rf'&&?|\|\|?|[=~><]?=|[{_dash}]{{1,2}}>?|\.\.?[&#]?|::|[<>+*/%]',
- Line 145: (r'(?i)(Class|Object|Routine|String)\b', Name.Builtin, '#pop'),
- Line 184: (rf'[~^]+|//[^{_squote}]*', String.Escape),
- Line 240: (r'\S\w*', String.Other, '#pop')
- Line 318: (r'(?=[,;]|(class|has|private|with)\b)', Text, '#pop'),
- Line 342: (r'(?=[,;]|(class|has|private|with)\b)', Text, '#pop'),
- Line 350: (r'\*', Punctuation, ('#pop', 'grammar-line')),
- Line 378: default(('#pop', 'before-plain-string?', 'directive-keyword?'))
- Line 449: (r'#(?![agrnw]\$|#)', Punctuation, 'directive'),
- Line 484: (r'\(', Punctuation, ('#pop', 'miscellaneous-keyword?')),
- Line 591: Text, ('#pop', '+heading?')),
- Line 592: (rf'[.;:]|(?<=[\s{_dquote}])\|', Text, '#pop'),
- Line 770: _comment_single = r'(?://(?:[^\\\n]|\\+[\w\W])*$)'
- Line 804: # This regex can't use `(?i)` because escape sequences are
- Line 840: (r'\\?>', Name.Tag, '#pop'),
- Line 886: (r'[^\s!"%-(*->@-_a-z{-~]+', Error),  # Averts an infinite loop
- Line 928: (r'(?=[\[\'"<(:])', Text,  # It might be a VerbRule macro.
- Line 963: (r'\*|\.{3}', Punctuation, '#pop'),
- Line 964: (r'(?i)0x[\da-f]+', Number.Hex, '#pop'),
- Line 984: ('#pop', 'block?', 'more/parameters', 'main/parameters')),
- Line 1014: ('#pop', 'block?', 'function-name')),
- Line 1053: (r'(?=;)|[:)\]]', Punctuation, '#pop'),
- Line 1060: (r'[^\s!"%-_a-z{-~]+', Error)  # Averts an infinite loop
- Line 1068: (r':(?!:)', Operator, '#pop'),
- Line 1118: (r'[:)]', Punctuation, ('#pop', 'multimethod?')),
- Line 1124: (r'(?=[,)])', Text, '#pop'),
- Line 1168: r"([^)\s\\/]|/(?![/*]))+|\)", String.Other, '#pop')
- Line 1185: (rf'(?={_name}?{_ws}*[({{])', Text, '#pop'),
- Line 1207: (r'(?=;)', Text, '#pop'),
- Line 1217: (r'\*|\.{3}', Punctuation, '#pop'),
- Line 1251: (rf'^{_ws_pp}*#({_comment_multiline}|[^\n]|(?<=\\)\n)*\n?',
- Line 1255: (rf'\\+\n+{_ws_pp}*#?|\n+|([^\S\n]|\\)+', Text)
- Line 1273: (rf'<<(%(_({_escape}|\\?.)|[\-+ ,#]|\[\d*\]?)*\d*\.?\d*({_escape}|\\?.)|'
- Line 1278: (r'(?i)&(#(x[\da-f]+|\d+)|[a-z][\da-z]*);?', Name.Entity)
- Line 1337: pp = rf'^{self._ws_pp}*#{self._ws_pp}*'

### \server\venv\Lib\site-packages\pygments\lexers\iolang.py
- Line 33: (r'//(.*?)$', Comment.Single),
- Line 34: (r'#(.*?)$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\j.py
- Line 35: (r'#!.*$', Comment.Preproc),
- Line 97: (r'[-=+*#$%@!~`^&";:.,<>{}\[\]\\|/?]', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\javascript.py
- Line 52: (r'//.*?$', Comment.Single),
- Line 59: (r'(?=/)', Text, ('#pop', 'badregex')),
- Line 66: (r'\A#! ?/.*?$', Comment.Hashbang),  # recognized by node.js
- Line 72: (r'0[oO]?[0-7]+n?', Number.Oct),  # Browsers support "0o7" and "07" (< ES5) notations
- Line 123: (r'#[a-zA-Z_]\w*', Name),
- Line 133: # TODO: should this include single-line comments and allow nesting strings?
- Line 174: (r'#[a-zA-Z_]\w*', Name),
- Line 195: (r'###[^#].*?###', Comment.Multiline),
- Line 196: (r'(#(?!##[^#]).*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 206: (r'([$a-zA-Z_][\w$]*)(?=\s*\n)', Name.Class, '#pop'),
- Line 280: # note that all kal strings are multi-line.
- Line 329: (r'(#.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 390: # note that all coffee script strings are multi-line.
- Line 441: (r'#!(.*?)$', Comment.Preproc),
- Line 445: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 464: # DIGIT+ (‘.’ DIGIT*)? EXPONENT?
- Line 466: (r'\.\d+([eE][+-]?\d+)?', Number),  # ‘.’ DIGIT+ EXPONENT?
- Line 471: (r'[a-zA-Z_$]\w*', Name.Class, '#pop')
- Line 555: (r'^#![ \S]+lasso9\b', Comment.Preproc, 'lasso'),
- Line 585: (r'\?>', Comment.Preproc, '#pop'),
- Line 589: (r'\]|\?>', Comment.Preproc, '#pop'),
- Line 594: (r'(//.*?)(\s*)$', bygroups(Comment.Single, Whitespace)),
- Line 613: (r'#([a-z_][\w.]*|\d+\b)', Name.Variable.Instance),
- Line 720: (r'-?[a-z_][\w.]*', Name.Attribute, '#pop'),
- Line 727: (r'[a-z_][\w.]*=?|[-+*/%]', Name, '#pop'),
- Line 734: (r'(\)(?=(\s*::\s*[\w.]+)?\s*,))', Punctuation, '#pop'),
- Line 805: _ws = r'(?:\s|//[^\n]*\n|/[*](?:[^*]|[*][^/])*[*]/)*'
- Line 834: (r'(#(?:include|import))(\s+)("(?:\\\\|\\"|[^"])*")',
- Line 836: (r'(#(?:include|import))(\s+)(<(?:\\\\|\\>|[^>])*>)',
- Line 845: (r'//(\n|(.|\n)*?[^\\]\n)', Comment.Single),
- Line 853: (r'(?=/)', Text, ('#pop', 'badregex')),
- Line 921: (r'([a-zA-Z_]\w*)', Name.Class, '#pop'),
- Line 996: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace), '#pop'),
- Line 1002: (r'^\s*#if.*?(?<!\\)\n', Comment.Preproc, '#push'),
- Line 1003: (r'^\s*#endif.*?(?<!\\)\n', Comment.Preproc, '#pop'),
- Line 1036: (r'###[^#].*?###', Comment.Multiline),
- Line 1037: (r'(#(?!##[^#]).*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1094: # note that all coffee script strings are multi-line.
- Line 1143: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1277: (r'[+\-*/~^<>%&|?!@#.]*=', Operator.Word),
- Line 1279: (r'([+*/~^<>&|?!]+)|([#\-](?=\s))|@@+(?=\s)|=+', Operator),
- Line 1305: (r'(\[)([\^#][a-zA-Z$_](?:[\w$\-]*[\w$])?)(\])',
- Line 1316: r'(?=\s+[+\-*/~^<>%&|?!@#.]*\=\s)',
- Line 1335: (?=(?:[+\-*/~^<>%&|?!@#.])?[a-zA-Z$_](?:[\w$-]*[\w$])?)''',
- Line 1349: (?<![+\-*/~^<>%&|?!@#.])(\s+)
- Line 1395: prefix=r'(?<![\w\-#.])', suffix=r'(?![\w\-.])'),
- Line 1408: (r'#[a-zA-Z_][\w\-]*(?=[\s{(,;])', Name.Namespace)
- Line 1481: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1488: (r'(?=/)', Text, ('#pop', 'badregex')),

### \server\venv\Lib\site-packages\pygments\lexers\jslt.py
- Line 36: (r'//.*(\n|\Z)', Comment.Single),
- Line 92: (r'//.*(\n|\Z)', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\json5.py
- Line 44: (r'(//|#).*\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\jsonnet.py
- Line 47: (r'(//|#).*\n', Comment.Single),
- Line 90: ('(?==)', Whitespace, ('#pop', 'local_value')),
- Line 141: (r'(?=[,\)])', Whitespace, '#pop'),
- Line 146: (r'\+?::?:?', Punctuation, ('#pop', '#pop', 'field_value')),

### \server\venv\Lib\site-packages\pygments\lexers\jsx.py
- Line 22: (r"</?>", Punctuation),  # JSXFragment <>|</>
- Line 39: (r"(/?)(\s*)(>)", bygroups(Punctuation, Text, Punctuation), "#pop"),
- Line 47: (r'".*?"', String, "#pop"),
- Line 48: (r"'.*?'", String, "#pop"),

### \server\venv\Lib\site-packages\pygments\lexers\julia.py
- Line 44: (r'#.*$', Comment),
- Line 78: # NOTE
- Line 195: # FIXME: This escape pattern is not perfect.
- Line 199: (r'%[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?[hlL]?[E-GXc-giorsux%]',
- Line 214: (r'(")([imsxa]*)?', bygroups(String.Regex, String.Affix), '#pop'),
- Line 220: (r'(""")([imsxa]*)?', bygroups(String.Regex, String.Affix), '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\jvm.py
- Line 45: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 53: (r'((?:(?:[^\W\d]|\$)[\w.\[\]$<>?]*\s+)+?)'  # return arguments
- Line 54: r'((?:[^\W\d]|\$)[\w$]*)'                  # method name
- Line 55: r'(\s*)(\()',                              # signature start
- Line 96: (r'([^\W\d]|\$)[\w$]*', Name.Class, '#pop')
- Line 99: (r'([^\W\d]|\$)[\w$]*', Name, '#pop')
- Line 102: (r'[\w.]+\*?', Name.Namespace, '#pop')
- Line 172: opchar = '[!#%&*\\-\\/:?@^' + uni.combine('Sm', 'So') + ']'
- Line 184: notStartOfComment = r'(?!//|/\*)'
- Line 185: endOfLineMaybeWithComment = r'(?=\s*(//|$))'
- Line 236: (r'//.*?\n', Comment.Single),
- Line 240: (r'^#!([^\n]*)$', Comment.Hashbang),
- Line 253: # the correct keyword. Note that soft modifiers can be followed by a
- Line 254: # sequence of regular modifiers; [a-z\s]* skips those, and we just
- Line 363: (r'/\*', Comment.Multiline, '#push'),
- Line 364: (r'\*/', Comment.Multiline, '#pop'),
- Line 368: (r'(?<=[\n;:])', Text, '#pop'),
- Line 385: (r'(?<=[\n;:])', Text, '#pop'),
- Line 399: (r'(?<=[\n;])', Text, '#pop'),
- Line 405: (r'"""(?!")', String, '#pop'),
- Line 460: (r'^(\s*(?:[a-zA-Z_][\w.\[\]]*\s+)+?)'  # modifiers etc.
- Line 461: r'([a-zA-Z_]\w*)'                       # method name
- Line 462: r'(\s*)(\()',                           # signature start
- Line 465: (r'//.*?\n', Comment.Single),
- Line 485: (r'(\??[.#])([a-zA-Z_]\w*)',
- Line 557: (r'#!(.*?)$', Comment.Preproc, 'base'),
- Line 562: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 570: (r'^(\s*(?:[a-zA-Z_][\w.\[\]]*\s+)+?)'  # return arguments
- Line 572: r'[a-zA-Z_]\w*'                        # method name
- Line 573: r'|"(?:\\\\|\\[^\\]|[^"\\])*"'         # or double-quoted method name
- Line 574: r"|'(?:\\\\|\\[^\\]|[^'\\])*'"         # or single-quoted method name
- Line 576: r'(\s*)(\()',                          # signature start
- Line 606: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 609: (r'[\w.]+\*?', Name.Namespace, '#pop')
- Line 636: (r'(?<!\\)"', String, '#pop'),
- Line 642: (r'(?<!\\)"', String.Doc, '#pop'),
- Line 653: (r'(?<!\\)/[im-psux]*', String.Regex, '#pop'),
- Line 660: (r'(?<!\\)][im-psux]*', String.Regex, '#pop'),
- Line 667: (r'(?<!\\)]', String, '#pop'),
- Line 678: (r'\A#!(.*?)\n', Comment),
- Line 787: r'\|\|>|\|\|=|\->>|\+>>|!>>|<>>>|<>>|&>>|%>>|#>>|@>>|/>>|\*>>|'
- Line 790: r'\+>|!>|<>|&>|%>|#>|\@>|\/>|\*>|\?>|\|>|\^>|~>|\$>|<\->|\->|'
- Line 792: r'\?|#|\u2260|\u2218|\u2208|\u2209)', Operator),
- Line 886: # TODO / should divide keywords/symbols into namespace/rest
- Line 888: valid_name = r'(?!#)[\w!$%*+<=>?/.#|-]+'
- Line 912: (r'::?#?' + valid_name, String.Symbol),
- Line 942: # the famous parentheses!
- Line 973: (r'^(\s*(?:[a-zA-Z_][\w\.\[\]]*\s+)+?)'  # return arguments
- Line 974: r'([a-zA-Z_]\w*)'                       # method name
- Line 975: r'(\s*)(\()',                           # signature start
- Line 978: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 992: (r'(isa|[.]{3}|[.]{2}|[=#!<>+-/%&;,.\*\\\(\)\[\]\{\}])', Operator),
- Line 999: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 1002: (r'[\w.]+\*?', Name.Namespace, '#pop')
- Line 1022: _ws = r'(?:\s|//.*?\n|/[*].*?[*]/)+'
- Line 1027: (r'^(\s*(?:[a-zA-Z_][\w.\[\]]*\s+)+?)'  # return arguments
- Line 1028: r'([a-zA-Z_]\w*)'                      # method name
- Line 1029: r'(\s*)(\()',                          # signature start
- Line 1032: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1071: (r'[A-Za-z_]\w*', Name.Class, '#pop')
- Line 1079: (r'/\*', Comment.Multiline, '#push'),
- Line 1080: (r'\*/', Comment.Multiline, '#pop'),
- Line 1124: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1125: (r'^(#!/.+?)(\n)', bygroups(Comment.Single, Whitespace)),  # shebang for kotlin scripts
- Line 1175: (r'' + kt_id + r'((\?[^.])?)', Name) # additionally handle nullable types
- Line 1197: (r'(>)(\s*)', bygroups(Operator, Whitespace), '#pop'),
- Line 1258: (r'^(\s*(?:[a-zA-Z_][\w.\[\]]*\s+)+?)'  # return arguments
- Line 1259: r'([a-zA-Z_$][\w$]*)'                  # method name
- Line 1260: r'(\s*)(\()',                          # signature start
- Line 1263: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1293: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 1296: (r'[\w.]+\*?', Name.Namespace, '#pop')
- Line 1341: (r'\S+\s+', Text)   # TODO: make tests pass without \s+
- Line 1366: (r'[#=,./%+\-?]', Operator),
- Line 1388: (r'#.*$', Comment),
- Line 1446: (r'`?[a-zA-Z_][\w$]*', Name.Function, '#pop'),
- Line 1449: (r'[a-zA-Z_][\w$.]*\*?', Name.Namespace, '#pop')
- Line 1452: (r'`?[\w.]+\*?', Name.Class, '#pop')
- Line 1455: (r'`?[a-zA-Z_][\w$]*', Name.Variable, '#pop'),
- Line 1479: (r'[#=,./%+\-?]', Operator),
- Line 1674: (rf'(?=[^{_separator}]*\()', Text, ('#pop', 'invocation')),
- Line 1763: (r'^(\s*(?:[a-zA-Z_][\w.\[\]]*\s+)+?)'  # return arguments
- Line 1764: r'([a-zA-Z_$][\w$]*)'                      # method name
- Line 1765: r'(\s*)(\()',                             # signature start
- Line 1768: (r'(//.*?)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 1797: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 1800: (r'[\w.]+\*?', Name.Namespace, '#pop')

### \server\venv\Lib\site-packages\pygments\lexers\kuin.py
- Line 295: (r'\b2#[01]+(?:b(?:8|16|32|64))?\b', Number.Bin),
- Line 296: (r'\b8#[0-7]+(?:b(?:8|16|32|64))?\b', Number.Oct),
- Line 297: (r'\b16#[0-9A-F]+(?:b(?:8|16|32|64))?\b', Number.Hex),
- Line 307: (r'(?:\+|-|!|##?)', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\kusto.py
- Line 58: (r"//.*", Comment),

### \server\venv\Lib\site-packages\pygments\lexers\ldap.py
- Line 38: (r'(#.*)(\n)', bygroups(Comment.Single, Whitespace)),
- Line 62: (r"::?", Punctuation, ("#pop", "value")),
- Line 114: url = 'https://www.openldap.org/software//man.cgi?query=ldap.conf&sektion=5&apropos=0&manpath=OpenLDAP+2.4-Release'
- Line 128: (r'#.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\lean.py
- Line 147: # same as Lean3Lexer, with `!` and `?` allowed
- Line 180: '!=', '#', '&', '&&', '*', '+', '-', '/', '@', '!',

### \server\venv\Lib\site-packages\pygments\lexers\lilypond.py
- Line 30: # Note that many of the entities listed as LilyPond built-in keywords
- Line 102: (r"[#$]@?", Token.Punctuation, "value"),
- Line 110: # - dot in nested properties: \revert NoteHead.color,
- Line 131: (r"-?\d+\.\d+", Token.Number.Float), # 5. and .5 are not allowed

### \server\venv\Lib\site-packages\pygments\lexers\lisp.py
- Line 54: | \#[;|!] # fancy comments
- Line 93: radix = r'( (\#[dD])? )'
- Line 101: {radix} (\#[iIeE])?
- Line 147: | [+-]? {ureal}    # Sign optional
- Line 215: (r'#!r6rs', Comment),
- Line 230: (r"#\\([()/'\"._!§$%& ?=+-]|[a-zA-Z0-9]+)", String.Char, "#pop"),
- Line 240: (r"(?<='\()" + valid_name, Name.Variable, '#pop'),
- Line 241: (r"(?<=#\()" + valid_name, Name.Variable, '#pop'),
- Line 243: # Functions -- note that this also catches variables
- Line 244: # defined in let/let*, but there is little that can
- Line 246: (r'(?<=\()' + valid_name, Name.Function, '#pop'),
- Line 251: # the famous parentheses!
- Line 273: (rf'(?x).*?{token_end}', Comment, '#pop'),
- Line 313: terminated = r'(?=[ "()\'\n,;`])'  # whitespace or terminating macro characters
- Line 384: # encoding comment (?)
- Line 385: (r'#\d*Y.*$', Comment.Special),
- Line 411: (r'#\d*\*[01]*', Literal.Other),
- Line 423: (r'#b[+-]?[01]+(/[01]+)?', Number.Bin),
- Line 426: (r'#o[+-]?[0-7]+(/[0-7]+)?', Number.Oct),
- Line 429: (r'#x[+-]?[0-9a-f]+(/[0-9a-f]+)?', Number.Hex),
- Line 432: (r'#\d+r[+-]?[0-9a-z]+(/[0-9a-z]+)?', Number),
- Line 444: (r'#p?"(\\.|[^"])*"', Literal.Other),
- Line 451: (r'#+nil' + terminated + r'\s*\(', Comment.Preproc, 'commented-form'),
- Line 474: # This is a *really* good indicator (and not conflicting with Visual Prolog)
- Line 583: # the famous parentheses!
- Line 615: '#%variable-reference', '->', '->*', '->*m', '->d', '->dm', '->i',
- Line 1390: _exact_decimal_prefix = r'(?:#e)?(?:#d)?(?:#e)?'
- Line 1393: _inexact_simple = (rf'(?:{_inexact_simple_no_hashes}|(?:\d+#+(?:\.#*|/\d+#*)?|\.\d+#+|'
- Line 1394: r'\d+(?:\.\d*#+|/\d+#+)))')
- Line 1407: (r'(?s)#;|#![ /]([^\\\n]|\\.)*', Comment),
- Line 1415: # can denote the base or the type. These don't map neatly
- Line 1421: (rf'(?i){_exact_decimal_prefix}[-+]?(\d+(\.\d*)?|\.\d+)([deflst][-+]?\d+)?(?=[{_delimiters}])', Number.Float, '#pop'),
- Line 1422: (rf'(?i){_exact_decimal_prefix}[-+]?({_inexact_normal_no_hashes}([-+]{_inexact_normal_no_hashes}?i)?|[-+]{_inexact_normal_no_hashes}?i)(?=[{_delimiters}])', Number, '#pop'),
- Line 1425: (rf'(?i)(#d)?({_inexact_real}([-+]{_inexact_unsigned}?i)?|[-+]{_inexact_unsigned}?i|{_inexact_real}@{_inexact_real})(?=[{_delimiters}])', Number.Float,
- Line 1429: (rf'(?i)(([-+]?{_inexact_simple}t[-+]?\d+)|[-+](inf|nan)\.t)(?=[{_delimiters}])', Number.Float, '#pop'),
- Line 1432: (rf'(?iu)(#[ei])?#b{_symbol}', Number.Bin, '#pop'),
- Line 1435: (rf'(?iu)(#[ei])?#o{_symbol}', Number.Oct, '#pop'),
- Line 1438: (rf'(?iu)(#[ei])?#x{_symbol}', Number.Hex, '#pop'),
- Line 1441: (rf'(?iu)(#d)?#i{_symbol}', Number.Float, '#pop'),
- Line 1444: (r'#?"', String.Double, ('#pop', 'string')),
- Line 1445: (r'#<<(.+)\n(^(?!\1$).*$\n)*^\1$', String.Heredoc, '#pop'),
- Line 1447: (r'(?is)#\\([0-7]{3}|[a-z]+|.)', String.Char, '#pop'),
- Line 1448: (r'(?s)#[pr]x#?"(\\?.)*?"', String.Regex, '#pop'),
- Line 1457: (r'(#lang |#!)(\S+)',
- Line 1462: (rf"(?i)\.(?=[{_delimiters}])|#c[is]|#['`]|#,@?", Operator),
- Line 1463: (rf"'|#[s&]|#hash(eqv?)?|#\d*(?={_opening_parenthesis})",
- Line 1496: (r',@?', Operator, ('#pop', 'unquoted-datum')),
- Line 1611: (r'#!(.*?)$', Comment.Preproc),
- Line 1615: (r'#.*$', Comment.Single),
- Line 1655: (r'(?s)(.*?)(\[/text\])', String, '#pop'),
- Line 1679: terminated = r'(?=[ "()\]\'\n,;`])'  # whitespace or terminating macro characters
- Line 2258: (r'#\^\^?', Operator),
- Line 2264: (r'#[bB][+-]?[01]+(/[01]+)?', Number.Bin),
- Line 2267: (r'#[oO][+-]?[0-7]+(/[0-7]+)?', Number.Oct),
- Line 2270: (r'#[xX][+-]?[0-9a-fA-F]+(/[0-9a-fA-F]+)?', Number.Hex),
- Line 2273: (r'#\d+r[+-]?[0-9a-zA-Z]+(/[0-9a-zA-Z]+)?', Number),
- Line 2361: valid_symbol_chars = r'[\w!$%*+,<=>?/.\'@&#:-]'
- Line 2363: symbol_name = rf'[a-z!$%*+,<=>?/.\'@&#_-]{valid_symbol_chars}*'
- Line 2375: (r'(?s)\\\*.*?\*\\', Comment.Multiline),  # \* ... *\
- Line 2376: (r'\\\\.*', Comment.Single),              # \\ ...
- Line 2516: (r"#\\([()/'\"._!§$%& ?=+-]|[a-zA-Z0-9]+)", String.Char),
- Line 2530: (r"(?<=#\()" + valid_name, Name.Variable),
- Line 2540: # the famous parentheses!
- Line 2694: (r"#\\([()/'\"._!§$%& ?=+-]|[a-zA-Z0-9]+)", String.Char),
- Line 2737: # the famous parentheses!
- Line 2764: '#', '%', '*', '+', '-', '->', '->>', '-?>', '-?>>', '.', '..',
- Line 2765: '/', '//', ':', '<', '<=', '=', '>', '>=', '?.', '^', 'accumulate',
- Line 2813: # these are ... even more special!
- Line 3032: #  (?=            # followed by one of:
- Line 3041: _token_end = r'(?=\s|#|[)\]]|$)'
- Line 3065: (r'#.*$', Comment.Single),
- Line 3113: #   @[ [ ]

### \server\venv\Lib\site-packages\pygments\lexers\macaulay2.py
- Line 1800: (r'\*-', Comment.Multiline, '#pop'),
- Line 1810: (r'(//)+(?!/)', String),
- Line 1811: (r'/(//)+(?!/)', String, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\make.py
- Line 45: r_comment = re.compile(r'^\s*@?#')
- Line 88: (r'#.*?\n', Comment),
- Line 121: (r'#.*?\n', Comment, '#pop'),
- Line 198: (r'#\[(?P<level>=*)\[[\w\W]*?\](?P=level)\]', Comment),
- Line 199: (r'#.*\n', Comment),
- Line 208: r'(#[^\n]*)?$'

### \server\venv\Lib\site-packages\pygments\lexers\maple.py
- Line 267: (r'#.*\n', Comment.Single),
- Line 276: (r'[;^!@$\(\)\[\]{}|_\\#?]+', Punctuation),
- Line 283: (r'.*\(\*', Comment.Multiline, '#push'),
- Line 284: (r'.*\*\)', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\markup.py
- Line 81: (r'^#.*$', Comment),
- Line 82: (r'(!)(\S+)', bygroups(Keyword, Text)),  # Ignore-next
- Line 84: (r'^(=+)([^=]+)(=+)(\s*#.+)?$',
- Line 87: (r'(\{\{\{)(\n#!.+)?', bygroups(Name.Builtin, Name.Namespace), 'codeblock'),
- Line 88: (r'(\'\'\'?|\|\||`|__|~~|\^|,,|::)', Comment),  # Formatting
- Line 93: (r'\[\[\w+.*?\]\]', Keyword),  # Macro
- Line 181: (r'^(=+|-+|`+|:+|\.+|\'+|"+|~+|\^+|_+|\*+|\++|#+)([ \t]*\n)'
- Line 187: r'~{3,}|\^{3,}|_{3,}|\*{3,}|\+{3,}|#{3,})(\n)',
- Line 193: (r'^(\s*)([0-9#ivxlcmIVXLCM]+\.)( .+\n(?:\1  .+\n)*)',
- Line 195: (r'^(\s*)(\(?[0-9#ivxlcmIVXLCM]+\))( .+\n(?:\1  .+\n)*)',
- Line 216: # A footnote/citation target
- Line 239: (r'(`.+?)(<.+?>)(`__?)',  # reference with inline target
- Line 241: (r'`.+?`__?', String),  # reference
- Line 246: (r'\*\*.+?\*\*', Generic.Strong),  # Strong emphasis
- Line 247: (r'\*.+?\*', Generic.Emph),  # Emphasis
- Line 248: (r'\[.*?\]_', String),  # Footnote or citation
- Line 249: (r'<.+?>', Name.Tag),   # Hyperlink
- Line 270: p1 * 2 + 1 == p2 and     # they are the same length
- Line 411: (r'(literal)(.*)', bygroups(Comment.Preproc, Text), '#pop:2'),
- Line 536: # FIXME: aren't the offsets wrong?
- Line 587: # eg. **foo _bar_ baz** => foo and baz are not recognized as bold
- Line 588: # bold fenced by '**'
- Line 592: # italics fenced by '*'
- Line 600: # (image?) links eg: ![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
- Line 611: # general text, must come last!
- Line 637: (r'^# .*', Comment.Single),
- Line 656: # Unordered lists items, including TODO items and description items
- Line 664: (r'(?i)^( *#\+begin: *)((?:.|\n)*?)(^ *#\+end: *$)',
- Line 668: (r'(?i)^( *#\+begin_comment *\n)((?:.|\n)*?)(^ *#\+end_comment *$)',
- Line 672: # TODO: language-dependent syntax highlighting (see Markdown lexer)
- Line 673: (r'(?i)^( *#\+begin_src .*)((?:.|\n)*?)(^ *#\+end_src *$)',
- Line 677: (r'(?i)^( *#\+begin_\w+)( *\n)((?:.|\n)*?)(^ *#\+end_\w+)( *$)',
- Line 681: (r'^(#\+\w+:)(.*)$', bygroups(Name.Namespace, Text)),
- Line 701: (_inline(r'=', r'='), String), # TODO token
- Line 713: # Footnotes
- Line 725: (r'[^#*+\-0-9:\\/=~_<{\[|\n]+', Text),
- Line 726: (r'[#*+\-0-9:\\/=~_<{\[|\n]', Text),
- Line 807: (r'^(\s*)([*#>]+)(\s*)(.+\n)',
- Line 841: (r'(\s)(//[^/]+//)((?=\W|\n))',
- Line 875: (r'(\b.?.?tps?://[^\s"]+)', bygroups(Name.Attribute)),
- Line 877: # general text, must come last!
- Line 998: # FIXME: Use ABC lexer in the future
- Line 1001: # a-z removed to prevent linter from complaining, REMEMBER to use (?i)
- Line 1003: nbsp_char = r'(?:\t|&nbsp;|&\#0*160;|&\#[Xx]0*[Aa]0;|[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000])'
- Line 1110: (\A\s*?)(\#REDIRECT:?) # may contain a colon
- Line 1132: (?: [0-9] {nbsp_dash}? ){{9}} # escape format()
- Line 1140: (r'(\]\])(\s*?\n)', bygroups(Punctuation, Whitespace), '#pop'),
- Line 1141: (r'(\#)([^#]*?)', bygroups(Punctuation, Name.Label)),
- Line 1148: (r'^[#:*]+', Keyword),
- Line 1170: (?: (\#) ([{}]*?) )?
- Line 1179: (\[\[)(?!{}) # Should not contain URLs
- Line 1182: (?: (\#) ([{}]*?) )?
- Line 1194: (?: (\#) ([{}]*?) )?
- Line 1323: (-\{{) (?!\{{) # Use {{ to escape format()
- Line 1337: (r'(?=\[\[)', Punctuation, '#pop'),
- Line 1352: (r'(?=\]\]|\{\{|\}\})', Punctuation, '#pop'),
- Line 1359: (r"'''(?!')", Generic.EmphStrong, ('#pop', 'inline-italic-bold')),
- Line 1360: (r"''(?!')", Generic.Emph, '#pop'),
- Line 1368: (r"'''(?!')", Generic.Strong, '#pop'),
- Line 1369: (r"''(?!')", Generic.EmphStrong, ('#pop', 'inline-bold-italic')),
- Line 1377: (r"'''(?!')", Generic.EmphStrong, ('#pop', 'inline-italic')),
- Line 1378: (r"''(?!')", Generic.EmphStrong, ('#pop', 'inline-bold')),
- Line 1386: (r"'''(?!')", Generic.EmphStrong, ('#pop', 'inline-italic')),
- Line 1387: (r"''(?!')", Generic.EmphStrong, ('#pop', 'inline-bold')),
- Line 1406: (r';?\s*?\}-', Punctuation, '#pop'),
- Line 1452: # comments, an extra state is required to handle things like {{\n<!---->\n name}}
- Line 1457: r'(?i)(\#[{}]*?|{})(:)'.format(title_char,
- Line 1473: (r'(\s*?)(\|)', bygroups(Text, Punctuation), ('#pop', 'template-inner')),
- Line 1485: ( (?: (?! \{\{ | \}\} )[^=\|<])*? ) # Exclude templates and tags
- Line 1594: (r'/?\s*>', Punctuation, '#pop'),
- Line 1599: (r'/\s*>', Punctuation, '#pop:2'),
- Line 1600: (r'\s*>', Punctuation, '#pop'),
- Line 1618: (r'/?>', Punctuation, '#pop:2'),
- Line 1624: (r'/?>', Punctuation, '#pop:2'),
- Line 1630: (r'/?>', Punctuation, '#pop:2'),

### \server\venv\Lib\site-packages\pygments\lexers\matlab.py
- Line 65: # line starting with '!' is sent as a system command.  not sure what
- Line 2652: prefix=r"(?<!\.)(",  # Exclude field names
- Line 2674: (r'^\s*%\}', Comment.Multiline, '#pop'),
- Line 2702: (r'(?<!\.)end\b', Keyword, '#pop'),
- Line 2706: (r"[^']*'", String, '#pop'),
- Line 2776: # without is showing error on same line as before...?
- Line 2839: #     perl -n -e 'print "\"$1\",\n" if /-- '"$i"': .* (\w*) \(/;' \
- Line 3150: (r'#\{\s*\n', Comment.Multiline, 'hashblockcomment'),
- Line 3151: (r'[%#].*$', Comment),
- Line 3201: (r'^\s*%\}', Comment.Multiline, '#pop'),
- Line 3206: (r'^\s*#\}', Comment.Multiline, '#pop'),
- Line 3211: (r"[^']*'", String, '#pop'),
- Line 3242: (r'//.*?$', Comment.Single),
- Line 3284: (r"[^']*'", String, '#pop'),
- Line 3293: (r'(\s*)([a-zA-Z_]\w*)', bygroups(Text, Name.Function), '#pop'),
- Line 3302: if re.search(r"^\s*//", text):

### \server\venv\Lib\site-packages\pygments\lexers\maxima.py
- Line 57: ((?:[a-zA-Z_#][\w#]*|`[^`]*`)
- Line 58: (?:::[a-zA-Z_#][\w#]*|`[^`]*`)*)(\s*)([(])''',
- Line 61: (?:[a-zA-Z_#%][\w#%]*|`[^`]*`)
- Line 62: (?:::[a-zA-Z_#%][\w#%]*|`[^`]*`)*''', Name.Variable),
- Line 70: (r'/\*', Comment.Multiline, '#push'),
- Line 71: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\meson.py
- Line 27: # TODO String interpolation @VARNAME@ inner matches
- Line 28: # TODO keyword_arg: value inner matches
- Line 39: (r'#.*?$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\mime.py
- Line 132: #  * no content
- Line 133: #  * no content type specific
- Line 134: #  * content encoding is not readable
- Line 135: #  * max recurrsion exceed
- Line 193: (r"\n(?![ \t])", Text.Whitespace, "#pop"),
- Line 204: (r';[ \t]*\n(?![ \t])', Text, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\minecraft.py
- Line 79: #  note: stringified keys still work
- Line 145: (r"#?[a-z_][a-z_.-]*:[a-z0-9_./-]+", Name.Function),
- Line 148: (r"#?[a-z0-9_\.\-]+\/[a-z0-9_\.\-\/]+", Name.Function),
- Line 156: (rf"^\s*(#{_block_comment_prefix})", Comment.Multiline,
- Line 158: (r"#.*$", Comment.Single),
- Line 161: (rf"^\s*#{_block_comment_prefix}", Comment.Multiline,
- Line 163: (r"^\s*#", Comment.Multiline, "comments.block.normal"),
- Line 272: (r"#?[a-z_][a-z_\.\-]*\:[a-z0-9_\.\-/]+(?=\s*\=)", Name.Attribute, "property.delimiter"),
- Line 273: (r"#?[a-z_][a-z0-9_\.\-/]+", Name.Attribute, "property.delimiter"),
- Line 309: (r"#?[a-z_][a-z_\.\-]*\:[a-z0-9_\.\-/]+", Name.Tag),
- Line 310: (r"#?[a-z_][a-z0-9_\.\-/]+", Name.Tag),
- Line 334: (r'//.*?$', Comment.Single),
- Line 341: (r'(?=/)', Text, ('#pop', 'badregex')),

### \server\venv\Lib\site-packages\pygments\lexers\mips.py
- Line 28: # TODO: add '*.s' and '*.asm', which will require designing an analyse_text
- Line 110: (r'#.*', Comment),
- Line 120: (words(directives, suffix=r'\b'), Name.Entity), # Preprocessor?

### \server\venv\Lib\site-packages\pygments\lexers\ml.py
- Line 53: symbolicid_re = r"[!%&$#+\-/:<=>?@\\~`^|*]+"
- Line 113: # definition by cases? (This is not how the Definition works, but
- Line 119: (r'\b(do|else|end|in|then)\b(?!\')', Keyword.Reserved, '#pop'),
- Line 139: (r'#\s*[1-9][0-9]*', Name.Label),
- Line 140: (rf'#\s*({alphanumid_re})', Name.Label),
- Line 211: (r'(?=\b({})\b(?!\'))'.format('|'.join(alphanumid_reserved)), Text, '#pop'),
- Line 260: (rf'=(?!{symbolicid_re})', Punctuation, ('#pop', 'typbind')),
- Line 271: (r'\b(and)\b(?!\')', Keyword.Reserved, ('#pop', 'tname')),
- Line 299: (r'\b(and)\b(?!\')', Keyword.Reserved, ('#pop', 'dname')),
- Line 300: (r'\b(withtype)\b(?!\')', Keyword.Reserved, ('#pop', 'tname')),
- Line 348: (r'\(\*', Comment.Multiline, '#push'),
- Line 349: (r'\*\)', Comment.Multiline, '#pop'),
- Line 377: '!=', '#', '&', '&&', r'\(', r'\)', r'\*', r'\+', ',', '-',
- Line 426: (r'\(\*', Comment, '#push'),
- Line 427: (r'\*\)', Comment, '#pop'),
- Line 440: (r'[A-Z][\w\']*', Name.Class, '#pop'),
- Line 441: (r'[a-z_][\w\']*', Name, '#pop'),
- Line 487: (r'//.*?$', Comment),
- Line 571: (r'#(?=\{)', String.Single),
- Line 584: # * -> ty
- Line 585: # * type-with-slash
- Line 586: # * type-with-slash -> ty
- Line 587: # * type-with-slash (, type-with-slash)+ -> ty
- Line 610: (r'~?\{', Keyword.Type, ('#pop', 'type-record')),
- Line 622: # * type-1
- Line 623: # * type-1 (/ type-1)+
- Line 643: (r'(?=,)', Keyword.Type, ('#pop', 'type-arrow')),
- Line 659: # note that this function would be not work if the source
- Line 684: #     (r',?\s*\)', Keyword.Type, '#pop'), # ,) is a valid end of tuple, in (1,)
- Line 690: #     (r'~?(?:\w+|`[^`]*`)', Keyword.Type, 'type-record-field-expr'),
- Line 698: (r'/\*', Comment, '#push'),
- Line 699: (r'\*/', Comment, '#pop'),
- Line 704: # is kinda sad. Is there a way to avoid that??
- Line 733: (r'[\w\-:]*>', String.Single, '#pop'),
- Line 736: # we are in this state after having parsed '<ident(:ident)?'
- Line 749: (r'#(?=\{)', String.Single, ('#pop', 'root')),
- Line 751: (r'\{', Operator, ('#pop', 'root')),  # this is a tail call!
- Line 791: '!=', '#', '&', '&&', r'\(', r'\)', r'\*', r'\+', ',', '-',
- Line 814: (r'//.*?\n', Comment.Single),
- Line 841: (r'\/\*', Comment.Multiline, '#push'),
- Line 842: (r'\*\/', Comment.Multiline, '#pop'),
- Line 855: (r'[A-Z][\w\']*', Name.Class, '#pop'),
- Line 856: (r'[a-z_][\w\']*', Name, '#pop'),
- Line 940: (r'\(\*', Comment, '#push'),
- Line 941: (r'\*\)', Comment, '#pop'),
- Line 954: (r'[A-Z][\w\']*', Name.Class, '#pop'),
- Line 955: (r'[a-z_][\w\']*', Name, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\modeling.py
- Line 41: (r'//[^\n]*\n?', Comment.Single),
- Line 156: (r'#.*$', Comment.Single),
- Line 238: (r'#.*$', Comment.Single),
- Line 302: (r'(//|#).*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\modula2.py
- Line 205: (r'[0-9]+(\'[0-9]+)*'  # integral part
- Line 206: r'\.[0-9]+(\'[0-9]+)*'  # fractional part
- Line 207: r'[eE][+-]?[0-9]+(\'[0-9]+)*',  # exponent
- Line 211: (r'[0-9]+(\'[0-9]+)*'  # integral part
- Line 212: r'\.[0-9]+(\'[0-9]+)*',  # fractional part
- Line 287: # Distinguish |* and * in M2 R10
- Line 294: (r'!', Punctuation),  # ISO
- Line 296: (r'\?', Punctuation),  # M2R10 + ObjM2
- Line 300: (r'^//.*?\n', Comment.Single),  # M2R10 + ObjM2
- Line 304: (r'/\*(.*?)\*/', Comment.Multiline),  # M2R10 + ObjM2
- Line 308: (r'<\*.*?\*>', Comment.Preproc),  # ISO, M2R10 + ObjM2
- Line 310: (r'\(\*\$.*?\*\)', Comment.Preproc),  # PIM

### \server\venv\Lib\site-packages\pygments\lexers\mojo.py
- Line 65: r"%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?"
- Line 72: r"((\w+)((\.\w+)|(\[[^\]]+\]))*)?"  # field name
- Line 73: r"(\![sra])?"  # conversion
- Line 74: r"(\:(.?[<>=\^])?[-+ ]?#?0?(\d+)?,?(\.\d+)?[E-GXb-gnosx%]?)?"
- Line 111: (r"\A#!.+$", Comment.Hashbang),
- Line 112: (r"#.*$", Comment.Single),
- Line 117: # In the original PR, all the below here used ((?:\s|\\\s)+) to
- Line 123: "varname",  # TODO varname the right fit?
- Line 244: r"(=\s*)?"  # debug (https://bugs.python.org/issue36817)
- Line 245: r"(\![sraf])?"  # conversion
- Line 253: r"(=\s*)?"  # debug (https://bugs.python.org/issue36817)
- Line 254: r"(\![sraf])?"  # conversion
- Line 273: "async for",  # TODO https://docs.modular.com/mojo/roadmap#no-async-for-or-async-with
- Line 274: "async with",  # TODO https://docs.modular.com/mojo/roadmap#no-async-for-or-async-with
- Line 328: r"(^[ \t]*)"  # at beginning of line + possible indentation
- Line 330: r"(?![ \t]*(?:"  # not followed by...
- Line 331: r"[:,;=^&|@~)\]}]|(?:" +  # characters and keywords that mean this isn't
- Line 702: # TODO supported?

### \server\venv\Lib\site-packages\pygments\lexers\monte.py
- Line 91: (r'#[^\n]*\n', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\mosel.py
- Line 129: # mosel exam mmxprs | sed -n -e "s/ [pf][a-z]* \([a-zA-Z0-9_]*\).*/'\1',/p" | sort -u
- Line 231: # mosel exam mmsystem | sed -n -e "s/ [pf][a-z]* \([a-zA-Z0-9_]*\).*/'\1',/p" | sort -u
- Line 334: # mosel exam mmjobs | sed -n -e "s/ [pf][a-z]* \([a-zA-Z0-9_]*\).*/'\1',/p" | sort -u

### \server\venv\Lib\site-packages\pygments\lexers\nimrod.py
- Line 74: (r'##.*$', String.Doc),
- Line 76: (r'#.*$', Comment),
- Line 130: (r'(?<!\$)\$(\d+|#|\w+)+', String.Interpol),
- Line 157: (r'"(?!")', String, '#pop'),
- Line 167: (r'((?![\d_])\w)(((?!_)\w)|(_(?!_)\w))*', Name.Function, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\nit.py
- Line 30: (r'#.*?$', Comment.Single),
- Line 42: (r'"""(([^\'\\]|\\.)|\\r|\\n)*((\{\{?)?(""?\{\{?)*""""*)', String),  # Simple long string
- Line 44: r'\'\'((\\.|[^\'\\])|\\r|\\n))*\'\'\'', String),  # Simple long string alt
- Line 45: (r'"""(([^\'\\]|\\.)|\\r|\\n)*((""?)?(\{\{?""?)*\{\{\{\{*)', String),  # Start long string
- Line 46: (r'\}\}\}(((\\.|[^\'\\])|\\r|\\n))*(""?)?(\{\{?""?)*\{\{\{\{*', String),  # Mid long string
- Line 47: (r'\}\}\}(((\\.|[^\'\\])|\\r|\\n))*(\{\{?)?(""?\{\{?)*""""*', String),  # End long string
- Line 48: (r'"(\\.|([^"}{\\]))*"', String),  # Simple String
- Line 49: (r'"(\\.|([^"}{\\]))*\{', String),  # Start string
- Line 50: (r'\}(\\.|([^"}{\\]))*\{', String),  # Mid String
- Line 51: (r'\}(\\.|([^"}{\\]))*"', String),  # End String
- Line 60: (r'`\{[^`]*`\}', Text),  # Extern blocks won't be Lexed by Nit

### \server\venv\Lib\site-packages\pygments\lexers\nix.py
- Line 36: operators = ['++', '+', '?', '.', '!', '//', '==', '/',
- Line 44: (r'#.*$', Comment.Single),
- Line 99: (r'/\*', Comment.Multiline, '#push'),
- Line 100: (r'\*/', Comment.Multiline, '#pop'),
- Line 123: # TODO: we should probably escape also here ''${ \${
- Line 135: # TODO: let/in

### \server\venv\Lib\site-packages\pygments\lexers\oberon.py
- Line 50: # TODO: nested comments (* (* ... *) ... (* ... *) *) not supported!
- Line 63: (r"'[^\n']*'", String),  # single quoted string
- Line 64: (r'"[^\n"]*"', String),  # double quoted string

### \server\venv\Lib\site-packages\pygments\lexers\objective.py
- Line 36: # Matches [ <ws>? identifier <ws> ( identifier <ws>? ] |  identifier? : )
- Line 37: # (note the identifier is *optional* when there is a ':'!)
- Line 103: (r'([a-zA-Z$_][\w$]*)', Name.Class, '#pop')
- Line 120: (r'^([-+])(\s*)'                         # method marker
- Line 121: r'(\(.*?\))?(\s*)'                      # return type
- Line 122: r'([a-zA-Z$_][\w$]*:?)',        # begin of method name
- Line 130: # TODO unsure if ellipses are allowed elsewhere, see
- Line 258: (r'([a-zA-Z$_][\w$]*)', Name.Class, '#pop')
- Line 410: (r'[(){}\[\].,:;=@#`?]|->|[<&?](?=\w)|(?<=\w)[>!?]', Punctuation),
- Line 437: r'|#(?:file|line|column|function))\b', Keyword.Constant),
- Line 465: (r'/\*', Comment.Multiline, '#push'),
- Line 466: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\ooc.py
- Line 45: # Note: %= not listed on https://ooc-lang.github.io/docs/lang/operators/
- Line 46: (r'//.*', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\openscad.py
- Line 33: (r"[*!#%\-+=?/]", Operator),
- Line 92: (r'/\*', Comment.Multiline, '#push'),
- Line 93: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\parasail.py
- Line 37: (r'//.*?\n', Comment.Single),
- Line 56: (r'#[a-zA-Z]\w*', Literal),       # Enumeration
- Line 70: (r'\d[0-9_]*#[0-9a-fA-F][0-9a-fA-F_]*#', Number.Hex),  # any base
- Line 71: (r'0[xX][0-9a-fA-F][0-9a-fA-F_]*', Number.Hex),        # C-like hex
- Line 72: (r'0[bB][01][01_]*', Number.Bin),                      # C-like bin
- Line 73: (r'\d[0-9_]*\.\d[0-9_]*[eE][+-]\d[0-9_]*',             # float exp
- Line 75: (r'\d[0-9_]*\.\d[0-9_]*', Number.Float),               # float
- Line 76: (r'\d[0-9_]*', Number.Integer),                        # integer

### \server\venv\Lib\site-packages\pygments\lexers\parsers.py
- Line 54: (r'\#.*$', Comment),
- Line 69: (r'\[(\\\\|\\[^\\]|[^\\\]])*\]', String),          # square bracket literals
- Line 70: (r'/(?!\*)(\\\\|\\[^\\]|[^/\\])*/', String.Regex),  # regular expressions
- Line 77: (r'\||&|--?', Operator),                    # Union, Intersection and Subtraction
- Line 78: (r'\.|<:|:>>?', Operator),                  # Concatention
- Line 82: (r'(>|\$|%|<|@|<>)(!|err\b)', Operator),    # Global Error Actions
- Line 85: (r'(>|\$|%|<|@|<>)(\*|from\b)', Operator),  # From-State Actions
- Line 87: (r'\*|\?|\+|\{[0-9]*,[0-9]*\}', Operator),  # Repetition
- Line 88: (r'!|\^', Operator),                        # Negation
- Line 111: r'//.*$\n?',            # single line comment
- Line 112: r'/\*(.|\n)*?\*/',      # multi-line javadoc-style comment
- Line 113: r'\#.*$\n?',            # ruby comment
- Line 116: # with a * and this stops confusion with comments.
- Line 147: r'%(?=[^%]|$)',   # a single % sign is okay, just not 2 of them
- Line 152: r'/\*(.|\n)*?\*/',      # multi-line javadoc-style comment
- Line 153: r'//.*$\n?',  # single line comment
- Line 154: r'\#.*$\n?',  # ruby/ragel comment
- Line 155: r'/(?!\*)(\\\\|\\[^\\]|[^/\\])*/',  # regular expression
- Line 175: r'\}(?=[^%]|$)',   # } is okay as long as it's not followed by %
- Line 176: r'\}%(?=[^%]|$)',  # ...well, one %'s okay, just not two...
- Line 183: # specifically allow regex followed immediately by *
- Line 187: # allow / as long as it's not followed by another / or by a *
- Line 192: # does it help performance?
- Line 198: r"\[(\\\\|\\[^\\]|[^\]\\])*\]",  # square bracket literal
- Line 199: r'/\*(.|\n)*?\*/',          # multi-line javadoc-style comment
- Line 200: r'//.*$\n?',                # single line comment
- Line 201: r'\#.*$\n?',                # ruby/ragel comment
- Line 344: (r'//.*$', Comment),
- Line 396: # TODO finish implementing other possibilities for scope
- Line 405: # finished prelims, go to rule alts!
- Line 426: (r'(\+|\||->|=>|=|\(|\)|\.\.|\.|\?|\*|\^|!|\#|~)', Operator),
- Line 459: r'//.*$\n?',            # single line comment
- Line 460: r'/\*(.|\n)*?\*/',      # multi-line javadoc-style comment
- Line 463: # with a * and this stops confusion with comments.
- Line 486: r'//.*$\n?',            # single line comment
- Line 487: r'/\*(.|\n)*?\*/',      # multi-line javadoc-style comment
- Line 490: # with a * and this stops confusion with comments.
- Line 697: (r'[A-Z]\w*(?:::[A-Z]\w*)*', Name.Class, '#pop'),
- Line 727: (r'#[^\n]*', Comment.Single),
- Line 792: (r'\*\)', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\pascal.py
- Line 445: elif scanner.scan(r'//.*?$'):
- Line 611: elif scanner.scan(r'//.*?$'):
- Line 640: # save the dot!!!11

### \server\venv\Lib\site-packages\pygments\lexers\pawn.py
- Line 31: _ws = r'(?:\s|//.*?\n|/\*.*?\*/)+'
- Line 32: #: only one /* */ style comment
- Line 75: (r'//.*?\n', Comment.Single, '#pop'),
- Line 81: (r'^\s*#if.*?(?<!\\)\n', Comment.Preproc, '#push'),
- Line 82: (r'^\s*#endif.*?(?<!\\)\n', Comment.Preproc, '#pop'),
- Line 142: _ws = r'(?:\s|//.*?\n|/[*][\w\W]*?[*]/)+'
- Line 143: #: only one /* */ style comment
- Line 186: (r'//.*?\n', Comment.Single, '#pop'),
- Line 192: (r'^\s*#if.*?(?<!\\)\n', Comment.Preproc, '#push'),
- Line 193: (r'^\s*#endif.*?(?<!\\)\n', Comment.Preproc, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\perl.py
- Line 35: # TODO: give this to a perl guy who knows how to parse perl...
- Line 38: (r'/(\\\\|\\[^\\]|[^\\/])*/[egimosx]*', String.Regex, '#pop'),
- Line 39: (r'!(\\\\|\\[^\\]|[^\\!])*![egimosx]*', String.Regex, '#pop'),
- Line 40: (r'\\(\\\\|[^\\])*\\[egimosx]*', String.Regex, '#pop'),
- Line 41: (r'\{(\\\\|\\[^\\]|[^\\}])*\}[egimosx]*', String.Regex, '#pop'),
- Line 42: (r'<(\\\\|\\[^\\]|[^\\>])*>[egimosx]*', String.Regex, '#pop'),
- Line 43: (r'\[(\\\\|\\[^\\]|[^\\\]])*\][egimosx]*', String.Regex, '#pop'),
- Line 44: (r'\((\\\\|\\[^\\]|[^\\)])*\)[egimosx]*', String.Regex, '#pop'),
- Line 45: (r'@(\\\\|\\[^\\]|[^\\@])*@[egimosx]*', String.Regex, '#pop'),
- Line 46: (r'%(\\\\|\\[^\\]|[^\\%])*%[egimosx]*', String.Regex, '#pop'),
- Line 47: (r'\$(\\\\|\\[^\\]|[^\\$])*\$[egimosx]*', String.Regex, '#pop'),
- Line 50: (r'\A\#!.+?$', Comment.Hashbang),
- Line 51: (r'\#.*?$', Comment.Single),
- Line 146: (r'[()\[\]:;,<>/?{}]', Punctuation),  # yes, there's no shortage
- Line 147: # of punctuation in Perl!
- Line 156: (r'\{', Punctuation, '#pop'),    # hash syntax?
- Line 162: (r'[a-zA-Z_]\w*(::[a-zA-Z_]\w*)*(::)?(?=\s*->)', Name.Namespace, '#pop'),
- Line 163: (r'[a-zA-Z_]\w*(::[a-zA-Z_]\w*)*::', Name.Namespace, '#pop'),
- Line 165: (r'[A-Z_]+(?=\W)', Name.Constant, '#pop'),
- Line 166: (r'(?=\W)', Text, '#pop'),
- Line 174: (r'.*?\{', Punctuation, '#pop'),
- Line 422: '&&', '||', '^^', '//', 'min', 'max', '??', '!!', 'ff', 'fff', 'so',
- Line 426: # Perl 6 has a *lot* of possible bracketing characters
- Line 596: # them, make sure you also process the corresponding one!
- Line 599: (r'#[`|=](?P<delimiter>(?P<first_char>[' + ''.join(PERL6_BRACKETS) + r'])(?P=first_char)*)',
- Line 601: (r'#[^\n]*$', Comment.Single),
- Line 670: (r'#.*?$', Comment.Single),
- Line 709: line = re.sub('#.*', '', line)

### \server\venv\Lib\site-packages\pygments\lexers\phix.py
- Line 33: flags = re.MULTILINE    # nb: **NOT** re.DOTALL! (totally spanners comment handling)
- Line 38: # Note these lists are auto-generated by pwa/p2js.exw, when pwa\src\p2js_keywords.e (etc)
- Line 340: (r'/\*|--/\*|#\[', Comment.Multiline, 'comment'),
- Line 341: (r'(?://|--|#!).*$', Comment.Single),
- Line 343: #           (r'//.*$|--.*$|#!.*$', Comment.Single),
- Line 354: (r'!=|==|<<|>>|:=|[-~+/*%=<>&^|\.(){},?:\[\]$\\;#]', Operator),
- Line 358: (r'[^*/#]+', Comment.Multiline),
- Line 359: (r'/\*|#\[', Comment.Multiline, '#push'),
- Line 360: (r'\*/|#\]', Comment.Multiline, '#pop'),
- Line 361: (r'[*/#]', Comment.Multiline)

### \server\venv\Lib\site-packages\pygments\lexers\php.py
- Line 44: (r'//.*?\n', Comment.Single),
- Line 175: # Note that a backslash is included, PHP uses a backslash as a namespace
- Line 189: (r'\?>', Comment.Preproc, '#pop'),
- Line 195: (r'#.*?\n', Comment.Single),
- Line 196: (r'//.*?\n', Comment.Single),
- Line 205: (r'\?', Operator),  # don't add to the charclass above!

### \server\venv\Lib\site-packages\pygments\lexers\pony.py
- Line 35: (r'//.*\n', Comment.Single),
- Line 84: (r'/\*', Comment.Multiline, '#push'),
- Line 85: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\praat.py
- Line 120: (r'(\s+)(#.*?$)',  bygroups(Whitespace, Comment.Single)),
- Line 121: (r'^#.*?$',        Comment.Single),
- Line 177: (words(functions_array, suffix=r'#(?=\s*[:(])'),   Name.Function, 'function'),
- Line 183: (r'\s*\(', Punctuation, ('#pop', 'comma_list')),
- Line 232: suffix=r'(?=[^a-zA-Z0-9_."\'$#\[:(]|\s|^|$)'),
- Line 239: (r'\.?_?[a-z][\w.]*(\$|#)?', Text),
- Line 274: (r'(\s+)(#.*?$)',  bygroups(Whitespace, Comment.Single)),

### \server\venv\Lib\site-packages\pygments\lexers\prolog.py
- Line 48: (r"'(?:''|[^'])*'", String.Atom),  # quoted atom
- Line 50: # (r'=(?=\s|[a-zA-Z\[])', Operator),
- Line 52: (r'(<|>|=<|>=|==|=:=|=|/|//|\*|\+|-)(?=\s|[a-zA-Z0-9\[])',
- Line 68: # This one includes !
- Line 69: (r'[#&*+\-./:<=>?@\\^~\u00a1-\u00bf\u2010-\u303f]+',
- Line 75: (r'\*/', Comment.Multiline, '#pop'),
- Line 76: (r'/\*', Comment.Multiline, '#push'),
- Line 219: (r'(//|[-+*/])', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\promql.py
- Line 143: (r"#.*?$", Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\prql.py
- Line 44: r'((\w+)((\.\w+)|(\[[^\]]+\]))*)?'  # field name
- Line 45: r'(\:(.?[<>=\^])?[-+ ]?#?0?(\d+)?,?(\.\d+)?[E-GXb-gnosx%]?)?'
- Line 65: (r'#!.*', String.Doc),
- Line 66: (r'#.*', Comment.Single),
- Line 208: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 212: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 249: (r'\w+(\.\w+)*', Name.Class, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\ptx.py
- Line 59: (r'//.*?\n', Comment)

### \server\venv\Lib\site-packages\pygments\lexers\python.py
- Line 68: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 72: r'((\w+)((\.\w+)|(\[[^\]]+\]))*)?'  # field name
- Line 73: r'(\![sra])?'                       # conversion
- Line 74: r'(\:(.?[<>=\^])?[-+ ]?#?0?(\d+)?,?(\.\d+)?[E-GXb-gnosx%]?)?'
- Line 106: (r'\A#!.+$', Comment.Hashbang),
- Line 107: (r'#.*$', Comment.Single),
- Line 185: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 186: r'(\![sraf])?'     # conversion
- Line 190: (r'(=\s*)?'         # debug (https://bugs.python.org/issue36817)
- Line 191: r'(\![sraf])?'     # conversion
- Line 221: (r'(^[ \t]*)'              # at beginning of line + possible indentation
- Line 223: r'(?![ \t]*(?:'           # not followed by...
- Line 224: r'[:,;=^&|@~)\]}]|(?:' +  # characters and keywords that mean this isn't
- Line 436: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 454: (r'\A#!.+$', Comment.Hashbang),
- Line 455: (r'#.*$', Comment.Single),
- Line 582: (r'[a-zA-Z_]\w*', Name.Function, '#pop'),
- Line 586: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 669: (r'(?=>>>( |$))', Text, '#pop'),
- Line 715: # different tokens.  TODO: DelegatingLexer should support this
- Line 848: (r'#.*$', Comment),
- Line 938: (r'[a-zA-Z_]\w*', Name.Function, '#pop')
- Line 943: (r'([a-zA-Z_]\w*)(\s*)(?=[(:#=]|$)',
- Line 950: (r'(?=["\'])', Text, '#pop'),
- Line 955: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 964: (r'(\s+)(c?import)\b', bygroups(Whitespace, Keyword), '#pop'),
- Line 974: (r'%(\([a-zA-Z0-9]+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
- Line 1025: (r'#.*?$', Comment.Single),
- Line 1084: (r'%(\(\w+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'

### \server\venv\Lib\site-packages\pygments\lexers\q.py
- Line 32: (r"^#!.*", Comment.Hashbang),
- Line 67: (r"([.]?[a-zA-Z][\w.]*)(\s*)([-.~=!@#$%^&*_+|,<>?/\\:']?:)(\s*)(\{)",
- Line 71: (r"([.]?[a-zA-Z][\w.]*)(\s*)([-.~=!@#$%^&*_+|,<>?/\\:']?:)",
- Line 90: (r"[-=+*#$%@!~^&:.,<>'\\|/?_]", Operator),

### \server\venv\Lib\site-packages\pygments\lexers\qlik.py
- Line 38: (r"\*/", Comment.Multiline, "#pop"),
- Line 82: (r"//.*\n", Comment.Single),
- Line 100: # Quotes denote a field/file name
- Line 102: # Square brackets denote a field/file name
- Line 110: # Strings denoted by single quotes

### \server\venv\Lib\site-packages\pygments\lexers\qvt.py
- Line 51: (r'(--|//)(\s*)(directive:)?(.*)$',
- Line 54: # '/*' and '/**', à la javadoc
- Line 55: # (r'/[*]{2}(.|\n)*?[*]/', Comment.Multiline),
- Line 58: (r'(and|not|or|xor|##?)\b', Operator.Word),
- Line 83: # (r'([a-zA-Z_]\w*)(::)([a-zA-Z_]\w*)',

### \server\venv\Lib\site-packages\pygments\lexers\r.py
- Line 50: # We have reached a non-prompt line!
- Line 86: (r'#.*$', Comment.Single),
- Line 148: (r'([^\'\\]|\\.)*\'', String, '#pop'),
- Line 151: (r'([^"\\]|\\.)*"', String, '#pop'),
- Line 189: (r'^\s*#(?:ifn?def|endif).*\b', Comment.Preproc),

### \server\venv\Lib\site-packages\pygments\lexers\rdf.py
- Line 57: PN_LOCAL_ESC_CHARS_GRP = r' _~.\-!$&"()*+,;=/?#@%'
- Line 137: (r'#[^\n]*', Comment),
- Line 224: PN_LOCAL_ESC_CHARS_GRP = r' _~.\-!$&"()*+,;=/?#@%'
- Line 237: 'PNAME_NS': r'((?:[a-zA-Z][\w-]*)?\:)',  # Simplified character range
- Line 308: (r'(\^\^){IRIREF}'.format(**patterns), bygroups(Operator, Generic.Emph), '#pop:2'),
- Line 360: PN_LOCAL_ESC_CHARS_GRP = r"_~.\-!$&'()*+,;=/?#@%"
- Line 431: (r'#[^\n]*', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\rebol.py
- Line 104: elif re.match(r'(\+|-|\*|/|//|\*\*|and|or|xor|=\?|=|==|<>|<|>|<=|>=)$',
- Line 113: elif re.match("#.*", word):
- Line 124: (r'#\{[0-9a-f]*\}', Number.Hex),
- Line 126: (r'64#\{[0-9a-z+/=\s]*\}', Number.Hex),
- Line 129: (r';#+.*\n', Comment.Special),
- Line 134: (r'[+-]?([a-z]{1,3})?\$\d+(\.\d+)?', Number.Float),  # money
- Line 135: (r'[+-]?\d+\:\d+(\:\d+)?(\.\d+)?', String.Other),    # time
- Line 137: r'([.\d+]?([+-]?\d+:\d+)?)?)?)?', String.Other),   # date
- Line 144: (r'[a-z]+[^(^{"\s:)]*://[^(^{"\s)]*', Name.Decorator),  # url
- Line 294: elif re.match(r'(\+|-\*\*|-|\*\*|//|/|\*|and|or|xor|=\?|===|==|=|<>|<=|>=|'
- Line 301: elif re.match("#.*", word):
- Line 314: (r'#\{[0-9a-f\s]*\}', Number.Hex),
- Line 316: (r'64#\{[0-9a-z+/=\s]*\}', Number.Hex),
- Line 321: (r';#+.*\n', Comment.Special),
- Line 326: (r'[+-]?([a-z]{1,3})?\$\d+(\.\d+)?', Number.Float),  # money
- Line 327: (r'[+-]?\d+\:\d+(\:\d+)?(\.\d+)?', String.Other),    # time
- Line 329: r'([\.\d+]?([+-]?\d+:\d+)?)?)?)?', String.Other),   # date
- Line 336: (r'[a-z]+[^(^{"\s:)]*://[^(^{"\s)]*', Name.Decorator),  # url

### \server\venv\Lib\site-packages\pygments\lexers\rego.py
- Line 41: (r'#.*?$', Comment.Single),
- Line 48: (r'(==|!=|<=|>=|:=)', Operator),  # Compound operators
- Line 49: (r'[=<>+\-*/%&|]', Operator),     # Single-character operators

### \server\venv\Lib\site-packages\pygments\lexers\resource.py
- Line 35: (r'//.*?$', Comment),
- Line 51: (r'([^{},]+)(\s*)', bygroups(Name, String.Escape), ('#pop', 'message'))

### \server\venv\Lib\site-packages\pygments\lexers\ride.py
- Line 87: (r'#.*', Comment.Single),
- Line 96: (r'\{-#.*?#-\}', Keyword.Reserved),

### \server\venv\Lib\site-packages\pygments\lexers\rita.py
- Line 33: (r'#(.*?)\n', Comment.Single),
- Line 34: (r'@(.*?)\n', Operator),  # Yes, whole line as an operator

### \server\venv\Lib\site-packages\pygments\lexers\rnc.py
- Line 33: (r'##.*$', Comment.Preproc),
- Line 34: (r'#.*$', Comment.Single),
- Line 36: # TODO single quoted strings and escape sequences outside of

### \server\venv\Lib\site-packages\pygments\lexers\roboconf.py
- Line 43: (r'#.*\n', Comment),
- Line 75: (r'#.*\n', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\ruby.py
- Line 45: # match: 1 = <<[-~]?, 2 = quote? 3 = name 4 = quote? 5 = rest of line
- Line 48: yield start, Operator, match.group(1)        # <<[-~]?
- Line 84: # end of heredoc not found -- error!
- Line 96: yield match.start(4), String.Regex, match.group(4)  # end[mixounse]*
- Line 161: (rbrace + '[mixounse]*', String.Regex, '#pop'),
- Line 169: # these must come after %<brace>!
- Line 195: (r'\A#!.+?$', Comment.Hashbang),
- Line 196: (r'#.*?$', Comment.Single),
- Line 289: # better ideas?)
- Line 290: # since pygments 0.7 we also eat a "?" operator after numbers
- Line 294: #   x>=0?n[x]:""
- Line 312: (r'\?(\\[MC]-)*'  # modifiers
- Line 318: # like keywords (class) or like this: ` ?!?
- Line 332: (r'(?:([a-zA-Z_]\w*)(\.))?'  # optional scope name, like "self."
- Line 334: r'[a-zA-Z\u0080-\uffff][a-zA-Z0-9_\u0080-\uffff]*[!?=]?'  # method name
- Line 335: r'|!=|!~|=~|\*\*?|[-+!~]@?|[/%&|^]|<=>|<[<=]?|>[>=]?|===?'  # or operator override
- Line 336: r'|\[\]=?'  # or element reference/assignment override
- Line 345: (r'[A-Z_]\w*', Name.Class, '#pop'),
- Line 349: (r'(\))(\.|::)?', bygroups(Punctuation, Operator), '#pop'),
- Line 360: (r'#@@?[a-zA-Z_]\w*', String.Interpol),
- Line 361: (r'#\$[a-zA-Z_]\w*', String.Interpol)
- Line 384: (r'/[mixounse]*', String.Regex, '#pop'),
- Line 453: (r'/(\\\\|\\[^\\]|[^/\\])*/[egimosx]*', String.Regex, '#pop'),
- Line 454: (r'!(\\\\|\\[^\\]|[^!\\])*![egimosx]*', String.Regex, '#pop'),
- Line 455: (r'\\(\\\\|[^\\])*\\[egimosx]*', String.Regex, '#pop'),
- Line 456: (r'\{(\\\\|\\[^\\]|[^}\\])*\}[egimosx]*', String.Regex, '#pop'),
- Line 457: (r'<(\\\\|\\[^\\]|[^>\\])*>[egimosx]*', String.Regex, '#pop'),
- Line 458: (r'\[(\\\\|\\[^\\]|[^\]\\])*\][egimosx]*', String.Regex, '#pop'),
- Line 459: (r'\((\\\\|\\[^\\]|[^)\\])*\)[egimosx]*', String.Regex, '#pop'),
- Line 460: (r'@(\\\\|\\[^\\]|[^@\\])*@[egimosx]*', String.Regex, '#pop'),
- Line 461: (r'%(\\\\|\\[^\\]|[^%\\])*%[egimosx]*', String.Regex, '#pop'),
- Line 462: (r'\$(\\\\|\\[^\\]|[^$\\])*\$[egimosx]*', String.Regex, '#pop'),
- Line 472: (r'm?/(\\\\|\\[^\\]|[^///\n])*/[gcimosx]*', String.Regex),
- Line 476: (r'#(.*?)\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\rust.py
- Line 69: # starts with #![ then it's not a shebang but a crate attribute.
- Line 70: (r'#![^[\r\n].*$', Comment.Preproc),
- Line 77: (r'//!.*?\n', String.Doc),
- Line 78: (r'///(\n|[^/].*?\n)', String.Doc),
- Line 79: (r'//(.*?)\n', Comment.Single),
- Line 138: (r'(?s)b?r(#*)".*?"\1', String),
- Line 151: (r'r#[a-zA-Z_]\w*', Name),
- Line 154: (r'#!?\[', Comment.Preproc, 'attribute['),
- Line 158: # arguments, most famously for quote::quote!()
- Line 163: (r'/\*', Comment.Multiline, '#push'),
- Line 164: (r'\*/', Comment.Multiline, '#pop'),
- Line 169: (r'/\*', String.Doc, '#push'),
- Line 170: (r'\*/', String.Doc, '#pop'),
- Line 175: (r'[a-zA-Z_]\w*', Name.Namespace, '#pop'),
- Line 180: (r'[a-zA-Z_]\w*', Name.Function, '#pop'),
- Line 189: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\sas.py
- Line 130: # SAS is multi-line regardless, but * is ended by ;
- Line 147: (r'(.|\n)*^\s*;\s*$', Other, '#pop'),
- Line 149: # Special highlight for put NOTE|ERROR|WARNING (order matters)
- Line 154: (r'NOTE(:|-).*', Generic, '#pop'),
- Line 155: (r'WARNING(:|-).*', Generic.Emph, '#pop'),
- Line 156: (r'ERROR(:|-).*', Generic.Error, '#pop'),
- Line 211: (r'[a-z_]\w{0,31}\.?', Name.Variable, '#pop'),
- Line 224: #     (r'(-|=|<=|>=|<|>|<>|&|!=|'
- Line 225: #      r'\||\*|\+|\^|/|!|~|~=)', Operator)

### \server\venv\Lib\site-packages\pygments\lexers\savi.py
- Line 48: (r'//.*?$', Comment.Single),
- Line 104: (r'(\])(\!)', bygroups(Punctuation, Generic.Deleted), "#pop"),

### \server\venv\Lib\site-packages\pygments\lexers\scdoc.py
- Line 61: # general text, must come last!

### \server\venv\Lib\site-packages\pygments\lexers\scripting.py
- Line 67: (r'#!.*', Comment.Preproc),
- Line 88: (r'[=<>|~&+\-*/%#^]+|\.\.', Operator),
- Line 116: (rf'{_name}(?={_s}*\()', Name.Function, '#pop'),
- Line 185: (r'0[xX][\da-fA-F_]*', Number.Hex, '#pop'),
- Line 186: (r'0[bB][\d_]*', Number.Bin, '#pop'),
- Line 187: (r'\.?\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?', Number.Float, '#pop'),
- Line 193: (r'\[(=*)\[[.\n]*?\]\1\]', String, '#pop'),
- Line 195: (r'(\.)([a-zA-Z_]\w*)(?=%s*[({"\'])', bygroups(Punctuation, Name.Function), '#pop'),
- Line 196: (r'(\.)([a-zA-Z_]\w*)', bygroups(Punctuation, Name.Variable), '#pop'),
- Line 198: (rf'[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*(?={_s}*[({{"\'])', Name.Other, '#pop'),
- Line 199: (r'[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*', Name, '#pop'),
- Line 210: (r'::?', Punctuation, ('#pop', 'type_end', 'type_start')),
- Line 250: (r'#!.*', Comment.Hashbang, 'base'),
- Line 269: (r'(?:\.\.|//|[+\-*\/%^<>=])=?', Operator, 'expression'),
- Line 421: (r'[a-zA-Z_]\w*', Name.Class, '#pop'),
- Line 512: (r'#!(.*?)$', Comment.Preproc),
- Line 526: (r'(==|!=|~=|<=|>=|\.\.\.|\.\.|[=+\-*/%^<>#!.\\:])', Operator),
- Line 540: (r'[A-Z]\w*', Name.Class),  # proper name
- Line 584: (r'//.*?\n', Comment.Single),
- Line 586: (r'^\#.*?\n', Comment.Single)
- Line 592: (r'(?=/)', Text, ('#pop', 'badregex')),
- Line 669: (r'//.*?\n',                          Comment.Single),
- Line 703: (r'/\*',                              Comment.Multiline, '#push'),
- Line 704: (r'\*/',                              Comment.Multiline, '#pop'),
- Line 996: (r'(--|#).*?$', Comment),
- Line 1030: (r'\(\*', Comment.Multiline, '#push'),
- Line 1031: (r'\*\)', Comment.Multiline, '#pop'),
- Line 1091: (r'(-|//|/|\(|\)|\*\*|\*|\\<<|\\<|\\==|\\=|\\>>|\\>|\\|\|\||\||'
- Line 1109: (r'\*/', Comment.Multiline, '#pop'),
- Line 1215: (r'//.*?\n', Comment.Single),
- Line 1272: (r'[a-zA-Z_]\w*', Name.Class, '#pop')
- Line 1275: (r'[\w.]+\*?', Name.Namespace, '#pop')
- Line 1304: # Note: We cannot use r'\b' at the start and end of keywords because
- Line 1307: #   * space ( )
- Line 1308: #   * apostrophe (')
- Line 1309: #   * period (.)
- Line 1310: #   * comma (,)
- Line 1311: #   * parenthesis ( and )
- Line 1312: #   * colon (:)
- Line 1314: # Additionally words end once a '*' appears, indicatins a comment.
- Line 1388: (r'\*.*\n', Comment.Single, '#pop'),
- Line 1391: (r"'(''|[^'])*'", String, '#pop'),
- Line 1469: # Note: PARAM is not a proper English word, so this is
- Line 1499: (r'//\*.*\n', Comment.Single),
- Line 1502: # TODO: JES3 statement
- Line 1503: (r'.*\n', Other)  # Input text or inline code in any language.
- Line 1506: (r'\s*\n', Whitespace, '#pop'),
- Line 1519: (r'\s*\n', Whitespace, '#pop'),
- Line 1549: _JOB_HEADER_PATTERN = re.compile(r'^//[a-z#$@][a-z0-9#$@]{0,7}\s+job(\s+.*)?$',
- Line 1579: (r'#!(.*?)$', Comment.Preproc),
- Line 1583: ('//.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\sgf.py
- Line 53: (r'(\[)([\w\s#()+,\-.:?]+)(\])',

### \server\venv\Lib\site-packages\pygments\lexers\shell.py
- Line 51: (r'\$\{#?', String.Interpol, 'curly'),
- Line 52: (r'\$[a-zA-Z_]\w*', Name.Variable),  # user variable
- Line 53: (r'\$(?:\d+|[#$?!_*@-])', Name.Variable),      # builtin
- Line 67: (r'\A#!.+\n', Comment.Hashbang),
- Line 68: (r'#.*\n', Comment.Single),
- Line 110: (r'\d+#(?! )', Number),
- Line 113: (r'[a-zA-Z_]\w*', Name.Variable),  # user variable
- Line 240: r'?|\[\S+[@:][^\n]+\].+))\s*[$#%]\s*)(.*\n?)')
- Line 363: state.append((r'(?=\))', Text, '#pop'))
- Line 368: (rf'(?=[{_nl}])', Text, '#pop'),
- Line 369: (r'\|\|?|&&?', Punctuation, '#pop'),
- Line 380: state.append((r'(?=\))', Text, '#pop'))
- Line 390: (r'(?=[\x00|&])', Text, '#pop'),
- Line 399: state.append((r'(?=\))', Text, '#pop'))
- Line 409: state.append((r'(?=\))', Text, '#pop'))
- Line 523: (r'\(', Punctuation, ('#pop', 'else?', 'root/compound')),
- Line 569: (r'\$\{#?', Keyword, 'curly'),
- Line 587: (r'#.*', Comment),
- Line 600: (r'\$#?(\w+|.)', Name.Variable),
- Line 706: (r'^(\s*#[#\s]*)(\.(?:{}))([^\n]*$)'.format('|'.join(commenthelp)),
- Line 708: (r'#[^\n]*?$', Comment),
- Line 722: (r'\[[a-z_\[][\w. `,\[\]]*\]', Name.Constant),  # .net [type]s
- Line 795: (r'\$#?(\w+|.)', Name.Variable),
- Line 810: (r'#.*\n', Comment),
- Line 840: (r'\d+#(?! )', Number),
- Line 877: (r'\A#!.+\n', Comment.Hashbang),
- Line 878: (r'#.*\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\sieve.py
- Line 63: (r'#.*$',

### \server\venv\Lib\site-packages\pygments\lexers\slash.py
- Line 35: (r"<%#.*?%>",   Comment.Multiline),
- Line 60: (r'}[a-z]*',            String.Regex,       "#pop"),
- Line 70: (r"(#|//).*?\n",            Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\smalltalk.py
- Line 69: (r'[-+*/\\~<>=|&#!?,@%\w:]+', String.Symbol),
- Line 73: (r'#*\(', String.Symbol, 'inner_parenth'),
- Line 97: (r'#("(""|[^"])*"|[-+*/\\~<>=|&!?,@%]+|[\w:]+)',
- Line 102: (r'! !$', Keyword, '#pop'),  # squeak chunk delimiter
- Line 108: (r'\b[a-zA-Z]+\w*:', Name.Function, '#pop'),
- Line 110: (r'\w+:?|[-+*/\\~<>=|&!?,@%]+', Name.Function, '#pop'),
- Line 186: (r"#'[^']*'", String.Symbol),
- Line 187: (r"#\w+:?", String.Symbol),
- Line 188: (r"#(\+|\/|~|\*|<|>|=|@|%|\||&|\?|!|,|-)+", String.Symbol)

### \server\venv\Lib\site-packages\pygments\lexers\smithy.py
- Line 44: (r'///.*$', Comment.Multiline),
- Line 45: (r'//.*$', Comment),
- Line 46: (r'@[0-9a-zA-Z\.#-]*', Name.Decorator),

### \server\venv\Lib\site-packages\pygments\lexers\smv.py
- Line 43: 'PREDICATES'), suffix=r'(?![\w$#-])'),
- Line 45: (r'process(?![\w$#-])', Keyword),
- Line 47: suffix=r'(?![\w$#-])'), Keyword.Type),
- Line 48: (words(('case', 'esac'), suffix=r'(?![\w$#-])'), Keyword),
- Line 51: 'abs', 'max', 'min'), suffix=r'(?![\w$#-])'),
- Line 56: 'xnor'), suffix=r'(?![\w$#-])'),
- Line 58: (words(('TRUE', 'FALSE'), suffix=r'(?![\w$#-])'), Keyword.Constant),
- Line 61: (r'[a-zA-Z_][\w$#-]*', Name.Variable),

### \server\venv\Lib\site-packages\pygments\lexers\snobol.py
- Line 47: (r'\s*\n', Text, '#pop'),
- Line 56: # | for the EBCDIC equivalent, ! likewise
- Line 58: (r'\*\*|[?$.!%*/#+\-@|&\\=]', Operator),
- Line 71: (r'\s*\n', Text, "#pop:2"),

### \server\venv\Lib\site-packages\pygments\lexers\solidity.py
- Line 66: (r'//(\n|[\w\W]*?[^\\]\n)', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\soong.py
- Line 66: (r'//.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\sophia.py
- Line 57: (r'//.*?\n', Comment.Single),
- Line 61: (r'#[\da-fA-F][\da-fA-F_]*', Name.Label),
- Line 84: (r'\/\*', Comment.Multiline, '#push'),
- Line 85: (r'\*\/', Comment.Multiline, '#pop'),
- Line 98: (r'[A-Z][\w\']*', Name.Function, '#pop'),
- Line 99: (r'[a-z_][\w\']*', Name, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\spice.py
- Line 35: (r'//(.*?)\n', Comment.Single),
- Line 65: r'\+\+|--|\%|\^|\~|==|!=|->|::|[.]{3}|#!|#|[+\-*/&]', Operator),

### \server\venv\Lib\site-packages\pygments\lexers\sql.py
- Line 150: # TODO: better logging
- Line 177: (r'[+*/<>=~!@#%^&|`?-]+', Operator),
- Line 195: (r'\*/', Comment.Multiline, '#pop'),
- Line 223: # FIXME: use inheritance
- Line 240: (r'\%[a-z]\w*\b', Name.Builtin),     # actually, a datatype
- Line 243: (r'\#[a-z]\w*\b', Keyword.Pseudo),   # #variable_conflict
- Line 274: re_prompt = re.compile(r'^(\S.*?)??[=\-\(\$\'\"][#>]')
- Line 347: # TODO: better handle multiline comments at the end with
- Line 348: # a lexer with an external state?
- Line 513: # special case: "*SELECT*"
- Line 529: (r'(\()([^\n]*)(\))', bygroups(Punctuation, Name.Variable, Punctuation), '#pop'),
- Line 531: (r'[^\n]*', Name.Variable, '#pop'),
- Line 586: (r'[+*/<>=~!@#%^&|`?-]', Operator),
- Line 588: # TODO: Backslash escapes?
- Line 590: (r'"(""|[^"])*"', String.Symbol),  # not a real string literal in ANSI SQL
- Line 591: (r'[a-z_][\w$]*', Name),  # allow $s in strings for Oracle
- Line 596: (r'\*/', Comment.Multiline, '#pop'),
- Line 652: (r'#?#?\w+', Name),  # names for temp tables and anything else
- Line 653: (r'\?', Name.Variable.Magic),  # parameter for prepared statements
- Line 657: (r'\*/', Comment.Multiline, '#pop'),
- Line 675: # and 0 >= 2 * 0, so we would always assume it's true
- Line 713: (r'(?:#|--\s+).*', Comment.Single),
- Line 726: (r'[0-9]+\.[0-9]*(e[+-]?[0-9]+)?', Number.Float),  # Mandatory integer, optional fraction and exponent
- Line 727: (r'[0-9]*\.[0-9]+(e[+-]?[0-9]+)?', Number.Float),  # Mandatory fraction, optional integer and exponent
- Line 728: (r'[0-9]+e[+-]?[0-9]+', Number.Float),  # Exponents with integer significands are still floats
- Line 729: (r'[0-9]+(?=[^0-9a-z$_\u0080-\uffff])', Number.Integer),  # Integers that are not in a schema object name
- Line 742: r"\d{2}(?:\d{2})?.?\d{2}.?\d{2}"  # Date part
- Line 744: r"\d{1,2}.?\d{1,2}.?\d{1,2}(\.\d*)?"  # Time part
- Line 759: (r'\?', Name.Variable),  # For demonstrating prepared statements
- Line 780: # Note: Although the first regex supports unquoted all-numeric
- Line 796: (r'\*/', Comment.Special, '#pop'),
- Line 805: (r'\*/', Comment.Multiline, '#pop'),
- Line 901: (r'(?:#|--\s+).*', Comment.Single),
- Line 913: (r'[0-9]+\.[0-9]*(e[+-]?[0-9]+)?', Number.Float),  # Mandatory integer, optional fraction and exponent
- Line 914: (r'[0-9]*\.[0-9]+(e[+-]?[0-9]+)?', Number.Float),  # Mandatory fraction, optional integer and exponent
- Line 915: (r'[0-9]+e[+-]?[0-9]+', Number.Float),  # Exponents with integer significands are still floats
- Line 916: (r'[0-9]+(?=[^0-9a-z$_\u0080-\uffff])', Number.Integer),  # Integers that are not in a schema object name
- Line 929: r"\d{2}(?:\d{2})?.?\d{2}.?\d{2}"  # Date part
- Line 931: r"\d{1,2}.?\d{1,2}.?\d{1,2}(\.\d*)?"  # Time part
- Line 946: (r'\?', Name.Variable),  # For demonstrating prepared statements
- Line 962: # Note: Although the first regex supports unquoted all-numeric
- Line 978: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\srcinfo.py
- Line 48: (r'#.*', Comment.Single),
- Line 60: (r'.*', Text, '#pop:2'),

### \server\venv\Lib\site-packages\pygments\lexers\stata.py
- Line 54: (r'(^//|(?<=\s)//)(?!/)', Comment.Single, 'comments-double-slash'),
- Line 57: (r'(^///|(?<=\s)///)', Comment.Special, 'comments-triple-slash')
- Line 60: (r'/\*', Comment.Multiline, '#push'),
- Line 64: (r'(\*/\s+\*(?!/)[^\n]*)|(\*/)', Comment.Multiline, '#pop'),
- Line 69: (r'///.*?\n', Comment.Single,
- Line 71: (r'(^//|(?<=\s)//)(?!/)', Comment.Single,
- Line 74: (r'.(?=\n)', Comment.Single, '#pop'),
- Line 80: (r'//.*?(?=\n)', Comment.Single, '#pop'),
- Line 87: # `"compound string"' and regular "string"; note the former are
- Line 101: (r'(")(?!\')|(?=\n)', String, '#pop'),
- Line 117: # A global is more restricted, so we do follow rules. Note only
- Line 132: (r'\$(\{|(?=[$`]))', Name.Variable.Global, '#push'),
- Line 140: (r'\$(\{|(?=[$`]))', Name.Variable.Global, 'macro-global-nested', '#pop'),
- Line 152: # http://www.stata.com/help.cgi?operators

### \server\venv\Lib\site-packages\pygments\lexers\supercollider.py
- Line 37: (r'//.*?\n', Comment.Single),
- Line 44: (r'(?=/)', Text, ('#pop', 'badregex')),

### \server\venv\Lib\site-packages\pygments\lexers\tablegen.py
- Line 121: (r'//.*?$', Comment.SingleLine),
- Line 124: # Binary/hex numbers. Note that these take priority over names,
- Line 153: (r'[-+\[\]{}()<>\.,;:=?#]+', Punctuation),
- Line 157: (r'/\*', Comment.Multiline, '#push'),
- Line 158: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\tact.py
- Line 124: (r'(?<=\})', Punctuation, '#pop'),
- Line 134: (r'(?<=\})', Punctuation, '#pop'),
- Line 143: (r'(?<=\})', Punctuation, '#pop'),
- Line 152: (r'(?<=\}|\;)', Punctuation, '#pop'),
- Line 225: (r'(?=\}|\,)', Punctuation, '#pop'),
- Line 234: (r'(?=\}|\{|\,|\;)',Punctuation, '#pop'),
- Line 243: (r'(?=\{|\;|\=|\,|\))', Punctuation, '#pop'),
- Line 266: (r'(?=\{|\;|\=|\,|\)|\>)', Punctuation, '#pop'),
- Line 289: (r'//.*', Comment.Single),
- Line 293: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\tal.py
- Line 44: (r'(?<!\S)\((?!\S)', Comment.Multiline, '#push'), # nested comments
- Line 45: (r'(?<!\S)\)(?!\S)', Comment.Multiline, '#pop'), # nested comments
- Line 51: (r'(?<!\S)\((?!\S)', Comment.Multiline, 'comment'), # comments
- Line 54: (r'[][{}](?!\S)', Punctuation), # delimiters
- Line 55: (r'#([0-9a-f]{2}){1,2}(?!\S)', Number.Hex), # integer
- Line 57: (r'([0-9a-f]{2}){1,2}(?!\S)', Literal), # raw integer
- Line 58: (r'[|$][0-9a-f]{1,4}(?!\S)', Keyword.Declaration), # abs/rel pad
- Line 69: (r'!\S+', Name.Function), # immediate jump
- Line 70: (r'\?\S+', Name.Function), # conditional immediate jump

### \server\venv\Lib\site-packages\pygments\lexers\tcl.py
- Line 64: (r'\}', Keyword),  # HACK: somehow we miscounted our braces
- Line 142: (r'.*[^\\]\n', Comment, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\teal.py
- Line 60: (r'^#pragma .*' + newline, Comment.Directive),

### \server\venv\Lib\site-packages\pygments\lexers\templates.py
- Line 67: _block_re = re.compile(r'(<%%|%%>|<%=|<%#|<%-|<%|-%>|%>|^%[^%].*?$)', re.M)
- Line 180: (r'#[a-zA-Z_]\w*#', Name.Variable),
- Line 226: (r'(#)(\*.*?\*)(#)',
- Line 228: (r'(##)(.*?$)',
- Line 230: (r'(#\{?)(' + identifier + r')(\}?)(\s?\()',
- Line 233: (r'(#\{?)(' + identifier + r')(\}|\b)',
- Line 277: if re.search(r'#\{?macro\}?\(.*?\).*?#\{?end\}?', text, re.DOTALL):
- Line 279: if re.search(r'#\{?if\}?\(.+?\).*?#\{?end\}?', text, re.DOTALL):
- Line 281: if re.search(r'#\{?foreach\}?\(.+?\).*?#\{?end\}?', text, re.DOTALL):
- Line 353: (r'\{#.*?#\}', Comment),
- Line 394: (r'(-?)(\}\})', bygroups(Text, Comment.Preproc), '#pop'),
- Line 399: (r'(-?)(%\})', bygroups(Text, Comment.Preproc), '#pop'),
- Line 445: (r'(?<=^)#[^\n]*(\n|\Z)', Comment),
- Line 449: (.+?)               # anything, followed by:
- Line 451: (?<=\n)(?=[%#]) |  # an eval or comment line
- Line 452: (?=</?[%&]) |      # a substitution or block or
- Line 557: (r'(?<=^)#[^\n]*(\n|\Z)', Comment),
- Line 561: (.+?)               # anything, followed by:
- Line 563: (?<=\n)(?=[%#]) |  # an eval or comment line
- Line 564: (?=</?[%&]) |      # a substitution or block or
- Line 601: (r'(\s*)(##[^\n]*)(\n|\Z)',
- Line 614: (.+?)                # anything, followed by:
- Line 616: (?<=\n)(?=%|\#\#) | # an eval or comment line
- Line 617: (?=\#\*) |          # multiline comment
- Line 618: (?=</?%) |          # a python block
- Line 620: (?=\$\{) |          # a substitution
- Line 637: (r'/?\s*>', Comment.Preproc, '#pop'),
- Line 641: ('".*?"', String, '#pop'),
- Line 642: ("'.*?'", String, '#pop'),
- Line 747: (r'(##[^\n]*)$',
- Line 749: (r'#[*](.|\n)*?[*]#', Comment),
- Line 750: (r'#end[^#\n]*(?:#|$)', Comment.Preproc),
- Line 752: (r'(#[a-zA-Z]+)([^#\n]*)(#|$)',
- Line 755: # TODO support other Python syntax like $foo['bar']
- Line 762: (.+?)               # anything, followed by:
- Line 764: (?=\#[#a-zA-Z]*) | # an eval comment
- Line 765: (?=\$[a-zA-Z_{]) | # a substitution
- Line 842: (r'^(\s*)(##.*)$', bygroups(Text, Comment)),
- Line 843: (r'^(\s*)(#)', bygroups(Text, Comment.Preproc), 'directive'),
- Line 849: (r'(?:def|for|if)\s+.*', using(PythonLexer), '#pop'),
- Line 853: (r'(end\w*)([^\S\n]*)(.*)', bygroups(Keyword, Text, Comment), '#pop'),
- Line 887: (r'/?\s*>', Name.Tag, '#pop'),
- Line 890: ('(")(.*?)(")', bygroups(String, using(PythonLexer), String), '#pop'),
- Line 891: ("(')(.*?)(')", bygroups(String, using(PythonLexer), String), '#pop'),
- Line 898: (r'/?\s*>', Name.Tag, '#pop'),
- Line 903: (r'[^\s>]*', String, '#pop')
- Line 1403: # FIXME: I want to make these keywords but still parse attributes.
- Line 1411: # note: '\w\W' != '.' without DOTALL.
- Line 1468: (r'(\$)(evoque|overlay)(\{(%)?)(\s*[#\w\-"\'.]+)?'
- Line 1550: (r'//.*?\n', Comment.Single),
- Line 1578: (r'#.+?#', String.Interp),
- Line 1617: (r'(#)(.*?)(#)', bygroups(Punctuation, using(ColdfusionLexer),
- Line 1619: # (r'<cfoutput.*?>', Name.Builtin, '#push'),
- Line 1620: (r'</cfoutput.*?>', Name.Builtin, '#pop'),
- Line 1626: (r'<!---', Comment.Multiline, '#push'),
- Line 1704: # note: '\w\W' != '.' without DOTALL.
- Line 1852: # Comment start {{!  }} or {{!--
- Line 1859: (r'(\{\{)([#~/]+)([^\s}]*)',
- Line 1869: (r'(~?)(\}\})', bygroups(Number, Comment.Preproc), '#pop'),
- Line 1876: (r'(#?>)(\s*)([\w-]+)', bygroups(Keyword, Text, Name.Variable)),
- Line 2168: # Note that a backslash is included in the following two patterns
- Line 2180: (r'\{\#.*?\#\}', Comment),
- Line 2223: (r'(-?)(\}\})', bygroups(Text, Comment.Preproc), '#pop'),
- Line 2228: (r'(-?)(%\})', bygroups(Text, Comment.Preproc), '#pop'),
- Line 2268: (r'[^{([*#]+', Other),
- Line 2280: # *ngIf="..."; #f="ngForm"
- Line 2281: (r'([*#])([\w:.-]+)(\s*)(=)(\s*)',
- Line 2283: (r'([*#])([\w:.-]+)(\s*)',
- Line 2307: ('".*?"', String, '#pop'),
- Line 2308: ("'.*?'", String, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\teraterm.py
- Line 49: (r'\*/', Comment.Multiline, '#pop'),
- Line 304: (r'(?i)#(?:[0-9]+|\$[0-9a-f]+)', String.Char),

### \server\venv\Lib\site-packages\pygments\lexers\testing.py
- Line 35: (r'^\s*#.*$', Comment),
- Line 53: (r"\s+\|\s*$", Keyword, "#pop:2"),
- Line 99: (r"\s+\|\s*$", Keyword, "#pop"),
- Line 163: (r'^#.*\n', Comment),
- Line 182: (r'.*\n', Generic.Error, '#pop'),
- Line 199: # Extract todo items.

### \server\venv\Lib\site-packages\pygments\lexers\textedit.py
- Line 37: (r'#.*$', Comment.Single)
- Line 43: (r'(?=/)', Text, ('#pop', 'badregex')),
- Line 94: (r'#.*$', Comment.Single),
- Line 140: # TODO: regexes can have other delims
- Line 145: # Who decided that doublequote was a good comment character??
- Line 146: (r'(?<=\s)"[^\-:.%#=*].*', Comment),
- Line 150: (r'[()<>+=!|,~-]', Punctuation),  # Inexact list.  Looks decent.
- Line 191: # TODO: builtins are only subsequent tokens on lines

### \server\venv\Lib\site-packages\pygments\lexers\textfmts.py
- Line 39: (?: \[|\()?                  # Opening bracket or paren for the timestamp
- Line 40: (?:                        # Timestamp
- Line 41: (?: (?:\d{1,4} [-/])*  # Date as - or /-separated groups of digits
- Line 43: [T ])?                # Date/time separator: T or space
- Line 44: (?: \d?\d [:.])*       # Time as :/.-separated groups of 1 or 2 digits
- Line 47: (?: \]|\))?\s+               # Closing bracket or paren for the timestamp
- Line 62: # hack
- Line 66: (\s*<.*?>\s*)          # Nick """,
- Line 70: (\s*[*]\s+)            # Star
- Line 71: (\S+\s+.*?\n)          # Nick + rest of message """,
- Line 75: (\s*(?:\*{3}|<?-[!@=P]?->?)\s*)  # Star(s) or symbols
- Line 77: (.*?\n)                         # Rest of message """,
- Line 82: (r"\S+:(?!//)", Name.Attribute),  # Prefix
- Line 83: (r".*\n", Text, '#pop'),
- Line 101: (r'^#,\s.*?$', Keyword.Type),
- Line 102: (r'^#:\s.*?$', Keyword.Declaration),
- Line 104: (r'^(#|#\.\s|#\|\s|#~\s|#\s).*$', Comment.Single),
- Line 214: url = 'http://todotxt.com/'
- Line 217: # *.todotxt is not a standard extension for Todo.txt files; including it
- Line 222: # Aliases mapping standard token types of Todo.txt format concepts
- Line 240: # TODO: Make date regex more ISO 8601 compliant
- Line 283: (r'\s*\n', CompleteTaskText, '#pop'),
- Line 296: (r'\s*\n', IncompleteTaskText, '#pop'),
- Line 375: (r'\f(?:part|attachment)\}\n', Keyword, '#pop'),
- Line 376: (r'\f(?:part|attachment)\{\s*', Keyword, ('#push', 'part-attr')),

### \server\venv\Lib\site-packages\pygments\lexers\theorem.py
- Line 98: '!=', '#', '&', '&&', r'\(', r'\)', r'\*', r'\+', ',', '-', r'-\.',
- Line 127: # (r'\b([A-Z][\w\']*)(\.)', Name.Namespace, 'dotted'),
- Line 169: # Consume comments like ***** as one token
- Line 171: (r'\(\*', Comment, '#push'),
- Line 172: (r'\*\)', Comment, '#pop'),
- Line 184: (r'[A-Z][\w\']*', Name.Class, '#pop'),
- Line 185: (r'[a-z][a-z0-9_\']*', Name, '#pop'),
- Line 383: (r'\(\*', Comment, '#push'),
- Line 384: (r'\*\)', Comment, '#pop'),
- Line 390: (r'\{\*|‹', String, '#push'),
- Line 392: (r'\*\}|›', String, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\thingsdb.py
- Line 125: (r'//(.*?)\n', Comment.Single),
- Line 130: (r'/\*', Comment.Multiline, '#push'),
- Line 131: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\tlb.py
- Line 41: (r'#[0-9a-f]*_?', Name.Tag),
- Line 50: (r'//.*', Comment.Singleline),
- Line 55: (r'/\*', Comment.Multiline, '#push'),
- Line 56: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\tnt.py
- Line 183: while text[end] != '\n':  # there's whitespace in rules
- Line 201: if end != start:  # actual number present

### \server\venv\Lib\site-packages\pygments\lexers\trafficscript.py
- Line 43: (r'#[^\n]*', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\typoscript.py
- Line 42: (r'(.*)(###\w+###)(.*)', bygroups(String, Name.Constant, String)),
- Line 55: (r'(?<!(#|\'|"))(?:#(?!(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3}))[^\n#]+|//[^\n]*)',
- Line 81: (r'(.*)(###\w+###)(.*)', bygroups(String, Name.Constant, String)),
- Line 94: (r'[\w"\-!/&;(){}#]+', String),
- Line 140: # Toplevel objects and _*
- Line 174: # (r'[0-9]*\.[0-9]+([eE][0-9]+)?[fd]?\s*(?:[^=])', Number.Float),
- Line 208: (r'(?<!(#|\'|"))(?:#(?!(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3}))[^\n#]+|//[^\n]*)',
- Line 211: (r'(\s*#\s*\n)', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\typst.py
- Line 55: (r'(#[a-zA-Z_][a-zA-Z0-9_-]*)(\[)', bygroups(Name.Function, Punctuation), 'markup'),
- Line 56: (r'(#[a-zA-Z_][a-zA-Z0-9_-]*)(\()', bygroups(Name.Function, Punctuation), 'code'),
- Line 58: (r'#[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable),
- Line 71: (r'`[^`]*`', String.Backtick),  # inline code
- Line 72: (r'^(\s*)(-)(\s+)', bygroups(Whitespace, Punctuation, Whitespace)),  # unnumbered list
- Line 73: (r'^(\s*)(\+)(\s+)', bygroups(Whitespace, Punctuation, Whitespace)),  # numbered list
- Line 74: (r'^(\s*)([0-9]+\.)', bygroups(Whitespace, Punctuation)),  # numbered list variant
- Line 75: (r'^(\s*)(/)(\s+)([^:]+)(:)', bygroups(Whitespace, Punctuation, Whitespace, Name.Variable, Punctuation)),  # definitions
- Line 76: (r'<[a-zA-Z_][a-zA-Z0-9_-]*>', Name.Label),  # label
- Line 77: (r'@[a-zA-Z_][a-zA-Z0-9_-]*', Name.Label),  # reference
- Line 80: (r'```(?:.|\n)*?```', String.Backtick),  # code block
- Line 81: (r'https?://[0-9a-zA-Z~/%#&=\',;.+?]*', Generic.Emph),  # links
- Line 88: (r'((?![*_$`<@\\#\] ]|https?://).)+', Text),
- Line 100: (r'([a-zA-Z][a-zA-Z0-9-]*)(:)', bygroups(Name.Variable, Punctuation)), # named arguments in math functions
- Line 101: (r'([a-zA-Z][a-zA-Z0-9-]*)', Name.Variable), # both variables and symbols (_ isn't supported for variables)
- Line 108: (r'//.*$', Comment.Single),
- Line 120: (r'=>|<=|==|!=|>|<|-=|\+=|\*=|/=|\+|-|\\|\*', Operator), # comparisons
- Line 135: # FIXME: make this work
- Line 136: ## (r'(import|include)( *)(")([^"])(")',
- Line 157: if self.start_state != 'markup': # markup is equivalent to root

### \server\venv\Lib\site-packages\pygments\lexers\ul4.py
- Line 40: # ``<?ul4?>``
- Line 47: # ``<?ul4 foo(bar=42)?>``
- Line 55: # ``<?note?>...<?end note?>``
- Line 58: "note", # Switch to "note" mode
- Line 62: # ``<?note foobar?>``
- Line 68: # ``<?doc?>...<?end doc?>``
- Line 75: # ``<?doc foobar?>``
- Line 80: # ``<?ignore?>`` tag for commenting out code:
- Line 81: # ``<?ignore?>...<?end ignore?>``
- Line 87: # ``<?def?>`` tag for defining local templates
- Line 88: # ``<?def foo(bar=42)?>...<?end def?>``
- Line 101: # ``<?end?>`` tag for ending ``<?def?>``, ``<?for?>``,
- Line 102: # ``<?if?>``, ``<?while?>``, ``<?renderblock?>`` and
- Line 103: # ``<?renderblocks?>`` blocks.
- Line 109: # ``<?whitespace?>`` tag for configuring whitespace handlng
- Line 118: # Ignore mode ignores everything upto the matching ``<?end ignore?>`` tag
- Line 120: # Nested ``<?ignore?>`` tag
- Line 121: (r"<\?\s*ignore\s*\?>", Comment, "#push"),
- Line 122: # ``<?end ignore?>`` tag
- Line 123: (r"<\?\s*end\s+ignore\s*\?>", Comment, "#pop"),
- Line 128: # Note mode ignores everything upto the matching ``<?end note?>`` tag
- Line 130: # Nested ``<?note?>`` tag
- Line 131: (r"<\?\s*note\s*\?>", Comment, "#push"),
- Line 132: # ``<?end note?>`` tag
- Line 133: (r"<\?\s*end\s+note\s*\?>", Comment, "#pop"),
- Line 138: # Doc mode ignores everything upto the matching ``<?end doc?>`` tag
- Line 140: # Nested ``<?doc?>`` tag
- Line 141: (r"<\?\s*doc\s*\?>", String.Doc, "#push"),
- Line 142: # ``<?end doc?>`` tag
- Line 143: (r"<\?\s*end\s+doc\s*\?>", String.Doc, "#pop"),
- Line 151: (r"\?>", Comment.Preproc, "#pop"),
- Line 177: (r"//|==|!=|>=|<=|<<|>>|\+=|-=|\*=|/=|//=|<<=|>>=|&=|\|=|^=|=|[\[\]{},:*/().~%&|<>^+-]", Operator),
- Line 187: # ``<?end ...?>`` tag for closing the last open block
- Line 189: (r"\?>", Comment.Preproc, "#pop"),
- Line 193: # Content of the ``<?whitespace ...?>`` tag:
- Line 196: (r"\?>", Comment.Preproc, "#pop"),

### \server\venv\Lib\site-packages\pygments\lexers\unicon.py
- Line 37: (r'#.*?\n', Comment.Single),
- Line 182: (r'#.*?\n', Comment.Single),
- Line 322: (r'(#.*\n)', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\urbi.py
- Line 34: # TODO
- Line 63: (r'//.*?\n', Comment),
- Line 119: (r'(\\\\|\\[^\\]|[^"\\])*?"', String.Double, '#pop'),
- Line 123: (r"(\\\\|\\[^\\]|[^'\\])*?'", String.Single, '#pop'),
- Line 128: (r'/\*', Comment.Multiline, '#push'),
- Line 129: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\usd.py
- Line 68: ("#.*?$", Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\varnish.py
- Line 126: (r'/\*', Comment.Multiline, '#push'),
- Line 127: (r'\*/', Comment.Multiline, '#pop'),
- Line 131: (r'#.*$', Comment),
- Line 133: (r'//.*$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\verification.py
- Line 34: (r'//[/!](.*?)\n', Comment.Doc),
- Line 35: (r'//(.*?)\n', Comment.Single),
- Line 48: (r'\{.*?\}', Generic.Emph), #triggers
- Line 55: (r'/\*', Comment.Multiline, '#push'),
- Line 56: (r'\*/', Comment.Multiline, '#pop'),
- Line 81: (r'//[/!](.*?)\n', Comment.Doc),
- Line 82: (r'//(.*?)\n', Comment.Single),
- Line 99: (r'\{.*?\}', Generic.Emph), #triggers
- Line 106: (r'/\*', Comment.Multiline, '#push'),
- Line 107: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\verifpal.py
- Line 32: (r'//.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\vip.py
- Line 58: (r'/\*', Comment, '#push'),
- Line 59: (r'\*/', Comment, '#pop'),
- Line 112: # These are *really* good indicators (and not conflicting with the other languages)
- Line 144: # These are *really* good indicators

### \server\venv\Lib\site-packages\pygments\lexers\vyper.py
- Line 36: (r'#.*$', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\webassembly.py
- Line 79: (r'\$[A-Za-z0-9!#$%&\'*+./:<=>?@\\^_`|~-]+', Name.Variable), # yes, all of the are valid in identifiers

### \server\venv\Lib\site-packages\pygments\lexers\webidl.py
- Line 54: (r'//.*', Comment.Single),
- Line 55: (r'^#.*', Comment.Preproc),
- Line 142: (r'\[\s*\]', Punctuation, '#pop'),
- Line 149: r'|[0-9]+[Ee][+-]?[0-9]+)', Number.Float, '#pop'),
- Line 150: (r'-?[1-9][0-9]*', Number.Integer, '#pop'),
- Line 151: (r'-?0[Xx][0-9A-Fa-f]+', Number.Hex, '#pop'),
- Line 152: (r'-?0[0-7]*', Number.Oct, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\webmisc.py
- Line 42: (r'(<%[@=#!:]?)(.*?)(%>)',
- Line 92: charref = r'(?:&#[0-9]+;|&#x[0-9a-fA-F]+;)'
- Line 100: elementcontentchar = r'[A-Za-z]|\s|\d|[!"#$%()*+,\-./:;=?@\[\\\]^_\'`|~]'
- Line 103: quotattrcontentchar = r'[A-Za-z]|\s|\d|[!#$%()*+,\-./:;=?@\[\\\]^_\'`|~]'
- Line 106: aposattrcontentchar = r'[A-Za-z]|\s|\d|[!"#$%()*+,\-./:;=?@\[\\\]^_`|~]'
- Line 368: # (r'\)|\?|\]', Punctuation, '#push'),
- Line 457: # Marklogic specific type?
- Line 464: (r'(\(\#)(\s*)', bygroups(Punctuation, Text), 'pragma'),
- Line 522: (r'\?>', String.Doc, '#pop'),
- Line 526: (r'\?>', String.Doc, '#pop'),
- Line 759: (r'(\(#)(\s*)', bygroups(Punctuation, Whitespace), 'pragma'),
- Line 833: (r'//.*?\n', Comment.Single),
- Line 840: (r'(?=/)', Text, ('#pop', 'badregex')),
- Line 914: (r'(?=\n)', Text, '#pop'),
- Line 975: (r'\|' + _dot + r'*\n', _starts_block(Text, 'plain'), '#pop'),
- Line 976: (r'/' + _dot + r'*\n', _starts_block(Comment.Preproc, 'slim-comment-block'), '#pop'),
- Line 989: (r'([^#\n]|#[^{\n]|(\\\\)*\\#\{)+', Text),
- Line 990: (r'(#\{)(.*?)(\})',

### \server\venv\Lib\site-packages\pygments\lexers\wgsl.py
- Line 325: (rf'//{NotLineEndRE}*{CR}{LF}', Comment.Single),
- Line 326: (rf'//{NotLineEndRE}*{LineEndRE}', Comment.Single),
- Line 383: (r'0[iu]?', Number.Integer), # Must match last.
- Line 390: # TODO: Treat context-depedendent names specially
- Line 396: # TODO: templates start and end tokens.
- Line 402: (r'/\*', Comment.Multiline, '#push'),
- Line 403: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\whiley.py
- Line 38: (r'//.*', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\wowtoc.py
- Line 22: + r"^(##)( *)"  # groups 1, 2
- Line 24: + r"( *)(:)( *)(.*?)( *)$")  # groups 4, 5, 6, 7, 8
- Line 59: # official localized tags, Notes and Title
- Line 87: (r"^#.*$", Comment),

### \server\venv\Lib\site-packages\pygments\lexers\wren.py
- Line 59: (r'/\*', Comment.Multiline, 'comment'), # Multiline, can nest.
- Line 60: (r'//.*?$', Comment.Single),            # Single line.
- Line 61: (r'#.*?(\(.*?\))?$', Comment.Special),  # Attribute or shebang.
- Line 75: (r'""".*?"""', String),   # Raw string
- Line 79: (r'/\*', Comment.Multiline, '#push'),
- Line 80: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\x10.py
- Line 56: (r'//.*?\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\xorg.py
- Line 29: (r'#.*$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\yang.py
- Line 66: (r'/\*', Comment, '#push'),
- Line 67: (r'\*/', Comment, '#pop'),
- Line 79: (r'//.*?$', Comment),

### \server\venv\Lib\site-packages\pygments\lexers\yara.py
- Line 33: (r'//.*?$', Comment.Single),
- Line 34: (r'\#.*?$', Comment.Single),
- Line 65: (r'/\*', Comment.Multiline, '#push'),
- Line 66: (r'\*/', Comment.Multiline, '#pop'),

### \server\venv\Lib\site-packages\pygments\lexers\zig.py
- Line 76: (r'//.*?\n', Comment.Single),

### \server\venv\Lib\site-packages\pygments\lexers\_julia_builtins.py
- Line 30: r'=', r'+=', r'-=', r'*=', r'/=', r'//=', r'\=', r'^=', r'÷=', r'%=', r'<<=',
- Line 96: #!/usr/bin/env julia
- Line 143: #!/usr/bin/env julia
- Line 354: #!/usr/bin/env julia

### \server\venv\Lib\site-packages\pygments\lexers\_lua_builtins.py
- Line 234: r = re.compile(r'^<A HREF="manual.html#pdf-(?!lua|LUA)([^:]+)">\1</A>')

### \server\venv\Lib\site-packages\pygments\lexers\_mapping.py
- Line 21: 'AntlrCSharpLexer': ('pygments.lexers.parsers', 'ANTLR With C# Target', ('antlr-csharp', 'antlr-c#'), ('*.G', '*.g'), ()),
- Line 72: 'CSharpLexer': ('pygments.lexers.dotnet', 'C#', ('csharp', 'c#', 'cs'), ('*.cs',), ('text/x-csharp',)),
- Line 165: 'FSharpLexer': ('pygments.lexers.dotnet', 'F#', ('fsharp', 'f#'), ('*.fs', '*.fsi', '*.fsx'), ('text/x-fsharp',)),

### \server\venv\Lib\site-packages\pygments\lexers\__init__.py
- Line 295: # - is primary filename pattern?

### \server\venv\Lib\site-packages\pytest_asyncio\plugin.py
- Line 182: obj = getattr(obj, "__func__", obj)  # instance method maybe?
- Line 366: # Note that this is slightly different from the behavior of a non-async

### \server\venv\Lib\site-packages\python_multipart\decoders.py
- Line 68: decode_len = (len(data) // 4) * 4

### \server\venv\Lib\site-packages\python_multipart\exceptions.py
- Line 10: #: This is the offset in the input data chunk (*NOT* the overall stream) in

### \server\venv\Lib\site-packages\python_multipart\multipart.py
- Line 157: # and these: !#$%&'*+-.^_`|~
- Line 162: b"!#$%&'*+-.^_`|~")
- Line 474: # TODO: what happens if we don't have a filename?
- Line 488: # Note that on Python 3, tempfile doesn't support byte names.  We
- Line 764: # Should parsing be strict?
- Line 862: # Jump i to this position.  Note that it will then have 1
- Line 916: # Note that we go to the separator, which brings us to the
- Line 1128: # Error!
- Line 1251: # Move back to the start of another header.  Note that if that
- Line 1322: # The current character matches, so continue!
- Line 1327: # Our index is equal to the length of our boundary!
- Line 1427: # We got into a strange state somehow!  Just stop processing.
- Line 1437: # We call our callbacks with any remaining data.  Note that we pass
- Line 1465: # TODO: verify that we're in the state MultipartState.END, otherwise throw an
- Line 1508: #: Note: all file sizes should be in bytes.
- Line 1515: # Error on invalid Content-Transfer-Encoding?
- Line 1656: # TODO: check for error here.
- Line 1686: # TODO: handle mixed case
- Line 1693: # TODO: check for errors
- Line 1704: # TODO: check that we properly handle 8bit / 7bit encoding.
- Line 1765: # TODO: check the parser's return value for errors?

### \server\venv\Lib\site-packages\requests\adapters.py
- Line 663: # TODO: Remove this in 3.0.0: see #2811

### \server\venv\Lib\site-packages\requests\auth.py
- Line 220: # XXX should the partial digests be encoded too?

### \server\venv\Lib\site-packages\requests\certs.py
- Line 1: #!/usr/bin/env python

### \server\venv\Lib\site-packages\requests\compat.py
- Line 51: #: Python 2.x?
- Line 54: #: Python 3.x?

### \server\venv\Lib\site-packages\requests\hooks.py
- Line 19: # TODO: response is the only one

### \server\venv\Lib\site-packages\requests\models.py
- Line 373: # Note that prepare_auth must be last to enable authentication schemes
- Line 440: f"Perhaps you meant https://{url}?"
- Line 449: # it doesn't start with a wildcard (*), before allowing the unencoded hostname.
- Line 969: # and the server didn't bother to tell us what codec *was*

### \server\venv\Lib\site-packages\requests\packages.py
- Line 11: # preserved (requests.packages.urllib3.* is urllib3.*)

### \server\venv\Lib\site-packages\requests\utils.py
- Line 109: test = test.replace("*", r".*")  # change glob sequence
- Line 110: test = test.replace("?", r".")  # change glob char
- Line 246: # App Engine hackiness.
- Line 658: safe_with_percent = "!#$%&'()*+,/:;=?@[]~"
- Line 659: safe_without_percent = "!#$&'()*+,/:;=?@[]~"

### \server\venv\Lib\site-packages\requests\__init__.py
- Line 60: assert urllib3_version != ["dev"]  # Verify urllib3 isn't installed from git.

### \server\venv\Lib\site-packages\rsa\asn1.py
- Line 33: # This little hack (the implicit tag) allows us to get a Bit String as Octet String

### \server\venv\Lib\site-packages\rsa\prime.py
- Line 85: # Decompose (n - 1) to write it as (2 ** r) * d

### \server\venv\Lib\site-packages\sqlalchemy\connectors\aioodbc.py
- Line 37: # return self.await_(self._cursor.setinputsizes(*inputsizes))

### \server\venv\Lib\site-packages\sqlalchemy\connectors\asyncio.py
- Line 48: # note that async DBAPIs dont agree if close() should be awaitable,
- Line 273: # NOTE: this is overridden in aioodbc due to

### \server\venv\Lib\site-packages\sqlalchemy\connectors\pyodbc.py
- Line 47: # for non-DSN connections, this *may* be used to
- Line 101: # note if keys is empty, this is a totally blank URL
- Line 177: # NOTE: this function is not reliable, particularly when
- Line 202: # NOTE: as of #6058, this won't be called if the use_setinputsizes

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\aioodbc.py
- Line 37: "mssql+aioodbc://scott:tiger@mssql2017:1433/test?"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\base.py
- Line 554: "mssql+pyodbc://scott:tiger^5HHH@mssql2017:1433/test?driver=ODBC+Driver+17+for+SQL+Server",
- Line 2134: # TODO: Why?  shouldn't we use TOP always ?
- Line 2472: # note we are intentionally calling upon the process() calls in the
- Line 2511: # TODO: does this comment (from mysql) apply to here, too?
- Line 2959: # test/dialect/mssql/test_compiler.py -> test_force_schema_*
- Line 2960: # test/dialect/mssql/test_compiler.py -> test_schema_many_tokens_*
- Line 3078: # note pyodbc will set this to False if fast_executemany is set,
- Line 3427: # TODO: try to avoid having to run a separate query here
- Line 3537: # NOTE: "root level" include_columns is legacy, now part of
- Line 3615: # see https://stackoverflow.com/questions/8311959/
- Line 3786: kwargs["length"] = maxlen // 2 if maxlen != -1 else None
- Line 4052: # TODO: we support match=<keyword> for foreign keys so

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\information_schema.py
- Line 177: # TODO: is CATLOG misspelled ?

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\json.py
- Line 77: # note there was a result processor here that was looking for "number",
- Line 81: # Note: these objects currently match exactly those of MySQL, however since

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\pymssql.py
- Line 14: :connectstring: mssql+pymssql://<username>:<password>@<freetds_name>/?charset=utf8
- Line 69: # TODO: monkeypatching here is less than ideal

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mssql\pyodbc.py
- Line 55: "mssql+pyodbc://scott:tiger@myhost:port/databasename?driver=ODBC+Driver+17+for+SQL+Server"
- Line 68: "mssql+pyodbc://scott:tiger@mssql2017:1433/test?"
- Line 119: <https://docs.microsoft.com/en-us/azure/developer/python/azure-sdk-authenticate?tabs=bash>`_.
- Line 141: connection_string = "mssql+pyodbc://@my-server.database.windows.net/myDb?driver=ODBC+Driver+17+for+SQL+Server"
- Line 317: "mssql+pyodbc://scott:tiger@mssql2017:1433/test?driver=ODBC+Driver+17+for+SQL+Server",
- Line 577: https://code.google.com/p/pyodbc/wiki/FAQs#How_do_I_retrieve_autogenerated/identity_values?
- Line 626: # note this parameter is no longer used by the ORM or default dialect

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\aiomysql.py
- Line 12: :connectstring: mysql+aiomysql://user:password@host:port/dbname[?key=value&key=value...]
- Line 27: "mysql+aiomysql://user:pass@hostname/dbname?charset=utf8mb4"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\asyncmy.py
- Line 12: :connectstring: mysql+asyncmy://user:password@host:port/dbname[?key=value&key=value...]
- Line 25: "mysql+asyncmy://user:pass@hostname/dbname?charset=utf8mb4"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\base.py
- Line 37: "mysql+pymysql://user:pass@some_mariadb/dbname?charset=utf8mb4"
- Line 57: "mariadb+pymysql://user:pass@some_mariadb/dbname?charset=utf8mb4"
- Line 188: # can also use mariadb_* prefix
- Line 352: "mysql+pymysql://scott:tiger@localhost/test?charset=utf8mb4"
- Line 373: "mysql+pymysql://scott:tiger@localhost/test?charset=utf8mb4"
- Line 420: "mysql+mysqldb://scott:tiger@localhost/test?charset=utf8mb4&binary_prefix=true"
- Line 425: "mysql+pymysql://scott:tiger@localhost/test?charset=utf8mb4&binary_prefix=true"
- Line 1376: # note we are intentionally calling upon the process() calls in the
- Line 1434: # that hits each backend and maybe make a requires rule for it?
- Line 1499: # TODO: this coercion should be up front.  we can't cache
- Line 1646: return self.visit_typeclause(typeclause, type_.impl, **kw)  # type: ignore[arg-type]  # noqa: E501
- Line 1764: self.process(join.onclause, from_linter=from_linter, **kwargs),  # type: ignore[arg-type]  # noqa: E501
- Line 1821: # TODO: remove ??
- Line 2170: def visit_create_index(self, create: ddl.CreateIndex, **kw: Any) -> str:  # type: ignore[override]  # noqa: E501
- Line 2397: def visit_NUMERIC(self, type_: NUMERIC, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2412: def visit_DECIMAL(self, type_: DECIMAL, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2427: def visit_DOUBLE(self, type_: DOUBLE, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2437: def visit_REAL(self, type_: REAL, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2447: def visit_FLOAT(self, type_: FLOAT, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2463: def visit_INTEGER(self, type_: INTEGER, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2473: def visit_BIGINT(self, type_: BIGINT, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2501: def visit_SMALLINT(self, type_: SMALLINT, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2517: def visit_DATETIME(self, type_: DATETIME, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2523: def visit_DATE(self, type_: DATE, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2526: def visit_TIME(self, type_: TIME, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2532: def visit_TIMESTAMP(self, type_: TIMESTAMP, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2544: def visit_TEXT(self, type_: TEXT, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2559: def visit_VARCHAR(self, type_: VARCHAR, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2567: def visit_CHAR(self, type_: CHAR, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2575: def visit_NVARCHAR(self, type_: NVARCHAR, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2589: def visit_NCHAR(self, type_: NCHAR, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2601: def visit_UUID(self, type_: UUID[Any], **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2613: def visit_enum(self, type_: ENUM, **kw: Any) -> str:  # type: ignore[override]  # NOQA: E501
- Line 2725: # MySQL doesn't support "DEFAULT VALUES" but *does* support
- Line 3061: # DESCRIBE *must* be used because there is no information schema
- Line 3075: # there are a lot of codes that *may* pop up here at some point
- Line 3221: # ref https://mariadb.com/kb/en/mariadb-1045-release-notes/
- Line 3224: # ref https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-17.html#mysqld-8-0-17-feature  # noqa
- Line 3232: # ref https://mariadb.com/kb/en/mariadb-1021-release-notes/
- Line 3407: # https://bugs.mysql.com/bug.php?id=88718
- Line 3411: # https://bugs.mysql.com/bug.php?id=96365
- Line 3433: # NOTE: using (table_schema, table_name, lower(column_name)) in (...)
- Line 3484: # SHOW CREATE TABLE converts them to *lower case*, therefore

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\cymysql.py
- Line 13: :connectstring: mysql+cymysql://<username>:<password>@<host>/<dbname>[?<options>]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\enumerated.py
- Line 118: # TODO: SET is a string as far as configuration but does not act like

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\mariadbconnector.py
- Line 24: Note that the default driver for a ``mariadb://`` connection URI continues to

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\mysqlconnector.py
- Line 149: # not until https://bugs.mysql.com/bug.php?id=117548
- Line 194: # note that "buffered" is set to False by default in MySQL/connector
- Line 199: # https://bugs.mysql.com/bug.php?id=117548 can be fixed

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\mysqldb.py
- Line 79: mysql+mysqldb://root@/<dbname>?unix_socket=/cloudsql/<projectid>:<instancename>
- Line 217: # Note: using either of the below will cause all strings to be
- Line 273: # note: the SQL here would be

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\provision.py
- Line 26: # NOTE: at the moment, tests are running mariadbconnector

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\pymysql.py
- Line 13: :connectstring: mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\pyodbc.py
- Line 42: connection_uri = "mysql+pyodbc:///?odbc_connect=%s" % params

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\reflection.py
- Line 116: # NOTE: we may want to consider SHOW INDEX as the
- Line 149: # Punt!
- Line 512: # (PRIMARY|UNIQUE|FULLTEXT|SPATIAL) INDEX `name` (USING (BTREE|HASH))?
- Line 513: # (`col` (ASC|DESC)?, `col` (ASC|DESC)?)
- Line 514: # KEY_BLOCK_SIZE size | WITH PARSER name  /*!50100 WITH PARSER name */
- Line 529: # https://forums.mysql.com/read.php?20,567102,567111#msg-567111
- Line 571: # punt!

### \server\venv\Lib\site-packages\sqlalchemy\dialects\mysql\types.py
- Line 120: # TODO: float arguments?

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\base.py
- Line 310: "oracle+oracledb://scott:tiger@localhost:1521?service_name=freepdb1",
- Line 551: "oracle+oracledb://scott:tiger@localhost:1521?service_name=freepdb1"
- Line 586: "oracle+oracledb://scott:tiger@localhost:1521/?service_name=freepdb1",
- Line 905: `CREATE VECTOR INDEX <https://www.oracle.com/pls/topic/lookup?ctx=dblatest&id=GUID-B396C369-54BB-4098-A0DD-7C54B3A0D66F>`_ - in the Oracle documentation
- Line 1059: # Note:
- Line 2261: # NOTE: materialized views are listed in all_objects twice;
- Line 2332: # see note in _all_objects_query
- Line 2409: # note that table_names() isn't loading DBLINKed or synonym'ed tables
- Line 2666: # see note in _table_options_query
- Line 2769: # NOTE: on oracle cannot create tables/views without columns and
- Line 2789: # NOTE: all_col_comments has a row for each column even if no
- Line 2946: # NOTE: default not needed since all tables have columns
- Line 3003: # NOTE: all_tab_comments / all_mview_comments have a row for all
- Line 3138: # NOTE: this adds about 20% to the query time. Using a

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\cx_oracle.py
- Line 13: :connectstring: oracle+cx_oracle://user:pass@hostname:port[/dbname][?service_name=<service>[&key=value&key=value...]]
- Line 36: "oracle+cx_oracle://scott:tiger@hostname:port?service_name=myservice&encoding=UTF-8&nencoding=UTF-8"
- Line 117: "oracle+cx_oracle://user:pass@dsn?encoding=UTF-8&nencoding=UTF-8&mode=SYSDBA&events=true"
- Line 295: "oracle+cx_oracle://scott:tiger@tnsalias?encoding=UTF-8&nencoding=UTF-8"
- Line 659: # TODO: the names used across CHAR / VARCHAR / NCHAR / NVARCHAR
- Line 793: # interesting to note about expanding parameters - since the
- Line 803: # TODO: we could likely do away with quoting altogether for
- Line 864: # note this is an OUT parameter.   Using
- Line 1180: # https://stackoverflow.com/questions/10711204/how-to-check-isoloation-level
- Line 1183: # https://asktom.oracle.com/pls/apex/f?p=100:11:0::::P11_QUESTION_ID:9532779900346079444
- Line 1481: # TODO: Others ?
- Line 1490: # TODO: others?
- Line 1516: # TODO: need to end XA state here
- Line 1531: # TODO: need to end XA state here

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\dictionary.py
- Line 26: # NOTE: all the dictionary_meta are aliases because oracle does not like
- Line 445: # TODO figure out if it's still relevant, since there is no mention from here
- Line 447: # original note:

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\oracledb.py
- Line 12: :connectstring: oracle+oracledb://user:pass@hostname:port[/dbname][?service_name=<service>[&key=value&key=value...]]
- Line 30: * calling :func:`_sa.create_engine` with ``oracle+oracledb://...`` will
- Line 36: "oracle+oracledb://scott:tiger@localhost?service_name=FREEPDB1"
- Line 39: * calling :func:`_asyncio.create_async_engine` with ``oracle+oracledb://...``
- Line 45: "oracle+oracledb://scott:tiger@localhost?service_name=FREEPDB1"
- Line 54: "oracle+oracledb_async://scott:tiger@localhost?service_name=FREEPDB1"
- Line 101: "oracle+oracledb://scott:tiger@hostname:port?service_name=myservice"
- Line 131: <https://www.oracle.com/pls/topic/lookup?ctx=dblatest&id=GUID-B0437826-43C1-49EC-A94D-B650B6A4A6EE>`_.
- Line 137: [[protocol:]//]host[:port][/[service_name]][?parameter_name=value{&parameter_name=value}]
- Line 478: "oracle+oracledb://scott:tiger@localhost:1521?service_name=freepdb1"
- Line 504: "oracle+oracledb://scott:tiger@localhost:1521?service_name=freepdb1"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\provision.py
- Line 69: # NOTE: make sure you've run "ALTER DATABASE default tablespace users" or
- Line 221: # TODO: oracledb claims to have this feature built in somehow,

### \server\venv\Lib\site-packages\sqlalchemy\dialects\oracle\types.py
- Line 245: cls, interval: sqltypes.Interval, **kw  # type: ignore[override]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\array.py
- Line 512: # interpret NULL (without quotes!) as None

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\asyncpg.py
- Line 13: :connectstring: postgresql+asyncpg://user:password@host:port/dbname[?key=value&key=value...]
- Line 55: "postgresql+asyncpg://user:password@/dbname?host=HostA:5432&host=HostB:5432&host=HostC:5432"
- Line 85: "postgresql+asyncpg://user:pass@hostname/dbname?prepared_statement_cache_size=500"
- Line 91: "postgresql+asyncpg://user:pass@hostname/dbname?prepared_statement_cache_size=0"
- Line 682: # TODO: looks like we have to hand-roll some kind of batching here.

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\base.py
- Line 1931: return self._generate_generic_binary(binary, " # ", **kw)
- Line 1979: binary, " #> " if not _cast_applied else " #>> ", **kw
- Line 2238: # TODO: this coercion should be up front.  we can't cache
- Line 3348: # note the generic dialect doesn't have AUTOCOMMIT, however
- Line 3414: # https://stackoverflow.com/questions/3523028/
- Line 3480: # FIXME: ugly hack to get out of transaction
- Line 3696: # NOTE: do not include temp materialzied views (that do not
- Line 3771: # NOTE: the query with the default and identity options scalar
- Line 3802: # attidentity != '' is required or it will reflect also
- Line 3893: # NOTE: postgresql support table with no user column, meaning
- Line 4264: # NOTE: filtering also on pg_index.indrelid for oids does
- Line 4290: # NOTE: restate the condition here, since pg15 otherwise
- Line 4305: # NOTE: cast since some postgresql derivatives may
- Line 4349: # See note in get_multi_indexes
- Line 4450: # NOTE: avoid calling pg_get_constraintdef when not needed
- Line 4507: rf"REFERENCES (?:({qtoken})\.)?({qtoken})\(((?:{qtoken}(?: *, *)?)+)\)"  # noqa: E501
- Line 4629: # NOTE: pg_index is used as from two times to improve performance,
- Line 4633: # NOTE: repeating oids clause improve query performance
- Line 4660: # NOTE: always using pg_get_indexdef is too slow so just
- Line 4669: # NOTE: need to cast this since attname is of type "name"
- Line 4737: # NOTE: pg_get_expr is very fast so this case has almost no
- Line 4912: # it *might* be nice to include that this is 'btree' in the
- Line 4924: # NOTE: this is legacy, this is part of
- Line 5063: # NOTE: avoid calling pg_get_constraintdef when not needed
- Line 5175: # NOTE: cast since some postgresql derivatives may
- Line 5241: # NOTE: cast since some postgresql derivatives may

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\hstore.py
- Line 198: # note that dialect-specific types like that of psycopg and
- Line 210: # note that dialect-specific types like that of psycopg and
- Line 296: # parsing.  note that none of this is used with the psycopg2 backend,
- Line 306: "(?P<key> (\\ . | [^"])* )"       # Quoted key
- Line 308: [ ]* => [ ]*    # Pair operator, optional adjoining whitespace
- Line 310: (?P<value_null> NULL )          # NULL value
- Line 311: | "(?P<value> (\\ . | [^"])* )"   # Quoted value

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\json.py
- Line 133: * Path index operations (the ``#>`` operator)::
- Line 137: * Path index operations returning text (the ``#>>`` operator)::

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\pg8000.py
- Line 13: :connectstring: postgresql+pg8000://user:password@host:port/dbname[?key=value&key=value...]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\psycopg.py
- Line 13: :connectstring: postgresql+psycopg://user:password@host:port/dbname[?key=value&key=value...]
- Line 28: * calling :func:`_sa.create_engine` with ``postgresql+psycopg://...`` will

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\psycopg2.py
- Line 13: :connectstring: postgresql+psycopg2://user:password@host:port/dbname[?key=value&key=value...]
- Line 88: "postgresql+psycopg2://scott:tiger@192.168.0.199:5432/test?sslmode=require"
- Line 106: "postgresql+psycopg2://user:password@/dbname?host=/var/lib/postgresql"
- Line 114: "postgresql+psycopg2://user:password@myhost1/dbname?host=myhost2"
- Line 144: "postgresql+psycopg2://user:password@/dbname?host=HostA:PortA&host=HostB&host=HostC:PortC"
- Line 153: "postgresql+psycopg2://user:password@/dbname?host=HostA,HostB,HostC&port=PortA,,PortC"
- Line 167: "postgresql+psycopg2://user:password@/dbname?host=HostA:PortA&host=HostB&host=HostC:PortC&target_session_attrs=primary"
- Line 347: "postgresql+psycopg2://user:pass@host/dbname?client_encoding=utf8"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\psycopg2cffi.py
- Line 13: :connectstring: postgresql+psycopg2cffi://user:password@host:port/dbname[?key=value&key=value...]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\postgresql\types.py
- Line 240: cls, interval: sqltypes.Interval, **kw: Any  # type: ignore[override]

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\aiosqlite.py
- Line 121: # TODO: base on connectors/asyncio.py
- Line 226: # TODO: base on connectors/asyncio.py

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\base.py
- Line 326: * `Isolation in SQLite <https://www.sqlite.org/isolation.html>`_ - on the SQLite website
- Line 327: * `Transaction control <https://docs.python.org/3/library/sqlite3.html#transaction-control>`_ - describes the sqlite3 autocommit attribute as well
- Line 329: * `sqlite3 SELECT does not BEGIN a transaction, but should according to spec <https://github.com/python/cpython/issues/54133>`_ - imported Python standard library issue on github
- Line 330: * `sqlite3 module breaks transactions and potentially corrupts data <https://github.com/python/cpython/issues/54949>`_ - imported Python standard library issue on github
- Line 1912: # note this name provides NUMERIC affinity, not TEXT.
- Line 2049: # TODO: detect SQLite version 3.10.0 or greater;
- Line 2066: # SQlite supports "DEFAULT VALUES" but *does not* support
- Line 2073: # note this parameter is no longer used by the ORM or default dialect
- Line 2165: # driver ?)
- Line 2178: # NOTE: python 3.7 on fedora for me has SQLite 3.34.1.  These
- Line 2565: # sqlite makes this *extremely difficult*.
- Line 2590: # note we use this list only if this is the first column
- Line 2643: # note that we already have the FKs from PRAGMA above.  This whole
- Line 2651: r'REFERENCES +(?:(?:"(.+?)")|([a-z0-9_]+)) *\( *((?:(?:"[^"]+"|[a-z0-9_]+) *(?:, *)?)+)\) *'  # noqa: E501
- Line 2792: # NOTE: auto_index_by_sig might not be empty here,
- Line 2816: # NOTE: there is not currently a way to parse CHECK constraints that
- Line 2822: (?<![A-Za-z0-9_])   # Negative lookbehind: ensure CHECK is not
- Line 2826: (?:                 # Optional CONSTRAINT clause
- Line 2829: "(?:[^"]|"")+"        # Double-quoted: "name" or "na""me"
- Line 2830: |'(?:[^']|'')+'  # Single-quoted: 'name' or 'na''me'
- Line 2831: |\[(?:[^\]]|\]\])+\]  # Bracket-quoted: [name] or [na]]me]
- Line 2832: |`(?:[^`]|``)+`       # Backtick-quoted: `name` or `na``me`
- Line 2838: CHECK\s*\(          # CHECK keyword followed by opening paren
- Line 3038: # https://www.sqlite.org/cvstrac/tktview?tn=1884

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\json.py
- Line 44: # Note: these objects currently match exactly those of MySQL, however since

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\provision.py
- Line 28: # TODO: I can't get this to build dynamically with pytest-xdist procs
- Line 116: # NOTE!  this has to be done *per connection*.  New sqlite connection,

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\pysqlcipher.py
- Line 14: :connectstring: sqlite+pysqlcipher://:passphrase@/file_path[?kdf_iter=<iter>]
- Line 27: * Otherwise for Python 3, choose https://pypi.org/project/sqlcipher3/
- Line 28: * If not available, fall back to https://pypi.org/project/pysqlcipher3/
- Line 29: * For Python 2, https://pypi.org/project/pysqlcipher/ is used.
- Line 72: "sqlite+pysqlcipher://:testing@/foo.db?cipher=aes-256-cfb&kdf_iter=64000"

### \server\venv\Lib\site-packages\sqlalchemy\dialects\sqlite\pysqlite.py
- Line 59: # in-memory database (note three slashes)
- Line 77: e = create_engine("sqlite:///file:path/to/database?mode=ro&uri=true")
- Line 94: "sqlite:///file:path/to/database?"
- Line 548: # NOTE: floor is optionally present in sqlite 3.35+ , however
- Line 597: # two names conflict?  again, this seems to be not the case right

### \server\venv\Lib\site-packages\sqlalchemy\engine\base.py
- Line 1452: # note for event handlers, the "distilled parameters" which is always
- Line 2146: # TODO: this will be fixed by #13018
- Line 2657: # test_transaction.py -> test_no_rollback_in_deactive(?:_savepoint)?
- Line 3335: # note: this will propagate events that are assigned to the parent

### \server\venv\Lib\site-packages\sqlalchemy\engine\create.py
- Line 143: ``dialect[+driver]://user:password@host/dbname[?key=value..]``, where
- Line 557: return create_mock_engine(url, **kwargs)  # type: ignore
- Line 769: # note that "invalidated" and "closed" are mutually

### \server\venv\Lib\site-packages\sqlalchemy\engine\cursor.py
- Line 277: # TODO: need unit test for:
- Line 424: # can occur when '*' was used as one of the compiled columns,
- Line 621: # against a "select *", so not safe to cache
- Line 631: # can change for "select *"
- Line 865: # TODO: can consider pre-loading ints and negative ints
- Line 913: # TODO: consider serializing this as SimpleResultMetaData
- Line 1985: # TODO: if these are Row objects, can we save on not having to
- Line 1986: # re-make new Row objects out of them a second time?  is that
- Line 1987: # what's actually happening right now?  maybe look into this

### \server\venv\Lib\site-packages\sqlalchemy\engine\default.py
- Line 197: # *not* the FLOAT type however.
- Line 272: # TODO: this is not to be part of 2.0.  implement rudimentary binary
- Line 630: return self.loaded_dbapi.connect(*cargs, **cparams)  # type: ignore[no-any-return]  # NOQA: E501
- Line 1240: # NOTE: pyhive is using this hook, can't remove it :(
- Line 1511: # note that currently, "expanded" parameters will be present
- Line 2003: # *usually*, this will be true.  However, some dialects
- Line 2104: # all of the rest of this... cython?

### \server\venv\Lib\site-packages\sqlalchemy\engine\events.py
- Line 566: # TODO: deprecate "context"
- Line 578: # TODO: deprecate "context"

### \server\venv\Lib\site-packages\sqlalchemy\engine\interfaces.py
- Line 777: # NOTE: this does not take into effect engine-level isolation level.
- Line 2795: "mysql+pymysql://scott:tiger@localhost/test?"
- Line 2804: "mysql+pymysql://scott:tiger@localhost/test?"
- Line 2850: "mysql+pymysql://scott:tiger@localhost/test?"

### \server\venv\Lib\site-packages\sqlalchemy\engine\processors.py
- Line 56: # Note that the scale argument is not taken into account for integer

### \server\venv\Lib\site-packages\sqlalchemy\engine\reflection.py
- Line 1572: # NOTE: support tables/views with no columns

### \server\venv\Lib\site-packages\sqlalchemy\engine\result.py
- Line 248: # note this also includes special key fallback behaviors
- Line 315: # TODO: are we freezing the result with or without uniqueness
- Line 316: # applied?
- Line 2339: # TODO: this throws away the iterator which may be holding

### \server\venv\Lib\site-packages\sqlalchemy\engine\url.py
- Line 126: ...     "postgresql+psycopg2://user:pass@host/dbname?alt_host=host1&alt_host=host2&ssl_cipher=%2Fpath%2Fto%2Fcrt"
- Line 380: 'postgresql+psycopg2://user:pass@host/dbname?alt_host=host1&alt_host=host2&ssl_cipher=%2Fpath%2Fto%2Fcrt'
- Line 422: 'postgresql+psycopg2://user:pass@host/dbname?alt_host=host1&alt_host=host2&ssl_cipher=%2Fpath%2Fto%2Fcrt'
- Line 506: 'postgresql+psycopg2://user:pass@host/dbname?alt_host=host1&alt_host=host2&ssl_cipher=%2Fpath%2Fto%2Fcrt'
- Line 599: ...     "postgresql+psycopg2://user:pass@host/dbname?alt_host=host1&alt_host=host2&ssl_cipher=%2Fpath%2Fto%2Fcrt"
- Line 680: # note this is an immutabledict of str-> str / tuple of str,
- Line 870: (?P<name>[\w\+]+)://
- Line 919: return URL.create(name, **components)  # type: ignore

### \server\venv\Lib\site-packages\sqlalchemy\ext\associationproxy.py
- Line 527: return inst  # type: ignore  # TODO
- Line 1278: # note the has() here will fail for collections; eq_()
- Line 1289: # note the has() here will fail for collections; eq_()
- Line 1614: # unlike a regular list *=, proxied __imul__ will generate unique
- Line 1615: # backing objects for each copy.  *= on proxied lists is a bit of
- Line 1627: # TODO: no idea how to do this without separate "stub"
- Line 1720: # TODO: again, no idea how to create an actual MutableMapping.

### \server\venv\Lib\site-packages\sqlalchemy\ext\automap.py
- Line 1265: cls.metadata.reflect(autoload_with, **opts)  # type: ignore[arg-type]  # noqa: E501

### \server\venv\Lib\site-packages\sqlalchemy\ext\baked.py
- Line 239: # note also we want to cache the statement itself because this
- Line 529: # TODO: can mapper._get_clause be pre-adapted?

### \server\venv\Lib\site-packages\sqlalchemy\ext\compiler.py
- Line 534: # TODO: why is the lambda needed ?
- Line 569: # TODO: yes, this could also switch off of DBAPI in use.

### \server\venv\Lib\site-packages\sqlalchemy\ext\horizontal_shard.py
- Line 455: # TODO: if we had an ORMOption that gets applied at ORM statement

### \server\venv\Lib\site-packages\sqlalchemy\ext\hybrid.py
- Line 1535: return op(other, self.expression, **kwargs)  # type: ignore

### \server\venv\Lib\site-packages\sqlalchemy\ext\mutable.py
- Line 833: def setdefault(self, *arg):  # noqa: F811
- Line 861: def pop(self, *arg):  # noqa: F811

### \server\venv\Lib\site-packages\sqlalchemy\ext\asyncio\base.py
- Line 147: self.gen = func(*args, **kwds)  # type: ignore
- Line 183: # Suppress StopIteration *unless* it's the same exception that
- Line 205: # only re-raise if it's *not* the exception that was

### \server\venv\Lib\site-packages\sqlalchemy\ext\asyncio\engine.py
- Line 112: # note that to send adapted arguments like
- Line 259: cls, target: Connection, **additional_kw: Any  # noqa: U100
- Line 901: # code within this block is **programmatically,
- Line 902: # statically generated** by tools/generate_proxy_methods.py
- Line 1047: cls, target: Engine, **additional_kw: Any  # noqa: U100
- Line 1154: # code within this block is **programmatically,
- Line 1155: # statically generated** by tools/generate_proxy_methods.py
- Line 1351: cls, target: Transaction, **additional_kw: Any  # noqa: U100

### \server\venv\Lib\site-packages\sqlalchemy\ext\asyncio\scoping.py
- Line 220: # code within this block is **programmatically,
- Line 221: # statically generated** by tools/generate_proxy_methods.py

### \server\venv\Lib\site-packages\sqlalchemy\ext\asyncio\session.py
- Line 1078: # code within this block is **programmatically,
- Line 1079: # statically generated** by tools/generate_proxy_methods.py
- Line 1862: **additional_kw: Any,  # noqa: U100

### \server\venv\Lib\site-packages\sqlalchemy\ext\mypy\decl_class.py
- Line 74: # mypy can call us more than once.  it then *may* have reset the
- Line 88: # empty (!) but the names are in the symbol table.  so use that.
- Line 135: # TODO: this is nearly the same logic as that of
- Line 412: # Mapped?[Optional?[A?]]
- Line 429: # TODO: do we need to convert from unbound for this case?

### \server\venv\Lib\site-packages\sqlalchemy\ext\mypy\infer.py
- Line 181: # TODO: handle mypy.types.Overloaded
- Line 301: # TODO: look at generic ref and either use that,
- Line 571: # TODO: support other pep-435 types here

### \server\venv\Lib\site-packages\sqlalchemy\ext\mypy\plugin.py
- Line 281: # how do I....tell it it has no attribute of a certain name?

### \server\venv\Lib\site-packages\sqlalchemy\ext\mypy\util.py
- Line 290: # TODO: figure out a more robust way to check this.  The node is some
- Line 294: # convert from "Optional?" to the more familiar

### \server\venv\Lib\site-packages\sqlalchemy\orm\attributes.py
- Line 453: return op(self.comparator, *other, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 458: return op(other, self.comparator, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 523: # hack to make __doc__ writeable on instances of
- Line 598: # TODO: can move this to descriptor_props if the need for this
- Line 1104: # TODO: no test coverage here.
- Line 1714: # NOTE: passive is ignored here at the moment
- Line 1913: # TODO: better solution here would be to add
- Line 2305: # TODO: need coverage in test/orm/ of remove event
- Line 2621: # TODO: this appears to be the WriteOnlyAttributeImpl /

### \server\venv\Lib\site-packages\sqlalchemy\orm\bulk_persistence.py
- Line 137: # can be delivered back to the caller (see #11661). This is **not**
- Line 143: # So in this conditional, we have **only** called
- Line 321: # notes for the insert case
- Line 807: # horizontal sharding, this step happens *within* the horizontal
- Line 896: # TODO: dive more into how a local table PK is used for fetch
- Line 1108: # answer?, why does this go through the whole execute phase using an
- Line 1109: # event?  Answer: because we are integrating with extensions such
- Line 1475: # note if the statement has _multi_values, these
- Line 1525: # NOTE: we might want to RETURNING the actual columns to be
- Line 2122: # TODO: inline this and call remove_newly_deleted

### \server\venv\Lib\site-packages\sqlalchemy\orm\collections.py
- Line 489: # this is actually a weakref; see note in constructor
- Line 770: # see note in constructor regarding this type: ignore
- Line 838: # Convert a builtin to 'Instrumented*'
- Line 849: # Did factory callable return a builtin?
- Line 905: # note role declarations
- Line 1214: # note: not breaking this into atomic dels
- Line 1262: # decorator is still possible, so events on *= can be had if they're

### \server\venv\Lib\site-packages\sqlalchemy\orm\context.py
- Line 195: # *cached* statement that's travelling with compile_state, not the
- Line 196: # *current* statement which won't match up for an ad-hoc
- Line 399: # set *only* when we are coming from the Query.statement
- Line 431: # TODO: this structure is set up by JoinedLoader
- Line 1294: # TODO: some complexity with order_by here was due to mapper.order_by.
- Line 1398: # TODO: this goes away once we get rid of the deep entity
- Line 1634: *([inner] + self.secondary_columns)  # use_labels=self.labels
- Line 1811: # this was *hopefully* the only adapter we were going to need
- Line 1822: # tagged as 'ORM' constructs ?
- Line 2195: # TODO: should we be checking for multiple mapper entities
- Line 2196: # matching?
- Line 2272: # TODO: we had orm_only=False here before, removing
- Line 2942: # TODO: we might be able to implement this but for now
- Line 3259: # TODO: polymorphic subclasses ?

### \server\venv\Lib\site-packages\sqlalchemy\orm\decl_api.py
- Line 275: # note this method should not be called outside of the declarative
- Line 1274: # a MyInt(int) subclass.  note also we pass NewType()
- Line 1290: # NOTE: assume there aren't type alias types of new types.
- Line 1770: return self.generate_base(**kw)  # type: ignore

### \server\venv\Lib\site-packages\sqlalchemy\orm\decl_base.py
- Line 935: # superclass.   note if the dataclasses.field()
- Line 953: # or similar.  note there is no known case that
- Line 1229: **{  # type: ignore[call-overload,unused-ignore]
- Line 1527: # TODO: should "registry" here be also?   might be too late
- Line 1943: # note the superclass is expected to have a Mapper assigned and
- Line 1974: # note here we place the subclass column

### \server\venv\Lib\site-packages\sqlalchemy\orm\dependency.py
- Line 251: # TODO: add a high speed method
- Line 393: # TODO: this whole block is not covered
- Line 1037: # TODO: no tests fail if this whole
- Line 1038: # thing is removed !!!!

### \server\venv\Lib\site-packages\sqlalchemy\orm\descriptor_props.py
- Line 566: # note this corresponds to sqlalchemy.ext.mutable load_attrs()
- Line 646: # TODO: need a deserialize hook here
- Line 988: # TODO: when initialized, check _proxied_object,

### \server\venv\Lib\site-packages\sqlalchemy\orm\dynamic.py
- Line 205: # note we're returning an entirely new Query class instance

### \server\venv\Lib\site-packages\sqlalchemy\orm\evaluator.py
- Line 108: # and sometimes apparently not present in the first place (?).
- Line 122: # note this used to fall back to a simple `getattr(obj, key)` evaluator

### \server\venv\Lib\site-packages\sqlalchemy\orm\events.py
- Line 1080: # TODO: need coverage for this event
- Line 2520: # TODO: coverage

### \server\venv\Lib\site-packages\sqlalchemy\orm\instrumentation.py
- Line 716: # TODO: we should use the ClassManager's notion of the
- Line 726: # FIXME: need to juggle local names to avoid constructor argument

### \server\venv\Lib\site-packages\sqlalchemy\orm\interfaces.py
- Line 56: from .base import NotExtension as NotExtension  # noqa: F401
- Line 142: # TODO: add python_type and sql_type here; combining them
- Line 285: # why is typing not erroring on this?
- Line 372: # NOTE: MapperProperty needs to extend _MappedAttribute so that declarative
- Line 935: return self.operate(operators.and_, *criteria)  # type: ignore
- Line 1033: # search among: exact match, "attr.*", "default" strategy
- Line 1044: # note that if strategy_options.Load is placing non-actionable

### \server\venv\Lib\site-packages\sqlalchemy\orm\loading.py
- Line 259: # this is a bit of a hack at the moment.
- Line 385: # TODO: need test coverage and documentation for the FrozenResult
- Line 470: # TODO: no coverage here
- Line 654: # constantly working to *remove* SELECTs we don't need.   We
- Line 657: # even less commonly used 3. the SELECT in question is very low
- Line 827: # note that this method, most of which exists in a closure
- Line 896: # note that in this path, we are no longer
- Line 914: # note there is still an issue where this codepath
- Line 1262: # TODO: polymorphic_from seems to be a Mapper in all cases.
- Line 1281: # TODO: we are currently ignoring the case where the
- Line 1373: # TODO:  allow "existing" populator to know this is
- Line 1382: # TODO: same path

### \server\venv\Lib\site-packages\sqlalchemy\orm\mapped_collection.py
- Line 383: # note that the adapter sets itself up onto this collection

### \server\venv\Lib\site-packages\sqlalchemy\orm\mapper.py
- Line 776: # note this is a new flow as of 2.0 so that
- Line 1988: # TODO: what happens if polymorphic_on column attribute name
- Line 1989: # does not match .key?
- Line 2678: # polymorphic selectable, *or* if the base mapper has either of those,
- Line 2679: # we turn on the adaption thing.  if not, we do *no* adaption.
- Line 2690: # note we have some tests in test_polymorphic_rel that query against
- Line 3870: # to loader strategy.   note this must be in terms
- Line 3878: # superclass that we *don't* want to load, applied after
- Line 3882: # to loader strategy.   note this must be in terms
- Line 4223: # note that _mapper_registry is unordered, which
- Line 4430: # TODO: weakref would be a good idea here

### \server\venv\Lib\site-packages\sqlalchemy\orm\path_registry.py
- Line 69: # NOTE: these names are weird since the array is 0-indexed,
- Line 220: # TODO: what are we using this for?
- Line 272: # note: we likely dont want configure=True here however
- Line 452: # NOTE: this method is no longer used.  consider removal
- Line 573: #  wp = with_polymorphic(RegularEntity, "*")
- Line 579: #  wp = with_polymorphic(SomeFoo, "*")

### \server\venv\Lib\site-packages\sqlalchemy\orm\persistence.py
- Line 460: # TODO: ordered values, etc
- Line 515: # HACK: check for history in other tables, in case the
- Line 889: # TODO: why with bookkeeping=False?
- Line 1489: # TODO: why does this "only warn" if versioning is turned off,
- Line 1490: # whereas the UPDATE raises?
- Line 1673: # note that columns can be in the "return defaults" that are
- Line 1726: # TODO: this still goes a little too often.  would be nice to

### \server\venv\Lib\site-packages\sqlalchemy\orm\properties.py
- Line 479: return op(self.__clause_element__(), *other, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 485: return op(col._bind_param(op, other), col, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 653: return op(self.__clause_element__(), *other, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 659: return op(col._bind_param(op, other), col, **kwargs)  # type: ignore[no-any-return]  # noqa: E501

### \server\venv\Lib\site-packages\sqlalchemy\orm\query.py
- Line 559: # TODO: this event needs to be deprecated, as it currently applies
- Line 1291: # TODO: deprecate, property has to be supplied
- Line 1334: # TODO: deprecate
- Line 1478: # code within this block is **programmatically,
- Line 1479: # statically generated** by tools/generate_tuple_map_overloads.py
- Line 1572: # given *only* User.id==5, Address.email, and 'q', what
- Line 1573: # would the *next* User in the result be ?
- Line 2833: # TODO: not sure why we can't use result.scalar() here
- Line 2987: # TODO: isn't this supposed to be a list?
- Line 3202: delete_ = sql.delete(*self._raw_columns)  # type: ignore
- Line 3291: upd = sql.update(*self._raw_columns)  # type: ignore
- Line 3295: upd = upd.ordered_values(*values)  # type: ignore

### \server\venv\Lib\site-packages\sqlalchemy\orm\relationships.py
- Line 485: self._overlaps = set(re.split(r"\s*,\s*", overlaps))  # type: ignore  # noqa: E501
- Line 828: # annotate the *local* side of the join condition, in the case
- Line 841: # limit this adapter to annotated only?
- Line 1276: # * the object hasn't been flushed yet and there's no value for
- Line 1279: # * the object hasn't been flushed yet but it has a user-defined
- Line 1282: # * the object has a value but it's expired and not locally present
- Line 1284: # * the object has a value but it's expired and not locally present,
- Line 1287: # * The object hadn't been flushed yet, there was no value, but
- Line 1288: #   later, the object has been expired and detached, and *now*
- Line 1291: # * the object had a value, but it was changed to a new value, and
- Line 1294: # * the object had a value, but it was changed to a new value, and
- Line 1297: # * the object has a user-set value, but it's None and we don't do
- Line 2527: # TODO: coverage
- Line 3159: # note: the "__*" symbol is used internally by

### \server\venv\Lib\site-packages\sqlalchemy\orm\scoping.py
- Line 313: # code within this block is **programmatically,
- Line 314: # statically generated** by tools/generate_proxy_methods.py
- Line 1565: # code within this block is **programmatically,
- Line 1566: # statically generated** by tools/generate_tuple_map_overloads.py

### \server\venv\Lib\site-packages\sqlalchemy\orm\session.py
- Line 1196: # TODO: shouldn't we only be here if not
- Line 1197: # conn.in_transaction() ?
- Line 1424: # TODO: these two None sets were historically after the
- Line 1427: # Why do we need to get rid of them at all?  test_memusage::CycleTest
- Line 2846: # code within this block is **programmatically,
- Line 2847: # statically generated** by tools/generate_tuple_map_overloads.py
- Line 3042: # note we are reraising StatementError as opposed to
- Line 3838: # TODO: this was being tested before, but this is not possible

### \server\venv\Lib\site-packages\sqlalchemy\orm\state.py
- Line 531: # object was GC'ed and we're done!  woop
- Line 563: # is strong referencing!

### \server\venv\Lib\site-packages\sqlalchemy\orm\strategies.py
- Line 243: # TODO: check all columns ?  check for foreign key as well?
- Line 743: # TODO: the "not self.uselist" can be taken out entirely; a m2o
- Line 1092: # reverse props that are MANYTOONE are loading *this*
- Line 1539: # LEGACY: make a Query back from the select() !!
- Line 1636: # note we have an assumption here that
- Line 1737: # note that because the subqueryload object
- Line 1743: # brought this into question.
- Line 2693: # is this the entity we want to splice onto in the first place?
- Line 2856: # note this must unconditionally clear out any existing collection.
- Line 3182: # note the above conditional may have changed query_info
- Line 3278: # note this will create a different cache key than
- Line 3393: # note it's OK if this is a uselist=True attribute, the empty
- Line 3440: # note that empty tuple set on uselist=False sets the

### \server\venv\Lib\site-packages\sqlalchemy\orm\strategy_options.py
- Line 661: # undefer all columns specific to a single class using Load + *
- Line 951: and c_token != p_token.key  # type: ignore
- Line 1435: # TODO: no cases in test suite where we actually get
- Line 1948: # note the essential logic of this attribute was very different in
- Line 1998: # NOTE: while it seems like we should not do the "apply" operation
- Line 2009: #    return and_(*self._extra_criteria)
- Line 2142: load_only(User.name, User.email)  # will create a defer('*')
- Line 2355: # TODO: need to figure out this None thing being returned by
- Line 2426: # TODO: attrs against different classes.  we likely have to

### \server\venv\Lib\site-packages\sqlalchemy\orm\unitofwork.py
- Line 134: # possible to reach here with attributes.NEVER_SET ?
- Line 281: # TODO: store the history as (state, object) tuples

### \server\venv\Lib\site-packages\sqlalchemy\orm\util.py
- Line 1684: # the Bundle *must* use the orm plugin no matter what.  the
- Line 1854: # note this is an inner join from secondary->right
- Line 1868: # for almost two years, not reported/fixed until 1.4.43 (!)
- Line 2242: # note: if one of the codepaths above didn't define real_symbol and
- Line 2318: # destringify the "outside" of the annotation.  note we are not
- Line 2319: # adding include_generic so it will *not* dig into generic contents,

### \server\venv\Lib\site-packages\sqlalchemy\orm\writeonly.py
- Line 294: # this is a hack to allow the entities.ComparableEntity fixture
- Line 511: # this is a hack right now.  The Query only knows how to
- Line 518: # note also, we are using the official ORM-annotated selectable

### \server\venv\Lib\site-packages\sqlalchemy\pool\base.py
- Line 821: # NOTE: the various comparisons here are assuming that measurable time
- Line 1284: # there are three attempts made here, but note that if the database
- Line 1496: # TODO: should this be _return_conn?

### \server\venv\Lib\site-packages\sqlalchemy\sql\annotation.py
- Line 428: # annotated objects hack the __hash__() method so if we want to

### \server\venv\Lib\site-packages\sqlalchemy\sql\base.py
- Line 333: # TODO: cython candidate
- Line 776: # note __dict__ needs to be in __slots__ if this is used
- Line 862: # TODO: very inefficient.  This is used only in test suites
- Line 870: # TODO: fairly inefficient, used only in debugging right now.
- Line 1877: # TODO: cython candidate

### \server\venv\Lib\site-packages\sqlalchemy\sql\cache_key.py
- Line 176: # TODO: wouldn't we instead get this from our superclass?
- Line 276: # TODO: see if C code can help here as Python lacks an

### \server\venv\Lib\site-packages\sqlalchemy\sql\coercions.py
- Line 326: # note callable() will not invoke a __getattr__() method, whereas
- Line 758: # TODO: there's no test coverage now for the
- Line 847: def _literal_coercion(self, element, *, expr, operator, **kw):  # type: ignore[override] # noqa: E501
- Line 911: # this is a hack right now as we want to use coercion on an
- Line 1170: # ObjectNotExecutableError
- Line 1244: # note that this codepath no longer occurs as of
- Line 1256: # TODO: doing _implicit_subquery here causes tests to fail,
- Line 1257: # how was this working before?  probably that ORM

### \server\venv\Lib\site-packages\sqlalchemy\sql\compiler.py
- Line 730: # FROMS left over?  boom
- Line 739: # FROMS left over?  boom
- Line 2067: # notes:
- Line 2068: # *unescaped* parameter names in:
- Line 2071: # *escaped* parameter names in:
- Line 2110: # note we are also inserting *escaped* parameter names
- Line 2391: # fact.  note that we don't try to
- Line 2616: # note we are not currently accommodating for
- Line 3133: # TODO: would need a fast cast again here,
- Line 3233: # empty IN expression.  note we don't need to use
- Line 3410: # don't allow "? = ?" to render
- Line 3766: # TODO: this condition is not well understood.
- Line 3958: # TODO: accumulate_bind_names is passed by crud.py to gather
- Line 4166: # TODO: can we get at the .columns_plus_names collection
- Line 4167: # that is already (or will be?) generated for the SELECT
- Line 4168: # rather than calling twice?
- Line 4170: # TODO: proxy_name is not technically safe,
- Line 4271: # lateral!  to the level above us.
- Line 4344: # note we cancel the "subquery" flag here as well
- Line 4447: # note objects must be non-empty for cursor.py to handle the
- Line 4571: # this is a hack to allow legacy result column lookups
- Line 4573: # TODO: this only seems to be tested indirectly
- Line 4600: # unary expression.  notes added as of #12681
- Line 4617: # versions of SQLAlchemy - **whether or not the AS <label>
- Line 4618: # is present in the statement is not actually important**.
- Line 4619: # We target result columns **positionally** for a fully
- Line 4847: text = "SELECT "  # we're off to a good start !
- Line 5392: # TODO: likely need asfrom=True here?
- Line 5480: # TODO: do we want non-primary key explicit sentinel cols
- Line 5481: # that can gracefully degrade for some backends?
- Line 5530: # just yield out that many single statements!  still
- Line 5533: # note we still are taking advantage of the fact that we know
- Line 6499: # anticipate 3rd party dialects that don't include **kw
- Line 6500: # TODO: remove in 2.1
- Line 7624: # TODO: no coverage here

### \server\venv\Lib\site-packages\sqlalchemy\sql\crud.py
- Line 131: # note: the _get_crud_params() system was written with the notion in mind
- Line 699: # TODO - see TODO(return_defaults_columns) below
- Line 727: # TODO - see TODO(return_defaults_columns) below
- Line 822: # TODO(return_defaults_columns): there can still be more columns in
- Line 1382: # by append_param_insert_(?:hasdefault|pk_returning|pk_no_returning)
- Line 1451: **kw,  # TODO: no test coverage for literal binds here
- Line 1564: # note one of the main use cases for this is array slice
- Line 1584: # TODO: not sure if accumulated_bind_names applies here
- Line 1703: # TODO: this is weird.  See #9685 where we have to
- Line 1705: # would this ever be *all* columns?  but if we set to blank, then

### \server\venv\Lib\site-packages\sqlalchemy\sql\default_comparator.py
- Line 65: # allow x ==/!= True/False to be treated as a literal.
- Line 66: # this comes out to "== / != true/false" or "1/0" if those

### \server\venv\Lib\site-packages\sqlalchemy\sql\dml.py
- Line 664: # note _return_defaults_columns = () means return all columns,
- Line 1327: # START OVERLOADED FUNCTIONS self.returning ReturningInsert 1-8 ", *, sort_by_parameter_order: bool = False"  # noqa: E501
- Line 1329: # code within this block is **programmatically,
- Line 1330: # statically generated** by tools/generate_tuple_map_overloads.py
- Line 1622: # code within this block is **programmatically,
- Line 1623: # statically generated** by tools/generate_tuple_map_overloads.py
- Line 1754: # code within this block is **programmatically,
- Line 1755: # statically generated** by tools/generate_tuple_map_overloads.py

### \server\venv\Lib\site-packages\sqlalchemy\sql\elements.py
- Line 490: # note this creates a cycle, asserted in test_memusage. however,
- Line 756: # TODO: this code is uncovered and in all likelihood is not included
- Line 1535: return op(self.comparator, *other, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 1540: return op(other, self.comparator, **kwargs)  # type: ignore[no-any-return]  # noqa: E501
- Line 2101: # TODO: set up protocol for bind parameter callable
- Line 2611: # TODO: this seems wrong, it seems like we might not
- Line 4005: return self.operator(*self._orig)  # type: ignore
- Line 4499: self.filter.non_generative(self, *criterion)  # type: ignore
- Line 4756: # TODO: this is only covered in test_text.py, but nothing
- Line 4767: # TODO: no coverage for this block, again would be in
- Line 4883: # there was a note here to remove this assertion, which was here
- Line 5091: # existing column.   note that this implies that any Column
- Line 5092: # must **not** set up its _label before its parent table has
- Line 5134: # note this does not accommodate for quoted_name differences

### \server\venv\Lib\site-packages\sqlalchemy\sql\functions.py
- Line 424: # TODO: this might not be fully accurate
- Line 1002: # code within this block is **programmatically,
- Line 1003: # statically generated** by tools/generate_sql_functions.py
- Line 1715: super().__init__(*args, **kwargs)  # type: ignore
- Line 1786: # slight hack to limit to just one positional argument

### \server\venv\Lib\site-packages\sqlalchemy\sql\lambdas.py
- Line 379: # TODO: this needs A LOT of tests
- Line 473: # if expected_binds != got_binds:
- Line 480: # TODO: TEST TEST TEST, this is very out there
- Line 491: deferred_copy_internals=deferred_copy_internals,  # **kw
- Line 495: # TODO: A LOT A LOT of tests.   for _resolve_with_args, we don't know
- Line 741: # TODO: validate kw haven't changed?
- Line 773: # a list of callables generated from _bound_parameter_getter_*
- Line 778: # a list of callables generated from _cache_key_getter_* functions
- Line 858: # parameter.   then if they *didn't* make a param, oh they're another
- Line 898: # TODO: should we coerce consts None/True/False here?
- Line 1322: # TODO: coverage where an ORM option or similar is here
- Line 1412: # TODO: coverage

### \server\venv\Lib\site-packages\sqlalchemy\sql\naming.py
- Line 70: # note this method was missing before
- Line 92: # note that before [ticket:3989], this method was returning

### \server\venv\Lib\site-packages\sqlalchemy\sql\operators.py
- Line 487: return left.operate(self, right, *other, **kwargs)  # type: ignore
- Line 489: return self.python_impl(left, right, *other, **kwargs)  # type: ignore  # noqa: E501

### \server\venv\Lib\site-packages\sqlalchemy\sql\roles.py
- Line 132: # note there's a special case right now where you can pass a whole
- Line 167: # note when using generics for ExpressionElementRole,
- Line 283: # TODO: are we using this?

### \server\venv\Lib\site-packages\sqlalchemy\sql\schema.py
- Line 479: table.__init__(name, metadata, *args, _no_init=False, **kw)  # type: ignore[misc] # noqa: E501
- Line 2085: # note this use case is legacy now that ORM declarative has a
- Line 2099: # these default to None because .index and .unique is *not*
- Line 2490: # TODO: likely should be copied in all cases
- Line 2491: # TODO: if a Sequence, we would need to transfer the Sequence
- Line 2500: # TODO: DefaultGenerator is not copied here!  it's just used again
- Line 2915: # is attached to a Table, *or* ForeignKeyConstraint
- Line 3087: # will never appear *within* any component of the FK.
- Line 3272: # TODO: no test coverage for self not in memos
- Line 3296: # set up remote ".column" attribute, or a note to pick it
- Line 4568: # note that target_table is None for the copy process of
- Line 5043: # note any existing PK cols on the table also have their
- Line 5277: # TODO: consider "table" argument being public, but for

### \server\venv\Lib\site-packages\sqlalchemy\sql\selectable.py
- Line 1309: # note: taken from If91f61527236fd4d7ae3cad1f24c38be921c90ba
- Line 1362: itertools.chain(*[col.foreign_keys for col in _columns])  # type: ignore  # noqa: E501
- Line 2009: # note: don't use the @_generative system here, keep a reference
- Line 4496: # TODO: this is hacky and slow
- Line 4650: # this is a slightly hacky thing - the union exports a
- Line 4651: # column that resembles just that of the *first* selectable.
- Line 5219: # note this does not include elements
- Line 5702: # note the order of parsing from vs. target is important here, as we
- Line 6038: # START OVERLOADED FUNCTIONS self.with_only_columns Select 1-8 ", *, maintain_column_froms: bool =..." # noqa: E501
- Line 6040: # code within this block is **programmatically,
- Line 6041: # statically generated** by tools/generate_tuple_map_overloads.py
- Line 6929: # TODO: this seems like we should be using coercions for this
- Line 7244: # for notes

### \server\venv\Lib\site-packages\sqlalchemy\sql\sqltypes.py
- Line 895: # TODO: this is useless for real world scenarios; implement
- Line 1631: self._generic_type_affinity(_enums=enum_args, **kw),  # type: ignore  # noqa: E501
- Line 2454: # will *always* insert SQL NULL
- Line 2457: # will *always* insert JSON string "null"

### \server\venv\Lib\site-packages\sqlalchemy\sql\traversals.py
- Line 359: # TODO: use abc classes
- Line 834: # TODO: look at attrname for "legacy_join" and use different structure

### \server\venv\Lib\site-packages\sqlalchemy\sql\type_api.py
- Line 1515: return cls(**kw)  # type: ignore
- Line 1519: #    def __init__(self, **kw: Any):
- Line 1675: # we are changing its behavior *slightly*, which is that we now consume

### \server\venv\Lib\site-packages\sqlalchemy\sql\util.py
- Line 928: # TODO: add specific coverage here
- Line 935: # TODO: add specific coverage here
- Line 1101: # note this specializes the ReplacingExternalTraversal.traverse()
- Line 1146: # TODO: cython candidate
- Line 1186: # leave them as the constant.  This is first noted in #6259,
- Line 1447: # TODO: typing is finding a few gaps in here, see if they can be

### \server\venv\Lib\site-packages\sqlalchemy\sql\visitors.py
- Line 136: return visitor.visit_unsupported_compilation(self, err, **kw)  # type: ignore  # noqa: E501
- Line 138: return meth(self, **kw)  # type: ignore  # noqa: E501
- Line 970: # *could* in theory replace with an entirely different kind of element.

### \server\venv\Lib\site-packages\sqlalchemy\sql\_elements_constructors.py
- Line 184: def and_(*clauses):  # noqa: F811
- Line 1455: def or_(*clauses):  # noqa: F811

### \server\venv\Lib\site-packages\sqlalchemy\sql\_selectable_constructors.py
- Line 107: # TODO: mypy requires the _TypedSelectable overloads in all compound select
- Line 384: # code within this block is **programmatically,
- Line 385: # statically generated** by tools/generate_tuple_map_overloads.py

### \server\venv\Lib\site-packages\sqlalchemy\testing\assertions.py
- Line 491: # assert outside the block so it works for AssertionError too !

### \server\venv\Lib\site-packages\sqlalchemy\testing\assertsql.py
- Line 276: # TODO: why do we need this part?

### \server\venv\Lib\site-packages\sqlalchemy\testing\asyncio.py
- Line 14: # note that SQLAlchemy's asyncio integration also supports a method

### \server\venv\Lib\site-packages\sqlalchemy\testing\engines.py
- Line 48: # note we are keeping "invalidated" here, as those are still
- Line 266: # TODO: this doesn't cover all cases

### \server\venv\Lib\site-packages\sqlalchemy\testing\pickleable.py
- Line 41: # TODO: these are kind of arbitrary....

### \server\venv\Lib\site-packages\sqlalchemy\testing\requirements.py
- Line 146: # TODO: exclusions should be composable,

### \server\venv\Lib\site-packages\sqlalchemy\testing\util.py
- Line 225: # TODO: this warning can be used to find all the places
- Line 331: # TODO:

### \server\venv\Lib\site-packages\sqlalchemy\testing\fixtures\base.py
- Line 36: # If present, test class is only runnable for the *single* specified

### \server\venv\Lib\site-packages\sqlalchemy\testing\fixtures\mypy.py
- Line 147: r"\s*# EXPECTED(_MYPY)?(_RE)?(_ROW)?(_TYPE)?: (.+)"
- Line 149: py_ver_re = re.compile(r"^#\s*PYTHON_VERSION\s?>=\s?(\d+\.\d+)")
- Line 169: expected_msg = re.sub(r"# noqa[:]? ?.*", "", m.group(5))
- Line 196: # note making sure preceding text matches
- Line 216: #     lambda m: fr"typing.{m.group(0)}\*?",

### \server\venv\Lib\site-packages\sqlalchemy\testing\fixtures\sql.py
- Line 398: # note we're asserting the order of the params as well as

### \server\venv\Lib\site-packages\sqlalchemy\testing\plugin\pytestplugin.py
- Line 328: # seems like the functions attached to a test class aren't sorted already?
- Line 329: # is that true and why's that? (when using unittest, they're sorted)
- Line 446: # pytest_runtest_setup runs *before* pytest fixtures with scope="class".
- Line 641: # note this is affected by "from __future__ import annotations" at
- Line 672: # this is the pytest hacky part.  don't do a full update wrapper

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_cte.py
- Line 84: # note that SQL Server requires this to be UNION ALL,

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_deprecations.py
- Line 61: # note we've had to remove one use case entirely, which is this

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_dialect.py
- Line 53: ``**kw``, for #8988.

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_insert.py
- Line 192: # note we are experimenting with having this be True

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_reflection.py
- Line 62: # TODO: when temp tables are subject to server reset,
- Line 2100: # CREATE TABLE?
- Line 2270: # NOTE: can't really create a table with no option

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_results.py
- Line 257: # TODO: this is a huge issue as it prevents these tests from being
- Line 334: # TODO: need a real requirement for this, or dont use this test
- Line 391: # fun fact!  why did we not have this result.close() in this test
- Line 392: # before 2.0? don't we roll back in the connection pool
- Line 393: # unconditionally? yes!  and in fact if you run this test in 1.4
- Line 395: # similar" with "Commands out sync" emitted a warning!  2.0's

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_select.py
- Line 1334: # note this becomes ARRAY if we dont use expanding
- Line 1381: # note this becomes ARRAY if we dont use expanding
- Line 1939: # note the rows are part of the cache key right now, not handled

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\test_types.py
- Line 412: # note that in Python 3, this invokes the Unicode
- Line 1019: # test that this is actually a number!
- Line 1020: # note we have tiny scale here as we have tests with very
- Line 1335: data = "réve🐍illé" * ((length // 9) + 1)
- Line 1338: data = "abcdefg" * ((length // 7) + 1)
- Line 1437: # take the quotes out.  yup, there is *literally* no other
- Line 1733: # note we include Unicode supplementary characters as well

### \server\venv\Lib\site-packages\sqlalchemy\testing\suite\__init__.py
- Line 7: from .test_cte import *  # noqa
- Line 8: from .test_ddl import *  # noqa
- Line 9: from .test_deprecations import *  # noqa
- Line 10: from .test_dialect import *  # noqa
- Line 11: from .test_insert import *  # noqa
- Line 12: from .test_reflection import *  # noqa
- Line 13: from .test_results import *  # noqa
- Line 14: from .test_rowcount import *  # noqa
- Line 15: from .test_select import *  # noqa
- Line 16: from .test_sequence import *  # noqa
- Line 17: from .test_types import *  # noqa
- Line 18: from .test_unicode_ddl import *  # noqa
- Line 19: from .test_update_delete import *  # noqa

### \server\venv\Lib\site-packages\sqlalchemy\util\concurrency.py
- Line 100: def greenlet_spawn(fn, *args, **kw):  # type: ignore  # noqa: F811
- Line 103: def AsyncAdaptedLock(*args, **kw):  # type: ignore  # noqa: F811
- Line 106: def _util_async_run(fn, *arg, **kw):  # type: ignore  # noqa: F811
- Line 109: def _util_async_run_coroutine_function(fn, *arg, **kw):  # type: ignore  # noqa: F811,E501

### \server\venv\Lib\site-packages\sqlalchemy\util\deprecations.py
- Line 281: return fn(*args, **kwargs)  # type: ignore[no-any-return]
- Line 386: return fn(*args, **kwargs)  # type: ignore[no-any-return]

### \server\venv\Lib\site-packages\sqlalchemy\util\langhelpers.py
- Line 101: obj: Any, *, format: Format  # noqa: A002
- Line 193: "except:" block if we don't explicitly store it? Original issue was #2703.
- Line 219: # see #2703 for notes
- Line 377: # arguments.  note that apply_pos doesn't currently work in all cases
- Line 378: # such as when a kw-only indicator "*" is present, which is why
- Line 1716: # NOTE: we should ultimately get rid of this global thing,
- Line 2236: # TODO: this is not working for params like ":param case_sensitive=True:"
- Line 2266: # TODO: this still won't cover if the code example itself has

### \server\venv\Lib\site-packages\sqlalchemy\util\typing.py
- Line 355: # NOTE: a generic TAT does not instance check as TypeAliasType outside of
- Line 358: # NOTE: things seems to work also without this additional check
- Line 533: return make_union_type(*parts) if parts else Never  # type: ignore[return-value] # noqa: E501

### \server\venv\Lib\site-packages\sqlalchemy\util\_concurrency_py3k.py
- Line 62: # note asyncio.CancelledError is already BaseException

### \server\venv\Lib\site-packages\starlette\concurrency.py
- Line 14: async def run_until_first_complete(*args: tuple[Callable, dict]) -> None:  # type: ignore[type-arg]

### \server\venv\Lib\site-packages\starlette\datastructures.py
- Line 399: super().__init__(*args, **kwargs)  # type: ignore[arg-type]
- Line 431: # Note 0 means unlimited mirroring SpooledTemporaryFile's __init__

### \server\venv\Lib\site-packages\starlette\formparsers.py
- Line 126: spool_max_size = 1024 * 1024  # 1MB
- Line 128: max_part_size = 1024 * 1024  # 1MB
- Line 138: max_part_size: int = 1024 * 1024,  # 1MB
- Line 257: # that call the corresponding file methods *in a threadpool*,

### \server\venv\Lib\site-packages\starlette\requests.py
- Line 63: # https://bugzilla.mozilla.org/show_bug.cgi?id=169091

### \server\venv\Lib\site-packages\starlette\responses.py
- Line 210: self.headers["location"] = quote(str(url), safe=":/%#?=@[]!$&'()*+,;")
- Line 489: result.insert(p, (start, end))  # THIS IS NOT REACHED!

### \server\venv\Lib\site-packages\starlette\middleware\base.py
- Line 54: if msg["type"] != "http.disconnect":  # pragma: no cover

### \server\venv\Lib\site-packages\starlette\middleware\cors.py
- Line 78: if scope["type"] != "http":  # pragma: no cover
- Line 118: # and the value would be "*".
- Line 167: # with the specific origin instead of '*'.

### \server\venv\Lib\site-packages\starlette\middleware\exceptions.py
- Line 26: self.debug = debug  # TODO: We ought to handle 404 cases if debug is set.

### \server\venv\Lib\site-packages\starlette\middleware\gzip.py
- Line 18: if scope["type"] != "http":  # pragma: no cover

### \server\venv\Lib\site-packages\starlette\middleware\sessions.py
- Line 21: max_age: int | None = 14 * 24 * 60 * 60,  # 14 days, in seconds

### \server\venv\Lib\site-packages\starlette\middleware\__init__.py
- Line 18: def __call__(self, app: _ASGIApp, /, *args: P.args, **kwargs: P.kwargs) -> _ASGIApp: ...  # pragma: no cover

### \server\venv\Lib\site-packages\stripe\_account.py
- Line 1: # -*- coding: utf-8 -*-
- Line 639: The back of a document returned by a [file upload](https://api.stripe.com#create_file) with a `purpose` value of `additional_verification`. Note that `additional_verification` files are [not downloadable](https://docs.stripe.com/file-upload#uploading-a-file).
- Line 651: The front of a document returned by a [file upload](https://api.stripe.com#create_file) with a `purpose` value of `additional_verification`. Note that `additional_verification` files are [not downloadable](https://docs.stripe.com/file-upload#uploading-a-file).
- Line 713: This value is used to determine if a business is exempt from providing ultimate beneficial owners. See [this support article](https://support.stripe.com/questions/exemption-from-providing-ownership-details) and [changelog](https://docs.stripe.com/changelog/acacia/2025-01-27/ownership-exemption-reason-accounts-api) for more details.

### \server\venv\Lib\site-packages\stripe\_account_capability_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_external_account_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_link.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_login_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_person_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_session.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_account_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_api_requestor.py
- Line 278: # TODO: should be able to remove this cast once self._client.request_stream_with_retries
- Line 581: # note: server sends back "expand[]" but users supply "expand", so we strip the brackets from the key name
- Line 851: # TODO: should be able to remove this cast once self._client.request_with_retries

### \server\venv\Lib\site-packages\stripe\_api_version.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_apple_pay_domain.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_apple_pay_domain_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_application.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_application_fee.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_application_fee_refund.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_application_fee_refund_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_application_fee_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_apps_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance_settings.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance_settings_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_balance_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_bank_account.py
- Line 1: # -*- coding: utf-8 -*-
- Line 379: For bank accounts, possible values are `new`, `validated`, `verified`, `verification_failed`, `tokenized_account_number_deactivated` or `errored`. A bank account that hasn't had any activity or validation performed is `new`. If Stripe can determine that the bank account exists, its status will be `validated`. Note that there often isn't enough information to know (e.g., for smaller credit unions), and the validation is not always run. If customer bank account verification has succeeded, the bank account status will be `verified`. If the verification failed for any reason, such as microdeposit failure, the status will be `verification_failed`. If the status is `tokenized_account_number_deactivated`, the account utilizes a tokenized account number which has been deactivated due to expiration or revocation. This account will need to be reverified to continue using it for money movement. If a payout sent to this bank account fails, we'll set the status to `errored` and will not continue to send [scheduled payouts](https://stripe.com/docs/payouts#payout-schedule) until the bank details are updated.
- Line 381: For external accounts, possible values are `new`, `errored`, `verification_failed`, and `tokenized_account_number_deactivated`. If a payout fails, the status is set to `errored` and scheduled payouts are stopped until account details are updated. In the US and India, if we can't [verify the owner of the bank account](https://support.stripe.com/questions/bank-account-ownership-verification), we'll set the status to `verification_failed`. Other validations aren't run against external accounts because they're only used for payouts. This means the other statuses don't apply.

### \server\venv\Lib\site-packages\stripe\_billing_portal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_billing_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_capability.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_card.py
- Line 1: # -*- coding: utf-8 -*-
- Line 95: If a CVC was provided, results of the check: `pass`, `fail`, `unavailable`, or `unchecked`. A result of unchecked indicates that CVC was provided but hasn't been checked yet. Checks are typically performed when attaching a card to a Customer object, or when creating a charge. For more details, see [Check if a card is valid without a charge](https://support.stripe.com/questions/check-if-a-card-is-valid-without-a-charge).

### \server\venv\Lib\site-packages\stripe\_cash_balance.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_charge.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_charge_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_checkout_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_climate_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_confirmation_token.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_confirmation_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_connect_collection_transfer.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_country_spec.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_country_spec_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_coupon.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_coupon_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_credit_note.py
- Line 1: # -*- coding: utf-8 -*-
- Line 55: Related guide: [Credit notes](https://docs.stripe.com/billing/invoices/credit-notes)
- Line 342: Status of this credit note, one of `issued` or `void`. Learn more about [voiding credit notes](https://docs.stripe.com/billing/invoices/credit-notes#voiding).
- Line 594: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 611: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 620: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 625: def void_credit_note(  # pyright: ignore[reportGeneralTypeIssues]
- Line 629: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 647: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 664: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 673: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 678: async def void_credit_note_async(  # pyright: ignore[reportGeneralTypeIssues]
- Line 682: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).

### \server\venv\Lib\site-packages\stripe\_credit_note_line_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_credit_note_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_credit_note_preview_lines_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_credit_note_service.py
- Line 1: # -*- coding: utf-8 -*-
- Line 290: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).
- Line 310: Marks a credit note as void. Learn more about [voiding credit notes](https://docs.stripe.com/docs/billing/invoices/credit-notes#voiding).

### \server\venv\Lib\site-packages\stripe\_customer.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_balance_transaction.py
- Line 1: # -*- coding: utf-8 -*-
- Line 100: Transaction type: `adjustment`, `applied_to_invoice`, `credit_note`, `initial`, `invoice_overpaid`, `invoice_too_large`, `invoice_too_small`, `unspent_receiver_credit`, `unapplied_from_invoice`, `checkout_session_subscription_payment`, or `checkout_session_subscription_payment_canceled`. See the [Customer Balance page](https://docs.stripe.com/billing/customer/balance#types) to learn more about transaction types.

### \server\venv\Lib\site-packages\stripe\_customer_balance_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_cash_balance_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_cash_balance_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_cash_balance_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_funding_instructions_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_payment_method_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_payment_source_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_session.py
- Line 1: # -*- coding: utf-8 -*-
- Line 21: Related guides: [Customer Session with the Payment Element](https://docs.stripe.com/payments/accept-a-payment-deferred?platform=web&type=payment#save-payment-methods),

### \server\venv\Lib\site-packages\stripe\_customer_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_customer_tax_id_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_custom_method.py
- Line 6: # TODO(major): 1704.

### \server\venv\Lib\site-packages\stripe\_discount.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_dispute.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_dispute_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_entitlements_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_ephemeral_key.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_ephemeral_key_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_event_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_exchange_rate.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_exchange_rate_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_file.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_file_link.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_file_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_file_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_financial_connections_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_forwarding_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_funding_instructions.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_http_client.py
- Line 194: # Note that we expect the headers object to be a CaseInsensitiveDict, as is the case with the requests library.
- Line 207: # Note that we expect the stripe-should-retry header to be false
- Line 700: # e.g. a socket timeout. TODO: The other fetch methods probably
- Line 788: # https://code.google.com/p/googleappengine/issues/detail?id=544

### \server\venv\Lib\site-packages\stripe\_identity_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice.py
- Line 1: # -*- coding: utf-8 -*-
- Line 150: Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://docs.stripe.com/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.
- Line 1886: Note: Currency conversion calculations use the latest exchange rates. Exchange rates may vary between the time of the preview and the time of the actual invoice creation. [Learn more](https://docs.stripe.com/currencies/conversions)
- Line 1910: Note: Currency conversion calculations use the latest exchange rates. Exchange rates may vary between the time of the preview and the time of the actual invoice creation. [Learn more](https://docs.stripe.com/currencies/conversions)
- Line 2800: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2821: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2832: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2843: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2863: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2884: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2895: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 2906: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.

### \server\venv\Lib\site-packages\stripe\_invoice_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_line_item.py
- Line 1: # -*- coding: utf-8 -*-
- Line 272: Set of [key-value pairs](https://docs.stripe.com/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Note that for line items with `type=subscription`, `metadata` reflects the current metadata from the subscription associated with the line item, unless the invoice line was directly updated with different metadata after creation.

### \server\venv\Lib\site-packages\stripe\_invoice_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_payment.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_payment_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_rendering_template.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_rendering_template_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_invoice_service.py
- Line 1: # -*- coding: utf-8 -*-
- Line 711: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 735: Consult with local regulations to determine whether and how an invoice might be amended, canceled, or voided in the jurisdiction you're doing business in. You might need to [issue another invoice or <a href="#create_credit_note">credit note](https://docs.stripe.com/api#create_invoice) instead. Stripe recommends that you consult with your legal counsel for advice specific to your business.
- Line 764: Note: Currency conversion calculations use the latest exchange rates. Exchange rates may vary between the time of the preview and the time of the actual invoice creation. [Learn more](https://docs.stripe.com/currencies/conversions)
- Line 791: Note: Currency conversion calculations use the latest exchange rates. Exchange rates may vary between the time of the preview and the time of the actual invoice creation. [Learn more](https://docs.stripe.com/currencies/conversions)

### \server\venv\Lib\site-packages\stripe\_issuing_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_line_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_listable_api_resource.py
- Line 8: # TODO(major): 1704 - remove this class and all internal usages. `.list` is already inlined into the resource classes.

### \server\venv\Lib\site-packages\stripe\_login_link.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_mandate.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_mandate_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_nested_resource_class_methods.py
- Line 7: # TODO(major): 1704. Remove this. It is no longer used except for "nested_resource_url" and "nested_resource_request",

### \server\venv\Lib\site-packages\stripe\_object_classes.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_attempt_record.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_attempt_record_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_intent.py
- Line 1: # -*- coding: utf-8 -*-
- Line 2852: Refer to our docs to [accept a payment](https://docs.stripe.com/payments/accept-a-payment?ui=elements) and learn about how `client_secret` should be handled.

### \server\venv\Lib\site-packages\stripe\_payment_intent_amount_details_line_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_intent_amount_details_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_intent_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_link.py
- Line 1: # -*- coding: utf-8 -*-
- Line 823: The account on behalf of which to charge. See the [Connect documentation](https://support.stripe.com/questions/sending-invoices-on-behalf-of-connected-accounts) for details.

### \server\venv\Lib\site-packages\stripe\_payment_link_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method_configuration.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method_configuration_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method_domain.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method_domain_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_method_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_record.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payment_record_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payout.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_payout_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_person.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_plan.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_plan_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_price.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_price_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_product.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_product_feature.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_product_feature_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_product_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_promotion_code.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_promotion_code_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_quote.py
- Line 1: # -*- coding: utf-8 -*-
- Line 557: The account on behalf of which to charge. See the [Connect documentation](https://support.stripe.com/questions/sending-invoices-on-behalf-of-connected-accounts) for details.

### \server\venv\Lib\site-packages\stripe\_quote_computed_upfront_line_items_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_quote_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_quote_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_radar_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_refund.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_refund_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_reporting_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_reserve_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_reversal.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_review.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_review_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_setup_attempt.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_setup_attempt_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_setup_intent.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_setup_intent_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_shipping_rate.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_shipping_rate_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_sigma_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_singleton_api_resource.py
- Line 8: # TODO(major): 1704 - Inline into Tax.Settings and Balance, and remove this class.

### \server\venv\Lib\site-packages\stripe\_source.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_source_mandate_notification.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_source_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_source_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_source_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_stripe_client.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_stripe_object.py
- Line 102: # TODO: is a more specific type possible here?

### \server\venv\Lib\site-packages\stripe\_subscription.py
- Line 1: # -*- coding: utf-8 -*-
- Line 680: If specified, payment collection for this subscription will be paused. Note that the subscription status will be unchanged and will not be updated to `paused`. Learn more about [pausing collection](https://docs.stripe.com/billing/subscriptions/pause-payment).

### \server\venv\Lib\site-packages\stripe\_subscription_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_subscription_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_subscription_schedule.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_subscription_schedule_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_subscription_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_code.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_code_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_deducted_at_source.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_id.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_id_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_rate.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_rate_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_tax_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_terminal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_test_helpers_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_token.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_topup.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_topup_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_transfer.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_transfer_reversal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_transfer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_treasury_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_util.py
- Line 323: # TODO: this is a horrible hack. The API needs

### \server\venv\Lib\site-packages\stripe\_v1_services.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_v2_services.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_webhook_endpoint.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\_webhook_endpoint_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\apps\_secret.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\apps\_secret_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\apps\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_alert.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_alert_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_alert_triggered.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_balance_summary.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_balance_summary_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_balance_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_balance_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_grant.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_credit_grant_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event_adjustment.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event_adjustment_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event_summary.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_event_summary_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\_meter_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing_portal\_configuration.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing_portal\_configuration_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing_portal\_session.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing_portal\_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\billing_portal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\checkout\_session.py
- Line 1: # -*- coding: utf-8 -*-
- Line 73: If enabled, Adaptive Pricing is available on [eligible sessions](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing?payment-ui=stripe-hosted#restrictions).
- Line 181: The font family for the Checkout Session. Must be one of the [supported font families](https://docs.stripe.com/payments/checkout/customization/appearance?payment-ui=stripe-hosted#font-compatibility).
- Line 2397: This parameter applies to `ui_mode: embedded`. Learn more about the [redirect behavior](https://docs.stripe.com/payments/checkout/custom-success-page?payment-ui=embedded-form) of embedded sessions. Defaults to `always`.

### \server\venv\Lib\site-packages\stripe\checkout\_session_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\checkout\_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\checkout\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_order.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_order_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_product.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_product_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_supplier.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\_supplier_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\climate\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\_active_entitlement.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\_active_entitlement_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\_active_entitlement_summary.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\_feature.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\_feature_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\entitlements\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_event_classes.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v1_billing_meter_error_report_triggered_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v1_billing_meter_no_meter_found_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_closed_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_created_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_customer_capability_status_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_customer_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_merchant_capability_status_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_merchant_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_recipient_capability_status_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_configuration_recipient_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_defaults_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_future_requirements_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_identity_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_including_requirements_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_link_returned_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_person_created_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_person_deleted_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_person_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_account_updated_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\_v2_core_event_destination_ping_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\events\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_account.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_account_owner.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_account_ownership.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_account_owner_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_account_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_session.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\financial_connections\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\forwarding\_request.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\forwarding\_request_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\forwarding\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\identity\_verification_report.py
- Line 1: # -*- coding: utf-8 -*-
- Line 290: Collect an ID number and perform an [ID number check](https://docs.stripe.com/identity/verification-checks?type=id-number) with the document's extracted name and date of birth.
- Line 298: Capture a face image and perform a [selfie check](https://docs.stripe.com/identity/verification-checks?type=selfie) comparing a photo ID and a picture of your user's face. [Learn more](https://docs.stripe.com/identity/selfie).

### \server\venv\Lib\site-packages\stripe\identity\_verification_report_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\identity\_verification_session.py
- Line 1: # -*- coding: utf-8 -*-
- Line 100: Collect an ID number and perform an [ID number check](https://docs.stripe.com/identity/verification-checks?type=id-number) with the document's extracted name and date of birth.
- Line 108: Capture a face image and perform a [selfie check](https://docs.stripe.com/identity/verification-checks?type=selfie) comparing a photo ID and a picture of your user's face. [Learn more](https://docs.stripe.com/identity/selfie).
- Line 329: The short-lived URL that you use to redirect a user to Stripe to submit their identity information. This URL expires after 48 hours and can only be used once. Don't store it, log it, send it in emails or expose it to anyone other than the user. Refer to our docs on [verifying identity documents](https://docs.stripe.com/identity/verify-identity-documents?platform=web&type=redirect) to learn how to redirect users to Stripe.

### \server\venv\Lib\site-packages\stripe\identity\_verification_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\identity\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_authorization.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_authorization_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_card.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_cardholder.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_cardholder_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_card_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_dispute.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_dispute_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_personalization_design.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_personalization_design_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_physical_bundle.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_physical_bundle_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_token.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\issuing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_capability_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_capability_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_capability_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_create_external_account_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_create_login_link_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 1035: This value is used to determine if a business is exempt from providing ultimate beneficial owners. See [this support article](https://support.stripe.com/questions/exemption-from-providing-ownership-details) and [changelog](https://docs.stripe.com/changelog/acacia/2025-01-27/ownership-exemption-reason-accounts-api) for more details.
- Line 1295: One or more documents that support the [Bank account ownership verification](https://support.stripe.com/questions/bank-account-ownership-verification) requirement. Must be a document associated with the account's primary active bank account that displays the last 4 digits of the account number, either a statement or a check.
- Line 1541: The government-issued ID number of the individual, as appropriate for the representative's country. (Examples are a Social Security Number in the U.S., or a Social Insurance Number in Canada). Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 1545: The government-issued secondary ID number of the individual, as appropriate for the representative's country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_account_create_person_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 65: The person's ID number, as appropriate for their country. For example, a social security number in the U.S., social insurance number in Canada, etc. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 69: The person's secondary ID number, as appropriate for their country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_account_delete_external_account_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_delete_person_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_external_account_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_external_account_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_external_account_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_external_account_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_external_account_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 81: One or more documents that support the [Bank account ownership verification](https://support.stripe.com/questions/bank-account-ownership-verification) requirement. Must be a document associated with the bank account that displays the last 4 digits of the account number, either a statement or a check.

### \server\venv\Lib\site-packages\stripe\params\_account_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_list_capabilities_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_list_external_accounts_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_list_persons_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_login_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_modify_capability_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_modify_external_account_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 82: One or more documents that support the [Bank account ownership verification](https://support.stripe.com/questions/bank-account-ownership-verification) requirement. Must be a document associated with the bank account that displays the last 4 digits of the account number, either a statement or a check.

### \server\venv\Lib\site-packages\stripe\params\_account_modify_person_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 65: The person's ID number, as appropriate for their country. For example, a social security number in the U.S., social insurance number in Canada, etc. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 69: The person's secondary ID number, as appropriate for their country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_account_persons_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_person_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 64: The person's ID number, as appropriate for their country. For example, a social security number in the U.S., social insurance number in Canada, etc. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 68: The person's secondary ID number, as appropriate for their country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_account_person_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_person_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_person_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_person_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 64: The person's ID number, as appropriate for their country. For example, a social security number in the U.S., social insurance number in Canada, etc. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 68: The person's secondary ID number, as appropriate for their country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_account_reject_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_retrieve_capability_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_retrieve_current_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_retrieve_external_account_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_retrieve_person_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_account_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 1022: This value is used to determine if a business is exempt from providing ultimate beneficial owners. See [this support article](https://support.stripe.com/questions/exemption-from-providing-ownership-details) and [changelog](https://docs.stripe.com/changelog/acacia/2025-01-27/ownership-exemption-reason-accounts-api) for more details.
- Line 1237: One or more documents that support the [Bank account ownership verification](https://support.stripe.com/questions/bank-account-ownership-verification) requirement. Must be a document associated with the account's primary active bank account that displays the last 4 digits of the account number, either a statement or a check.
- Line 1483: The government-issued ID number of the individual, as appropriate for the representative's country. (Examples are a Social Security Number in the U.S., or a Social Insurance Number in Canada). Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 1487: The government-issued secondary ID number of the individual, as appropriate for the representative's country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_apple_pay_domain_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_apple_pay_domain_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_apple_pay_domain_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_apple_pay_domain_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_create_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_list_refunds_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_modify_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_refund_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_refund_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_refund_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_refund_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_application_fee_retrieve_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_settings_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_settings_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_settings_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_balance_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_bank_account_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_card_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_list_refunds_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_retrieve_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_charge_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_confirmation_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_confirmation_token_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_country_spec_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_country_spec_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_coupon_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_list_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_preview_lines_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_preview_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_preview_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_credit_note_void_credit_note_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_balance_transaction_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_balance_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_balance_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_balance_transaction_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_cash_balance_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_cash_balance_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_cash_balance_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_cash_balance_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_create_balance_transaction_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_create_funding_instructions_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 11: The customer's address. Learn about [country-specific requirements for calculating tax](https://docs.stripe.com/invoicing/taxes?dashboard-or-api=dashboard#set-up-customer).

### \server\venv\Lib\site-packages\stripe\params\_customer_create_source_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_create_tax_id_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_delete_discount_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_delete_source_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_delete_tax_id_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_funding_instructions_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_fund_cash_balance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_balance_transactions_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_cash_balance_transactions_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_payment_methods_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_sources_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_list_tax_ids_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_modify_balance_transaction_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_modify_cash_balance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_modify_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 11: The customer's address. Learn about [country-specific requirements for calculating tax](https://docs.stripe.com/invoicing/taxes?dashboard-or-api=dashboard#set-up-customer).

### \server\venv\Lib\site-packages\stripe\params\_customer_modify_source_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_method_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_method_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_payment_source_verify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_balance_transaction_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_cash_balance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_cash_balance_transaction_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_payment_method_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_source_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_retrieve_tax_id_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_tax_id_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_tax_id_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_tax_id_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_tax_id_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_customer_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 10: The customer's address. Learn about [country-specific requirements for calculating tax](https://docs.stripe.com/invoicing/taxes?dashboard-or-api=dashboard#set-up-customer).

### \server\venv\Lib\site-packages\stripe\params\_dispute_close_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_dispute_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_dispute_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_dispute_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_dispute_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_ephemeral_key_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_ephemeral_key_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_event_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_event_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_exchange_rate_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_exchange_rate_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_link_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_link_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_link_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_link_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_file_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_add_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_attach_payment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 150: Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://docs.stripe.com/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.

### \server\venv\Lib\site-packages\stripe\params\_invoice_create_preview_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 78: Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://docs.stripe.com/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.
- Line 102: The customer's address. Learn about [country-specific requirements for calculating tax](https://docs.stripe.com/invoicing/taxes?dashboard-or-api=dashboard#set-up-customer).

### \server\venv\Lib\site-packages\stripe\params\_invoice_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_finalize_invoice_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_item_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_line_item_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_list_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_mark_uncollectible_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_modify_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 128: Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://docs.stripe.com/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.

### \server\venv\Lib\site-packages\stripe\params\_invoice_payment_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_payment_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_pay_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_remove_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_rendering_template_archive_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_rendering_template_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_rendering_template_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_rendering_template_unarchive_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_send_invoice_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_update_lines_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_invoice_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 127: Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://docs.stripe.com/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.

### \server\venv\Lib\site-packages\stripe\params\_invoice_void_invoice_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_mandate_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_attempt_record_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_attempt_record_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_amount_details_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_apply_customer_balance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_confirm_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_increment_authorization_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_list_amount_details_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_intent_verify_microdeposits_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_list_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_link_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_attach_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_configuration_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 131: JCB is a credit card company based in Japan. JCB is currently available in Japan to businesses approved by JCB, and available to all businesses in Australia, Canada, Hong Kong, Japan, New Zealand, Singapore, Switzerland, United Kingdom, United States, and all countries in the European Economic Area except Iceland. Check this [page](https://support.stripe.com/questions/accepting-japan-credit-bureau-%28jcb%29-payments) for more details.

### \server\venv\Lib\site-packages\stripe\params\_payment_method_configuration_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_configuration_modify_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 135: JCB is a credit card company based in Japan. JCB is currently available in Japan to businesses approved by JCB, and available to all businesses in Australia, Canada, Hong Kong, Japan, New Zealand, Singapore, Switzerland, United Kingdom, United States, and all countries in the European Economic Area except Iceland. Check this [page](https://support.stripe.com/questions/accepting-japan-credit-bureau-%28jcb%29-payments) for more details.

### \server\venv\Lib\site-packages\stripe\params\_payment_method_configuration_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_configuration_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 134: JCB is a credit card company based in Japan. JCB is currently available in Japan to businesses approved by JCB, and available to all businesses in Australia, Canada, Hong Kong, Japan, New Zealand, Singapore, Switzerland, United Kingdom, United States, and all countries in the European Economic Area except Iceland. Check this [page](https://support.stripe.com/questions/accepting-japan-credit-bureau-%28jcb%29-payments) for more details.

### \server\venv\Lib\site-packages\stripe\params\_payment_method_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_detach_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_domain_validate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_method_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_attempt_canceled_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_attempt_failed_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_attempt_guaranteed_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_attempt_informational_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_attempt_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_payment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_report_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payment_record_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_reverse_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_payout_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_plan_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_price_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_create_feature_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_delete_feature_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_feature_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_feature_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_feature_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_feature_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_list_features_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_retrieve_feature_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_product_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_promotion_code_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_promotion_code_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_promotion_code_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_promotion_code_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_promotion_code_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_accept_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_computed_upfront_line_items_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_finalize_quote_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_list_computed_upfront_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_list_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_pdf_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_quote_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_refund_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_review_approve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_review_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_review_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_attempt_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_confirm_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_setup_intent_verify_microdeposits_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_shipping_rate_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_shipping_rate_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_shipping_rate_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_shipping_rate_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_shipping_rate_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_detach_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_list_source_transactions_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_source_verify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_delete_discount_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_item_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_migrate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_modify_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 109: If specified, payment collection for this subscription will be paused. Note that the subscription status will be unchanged and will not be updated to `paused`. Learn more about [pausing collection](https://docs.stripe.com/billing/subscriptions/pause-payment).

### \server\venv\Lib\site-packages\stripe\params\_subscription_resume_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_release_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_schedule_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_search_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_subscription_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 108: If specified, payment collection for this subscription will be paused. Note that the subscription status will be unchanged and will not be updated to `paused`. Learn more about [pausing collection](https://docs.stripe.com/billing/subscriptions/pause-payment).

### \server\venv\Lib\site-packages\stripe\params\_tax_code_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_code_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_id_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_id_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_id_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_id_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_rate_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_rate_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_rate_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_rate_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_tax_rate_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 129: This value is used to determine if a business is exempt from providing ultimate beneficial owners. See [this support article](https://support.stripe.com/questions/exemption-from-providing-ownership-details) and [changelog](https://docs.stripe.com/changelog/acacia/2025-01-27/ownership-exemption-reason-accounts-api) for more details.
- Line 389: The government-issued ID number of the individual, as appropriate for the representative's country. (Examples are a Social Security Number in the U.S., or a Social Insurance Number in Canada). Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 393: The government-issued secondary ID number of the individual, as appropriate for the representative's country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token created with Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 793: The person's ID number, as appropriate for their country. For example, a social security number in the U.S., social insurance number in Canada, etc. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).
- Line 797: The person's secondary ID number, as appropriate for their country, will be used for enhanced verification checks. In Thailand, this would be the laser code found on the back of an ID card. Instead of the number itself, you can also provide a [PII token provided by Stripe.js](https://docs.stripe.com/js/tokens/create_token?type=pii).

### \server\venv\Lib\site-packages\stripe\params\_token_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_topup_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_create_reversal_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_list_reversals_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_modify_reversal_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_retrieve_reversal_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_reversal_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_reversal_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_reversal_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_reversal_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_transfer_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\_webhook_endpoint_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\apps\_secret_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\apps\_secret_delete_where_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\apps\_secret_find_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\apps\_secret_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\apps\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_activate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_archive_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_deactivate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_alert_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_balance_summary_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_balance_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_balance_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_credit_grant_void_grant_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_deactivate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_event_adjustment_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_event_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_event_summary_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_list_event_summaries_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_reactivate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\_meter_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_configuration_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_configuration_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_configuration_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_configuration_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_configuration_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\billing_portal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 380: This parameter applies to `ui_mode: embedded`. Learn more about the [redirect behavior](https://docs.stripe.com/payments/checkout/custom-success-page?payment-ui=embedded-form) of embedded sessions. Defaults to `always`.
- Line 447: If set to `true`, Adaptive Pricing is available on [eligible sessions](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing?payment-ui=stripe-hosted#restrictions). Defaults to your [dashboard setting](https://dashboard.stripe.com/settings/adaptive-pricing).
- Line 518: The font family for the Checkout Session corresponding to one of the [supported font families](https://docs.stripe.com/payments/checkout/customization/appearance?payment-ui=stripe-hosted#font-compatibility).

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_list_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\_session_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\checkout\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_order_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_product_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_product_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_supplier_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\_supplier_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\climate\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_active_entitlement_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_active_entitlement_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_feature_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_feature_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_feature_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_feature_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\_feature_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\entitlements\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_disconnect_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_list_owners_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_owner_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_refresh_account_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_refresh_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_subscribe_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_account_unsubscribe_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_session_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\financial_connections\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\forwarding\_request_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\forwarding\_request_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\forwarding\_request_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\forwarding\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_report_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_report_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 62: Options that apply to the [document check](https://docs.stripe.com/identity/verification-checks?type=document).
- Line 75: Collect an ID number and perform an [ID number check](https://docs.stripe.com/identity/verification-checks?type=id-number) with the document's extracted name and date of birth.
- Line 83: Capture a face image and perform a [selfie check](https://docs.stripe.com/identity/verification-checks?type=selfie) comparing a photo ID and a picture of your user's face. [Learn more](https://docs.stripe.com/identity/selfie).

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_modify_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 38: Options that apply to the [document check](https://docs.stripe.com/identity/verification-checks?type=document).
- Line 51: Collect an ID number and perform an [ID number check](https://docs.stripe.com/identity/verification-checks?type=id-number) with the document's extracted name and date of birth.
- Line 59: Capture a face image and perform a [selfie check](https://docs.stripe.com/identity/verification-checks?type=selfie) comparing a photo ID and a picture of your user's face. [Learn more](https://docs.stripe.com/identity/selfie).

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_redact_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\identity\_verification_session_update_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 37: Options that apply to the [document check](https://docs.stripe.com/identity/verification-checks?type=document).
- Line 50: Collect an ID number and perform an [ID number check](https://docs.stripe.com/identity/verification-checks?type=id-number) with the document's extracted name and date of birth.
- Line 58: Capture a face image and perform a [selfie check](https://docs.stripe.com/identity/verification-checks?type=selfie) comparing a photo ID and a picture of your user's face. [Learn more](https://docs.stripe.com/identity/selfie).

### \server\venv\Lib\site-packages\stripe\params\identity\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_approve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_decline_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_finalize_amount_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_increment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_respond_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_reverse_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_authorization_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_cardholder_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_cardholder_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_cardholder_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_cardholder_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_cardholder_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 19: The desired expiration month (1-12) for this card if [specifying a custom expiration date](https://docs.stripe.com/issuing/cards/virtual/issue-cards?testing-method=with-code#exp-dates).
- Line 23: The desired 4-digit expiration year for this card if [specifying a custom expiration date](https://docs.stripe.com/issuing/cards/virtual/issue-cards?testing-method=with-code#exp-dates).

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_deliver_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_fail_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_return_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_ship_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_submit_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_card_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_submit_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_dispute_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_activate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_deactivate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_reject_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_personalization_design_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_physical_bundle_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_physical_bundle_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_token_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_token_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_token_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_token_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_create_force_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_create_unlinked_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\_transaction_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\issuing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_early_fraud_warning_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_early_fraud_warning_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_payment_evaluation_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_item_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_item_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_item_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\_value_list_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\radar\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\_report_run_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\_report_run_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\_report_run_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\_report_type_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\_report_type_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\reporting\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\sigma\_scheduled_query_run_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\sigma\_scheduled_query_run_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\sigma\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_association_find_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_calculation_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_calculation_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_calculation_list_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_calculation_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_registration_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_registration_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_registration_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_registration_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_registration_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_settings_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_settings_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_settings_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_transaction_create_from_calculation_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_transaction_create_reversal_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_transaction_line_item_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_transaction_list_line_items_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\tax\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_configuration_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_connection_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 15: The id of the location that this connection token is scoped to. If specified the connection token will only be usable with readers assigned to that location, otherwise the connection token will be usable with all readers. Note that location scoping only applies to internet-connected readers. For more details, see [the docs on scoping connection tokens](https://docs.stripe.com/terminal/fleet/locations-and-zones?dashboard-or-api=api#connection-tokens).

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_location_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_onboarding_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_cancel_action_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_collect_inputs_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_collect_payment_method_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_confirm_payment_intent_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_present_payment_method_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_process_payment_intent_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_process_setup_intent_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_refund_payment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_set_reader_display_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_succeed_input_collection_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_timeout_input_collection_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\_reader_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\terminal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_confirmation_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_customer_fund_cash_balance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_refund_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_test_clock_advance_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_test_clock_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_test_clock_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_test_clock_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\_test_clock_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_expire_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_finalize_amount_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_increment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_respond_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_authorization_reverse_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_card_deliver_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_card_fail_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_card_return_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_card_ship_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_card_submit_card_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_personalization_design_activate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_personalization_design_deactivate_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_personalization_design_reject_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_transaction_create_force_capture_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_transaction_create_unlinked_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\_transaction_refund_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\issuing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\terminal\_reader_present_payment_method_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\terminal\_reader_succeed_input_collection_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\terminal\_reader_timeout_input_collection_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\terminal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_inbound_transfer_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_inbound_transfer_return_inbound_transfer_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_inbound_transfer_succeed_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_payment_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_payment_post_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_payment_return_outbound_payment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_payment_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_transfer_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_transfer_post_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_transfer_return_outbound_transfer_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_outbound_transfer_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_received_credit_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\_received_debit_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\test_helpers\treasury\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_credit_reversal_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_credit_reversal_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_credit_reversal_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_debit_reversal_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_debit_reversal_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_debit_reversal_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_close_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_features_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_features_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_modify_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_retrieve_features_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_update_features_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_financial_account_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 39: The complete description that appears on your customers' statements. Maximum 10 characters. Can only include -#.$&*, spaces, and alphanumeric characters.

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_return_inbound_transfer_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_inbound_transfer_succeed_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 59: The description that appears on the receiving end for this OutboundPayment (for example, bank statement for external bank transfer). Maximum 10 characters for `ach` payments, 140 characters for `us_domestic_wire` payments, or 500 characters for `stripe` network transfers. Can only include -#.$&*, spaces, and alphanumeric characters. The default value is "payment".

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_post_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_return_outbound_payment_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_payment_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_cancel_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_create_params.py
- Line 1: # -*- coding: utf-8 -*-
- Line 51: Statement descriptor to be shown on the receiving end of an OutboundTransfer. Maximum 10 characters for `ach` transfers or 140 characters for `us_domestic_wire` transfers. The default value is "transfer". Can only include -#.$&*, spaces, and alphanumeric characters.

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_fail_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_post_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_return_outbound_transfer_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_outbound_transfer_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_credit_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_credit_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_credit_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_debit_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_debit_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_received_debit_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_transaction_entry_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_transaction_entry_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_transaction_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\_transaction_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\treasury\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\billing\_meter_event_adjustment_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\billing\_meter_event_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\billing\_meter_event_session_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\billing\_meter_event_stream_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\billing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_close_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_link_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_token_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_account_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_disable_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_enable_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_ping_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_destination_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\_event_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_delete_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_list_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_token_create_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_token_retrieve_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\_person_update_params.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\params\v2\core\accounts\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_early_fraud_warning.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_early_fraud_warning_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_payment_evaluation.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_payment_evaluation_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_value_list.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_value_list_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_value_list_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\_value_list_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\radar\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\reporting\_report_run.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\reporting\_report_run_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\reporting\_report_type.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\reporting\_report_type_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\reporting\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\sigma\_scheduled_query_run.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\sigma\_scheduled_query_run_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\sigma\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_association.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_association_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_calculation.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_calculation_line_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_calculation_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_calculation_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_registration.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_registration_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_settings.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_settings_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_transaction_line_item.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_transaction_line_item_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\tax\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_configuration.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_configuration_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_connection_token.py
- Line 1: # -*- coding: utf-8 -*-
- Line 25: The id of the location that this connection token is scoped to. Note that location scoping only applies to internet-connected readers. For more details, see [the docs on scoping connection tokens](https://docs.stripe.com/terminal/fleet/locations-and-zones?dashboard-or-api=api#connection-tokens).

### \server\venv\Lib\site-packages\stripe\terminal\_connection_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_location.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_location_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_onboarding_link.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_onboarding_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\terminal\_reader.py
- Line 1: # -*- coding: utf-8 -*-
- Line 587: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 606: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 615: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 624: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 642: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 661: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 670: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 679: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 807: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 826: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 835: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 844: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 862: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 881: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 890: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 899: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 917: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 936: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 945: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 954: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 972: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 991: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 1000: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 1009: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 1225: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1244: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1253: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1262: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1280: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1299: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1308: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1317: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 1445: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1464: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1473: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1482: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1500: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1519: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1528: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 1537: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.

### \server\venv\Lib\site-packages\stripe\terminal\_reader_service.py
- Line 1: # -*- coding: utf-8 -*-
- Line 261: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 283: Cancels the current reader action. See [Programmatic Cancellation](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven#programmatic-cancellation) for more details.
- Line 349: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 371: Initiates a payment flow on a Reader and updates the PaymentIntent with card details before manual confirmation. See [Collecting a Payment method](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#collect-a-paymentmethod) for more details.
- Line 393: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 415: Finalizes a payment on a Reader. See [Confirming a Payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=inspect#confirm-the-paymentintent) for more details.
- Line 437: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 459: Initiates a payment flow on a Reader. See [process the payment](https://docs.stripe.com/docs/terminal/payments/collect-card-payment?terminal-sdk-platform=server-driven&process=immediately#process-payment) for more details.
- Line 525: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.
- Line 547: Initiates an in-person refund on a Reader. See [Refund an Interac Payment](https://docs.stripe.com/docs/terminal/payments/regional?integration-country=CA#refund-an-interac-payment) for more details.

### \server\venv\Lib\site-packages\stripe\terminal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_confirmation_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_customer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_issuing_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_refund_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_terminal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_test_clock.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_test_clock_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\_treasury_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\issuing\_authorization_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\issuing\_card_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\issuing\_personalization_design_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\issuing\_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\issuing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\terminal\_reader_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\terminal\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\_inbound_transfer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\_outbound_payment_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\_outbound_transfer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\_received_credit_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\_received_debit_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\test_helpers\treasury\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_credit_reversal.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_credit_reversal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_debit_reversal.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_debit_reversal_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_financial_account.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_financial_account_features.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_financial_account_features_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_financial_account_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_inbound_transfer.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_inbound_transfer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_outbound_payment.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_outbound_payment_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_outbound_transfer.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_outbound_transfer_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_received_credit.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_received_credit_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_received_debit.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_received_debit_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_transaction.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_transaction_entry.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_transaction_entry_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\_transaction_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\treasury\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\_amount.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\_billing_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\_core_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\_deleted_object.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_adjustment.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_adjustment_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_session.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_session_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\_meter_event_stream_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\billing\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_link.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_link_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_person.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_person_token.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_token.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_account_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_event.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_event_destination.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_event_destination_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\_event_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\accounts\_person_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\accounts\_person_token_service.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\stripe\v2\core\accounts\__init__.py
- Line 1: # -*- coding: utf-8 -*-

### \server\venv\Lib\site-packages\tenacity\after.py
- Line 38: # NOTE(sileht): can't really happen, but we must please mypy

### \server\venv\Lib\site-packages\tenacity\before.py
- Line 36: # NOTE(sileht): can't really happen, but we must please mypy

### \server\venv\Lib\site-packages\tenacity\before_sleep.py
- Line 59: # NOTE(sileht): can't really happen, but we must please mypy

### \server\venv\Lib\site-packages\tenacity\nap.py
- Line 41: # NOTE(harlowja): this may *not* actually wait for timeout

### \server\venv\Lib\site-packages\tenacity\_utils.py
- Line 77: # When running under sphinx it appears this can be none?

### \server\venv\Lib\site-packages\typing_inspection\introspection.py
- Line 179: # Note: we could also check for generic aliases with a type alias as an origin.
- Line 221: # TODO at some point, we could switch to an enum flag, so that multiple sources
- Line 222: # can be combined. However, is there a need for this?
- Line 224: # TODO if/when https://peps.python.org/pep-0767/ is accepted, add 'read_only'
- Line 319: # TODO use a match statement when Python 3.9 support is dropped.

### \server\venv\Lib\site-packages\typing_inspection\typing_objects.py
- Line 204: # Also note that starting in 3.14, this is an alias to `annotationlib.ForwardRef`, but
- Line 255: # Protocol?
- Line 320: # TypedDict?
- Line 322: # BinaryIO? IO? TextIO?
- Line 456: # TYPE_CHECKING?

### \server\venv\Lib\site-packages\urllib3\connection.py
- Line 30: try:  # Compiled with SSL?
- Line 79: _CONTAINS_CONTROL_CHAR_RE = re.compile(r"[^-!#$%&'*+.^_`|~0-9a-zA-Z]")
- Line 336: # TODO: Fix tunnel so it doesn't depend on self.sock state.
- Line 410: def putheader(self, header: str, *values: str) -> None:  # type: ignore[override]
- Line 442: # object later. TODO: Remove this in favor of a real
- Line 567: # TODO should we implement it everywhere?
- Line 763: # Do we need to establish a tunnel?
- Line 1033: # match DNS SANs so we do the same thing!

### \server\venv\Lib\site-packages\urllib3\connectionpool.py
- Line 490: # conn.request() calls http.client.*.request, not the method in
- Line 578: # TODO: Add optional support for socket.gethostbyname checking.
- Line 770: # Is this a closed/new connection that requires CONNECT tunnelling?
- Line 802: # Everything went great!
- Line 889: # Handle redirect?
- Line 1095: # TODO revise this, see https://github.com/urllib3/urllib3/issues/2791
- Line 1132: return HTTPSConnectionPool(host, port=port, **kw)  # type: ignore[arg-type]
- Line 1134: return HTTPConnectionPool(host, port=port, **kw)  # type: ignore[arg-type]
- Line 1157: # *assert* that.  See http://bugs.python.org/issue28539

### \server\venv\Lib\site-packages\urllib3\exceptions.py
- Line 306: # TODO(t-8ch): Stop inheriting from AssertionError in v2.0.

### \server\venv\Lib\site-packages\urllib3\response.py
- Line 604: # Note: content-encoding value should be case-insensitive, per RFC 7230
- Line 773: # Are we using the chunked-style of transfer encoding?
- Line 906: # FIXME: Ideally we'd like to include the url in the ReadTimeoutError but
- Line 911: # FIXME: Is there a better way to differentiate between SSLErrors?
- Line 1146: # TODO make sure to initially read enough data to get past the headers
- Line 1211: # FIXME, this method's type doesn't say returning None is possible
- Line 1385: # FIXME: Rewrite this method and make it a class with a better structured logic.
- Line 1433: # decoder. However, on Jython we *might* need to, so

### \server\venv\Lib\site-packages\urllib3\_base_connection.py
- Line 20: # TODO: Remove this in favor of a better
- Line 83: # We know *at least* botocore is depending on the order of the

### \server\venv\Lib\site-packages\urllib3\__init__.py
- Line 98: # All warning filters *must* be appended unless you're really certain that they

### \server\venv\Lib\site-packages\urllib3\contrib\pyopenssl.py
- Line 326: return self.connection.recv_into(*args, **kwargs)  # type: ignore[no-any-return]

### \server\venv\Lib\site-packages\urllib3\contrib\emscripten\connection.py
- Line 91: # We know *at least* botocore is depending on the order of the

### \server\venv\Lib\site-packages\urllib3\http2\connection.py
- Line 25: RE_IS_LEGAL_HEADER_NAME = re.compile(rb"^[!#$%&'*+\-.^_`|~0-9a-z]+$")
- Line 143: def putheader(self, header: str | bytes, *values: str | bytes) -> None:  # type: ignore[override]
- Line 144: # TODO SKIPPABLE_HEADERS from urllib3 are ignored.
- Line 234: # TODO: Arbitrary read value.
- Line 282: # TODO this is often present from upstream.
- Line 325: # TODO: This is a woefully incomplete response object, but works for non-streaming.
- Line 332: decode_content: bool = False,  # TODO: support decoding
- Line 337: # Following CPython, we map HTTP versions to major * 10 + minor integers

### \server\venv\Lib\site-packages\urllib3\http2\__init__.py
- Line 38: # TODO: Offer 'http/1.1' as well, but for testing purposes this is handy.

### \server\venv\Lib\site-packages\urllib3\util\request.py
- Line 56: # treated as if they were 'POST' which *does* expect a body.
- Line 227: # File-like object, TODO: use seek() and tell() for length?

### \server\venv\Lib\site-packages\urllib3\util\response.py
- Line 99: # FIXME: Can we do this somehow without accessing private httplib _method?

### \server\venv\Lib\site-packages\urllib3\util\retry.py
- Line 280: return type(self)(**params)  # type: ignore[arg-type]
- Line 481: # Connect retry?
- Line 488: # Read retry?
- Line 495: # Other retry?
- Line 500: # Redirect retry?

### \server\venv\Lib\site-packages\urllib3\util\ssl_.py
- Line 93: try:  # Do we have ssl at all?
- Line 455: # Note: This branch of code and all the variables in it are only used in tests.

### \server\venv\Lib\site-packages\urllib3\util\ssl_match_hostname.py
- Line 3: # Note: This file is under the PSF license as the code comes from the python
- Line 36: # leftmost, *remainder = dn.split(r'.')
- Line 59: # When '*' is a fragment by itself, it matches a non-empty dotless
- Line 69: # Otherwise, '*' matches any dotless string, e.g. www*

### \server\venv\Lib\site-packages\urllib3\util\url.py
- Line 19: r"(?://([^\\/?#]*))?"
- Line 20: r"([^?#]*)"
- Line 21: r"(?:\?([^#]*))?"
- Line 22: r"(?:#(.*))?$",
- Line 37: # [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
- Line 39: # [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
- Line 41: # [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
- Line 43: # [ *4( h16 ":" ) h16 ] "::"              ls32
- Line 45: # [ *5( h16 ":" ) h16 ] "::"              h16
- Line 47: # [ *6( h16 ":" ) h16 ] "::"
- Line 55: _REG_NAME_PAT = r"(?:[^\[\]%:/?#]|%[a-fA-F0-9]{2})*"
- Line 56: _TARGET_RE = re.compile(r"^(/[^?#]*)(?:\?([^#]*))?(?:#.*)?$")
- Line 186: # "https://username:password@host.com:80/path?query#fragment"
- Line 454: # TODO: Remove this when we break backwards compatibility.

### \server\venv\Lib\site-packages\urllib3\util\wait.py
- Line 10: # How should we wait on sockets?
- Line 20: # Now, how do we choose between select() and poll()? On traditional Unixes,

### \server\venv\Lib\site-packages\uvicorn\config.py
- Line 140: # Special case for the .* pattern, otherwise this would only match
- Line 386: # See the note about fileConfig() here:

### \server\venv\Lib\site-packages\uvicorn\server.py
- Line 337: # done LIFO, see https://stackoverflow.com/questions/48434964

### \server\venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py
- Line 77: # Notes:
- Line 91: # Note: because we always convert invalid IP types to literals it
- Line 135: # Note: each proxy appends to the header list so check it in reverse order

### \server\venv\Lib\site-packages\uvicorn\protocols\http\h11_impl.py
- Line 256: # TODO: Replace the line above with the line below for Python >= 3.11

### \server\venv\Lib\site-packages\uvicorn\protocols\http\httptools_impl.py
- Line 296: # TODO: Replace the line above with the line below for Python >= 3.11

### \server\venv\Lib\site-packages\uvicorn\protocols\websockets\wsproto_impl.py
- Line 120: # TODO: Remove `type: ignore` when wsproto fixes the type annotation.
- Line 204: # todo: we may want to guard the size of self.bytes and self.text

### \server\venv\Lib\site-packages\uvicorn\supervisors\multiprocess.py
- Line 57: # https://learn.microsoft.com/zh-cn/cpp/c-runtime-library/reference/signal?view=msvc-170

### \server\venv\Lib\site-packages\uvicorn\supervisors\watchfilesreload.py
- Line 28: # gets raised on Windows for values like "*.py"

### \server\venv\Lib\site-packages\websockets\headers.py
- Line 103: _token_re = re.compile(r"[-!#$%&\'*+.^_`|~0-9a-zA-Z]+")
- Line 264: r"[-!#$%&\'*+.^_`|~0-9a-zA-Z]+(?:/[-!#$%&\'*+.^_`|~0-9a-zA-Z]+)?"

### \server\venv\Lib\site-packages\websockets\http11.py
- Line 38: # Maximum total size of headers is around 128 * 8 KiB = 1 MiB.
- Line 62: _token_re = re.compile(rb"[-!#$%&\'*+.^_`|~0-9a-zA-Z]+")
- Line 73: # See also https://www.rfc-editor.org/errata_search.php?rfc=7230&eid=4189

### \server\venv\Lib\site-packages\websockets\protocol.py
- Line 536: # * Normal closure: once we send a close frame, we expect a TCP close:
- Line 540: # * Abnormal closure: we always send a close frame and the same logic

### \server\venv\Lib\site-packages\websockets\uri.py
- Line 14: DELIMS = ":/?#[]@!$&'()*+,;="

### \server\venv\Lib\site-packages\websockets\utils.py
- Line 49: mask_repeated = mask * (len(data) // 4) + mask[: len(data) % 4]

### \server\venv\Lib\site-packages\websockets\asyncio\async_timeout.py
- Line 124: # Implementation note: `async with timeout()` is preferred

### \server\venv\Lib\site-packages\websockets\asyncio\connection.py
- Line 879: # Should we wait until the connection is closed?
- Line 881: # Should we close the transport and raise ConnectionClosed?
- Line 883: # What exception should we chain ConnectionClosed to?

### \server\venv\Lib\site-packages\websockets\asyncio\router.py
- Line 129: * Set ``ssl=True`` to generate ``wss://`` URIs without actually enabling

### \server\venv\Lib\site-packages\websockets\asyncio\server.py
- Line 808: self.create_server = loop.create_server(factory, host, port, **kwargs)  # type: ignore[arg-type]

### \server\venv\Lib\site-packages\websockets\extensions\permessage_deflate.py
- Line 399: #   True    False   Error!
- Line 425: #   8≤N≤15  None    Error!
- Line 427: #   8≤N≤15  N<M≤15  Error!
- Line 443: #   None    8≤M≤15  Error!
- Line 448: #   8≤N≤15  N<M≤15  Error!
- Line 639: #   8≤N≤15  None    None or Error!

### \server\venv\Lib\site-packages\websockets\legacy\http.py
- Line 29: _token_re = re.compile(rb"[-!#$%&\'*+.^_`|~0-9a-zA-Z]+")
- Line 40: # See also https://www.rfc-editor.org/errata_search.php?rfc=7230&eid=4189

### \server\venv\Lib\site-packages\websockets\legacy\protocol.py
- Line 926: # will complete within 4 or 5 * close_timeout after close(). The

### \server\venv\Lib\site-packages\websockets\sync\connection.py
- Line 926: # Should we wait until the connection is closed?
- Line 928: # Should we close the socket and raise ConnectionClosed?
- Line 930: # What exception should we chain ConnectionClosed to?

### \server\venv\Lib\site-packages\websockets\sync\messages.py
- Line 294: # without holding self.mutex. However, it's harmless — and even beneficial!

### \server\venv\Lib\site-packages\websockets\sync\router.py
- Line 125: * Set ``ssl=True`` to generate ``wss://`` URIs without actually enabling

### \server\venv\Lib\site-packages\yarl\_parse.py
- Line 48: delim_chars = "/?#"
- Line 93: n = netloc.replace("@", "").replace(":", "").replace("#", "").replace("?", "")
- Line 97: # Note that there are no unicode decompositions for the character '@' so
- Line 100: for c in "/?#@:":  # pragma: no branch

### \server\venv\Lib\site-packages\yarl\_quoting_py.py
- Line 8: GEN_DELIMS = ":/?#[]@"

### \server\venv\Lib\site-packages\yarl\_url.py
- Line 67: # this pattern matches anything that is *not* in those classes. and is only used
- Line 288: # gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
- Line 289: # sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
- Line 290: #             / "*" / "+" / "," / ";" / "="
- Line 292: # URI         = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
- Line 297: # scheme      = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
- Line 299: # userinfo    = *( unreserved / pct-encoded / sub-delims / ":" )
- Line 302: # IPvFuture  = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
- Line 306: #             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
- Line 307: #             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
- Line 308: #             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
- Line 309: #             / [ *4( h16 ":" ) h16 ] "::"              ls32
- Line 310: #             / [ *5( h16 ":" ) h16 ] "::"              h16
- Line 311: #             / [ *6( h16 ":" ) h16 ] "::"
- Line 314: # h16         = 1*4HEXDIG
- Line 322: # reg-name    = *( unreserved / pct-encoded / sub-delims )
- Line 323: # port        = *DIGIT
- Line 329: # path-abempty  = *( "/" segment )
- Line 330: # path-absolute = "/" [ segment-nz *( "/" segment ) ]
- Line 331: # path-noscheme = segment-nz-nc *( "/" segment )
- Line 332: # path-rootless = segment-nz *( "/" segment )
- Line 334: # segment       = *pchar
- Line 335: # segment-nz    = 1*pchar
- Line 336: # segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" )
- Line 339: # query       = *( pchar / "/" / "?" )
- Line 340: # fragment    = *( pchar / "/" / "?" )
- Line 342: # relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
- Line 347: # absolute-URI  = scheme ":" hier-part [ "?" query ]
- Line 614: # TODO: add a keyword-only option for keeping user/pass maybe?
- Line 1211: >>> url = URL('http://example.com/?a=1&b=2')
- Line 1213: URL('http://example.com/?a=1&b=2&a=3&c=4')
- Line 1239: >>> url = URL('http://example.com/?a=1&b=2')
- Line 1241: URL('http://example.com/?a=3&b=2&c=4')
- Line 1466: user = human_quote(self.user, "#/:?@[]")
- Line 1467: password = human_quote(self.password, "#/:?@[]")
- Line 1470: path = human_quote(self.path, "#?")

### \server\venv\Lib\site-packages\_pytest\cacheprovider.py
- Line 216: # Note: there's no way to get the current umask atomically, eek.
- Line 224: f.write("# Created by pytest automatically.\n*\n")
- Line 242: # TODO: pass ignore_cleanup_errors=True when we no longer support python < 3.10.
- Line 243: # See https://github.com/python/cpython/issues/74168. Note that passing
- Line 586: # TODO: evaluate generating upward relative paths

### \server\venv\Lib\site-packages\_pytest\capture.py
- Line 708: # TODO: This type error is real, need to fix.

### \server\venv\Lib\site-packages\_pytest\compat.py
- Line 126: # TODO(RonnyPfannschmidt): This function should be refactored when we
- Line 176: # Note: this code intentionally mirrors the code at the beginning of
- Line 267: # https://mypy.readthedocs.io/en/stable/common_issues.html?highlight=platform#python-version-and-system-platform-checks
- Line 312: # Note: review `regendoc` tox env in case this list is changed.

### \server\venv\Lib\site-packages\_pytest\debugging.py
- Line 80: # NOTE: not using pytest_unconfigure, since it might get called although
- Line 199: # This is a bit of a hack - it would be better if BdbQuit

### \server\venv\Lib\site-packages\_pytest\deprecated.py
- Line 85: #   def my_private_function(some, args, *, _ispytest: bool = False):

### \server\venv\Lib\site-packages\_pytest\doctest.py
- Line 316: # TODO: Type ignored -- breaks Liskov Substitution.
- Line 346: # TODO: ReprFileLocation doesn't expect a None lineno.

### \server\venv\Lib\site-packages\_pytest\fixtures.py
- Line 150: # TODO: Try to use FixtureFunctionDefinition instead of the marker
- Line 326: # Note: can't include dynamic dependencies (`request.getfixturevalue` calls).
- Line 390: # Notes on the type of `param`:
- Line 534: # Note that in addition to the use case described in the docstring,
- Line 1256: # TODO: paramspec/return type annotation tracking and storing
- Line 1542: # TODO: The order of the FixtureDefs list of each arg is significant,
- Line 1594: # Note: we explicitly do *not* use `plugin.__file__` here -- The
- Line 1968: # TODO: Fix this type ignore.

### \server\venv\Lib\site-packages\_pytest\helpconfig.py
- Line 167: # Note: a single `--version` argument is handled directly by `Config.main()` to avoid starting up the entire

### \server\venv\Lib\site-packages\_pytest\junitxml.py
- Line 44: Note that the #xABs are *not* XML escapes - missing the ampersand &#xAB.
- Line 57: # For an unknown(?) reason, we disallow #x7F (DEL) as well.
- Line 494: # Local hack to handle xdist report order.
- Line 506: # Local hack to handle xdist report order.
- Line 512: # TODO: breaks for --dist=each

### \server\venv\Lib\site-packages\_pytest\legacypath.py
- Line 389: # TODO: This assert is probably not valid in all cases.

### \server\venv\Lib\site-packages\_pytest\logging.py
- Line 878: # (logging.shutdown might have lost the weakref?!)

### \server\venv\Lib\site-packages\_pytest\main.py
- Line 993: # TODO: Remove the hacky split once the collection structure
- Line 1188: # So this uses an O(n*log(n)) algorithm which takes advantage of the

### \server\venv\Lib\site-packages\_pytest\nodes.py
- Line 110: return super().__call__(*k, **kw)  # type: ignore[no-any-return,misc]
- Line 125: return super().__call__(*k, **known_kw)  # type: ignore[no-any-return,misc]
- Line 144: # Note that __dict__ is still available.
- Line 431: # XXX should excinfo.getrepr record all data and toterminal() process it?
- Line 514: # TODO: This omits the style= parameter which breaks Liskov Substitution.
- Line 701: # It is a hack, but was deemed acceptable in order to avoid

### \server\venv\Lib\site-packages\_pytest\outcomes.py
- Line 41: # XXX hackish: on 3k we fake to live in the builtins

### \server\venv\Lib\site-packages\_pytest\pastebin.py
- Line 90: with e:  # HTTPErrors are also http responses that must be closed!

### \server\venv\Lib\site-packages\_pytest\pathlib.py
- Line 296: #  * other process did a cleanup at the same time
- Line 297: #  * deletable folder was found
- Line 298: #  * process cwd (Windows)
- Line 434: * https://bugs.python.org/issue29249
- Line 435: * https://bugs.python.org/issue34731
- Line 915: # Note this is different from what we do in ``_import_module_using_spec``, where we explicitly search through

### \server\venv\Lib\site-packages\_pytest\pytester.py
- Line 1109: # (maybe a cpython bug?) the importlib cache sometimes isn't updated
- Line 1124: # Important note:

### \server\venv\Lib\site-packages\_pytest\python.py
- Line 89: # NOTE: default is also used in AssertionRewritingHook.
- Line 290: # XXX evil hack
- Line 305: # TODO: Improve the type of `parent` such that assert/ignore aren't needed.
- Line 326: # XXX caching?
- Line 417: # Note: seems like the dict can change during iteration -
- Line 483: # we update what the function really needs a.k.a its fixture closure. Note that
- Line 658: # NOTE: following args are unused:
- Line 664: # NOTE: Could be just the following, but kept as-is for compat.
- Line 749: def from_parent(cls, parent, *, name, obj=None, **kw) -> Self:  # type: ignore[override]
- Line 915: # All IDs must be unique!
- Line 1048: # Fallback to default. Note that NOTSET is an enum.Enum.
- Line 1581: # TODO: If escaping is turned off and the user passes bytes,
- Line 1583: #       code *probably* doesn't handle this case.
- Line 1645: # Note: when FunctionDefinition is introduced, we should change ``originalname``
- Line 1653: # todo: this is a hell of a hack
- Line 1655: # Note: the order of the updates is important here; indicates what
- Line 1670: # todo: determine sound type limitations
- Line 1754: # TODO: Type ignored -- breaks Liskov Substitution.

### \server\venv\Lib\site-packages\_pytest\python_api.py
- Line 415: # raise a ValueError.  In this case, display '???'.

### \server\venv\Lib\site-packages\_pytest\raises.py
- Line 163: `PEP-678 <https://peps.python.org/pep-0678/>`__ ``__notes__``:
- Line 165: >>> with pytest.raises(ValueError, match=r"had a note added"):  # doctest: +SKIP
- Line 303: # note: RaisesExc/RaisesGroup uses fail() internally, so this alias
- Line 304: #  indicates (to [internal] plugins?) that `pytest.raises` will
- Line 307: # note: this is *not* the same as `_pytest.main.Failed`
- Line 308: # note: mypy does not recognize this attribute, and it's not possible
- Line 392: # juggle error in order to avoid context to fail (necessary?)
- Line 495: # TODO: harmonize with ExceptionInfo.match
- Line 513: # TODO: it instructs to use `-v` to print leading text, but that doesn't work
- Line 696: # TODO: move common code into superclass
- Line 967: # that are *very* hard to reconcile while adhering to the overloads, so we cast
- Line 1424: # I might just scrap it? Or make it part of fail_reason

### \server\venv\Lib\site-packages\_pytest\recwarn.py
- Line 230: # parameter to be ourselves but that is not possible(?).
- Line 304: # pytest.warns should *not* trigger "DID NOT WARN" and get suppressed

### \server\venv\Lib\site-packages\_pytest\reports.py
- Line 523: # TODO: Check if this is actually reachable.
- Line 575: # TODO: Investigate whether the duck typing is really necessary here.

### \server\venv\Lib\site-packages\_pytest\runner.py
- Line 187: # Skip *this* frame
- Line 387: # Note: initial conftests are loaded early, not here.

### \server\venv\Lib\site-packages\_pytest\skipping.py
- Line 52: # yay a hack

### \server\venv\Lib\site-packages\_pytest\subtests.py
- Line 196: # Note: initially the logic for this context manager was implemented directly

### \server\venv\Lib\site-packages\_pytest\terminal.py
- Line 113: # todo Deprecate config.quiet
- Line 761: return f" [{self.reported_progress * 100 // collected:3d}%]"
- Line 1048: return "test session"  # XXX?
- Line 1570: # TODO: Revisit after marks scope would be fixed.
- Line 1613: # Gets us name and version!
- Line 1615: # Questionable convenience, but it keeps things short.
- Line 1758: progress = min(reported * 100 // collected, 100)

### \server\venv\Lib\site-packages\_pytest\timing.py
- Line 34: # Note: using a `lambda` to correctly get the mocked time via `MockTiming`.
- Line 38: # Note: using a `lambda` to correctly get the mocked time via `MockTiming`.

### \server\venv\Lib\site-packages\_pytest\tmpdir.py
- Line 229: # NOTE: Would have been better as an `int` but can't change it now.

### \server\venv\Lib\site-packages\_pytest\unittest.py
- Line 62: # Has unittest been imported?
- Line 64: # Is obj a subclass of unittest.TestCase?
- Line 70: # Is obj a concrete class?

### \server\venv\Lib\site-packages\_pytest\assertion\rewrite.py
- Line 72: # Special marker that denotes we have just left a scope definition
- Line 216: # Note: conftest already by default in _basenames_to_check_rewrite.
- Line 225: # if the pattern contains subdirectories ("tests/**.py" for example) we can't bail out based
- Line 867: # TODO: This assert should not be needed.
- Line 1082: else:  # **args have `arg` keywords with an .arg of None

### \server\venv\Lib\site-packages\_pytest\assertion\util.py
- Line 266: # Note: unlike dataclasses/attrs, namedtuples compare only the

### \server\venv\Lib\site-packages\_pytest\assertion\__init__.py
- Line 84: msg = "expected module names as *args, got {0} instead"  # type: ignore[unreachable]

### \server\venv\Lib\site-packages\_pytest\config\argparsing.py
- Line 337: self.dest = "???"  # Needed for the error repr.
- Line 495: if orgstr and orgstr[0] != "-":  # only optional arguments
- Line 521: # **and** we keep the right option ordering from add_argument

### \server\venv\Lib\site-packages\_pytest\config\__init__.py
- Line 221: # https://docs.python.org/3/library/signal.html#note-on-sigpipe
- Line 623: # But this is *not* the same as:
- Line 646: # let's also consider test* subdirs
- Line 1194: # Note that `--version` (single argument) is handled early by `Config.main()`, so the only
- Line 1723: # Note: some coercions are only required if we are reading from .ini

### \server\venv\Lib\site-packages\_pytest\mark\structures.py
- Line 157: # TODO: Refactor to fix this type-ignore. Currently the following
- Line 303: # Note: a lambda is not allowed, but this can't be represented.
- Line 524: def __call__(self, *fixtures: str) -> MarkDecorator:  # type: ignore[override]
- Line 528: def __call__(self, *filters: str) -> MarkDecorator:  # type: ignore[override]
- Line 571: # not in the set.  We therefore start by updating the set!
- Line 631: # Note: we could've avoided explicitly implementing some of the methods

### \server\venv\Lib\site-packages\_pytest\_code\code.py
- Line 100: # in the standard lib [linecache.updatecache] does?
- Line 324: # (even incorrect types!).
- Line 832: representation of the exception and its `PEP-678 <https://peps.python.org/pep-0678/>` `__notes__`
- Line 1483: # NOTE: this used to be done in _pytest.compat.getfslineno, initially added
- Line 1517: # note: if we need to add more paths than what we have now we should probably use a list

### \server\venv\Lib\site-packages\_pytest\_io\pprint.py
- Line 660: last = len(object) // 4 * 4

### \server\venv\Lib\site-packages\_pytest\_io\terminalwriter.py
- Line 135: # we want 2 + 2*len(fill) + len(title) <= fullwidth
- Line 136: # i.e.    2 + 2*len(sepchar)*N + len(title) <= fullwidth
- Line 137: #         2*len(sepchar)*N <= fullwidth - len(title) - 2
- Line 138: #         N <= (fullwidth - len(title) - 2) // (2*len(sepchar))
- Line 139: N = max((fullwidth - len(title) - 2) // (2 * len(sepchar)), 1)
- Line 143: # we want len(sepchar)*N <= fullwidth
- Line 145: line = sepchar * (fullwidth // len(sepchar))

### \server\venv\Lib\site-packages\_pytest\_py\error.py
- Line 48: 5: errno.EACCES,  # anything better?

### \server\venv\Lib\site-packages\_pytest\_py\path.py
- Line 193: name = str(path)  # path.strpath # XXX svn?
- Line 441: # assert strrelpath[-2] != self.sep

### \src\App.tsx
- Line 27: // * Valid page names for hash routing
- Line 37: // * Case-insensitive match against valid page names
- Line 173: // ! Hash-based routing: sync activePage with URL hash
- Line 175: // * Handle Stripe redirect parameters first
- Line 187: // * On mount, read hash and navigate to it if no payment redirect
- Line 193: // * Listen for browser back/forward navigation
- Line 201: }, []); // * Only run on mount
- Line 203: // ! Sync hash when activePage changes (e.g. from sidebar clicks)
- Line 208: // ! Debounced achievement checking — 2 second delay to avoid running on every state change
- Line 214: // * Clear any pending check
- Line 219: // * Schedule achievement check with 2s debounce
- Line 237: // * Track pages that have been visited to lazily mount them
- Line 238: // ! Each page stays mounted after first visit to preserve local state
- Line 241: // * Mark page as visited when navigated to

### \src\constants.ts
- Line 236: positions: ['Heart', 'Challenge', 'Root', 'Past', 'Crown', 'Future', 'Self', 'Environment', 'Hopes/Fears', 'Outcome', 'Synthesis'], // 11th card is synthesis/summary often not drawn but computed, but here we have 11 positions?
- Line 256: { x: 50, y: 50, rotation: 0 }    // 11 Synthesis (Maybe hidden behind or just central?) - Let's put it hidden or distinct?
- Line 262: // I'll place the 11th card centrally but larger/behind? Or just below the staff?
- Line 294: { x: 50, y: 70, rotation: 180 }, // Hidden (Bottom, Reversed visual?)
- Line 331: { x: 50, y: 50, rotation: 0 } // Placed 8 cards in arc?, wait, 8 positions. Let's do a circle.
- Line 339: // 1: Top (New Moon? No new moon is dark. Let's start left)

### \src\types.ts
- Line 56: interpretation?: string; // AI interpretation for individual card in a specific position
- Line 57: keywordAnalysis?: string; // AI-generated keyword-level analysis for deep dive
- Line 58: symbolicInterpretation?: string; // AI-generated symbolic analysis for deep dive
- Line 59: esotericInterpretation?: string; // Deep dive esoteric analysis
- Line 138: visionSigil?: string; // Base64 or URL for generated image
- Line 159: // * Free tier enhancements
- Line 162: // * Premium tier enhancements
- Line 167: // * Pre-reading intent (Premium)
- Line 177: linkedCard?: string; // Storing card ID/Name string in DB? User said linkedCard.

### \src\components\CardAnimationCanvas.tsx
- Line 36: const marginX = cardWidth * 0.2; // Small margin for visual spacing
- Line 121: positions.push({ x: centerX + cardWidth * 0.7, y: centerY, rotation: 90 }); // 2. Challenge (crossing)
- Line 129: positions.push({ x: staffX, y: centerY + cardHeight * 1.5, rotation: 0 }); // 7. Your Attitude
- Line 130: positions.push({ x: staffX, y: centerY + cardHeight * 0.5, rotation: 0 }); // 8. External Influences
- Line 131: positions.push({ x: staffX, y: centerY - cardHeight * 0.5, rotation: 0 }); // 9. Hopes and Fears
- Line 132: positions.push({ x: staffX, y: centerY - cardHeight * 1.5, rotation: 0 }); // 10. Final Outcome
- Line 183: const angle = i * angleStep - p.HALF_PI; // Start from top

### \src\components\CardDetailModal.tsx
- Line 13: const isAngel = card.id ? card.id.startsWith('angel_') : (card as any).category === 'angel'; // Fallback check

### \src\components\CosmicBlueprintDisplay.tsx
- Line 91: // * Core numbers with their icons and accent colors

### \src\components\ErrorBoundary.tsx
- Line 25: // * Explicit state declaration — required by React 19 bundled types
- Line 26: // ! Without this, TS cannot resolve `this.state` on class components
- Line 34: // * Log error details for debugging

### \src\components\PowerPlaceMap.tsx
- Line 84: .leaflet-container { background: #0a0a0c !important; }

### \src\components\3d\CyberDeck.tsx
- Line 56: const fanX = offset * 30; // Horizontal spread
- Line 57: const fanY = Math.abs(offset) * 5; // Slight arc
- Line 58: const fanRot = offset * 10; // Rotation fan

### \src\components\3d\SpreadCanvas.tsx
- Line 77: if (!card || !pos) return null; // Or render placeholder logic if needed

### \src\components\profile\NarrativeSection.tsx
- Line 20: * * NOTE: Parses structured LLM output (split by '### ') and renders each
- Line 23: * ! IMPORTANT: The LLM output MUST use '### [SECTION_NAME]' headers for parsing.

### \src\components\SigilFlow\DeepDivePhase.tsx
- Line 25: // * Cast to TarotCard for element/arcana access (safe — non-tarot cards just lack these fields)

### \src\components\SigilFlow\InitiationPhase.tsx
- Line 13: onComplete(focus, ''); // Pass empty string for refinedQuestion, will be handled in main prompt
- Line 21: <EnergyVortex intensity={focus.length > 0 ? 0.8 : 0.2} color={focus.length > 0 ? '#fbbf24' : '#818cf8'} />

### \src\components\ui\CyberInput.tsx
- Line 73: //! ERROR: {error}

### \src\context\AppContext.tsx
- Line 232: // TODO: Implement update on DB
- Line 254: // TODO: Update specific daily draw record in DB

### \src\hooks\useLocalStorage.ts
- Line 18: // ! FIX: Use functional updater to avoid stale closure race condition.
- Line 19: // * Previous implementation captured `storedValue` via closure, so rapid

### \src\pages\JournalPage.tsx
- Line 145: // ! AI Journal Analysis state (Premium feature)
- Line 151: // * Generate dynamic journal prompt on mount
- Line 209: // * Build context from recent entries (limit to prevent token overflow)
- Line 243: addXp(25); // * Reward for engaging with premium analysis

### \src\pages\OnboardingPage.tsx
- Line 117: //! ERROR: {authError}

### \src\pages\ProfilePage.tsx
- Line 34: // * If changing birthDate, also recalculate astrological sign
- Line 55: // * Use pending profile for display

### \src\pages\ReadingsPage.tsx
- Line 15: // * Extracted Components
- Line 23: // * TTS Helper function
- Line 35: // * Reading Steps: focus-intent (Premium) -> select-spread -> select-deck -> charging -> picking-cards -> revealing -> summary
- Line 38: // * State
- Line 49: // * Immersion State
- Line 57: // * Reading Data
- Line 61: const [userQuestion, setUserQuestion] = useState(''); // Premium
- Line 62: const [refinedQuestion, setRefinedQuestion] = useState(''); // Premium AI output
- Line 64: // * Extended Reading Data (Tiered)
- Line 82: // * Initialize reading step based on Premium status
- Line 230: // * Premium Feature: AI Question Refiner
- Line 244: setRefinedQuestion(userQuestion); // Fallback
- Line 366: readingIntent: isPremium ? readingIntent : undefined, // Only save intent if premium flow used
- Line 389: // Or just let the user assume it worked. Let's add a simple alert or reuse error state for "Copied!"
- Line 420: handleRefineQuestion={handleRefineQuestion} // Keeping for manual refinement if desired, but generation now handles it

### \src\services\apiService.ts
- Line 97: // We update via FastAPI endpoint, wait we don't have an update profile route yet!

### \src\services\astroService.ts
- Line 20: // * Add time to avoid timezone interpretation issues
- Line 25: // * Standard Western zodiac date ranges

### \src\services\geminiService.ts
- Line 67: currentDelay *= 2; // Exponential backoff

### \src\services\loggerService.ts
- Line 20: // Persist critical logs immediately, batch others?
- Line 70: case 'TODO': return 'color: #BB6BD9; font-weight: bold;'; // Purple
- Line 77: // Optional/TODO: Send logs to a FastAPI endpoint when implemented
- Line 84: // ! Rule 2-C/D Compliance: Export Logs to Zip

