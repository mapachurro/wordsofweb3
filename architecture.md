# Education DAO Glossary: Architecture

The Education DAO Glossary is a multilingual glossary app encompassing terms and explanations about crypto, web3, and decentralized web, in general, terms, concepts, and entities.

It is meant to be an intertextual experience for the reader: in every `term`'s definition, whenever there is a term or phrase that is _also_ a `term` in the glossary in that language, there will be a hyperlink to that term.
Ideally, there will be a `breadcrumbs` element at the top of each entry page, tracking the user's journey through the interwoven terminology of this space.

## Design principles

This app is meant to be _for the ages_. The idea is that it _will never break_. It is designed to be deployed on decentralized storage networks, such as IPFS, which sometimes experience high latency; additionally, this technology should be accessible by the widest possible audience.

For these reasons, at every point at which we can choose "how to do X", we should choose the dumbest, most low-tech way possible.

This means that if you're installing an npm package, or importing a CDN, you might be doing it wrong.

## Implementation implications

Yes, this means custom scripting; but anyone that tells you that an npm package or open source project will require _less_ maintenance than custom scripts that do what you want, well, wish them the best of luck with that.

### Creating the homepages

As a fully internationalized app, the site will actually have multiple potential versions of its homepage.

This will likely mean an `index.html`, which loads an `index.js`; that JS file will likely ensure:

- The user's browser language is detected
- An appropriate linguistic version of the site is loaded
  - Filling in the UI elements in a templated version of the homepage, using JQuery-like placeholders or tags, with UI strings from a .json file corresponding to the language in question
    - And falling back to the closest available locale (e.g. fall back to es-419 if es_HN is not available), or English if there is no support for a language family at all

#### The Navbar and language switching

There will be a language dropdown selector on the navbar of the site.
Changing the language in this dropdown will trigger a function in `index.js` which loads the corresponding language's strings -- **and changes the links on the page to URL paths or slugs which match that language**.
There will be no English-langauge slug elements when a user is experiencing the site in a language other than English.

### Creating the glossary entries

Similarly to the "template" format of the homepage, each `term`'s `entry page` will be generated **on the build side of the app; nothing will be created "generatively" on the reader's side.**

There are two data inputs to these `entry pages`:

#### `ext-sync-terms.csv`:

This .csv file is something that will be imported, from time to time, with new or updated terms in one or more languages.
It currently houses a large number of locales; here is a sample of its structure and content:

```CSV
[en_US],[ar_AR],[zh-CN],[zh-TW],[nl_NL],[fr_FR],[de_DE],[el_GR],[ha-NG],[hi_IN],[hu_HU],[id_ID],[it_IT],[ja_JP],[ko_KR],[fa_IR],[ms_MY],[pcm-NG],[pl_PL],[pt_BR],[ro_RO],[ru_RU],[es-419],[tl_PH],[th_TH],[tr_TR],[uk_UA],[vi_VN]
51% Attack,هجوم 51٪,51%攻击,51%攻擊,51%-aanval,Attaque des 51 %,51% Attacke,Επίθεση του 51%,Tsarin 51%,51% अटैक,51%-os támadás,51% Attack,Attacco del 51%,51%攻撃,51% 공격,حمله 51 درصدی,Serangan 51%,Chop oga network,Atak 51%,Ataque de 51%,Atac 51%,Атака 51%,ataque de 51 %,51% Pag-atake,การโจมตี 51%,%51 Saldırısı,Атака 51%,Tấn công 51%
Account,حساب,账户,帳戶,account,Compte,Konto,Λογαριασμός,Asusu,Account,fiók,Akun,Account,アカウント,계정,حساب,Akaun,Akaunt,Konto,Conta,Cont,Счет,cuenta,Account,บัญชี,Hesap,Обліковий запис,Tài khoản
```

This .csv will be processed by a script, `generate-json.js`. For each locale, this script:

- Iterates through `./locales/<locale-code>` directories
  - In each directory, it looks for a file, `./locales/<locale-code>/<locale-code>.json`
    - If that file exists, it iterates through the rows of `ext-sync-terms.csv`, ensuring that:
      - There is a `term` object for each row of that locale (each word in that language), and that
      - There are no duplicate terms, such that building an HTML file from it would result in multiple HTML files located at the same URL path / slug.
      - Additionally, when this script creates a new term, it uses the following structure:

```json
    "Ethereum": {
      "term": "Ethereum",
      "phonetic": "/ɪˈθiːriəm/",
      "partOfSpeech": "noun",
      "definition": "A public blockchain network and decentralized software platform upon which developers build and run applications. As it is a proper noun, it should always be capitalized.",
      "termCategory": "project or product",
      "source": "",
      "datefirstseen": ""
    },
```

