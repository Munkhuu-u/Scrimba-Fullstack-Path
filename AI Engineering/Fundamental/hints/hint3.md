Right now, loading is stopped only
when things go well.

If the request throws,
that line is never reached.

Look for a way to guarantee that
setLoading(false) runs
whether the request succeeds or fails.

There's a language feature
specifically designed for this.

You might want to check the docs again if
you're stuck: https://scrimba.com/mdn-try-catch
