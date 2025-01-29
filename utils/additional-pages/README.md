This is the README for the `Resources` page on wordsofweb3.

If you want to add a new resource, use this template:

```json
          {
            "text": "Name of the new resource",
            "url": "https://link-to-that.resource/",
            "description": "A good but short-ish description of this new resource."
          },
```

And then add it into the list; json is picky about commas, spacing, etc., so here's a sneak peek of what it should look like:

```json
      {
        "title": "Web3, Decentralized Web, and Crypto Glossaries and Explainers",
        "links": [
          {
            "text": "Ethereum.org Glossary",
            "url": "https://ethereum.org/en/glossary/",
            "description": "Comprehensive glossary of Ethereum and blockchain terms."
          },
          {
            "text": "Name of the new resource",
            "url": "https://link-to-that.resource/",
            "description": "A good but short-ish description of this new resource."
          }
        ]
      },
```

Note that the last curly bracket `}` does **not** have a comma after it. That's important. Each object / array in json should have a comma after it unless it's the only element at that "level" (how many indents / nested structures), or if it's the last one; then it doesn't have a comma. IDK bro.