This script will, essentially, only be updating the `term` field of each object.
The name of each overarching object will be the term from the `en_US` column, whereas the `term` key's value will be populated from the corresponding locale.
The `partOfSpeech` value has not been filled out for most terms in most languages, but should mirror that of the `en_US` locale, unless grammatically incorrect in that language.
The `termCategory` value should also mirror `en_US`, unless subsequently changed.
If there is no data to fill in a given value (e.g., "source"), it should be left blank at this point (`source: "",`).

For example:

```json
{
  "terms": {
    "Ethereum": {
      "term": "حساب",
      "phonetic": "",
      "partOfSpeech": "noun",
      "definition": "",
      "termCategory": "project or product",
      "source": "",
      "datefirstseen": ""
    }
  }
}
```

### `app-side-glossary.csv`

We need a way to export this information, and manage it, in .csv format, for less-technical people who don't want to handle .json files.
For this reason, these collective .json files from each locale will be exportable, via a script not yet written, to `./utils/data-import/app-side-glossary.csv`, for exportation to e.g. Google Sheets for editing and updates.

This can be changed over time, but here is a sample of what it looks like now:

```CSV

Term,Part of speech,Term Category,Phonetic,Definition,Source,Date first recorded
51% attack,noun,decentralized web,/ˈfɪfti wʌn pərˈsɛnt əˈtæk/,"If more than half the computer power or mining hash rate on a network is run by a single person or a single group of people, then a 51% attack is in operation. This means that this entity has full control of the network and can negatively affect a cryptocurrency by taking over mining operations, stopping or changing transactions, and double-spending coins.",,
account,noun,decentralized web,/əˈkaʊnt/," Accounts are records or statements of financial expenditure and receipts that relate to a particular period or purpose. In the world of crypto, this is referred to as a cryptocurrency account. It gives you certain benefits, and it is a requirement in order to use just about any cryptocurrency exchange. A cryptocurrency account gives you access to hot wallets, which allow you to quickly buy, sell and trade cryptocurrencies, and it gives you an identity or a way through which you can hold onto your public keys when it comes to the aforementioned process.",,
address,noun,decentralized web,"/ˈæd.rɛs/ ""ˈpʌblɪk ˈæd.rɛs""","Synonymous with ""public address"", ""wallet address"". Used to send and receive transactions on a blockchain network, and to identify different users; also referred to as a 'public key'. An address is an alphanumeric character string, which can also be represented as a scannable QR code. In Ethereum, the address begins with 0x. For example: 0x06A85356DCb5b307096726FB86A78c59D38e08ee",,

```

### Moving the information from .json to HTML

Once this information is in its .json files in corresponding locale folders, we can proceed to generate the site's content from it.

`./utils/build-pages.js`, yet to be created, will do the following:

- Ingest `entrytemplate.html`, which will be a wireframe HTML of what each `term`'s entry page should have on it (Navbar, "new search" field at the bottom, other features TBD) that will not be dependent on JS functionality.
  - It will also invoke `entrytemplate.js`, which will have **dynamic content placeholders** for each of the values of a `term` object, and a few more.
- For each locale, ingest that locale's `<locale>.json`, and
- Create an HTML file for each term
  - Named by the `term` value, not the English object name
  - Filling out the dynamic content placeholders with the corresponding values
  - Creating links dynamically as specified in the code
- Save that HTML file (e.g. `cuenta.html`) in a directory which it will create (and overwrite the contents of) if it doesn't already exist: `./static`. **This is the "build directory"**.

**One important point**: a consideration should be made for linking readers to the entry page for _the term whose page they're on, but in a different language_. So, if I'm reading an entry in French, there could be, e.g., a sidebar or section at the bottom of the page like so:

```markdown
### Read this entry in:

[Spanish](./path-to-entry-in-Spanish.html)
[English](./path-to-entry-in-English.html)
```

Given the fact that each `term` object will be labelled with its equivalent in English, a sort of reverse route mapping function could be developed to draw the connections between translations of given terms, and during the build process, create these links in the entry pages.

### Paths and slugs

Ideally, the url structure will be something like `wordsofweb3/home`; `wordsofweb3/account`; `wordsofweb3/cuenta`, with no prefixing of e.g. locale codes, etc. This may require a small file server, to make each locale's HTML files available at the top directory level.

Additionally, we should not, e.g., convert non-Latin alphabets into strings of `%%C9A%` etc.; this is meant to be a reference and educational site, and making the URLs unreadable to those trying to access it is contrary to its primary goals.

