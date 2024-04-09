Import("env")
import os
import re
import io
import tempfile
import filecmp
import shutil
import gzip
from external.minify import (html_minifier, rcssmin, rjsmin)
from external.wheezy.template.engine import Engine
from external.wheezy.template.ext.core import CoreExtension
from external.wheezy.template.loader import FileLoader


def get_version(env):
    return '%s (%s)' % (env.get('GIT_VERSION'), env.get('GIT_SHA'))

def build_version(out, env):
    out.write('const char *VERSION = "%s";\n\n' % get_version(env))

def compress(data):
    """Compress data in one shot and return the compressed string.
    Optional argument is the compression level, in range of 0-9.
    """
    buf = io.BytesIO()
    with gzip.GzipFile(fileobj=buf, mode='wb', compresslevel=9, mtime=0.0) as f:
        f.write(data)
    return buf.getvalue()

def build_html(mainfile, var, out):
    engine = Engine(
        loader=FileLoader(["frontend/dist"]),
        extensions=[CoreExtension("@@@@@@@")]
    )
    template = engine.get_template(mainfile)
    data = template.render({})
    out.write('static const char PROGMEM %s[] = {\n' % var)
    out.write(','.join("0x{:02x}".format(c) for c in compress(data.encode('utf-8'))))
    out.write('\n};\n\n')

def build_common(env, mainfile):
    fd, path = tempfile.mkstemp()
    try:
        with os.fdopen(fd, 'w') as out:
            build_version(out, env)
            build_html(mainfile, "INDEX_HTML", out)
            build_html("index.js", "INDEX_JS", out)
            build_html("index.css", "INDEX_CSS", out)

    finally:
        if not os.path.exists("include/WebContent.h") or not filecmp.cmp(path, "include/WebContent.h"):
            shutil.copyfile(path, "include/WebContent.h")
        os.remove(path)

target_name = env['PIOENV'].upper()
build_common(env, "index.html")
