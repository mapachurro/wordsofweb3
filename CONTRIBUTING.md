# Contributing to wordsofweb3

First off, thank you for considering contributing to wordsofweb3! This is a community-driven project aiming to create a comprehensive, multilingual web3 glossary.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Types of Contributions](#types-of-contributions)
3. [Getting Started](#getting-started)
4. [How to Contribute](#how-to-contribute)
5. [Reporting Issues](#reporting-issues)
6. [Translation Guidelines](#translation-guidelines)
7. [Internationalization](#internationalization)
8. [Security Considerations](#security-considerations)
9. [Style Guide](#style-guide)
10. [Getting Help](#getting-help)
11. [Recognition](#recognition)
12. [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers through [GitHub's reporting tools](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam).

## Types of Contributions

We welcome several types of contributions:

1. **Term Additions/Modifications**
   - New term definitions
   - Translations
   - Improvements to existing definitions

2. **Technical Contributions**
   - Bug fixes
   - Feature enhancements
   - Documentation improvements

3. **Content Quality**
   - Spelling/grammar fixes
   - Fact checking
   - Source verification

## Getting Started

### Quick Links
- 📝 [Add a New Term](../../issues/new?template=term_request.md)
- 🐛 [Report a Bug](../../issues/new?template=bug_report.md)
- ✨ [Request a Feature](../../issues/new?template=feature_request.md)
- 💬 [Join Discussions](../../discussions)

### Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/wordsofweb3.git
cd wordsofweb3
```
3. Set up your development environment:
```bash
npm install
npm run build
```

### Project Structure
```
./
├── src/           # Source files
├── locales/       # Language-specific content
├── static/        # Static assets
└── build/         # Generated site output
```

## How to Contribute

### Adding or Modifying Terms

1. **Create an Issue** using the [Term Addition/Modification template](../../issues/new?template=term_request.md)
2. **Format your submission** in either:
   - JSON format (preferred)
   - Narrative form

Example JSON format:
```json
{
    "example-term": {
        "term": "Example Term",
        "partOfSpeech": "noun",
        "termCategory": "web3",
        "phonetic": "/ɪɡˈzæmpəl tɜːm/",
        "definition": "A clear example of how to format term submissions.",
        "definitionSource": "",
        "sampleSentence": "",
        "extended": "",
        "termSource": "",
        "dateFirstRecorded": "",
        "commentary": ""
    }
}
```

### Submitting Changes

[Previous git workflow content remains the same...]

## Internationalization

### Language Support
- Each term should be available in multiple languages
- Maintain consistent structure across translations
- Consider cultural context and regional variations

### Translation Process
1. **Term Selection**
   - Identify terms needing translation
   - Verify technical accuracy
   - Consider regional variations

2. **Quality Assurance**
   - Native speaker review
   - Technical accuracy verification
   - Cultural context validation

3. **Documentation**
   - Include source references
   - Note regional variations
   - Document translation decisions

## Security Considerations

### IPFS-Specific Security
- Content permanence: Once published, content cannot be fully removed from IPFS
- Gateway security: Use trusted IPFS gateways
- ENS name resolution: Verify ENS names and records

### Data Validation
- Verify term sources and references
- Validate JSON formatting
- Check for malicious content or links

### Best Practices
- Use secure communication channels
- Verify contributor identities
- Follow secure development practices

[Previous content for Reporting Issues, Style Guide, etc. remains the same...]

## Getting Help

- [Create an Issue](../../issues/new/choose) for questions
- Join our [Community Discussion](../../discussions)
- Visit [Education DAO](https://educationdao.xyz/)
- Check our [Documentation](../../wiki)

## Recognition

Contributors will be recognized in:
- The project's [contributors list](../../graphs/contributors)
- Release notes
- Documentation credits

## License

By contributing, you agree that your contributions will be licensed under the project's [DBAD License](./licenses/wordsofweb3-code-license.md).