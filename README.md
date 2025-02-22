# wordsofweb3

A multilingual glossary for web3, crypto, and decentralized web terminology, deployed on IPFS at [wordsofweb3.eth.limo](https://wordsofweb3.eth.limo).

![wordsofweb3 Interface](https://res.cloudinary.com/resourcefulmind-inc/image/upload/v1739897349/Screenshot_2025-02-18_at_5.47.28_PM_qknuhu.png "Words of Web3 Glossary Interface")


> If the canonical URL isn't working, try the [IPNS hash](https://ipfs.io/ipns/k51qzi5uqu5dik032y8x6pgcprlg8t42dy521tnnqiomgxauyt3u2z6j5x60r1/english-us/index.html).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [Features](#features)
- [Supported Languages](#supported-languages)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Technical Conventions](#technical-conventions)
- [Project Architecture](#project-architecture)
  - [Directory Structure](#directory-structure)
  - [Data Management](#data-management)
    - [CSV Files](#csv-files)
    - [Build Process](#build-process)
- [Search Functionality](#search-functionality)
- [Visual Identity](#visual-identity)
  - [Color Palette](#color-palette)
- [Contributing](#contributing)
- [Development](#development)
  - [Building the Project](#building-the-project)
  - [Testing](#testing)
- [Deployment](#deployment)
- [Future Plans](#future-plans)
- [License](#license)
- [Contact](#contact)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

wordsofweb3 is a collaborative project by [Education DAO](https://educationdao.xyz/) that aims to create a credibly neutral, living record of web3 and decentralized web tech terminology. 

The project supports multiple languages and provides an intertextual experience where terms link to related concepts.

## Design Philosophy

This app is meant to be _for the ages_. We follow these core principles:

- **Longevity**: Built to sometimes break (but never fail, like every other durable thing out there), using the simplest possible solutions
- **Accessibility**: Available to the widest possible audience
- **Decentralization**: Deployed on [IPFS](https://ipfs.tech/) for permanent availability
- **Simplicity**: Minimal dependencies, custom solutions over external packages
- **Language neutrality**: Working towards a human language-agnostic design.

## Features

- **Multilingual support**: Available in 28+ languages
- **Intertextual experience**: Terms link to related concepts within definitions
- **Search functionality**: Easy term lookup across all supported languages
- **Static generation**: All pages built at compile time for reliability
- **Decentralized storage**: Deployed on IPFS via [Fleek]((https://fleek.xyz/)); working towards multiple fallbacks, e.g. Arweave, GH Pages, etc.

## Supported Languages

<details>
<summary>Click to see all 28+ supported languages</summary>

- العربية (Arabic)
- 中文-简体 (Simplified Chinese)
- 中文-繁體 (Traditional Chinese)
- Nederlands (Dutch)
- English (US/UK)
- Français (French)
- Deutsch (German)
- Eλληνικά (Greek)
- Hausa
- हिन्दी (Hindi)
- 日本語 (Japanese)
- 한국어 (Korean)
- Español de (Latin America)
- Magyar (Hungarian)
- Bahasa Indonesia (Indonesian)
- Italiano (Italian)
- فارسی (Persian)
- Bahasa Melayu (Malaysian)
- Pidgin (Nigerian Pidgin)
- Polski (Polish)
- Português Brasileiro (Brazilian Portuguese)
- Limba Română (Romanian)
- Русские (Russian)
- 

</details>

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Installation

```bash
bash
git clone https://github.com/mapachurro/wordsofweb3.git
cd wordsofweb3
npm install
```

### Technical Conventions

1. **Module System**
   - Use ES Module syntax throughout
   - No CommonJS `require()` statements

2. **Error Handling**
   - Include graceful failures
   - Implement comprehensive error logging
   - Add console logging for debugging

3. **Custom Solutions**
   - Prefer custom scripts over npm packages
   - Maintain minimal dependencies

## Project Architecture

### Directory Structure

```bash
./
├── src/
│   └── js/           # Client-facing JavaScript
├── utils/            # Build and data processing scripts
├── locales/          # Language-specific content
├── static/           # Static assets
└── build/            # Generated site output
```

### Data Management

#### CSV Files

- `all-terms.csv`: Canonical source for terms across languages
- `english-terms.csv`: Working file for English definitions

#### Build Process

1. CSV files processed into JSON
2. Static pages generated from JSON
3. Intertextual links created
4. Search indices built

## Search Functionality

The search system provides:

- Term matches
- Definition matches
- Partial matches
- Language-specific search indices

## Visual Identity

### Color Palette

- Primary: #a49ceb
- Background: #1c1c1c
- Accents:
  - #5c5481
  - #484366
  - #54547c
  - #5c5c8c

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for:

- How to submit changes
- How to report issues
- Term addition process
- Translation guidelines

## Development

### Building the Project

```bash

npm run build
```


This will:
1. Generate homepages
2. Build term pages
3. Create intertextual links
4. Generate search indices
5. Copy static assets

### Testing

Before deployment:

1. Test on local server
2. Verify language switching
3. Check search functionality
4. Validate intertextual links

## Deployment

- Primary: IPFS via Fleek.xyz
- ENS: wordsofweb3.eth
- Access: wordsofweb3.eth.limo

## Future Plans

1. Language-agnostic term key system
2. Enhanced search capabilities
3. Attestation-based contribution flow
4. Improved language switching

## License

This project is licensed under the [DBAD License](licenses/wordsofweb3-code-license.md).

## Contact

- Create an [Issue](https://github.com/mapachurro/wordsofweb3/issues) for bug reports or feature requests
- Join [Education DAO](https://educationdao.xyz/) for broader discussions
