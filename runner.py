# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "sentry-sdk",
# ]
# ///
import sentry_sdk

sentry_sdk.init(
    dsn="https://f6c0203e96b5c24f589a3ae264f8fadb@o4509810507186176.ingest.us.sentry.io/4509810839453696",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)

print("Running fatally doomed mission...")
1 / 0
print("Wait what?")