## Creating the connections between the `definitions`

This part is crucial, and yet to be engineered.

`./utils/intertextual.js` will run **after** `build-pages.js`, and it will do this work. For each locale, it will:

- Ingest the corresponding `./locales/<locale-code>.json` file
- Iterate over the built files for that locale in `./static/<locale-code>/*`
- In each HTML file within that directory, locate the `<p id="description">` tag which will have been created by `build-pages.js`
- Search for terms or phrases which [match](#matching) a `term` key in the .json file
- For each match, create a hyperlink to that term, following the pattern `./<term-key>.html`. Given that all the .html files will be in the same directory, this should provide for easy resolution. **terms will not be indexed across languages**.

This script should have robust console logging and graceful error handling, given the number of edge cases it will present.
It should save this output to file at `./utils/intertextual-output-<number>.txt`, increasing the number each time so that subsequent versions of the log can be checked.

### Matching

There is a difficult implementation detail here: `stop words`, `stems`, and `plurals`.

A quality contextual search will use detailed information about the morphology of a given language to find a _good_ match, not just something that happens to match a pattern.
One option is to leverage [lunr-languages](https://github.com/MihaiValentin/lunr-languages), which has a decent and open source (MPL) collection of such files.

# Overall site / `static` directory structure

```bash
./static
    index.html
    index.js
    ./js
        search.js
        navbar.js
    ./assets
        ./search-indices
            `<locale-code>-index.json` x number of locales
    ./css
        styles.css
    ./images
        `any images needed by the app`
    favicon.ico
    ./en-US
        51%-attack.html
        account.html
            etc.
    ./es-ES
        ataque-del-51%.html
        cuenta.html
        ...etc
```

## Navbar / top-level link structure

As stated, upon changing the language using the dropdown selector (or the URL bar), the `index.js` script will change the UI strings; it should also change _the search index used for any searches made_, such that if I have selected Nigerian Pidgin, I am searching the index of Nigerian Pidgin terms.

# Search

The search will be key functionality in this site.

The current plan is to use `lunr.js`, perhaps as the sole dependency added to this project, to build search indices during the build phase, which when created, are written to `./build/assets/search-indices/<locale-code>-index.json`.

The search function should, as indicated, consult the linguistically correct search index for the locale the user has selected.

An autocomplete function would be nice, although that depends on how many dependencies that would bring into the app. The search function should display a new page--for which, perhaps, a `results.html` and `results.js` template should be made--which would display:

```markdown
## Term matches

- Terms that have the search query in them

## Definition matches

- Terms that have the search query in their `description` field

## Partial matches

- Terms that partially match the search query
```

In this way, the reader will be presented with the most relevant searches first.

# Build

The various scripts mentioned above which must be run every time the site builds should be all located in `./src/js`, whenever possible.

They should probably be invokable using a single command, such as `npm run build`; there should probably be a `./src/js/build.js` script, which will collate and manage that series of scripts, for example

```javascript
import build-pages.js
import intertextual.js
import lunr.js

build-pages.js
intertextual.js
lunr.js
//there will obviously be a little more complexity here, but to give an idea.
```

# Deployment

This site will be deployed on IPFS, for starters, using Fleek.xyz. It can and probably should be deployed on other decentralized storage networks.

The intention is to route the ENS name `wordsofweb3.eth` to an IPNS hash using Fleek.xyz, such that it could be accessed at `wordsofweb3.eth.limo`, etc.

# ChatGPT's recommended steps:

Next Steps
Prototype Key Scripts:

Start by creating prototypes of the critical scripts (generate-json.js, build-pages.js, and intertextual.js). This will allow you to test the core functionality early and refine the process as you move forward.
Set Up the Build Pipeline:

Once the key scripts are prototyped, set up your build.js script to orchestrate them. Ensure each step logs its progress and any issues encountered, so you can debug effectively.
Test on a Local Server:

Before deploying to IPFS, test the generated static site on a local server. This will help you catch any issues with linking, language detection, or search functionality.
Deploy and Iterate:

Deploy the site using Fleek.xyz to IPFS. After deployment, test the site thoroughly across different languages and locales to ensure everything is functioning as expected. Use feedback to iterate and improve the site.
Consider Future Features:

As you complete the core features, consider implementing additional features like the autocomplete search or more sophisticated link management between languages if needed.
This approach will ensure that you build a robust, accessible, and durable multilingual glossary that meets the long-term goals of the project. Let me know if you need help with any specific parts of the implementation!
