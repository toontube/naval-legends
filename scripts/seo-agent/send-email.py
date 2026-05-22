#!/usr/bin/env python3
"""Send email notification for new Bravo Zulu story."""
import sys
import subprocess

def send_via_osascript(to, subject, body_html):
    """Send email using macOS Mail.app via AppleScript."""
    # Strip HTML for plain text
    import re
    body_plain = re.sub('<[^<]+?>', '', body_html).strip()

    script = f'''
    tell application "Mail"
        set newMessage to make new outgoing message with properties {{subject:"{subject}", content:"{body_plain}", visible:false}}
        tell newMessage
            make new to recipient at end of to recipients with properties {{address:"{to}"}}
        end tell
        send newMessage
    end tell
    '''
    subprocess.run(['osascript', '-e', script], check=True)
    print(f"Email sent to {to}: {subject}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: send-email.py <slug> <title> <summary>")
        sys.exit(1)

    slug = sys.argv[1]
    title = sys.argv[2]
    summary = sys.argv[3]
    url = f"https://brvzulu.com/stories/{slug}/"

    subject = f"New on Bravo Zulu: {title}"
    body = f"{title}\n\n{summary}\n\nRead it: {url}"

    send_via_osascript("max@mozuma.co", subject, body)
