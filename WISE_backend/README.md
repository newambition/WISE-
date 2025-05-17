<div align="center">

  ' -->
  # **WISE**

  **A lightweight tool to help users identify manipulative tactics in text-based content.**

  </div>

---

WISE is built for ethose who want to better recognize common patterns of manipulation in written content, wether news articles, social media posts, health blogs or even a batch of private messages.  It's designed to empower individuals by making the strategies behind persuasive messages more transparent.

🔗 **Try it now: [Live Demo](https://wise-ga5e.onrender.com)**

---

## 🌟 What It Does

WISE offers a focused approach to analyzing text-based content:

* **File Uploads**: Easily upload `.txt`, `.md`, or `.docx` files for analysis.

* **Tactic Identification**: Analyzes text for common manipulative tactics.
* **User-Controlled AI**: Uses your own Google Generative Language API key.
    * _No server-side AI processing of your content._
    * _No data collection or logging of your text or API key by the WISE application._
* **Secure Key Storage**: Implements a simple local passphrase vault to encrypt and store your API key directly in your browser.

## 🚫 What It Doesn’t Do

It's important to understand the scope of WISE:

* **No Open-Ended Chatbot**: WISE is not a conversational AI or a general-purpose Q&A tool.

* **Not a Substitute for Professional Judgment**: It's an aid for awareness, not a replacement for expert advice or critical thinking.
* **No Data Storage**:
    * Your API key is *not* stored on any server.
    * All file content and analysis processing occur client-side; nothing is uploaded or logged by the WISE application.

## 🚀 How to Use It

Getting started with WISE is straightforward:

1.  **Visit the Live Link**: Navigate to [https://wise-ga5e.onrender.com](https://wise-ga5e.onrender.com).

2.  **API Key**: Enter your Google Generative Language API key when prompted, or unlock your saved key using your passphrase.

3.  **Upload Content**: Upload a `.txt`, `.md`, or `.docx` file containing the written content you wish to analyze.

4.  **Review Analysis**: Examine the breakdown of potential manipulative tactics identified in your text.

## ❤️ The Story Behind WISE: Why This Exists

I built WISE because I've seen what happens when people are guided into belief systems they didn't consciously choose. 

I've personally experienced the effects of malicious persuasion, without realising it was happening.  

**I created what I wished existed when I needed it most**

I didn't want another tool that simply labels content "good" or "bad." 

Instead, WISE helps you see the strategies behind the message—like having X-ray vision for persuasion techniques. 

Everyone deserves to know when their thinking is being deliberately directed.

Many people encounter covert manipulation in everyday language — online, in media, or in personal relationships. 

WISE is designed as a clear, accessible tool to help spot those tactics quickly and build awareness.

WISE isn't about profit margins or user growth. It's about helping people think more clearly in a noisy world.

If it helps even a handful of people feel more confident in their own judgment and less confused by conflicting messages—that's success,

Because everyone deserves to see how persuasion works before deciding what to believe.

## 🛠️ Tech Stack

WISE is built with a modern and efficient technology stack:

* **Frontend**: React
* **Backend**: FastAPI (primarily serves static files and handles the analysis endpoint)
* **Deployment**: Render
* **AI API**: Google Generative Language API (user-supplied key)

## 🔒 Security Notes

Your privacy and data security are paramount:

* **API Key Encryption**: Your API key is encrypted with a user-defined passphrase and stored *only* in your browser's local storage. It is never transmitted to any server.
* **Client-Side Processing**: All file content analysis stays local to your machine. Nothing is uploaded to or logged by the WISE application servers.
* **Key Deletion**: You can delete your saved (encrypted) API key from your browser's storage at any time through the application's interface.

## 📜 License & Status

* **Status**: This project is currently pre-release.
* **Affiliation**: Built independently and not affiliated with any organization.
* **Purpose**: Created for educational and self-awareness purposes.
* **License**: Free to use. Not for redistribution.
    ---

<div align="center">
  <p>Made with ❤️ by Tom Green</p>
  <p>github.com/newambition</p>

  </div>
