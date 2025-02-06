---
name: 'Add or modify a term '
about: 'Make a suggestion to add or improve a term''s entry '
title: "[SUBMISSION]"
labels: ''
assignees: ''

---

You can make your suggestion in writing, ie "narrative" form here, like: 

"We should add the term 'stonks' because everybody in Discord says it. The definition should be "A meme meaning the value of something is good. Or bad."

Or you can submit an entry using the JSON format in which each term record is saved: 

```
    "0x-api": {
      "term": "0x API",
      "partOfSpeech": "noun",
      "termCategory": "",
      "phonetic": "/ˌzɪroʊ ˈɛks ˈeɪ.pi.aɪ/",
      "definition": "The 0x API is the liquidity and data endpoint for DeFi. It lets you access aggregated liquidity from tens of on-chain and off-chain decentralized exchange networks, across multiple blockchains. It comes with many parameters to customize your requests for your application and your users.",
      "definitionSource": "",
      "sampleSentence": "",
      "extended": "",
      "termSource": "",
      "dateFirstRecorded": "",
      "commentary": ""
    },

```

    "0x-api": { `this is a sanitized version of the term, that will appear as a URL`
      "term": "0x API", `this is the term itself`
      "partOfSpeech": "noun", `what grammatical category is it?`
      "termCategory": "", `is it web3? Web2? Memes?`
      "phonetic": "/ˌzɪroʊ ˈɛks ˈeɪ.pi.aɪ/", `an IPA pronunciation`
      "definition": "The 0x API is the liquidity and data endpoint for DeFi. It lets you access aggregated liquidity from tens of on-chain and off-chain decentralized exchange networks, across multiple blockchains. It comes with many parameters to customize your requests for your application and your users.", `The definition of the term. This should be one to two sentences, and don't use the term in its own definition.`
      "definitionSource": "", `Who wrote this definition?`
      "sampleSentence": "", `Can you use it in a sentence?`
      "extended": "", `Is there more to say? Back story? Multiple uses? Debate?`
      "termSource": "", `Know who coined the term? Did it come from a specific website or account?`
      "dateFirstRecorded": "", `Date of submission here`
      "commentary": "" `If there is active debate, room for doubt, a topic under development, this is the place for explanations!`
    },
